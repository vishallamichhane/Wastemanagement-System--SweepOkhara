import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { auth } from "./libs/auth.js";
import { admin } from "./middleware/auth.js";
import { sendReminderToUser } from './services/scheduleReminderService.js';
import { sendReportResolutionEmail, sendBinFullAlertEmail, sendBinEmptiedAlertEmail } from './utils/email.js';
import BinAlert from './models/binAlert.js';

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
    return res.status(200).json({message:"Welcome to SweepPokhara Backend"})
})

// Public user creation endpoint (for registration)
app.post("/api/users/create", async (req, res) => {
  try {
    const { clerkId, username, email, firstName, lastName, fullName, address, ward, houseNumber, phone, role } = req.body;

    console.log('=== Creating User in MongoDB (Public Route) ===');
    console.log('Data received:', { clerkId, username, email, firstName, lastName, fullName, address, ward, houseNumber, phone, role });

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
      // If role is provided and different, update it (e.g., promoting to admin)
      if (role && ['user', 'admin'].includes(role) && existingUser.role !== role) {
        existingUser.role = role;
        await existingUser.save();
        console.log(`User role updated to '${role}' in MongoDB:`, existingUser._id);
      }
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
      role: (role && ['user', 'admin'].includes(role)) ? role : 'user',
      isActive: true
    });

    console.log('✅ User created successfully in MongoDB:', newUser._id);
    // If user registered with a ward, send instant pickup reminder if applicable
    if (newUser.ward) {
      console.log('\ud83d\udce7 New user has ward set — checking if instant reminder needed');
      sendReminderToUser(newUser).catch(err =>
        console.error('\u26a0\ufe0f Instant reminder error for new user:', err.message)
      );
    }
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

// Public bin status alert endpoint (called from all map views)
app.post("/api/bin-status/alert", async (req, res) => {
  try {
    const { binId, ward, status, location, fillLevel } = req.body;

    // Validate inputs
    if (!binId || !ward || !status || !location) {
      return res.status(400).json({ success: false, error: "Missing required fields: binId, ward, status, location" });
    }

    if (!["full", "emptied"].includes(status)) {
      return res.status(400).json({ success: false, error: "Status must be 'full' or 'emptied'" });
    }

    const wardNumber = parseInt(String(ward).replace(/\D/g, "")) || 0;
    if (!wardNumber) {
      return res.status(400).json({ success: false, error: "Invalid ward number" });
    }

    // Check deduplication - only alert if status actually changed
    let binAlert = await BinAlert.findOne({ binId });
    if (binAlert && binAlert.lastStatus === status) {
      console.log(`⏭️ Bin ${binId} already in '${status}' state, skipping duplicate alert`);
      return res.json({ success: true, alerted: false, reason: "duplicate", message: "Alert already sent for this status" });
    }

    // Update or create bin alert record
    if (binAlert) {
      binAlert.lastStatus = status;
      binAlert.lastAlertAt = new Date();
      binAlert.ward = wardNumber;
      binAlert.location = location;
      await binAlert.save();
    } else {
      binAlert = await BinAlert.create({
        binId,
        ward: wardNumber,
        lastStatus: status,
        lastAlertAt: new Date(),
        location,
      });
    }

    // Find all users in this ward
    const wardVariations = [
      `Ward ${wardNumber}`,
      `ward ${wardNumber}`,
      `Ward-${wardNumber}`,
      `${wardNumber}`,
    ];
    const wardUsers = await User.find({
      ward: { $in: wardVariations },
      email: { $exists: true, $ne: "" },
    });

    // Find collectors assigned to this ward
    const wardCollectors = await Collector.find({
      assignedWards: wardNumber,
      email: { $exists: true, $ne: "" },
      status: "active",
    });

    // Find admin users (they should always be notified about bin alerts)
    const adminUsers = await User.find({
      role: "admin",
      email: { $exists: true, $ne: "" },
    });

    console.log(`📧 Sending bin ${status} alert for ${binId} (Ward ${wardNumber}) to ${wardUsers.length} users, ${wardCollectors.length} collectors, ${adminUsers.length} admins`);

    // Send emails to all ward users
    let emailsSent = 0;
    let emailsFailed = 0;
    const emailFunction = status === "full" ? sendBinFullAlertEmail : sendBinEmptiedAlertEmail;

    for (const user of wardUsers) {
      try {
        await emailFunction({
          to: user.email,
          name: user.fullName || user.username || "Resident",
          binId,
          ward: wardNumber,
          location,
          fillLevel: fillLevel || (status === "full" ? 100 : 0),
        });
        emailsSent++;
      } catch (emailErr) {
        console.error(`❌ Failed to send email to ${user.email}:`, emailErr.message);
        emailsFailed++;
      }
    }

    // Send emails to collectors assigned to this ward
    const notifiedEmails = new Set(wardUsers.map(u => u.email));
    for (const collector of wardCollectors) {
      if (notifiedEmails.has(collector.email)) continue; // skip if already emailed
      notifiedEmails.add(collector.email);
      try {
        await emailFunction({
          to: collector.email,
          name: collector.name || "Collector",
          binId,
          ward: wardNumber,
          location,
          fillLevel: fillLevel || (status === "full" ? 100 : 0),
        });
        emailsSent++;
      } catch (emailErr) {
        console.error(`❌ Failed to send email to collector ${collector.email}:`, emailErr.message);
        emailsFailed++;
      }
    }

    // Send emails to admin users
    for (const admin of adminUsers) {
      if (notifiedEmails.has(admin.email)) continue; // skip if already emailed
      notifiedEmails.add(admin.email);
      try {
        await emailFunction({
          to: admin.email,
          name: admin.fullName || admin.username || "Admin",
          binId,
          ward: wardNumber,
          location,
          fillLevel: fillLevel || (status === "full" ? 100 : 0),
        });
        emailsSent++;
      } catch (emailErr) {
        console.error(`❌ Failed to send email to admin ${admin.email}:`, emailErr.message);
        emailsFailed++;
      }
    }

    console.log(`✅ Bin alert complete: ${emailsSent} sent, ${emailsFailed} failed`);

    res.json({
      success: true,
      alerted: true,
      status,
      binId,
      ward: wardNumber,
      emailsSent,
      emailsFailed,
      totalUsers: wardUsers.length,
      totalCollectors: wardCollectors.length,
      totalAdmins: adminUsers.length,
    });
  } catch (error) {
    console.error("❌ Bin status alert error:", error);
    res.status(500).json({ success: false, error: "Failed to process bin status alert", details: error.message });
  }
});

// Apply Clerk middleware for authenticated routes
app.use(auth);

// Protected admin API: list all users from MongoDB
app.get("/api/admin/users", admin, async (req, res) => {
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

// Protected admin API: system-wide stats
app.get("/api/admin/stats", admin, async (req, res) => {
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

// Protected admin API: all reports
app.get("/api/admin/reports", admin, async (req, res) => {
  try {
    const reports = await Report.find({}).sort({ createdAt: -1 }).lean();
    res.json(reports);
  } catch (error) {
    console.error('Admin reports fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Protected admin API: verify (approve) a report completion
app.put("/api/admin/reports/:reportId/verify", admin, async (req, res) => {
  try {
    const { reportId } = req.params;
    const { adminNotes } = req.body;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    if (report.status !== 'pending-verification') {
      return res.status(400).json({
        success: false,
        message: `Cannot verify a report with status '${report.status}'. Only pending-verification reports can be verified.`,
      });
    }

    // Mark as verified and resolved
    report.status = 'resolved';
    report.adminVerified = true;
    report.adminVerifiedAt = new Date();
    report.adminVerifiedBy = req.auth?.userId || 'admin';
    report.adminNotes = adminNotes || '';
    await report.save();

    console.log(`✅ Report ${reportId} verified and resolved by admin.`);

    // Now send the resolution email to the user
    if (report.userEmail) {
      try {
        const resolvedDate = new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Kathmandu',
        });

        const reportDate = new Date(report.createdAt).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Kathmandu',
        });

        await sendReportResolutionEmail({
          to: report.userEmail,
          userName: report.userName || 'Resident',
          reportLabel: report.reportLabel,
          description: report.description,
          location: report.location,
          ward: report.ward,
          collectorName: report.assignedCollectorName || 'Collection Team',
          vehicleId: report.assignedVehicleId || 'N/A',
          reportDate,
          resolvedDate,
          priority: report.priority,
        });

        console.log(`📧 Report resolution email sent to ${report.userEmail} after admin verification.`);
      } catch (emailError) {
        console.error(`❌ Failed to send resolution email for report ${reportId}:`, emailError.message);
      }
    }

    res.json({ success: true, data: report, message: 'Report verified and resolved successfully.' });
  } catch (error) {
    console.error('Admin verify report error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Protected admin API: reject a report completion (send back to collector)
app.put("/api/admin/reports/:reportId/reject", admin, async (req, res) => {
  try {
    const { reportId } = req.params;
    const { adminNotes } = req.body;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    if (report.status !== 'pending-verification') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject a report with status '${report.status}'. Only pending-verification reports can be rejected.`,
      });
    }

    // Send back to in-progress
    report.status = 'in-progress';
    report.adminVerified = false;
    report.adminNotes = adminNotes || 'Verification rejected by admin. Please re-inspect.';
    report.completionNote = '';
    report.collectorCompletedAt = null;
    await report.save();

    console.log(`❌ Report ${reportId} rejected by admin. Sent back to in-progress.`);

    res.json({ success: true, data: report, message: 'Report rejected and sent back to collector.' });
  } catch (error) {
    console.error('Admin reject report error:', error);
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