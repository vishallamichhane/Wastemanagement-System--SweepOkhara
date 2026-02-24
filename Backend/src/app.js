import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { auth } from "./libs/auth.js";

const app = express()

const appUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const corsOrigins = process.env.CORS_ORIGIN
    ? (process.env.CORS_ORIGIN === "*"
        ? [appUrl, "http://localhost:5174"]
        : process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean))
    : [appUrl, "http://localhost:5174"];

// Apply CORS first
app.use(cors({
    origin: corsOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}))

// Apply express middleware before auth routes
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

import reportRoutes from './routes/reportRoutes.js';
import userRoutes from './routes/userRoutes.js';
import collectorRoutes from './routes/collectorRoutes.js';
import wardTaskRoutes from './routes/wardTaskRoutes.js';
import User from './models/user.js';
import Report from './models/reports.js';
import Collector from './models/collector.js';

// Public routes (no authentication required)
app.get("/", (req, res)=>{
    return res.status(200).json({message:"Welcome to SweePokhara Backend"})
})

// Public user creation endpoint (for registration)
app.post("/api/users/create", async (req, res) => {
  try {
    const { clerkId, username, email, firstName, lastName, fullName, address, ward, houseNumber, phone } = req.body;

    console.log('=== Creating User in MongoDB (Public Route) ===');
    console.log('Data received:', { clerkId, username, email, firstName, lastName, fullName, address, ward, houseNumber, phone });

    // Validate required fields
    if (!clerkId || !email || !username) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: clerkId, email, and username are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ clerkId });
    if (existingUser) {
      console.log('User already exists in MongoDB:', existingUser._id);
      return res.json({
        success: true,
        message: 'User already exists',
        user: existingUser
      });
    }

    // Create new user in MongoDB
    const newUser = await User.create({
      clerkId,
      username,
      email,
      firstName: firstName || '',
      lastName: lastName || '',
      fullName: fullName || `${firstName || ''} ${lastName || ''}`.trim(),
      address: address || '',
      ward: ward || '',
      phone: phone || '',
      houseNumber: houseNumber || '',
      emailVerified: true,
      role: 'user',
      isActive: true
    });

    console.log('✅ User created successfully in MongoDB:', newUser._id);

    res.status(201).json({
      success: true,
      message: 'User created successfully in MongoDB',
      user: {
        id: newUser._id,
        clerkId: newUser.clerkId,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        address: newUser.address,
        ward: newUser.ward,
        houseNumber: newUser.houseNumber,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('=== User Creation Error ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'User with this email or Clerk ID already exists'
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'Failed to create user in MongoDB',
      details: error.message 
    });
  }
});

// Apply Clerk middleware for authenticated routes
app.use(auth);

// Public admin API: list all users from MongoDB
app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    // Count reports per user from reports collection
    const reportCounts = await Report.aggregate([
      { $group: { _id: "$userId", count: { $sum: 1 } } }
    ]);
    const countMap = {};
    reportCounts.forEach(r => { countMap[r._id] = r.count; });

    const formatted = users.map((u, idx) => ({
      id: u.clerkId || u._id.toString(),
      name: u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username || 'Unknown',
      email: u.email || '',
      phone: u.phone || 'N/A',
      type: u.role === 'admin' ? 'Government' : 'Resident',
      status: u.isActive ? 'active' : 'inactive',
      reports: countMap[u.clerkId] || 0,
      joined: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : 'N/A',
      lastActive: u.updatedAt ? timeSince(u.updatedAt) : 'N/A',
      address: u.address || 'N/A',
      ward: u.ward || 'N/A',
      houseNumber: u.houseNumber || '',
      emailVerified: u.emailVerified || false,
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    console.error('Admin users fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Public admin API: system-wide stats
app.get("/api/admin/stats", async (req, res) => {
  try {
    const [totalUsers, totalCollectors, activeCollectors, reports] = await Promise.all([
      User.countDocuments(),
      Collector.countDocuments(),
      Collector.countDocuments({ status: 'active' }),
      Report.find({}).lean(),
    ]);

    const pendingReports = reports.filter(r => r.status !== 'resolved').length;
    const resolvedReports = reports.filter(r => r.status === 'resolved').length;
    const inProgressReports = reports.filter(r => r.status === 'in-progress').length;
    const receivedReports = reports.filter(r => r.status === 'received').length;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalCollectors,
        activeCollectors,
        totalReports: reports.length,
        pendingReports,
        resolvedReports,
        inProgressReports,
        receivedReports,
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Public admin API: all reports
app.get("/api/admin/reports", async (req, res) => {
  try {
    const reports = await Report.find({}).sort({ createdAt: -1 }).lean();
    res.json(reports);
  } catch (error) {
    console.error('Admin reports fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper: time since a date (relative)
function timeSince(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

// Protected routes (require authentication)
app.use("/api/reports", reportRoutes)
app.use("/api/users", userRoutes)
app.use("/api/collectors", collectorRoutes)
app.use("/api/ward-tasks", wardTaskRoutes)


export default app