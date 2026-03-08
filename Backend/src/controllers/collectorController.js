import Collector from '../models/collector.js';
import Report from '../models/reports.js';
import { sendReportResolutionEmail } from '../utils/email.js';
import jwt from 'jsonwebtoken';

// Maximum number of collectors allowed
const MAX_COLLECTORS = 6;

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id, role: 'collector' }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

// @desc    Create new collector (Admin only)
// @route   POST /api/collectors
// @access  Private/Admin
export const createCollector = async (req, res) => {
  try {
    const {
      collectorId,
      password,
      name,
      email,
      phoneNumber,
      assignedWards,
      vehicleId,
    } = req.body;

    console.log('📋 Create Collector Request:', {
      collectorId,
      name,
      email,
      wardsCount: assignedWards?.length,
    });

    // Validate assigned wards
    if (!assignedWards || !Array.isArray(assignedWards) || assignedWards.length < 5) {
      console.log('❌ Validation failed: Need at least 5 wards');
      return res.status(400).json({
        success: false,
        message: 'Collector must be assigned to at least 5 wards',
      });
    }

    // Check if maximum collectors limit reached
    const collectorCount = await Collector.countDocuments();
    if (collectorCount >= MAX_COLLECTORS) {
      console.log(`❌ Max limit reached: ${collectorCount}/${MAX_COLLECTORS}`);
      return res.status(400).json({
        success: false,
        message: `Maximum limit of ${MAX_COLLECTORS} collectors reached. Cannot add more collectors.`,
      });
    }

    // Check if collector ID already exists
    const collectorExists = await Collector.findOne({ collectorId });
    if (collectorExists) {
      console.log(`❌ Collector ID already exists: ${collectorId}`);
      return res.status(400).json({
        success: false,
        message: 'Collector ID already exists',
      });
    }

    // Check if email already exists
    const emailExists = await Collector.findOne({ email });
    if (emailExists) {
      console.log(`❌ Email already exists: ${email}`);
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    console.log('✅ All validations passed, preparing to create collector');

    // Validate all required fields
    if (!collectorId || !password || !name || !email || !phoneNumber || !vehicleId) {
      const missingFields = [];
      if (!collectorId) missingFields.push('collectorId');
      if (!password) missingFields.push('password');
      if (!name) missingFields.push('name');
      if (!email) missingFields.push('email');
      if (!phoneNumber) missingFields.push('phoneNumber');
      if (!vehicleId) missingFields.push('vehicleId');
      
      console.log('❌ Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    // Ensure password is a string and has minimum length
    if (typeof password !== 'string' || password.length < 6) {
      console.log('❌ Password validation failed');
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Create collector data object
    const collectorData = {
      collectorId: String(collectorId).trim(),
      password: String(password).trim(),
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      phoneNumber: String(phoneNumber).trim(),
      assignedWards: Array.isArray(assignedWards) ? assignedWards : [],
      vehicleId: String(vehicleId).trim(),
    };

    console.log('📦 Collector data ready:', {
      collectorId: collectorData.collectorId,
      name: collectorData.name,
      password: '***',
      email: collectorData.email,
      assignedWards: collectorData.assignedWards,
      vehicleId: collectorData.vehicleId,
    });

    // Create the collector document
    console.log('🚀 Creating collector document in MongoDB...');
    const collector = await Collector.create(collectorData);
    console.log('✅ Collector created successfully:', collector._id);

    if (collector) {
      const responseData = {
        success: true,
        data: {
          id: collector._id,
          collectorId: collector.collectorId,
          name: collector.name,
          email: collector.email,
          phoneNumber: collector.phoneNumber,
          assignedWards: collector.assignedWards,
          vehicleId: collector.vehicleId,
          status: collector.status,
        },
        message: 'Collector created successfully',
      };
      
      console.log('📤 Sending success response');
      res.status(201).json(responseData);
    } else {
      console.log('❌ Collector creation returned null');
      res.status(400).json({
        success: false,
        message: 'Invalid collector data',
      });
    }
  } catch (error) {
    console.error('❌ Create collector error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + messages.join(', '),
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      });
    }

    // Handle any other errors
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating collector',
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
};

// @desc    Collector login
// @route   POST /api/collectors/login
// @access  Public
export const collectorLogin = async (req, res) => {
  try {
    const { collectorId, password, phoneNumber } = req.body;

    // Validate input
    if (!collectorId || !password || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide collector ID, password, and phone number',
      });
    }

    // Find collector and include password field
    const collector = await Collector.findOne({ collectorId }).select('+password');

    if (!collector) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if collector is active
    if (collector.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Your account is inactive. Please contact admin.',
      });
    }

    // Verify password
    const isPasswordMatch = await collector.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Verify phone number
    if (collector.phoneNumber !== phoneNumber) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number',
      });
    }

    // Generate token
    const token = generateToken(collector._id);

    res.status(200).json({
      success: true,
      data: {
        id: collector._id,
        collectorId: collector.collectorId,
        name: collector.name,
        email: collector.email,
        phoneNumber: collector.phoneNumber,
        assignedWards: collector.assignedWards,
        vehicleId: collector.vehicleId,
        status: collector.status,
        badge: collector.badge,
        rating: collector.rating,
        token,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Collector login error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all collectors
// @route   GET /api/collectors
// @access  Private/Admin
export const getAllCollectors = async (req, res) => {
  try {
    const collectors = await Collector.find().select('-password');
    
    res.status(200).json({
      success: true,
      count: collectors.length,
      maxLimit: MAX_COLLECTORS,
      remaining: MAX_COLLECTORS - collectors.length,
      data: collectors,
    });
  } catch (error) {
    console.error('Get collectors error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single collector
// @route   GET /api/collectors/:id
// @access  Private
export const getCollector = async (req, res) => {
  try {
    const collector = await Collector.findById(req.params.id).select('-password');

    if (!collector) {
      return res.status(404).json({
        success: false,
        message: 'Collector not found',
      });
    }

    res.status(200).json({
      success: true,
      data: collector,
    });
  } catch (error) {
    console.error('Get collector error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update collector
// @route   PUT /api/collectors/:id
// @access  Private/Admin
export const updateCollector = async (req, res) => {
  try {
    const collector = await Collector.findById(req.params.id);

    if (!collector) {
      return res.status(404).json({
        success: false,
        message: 'Collector not found',
      });
    }

    // Update fields (excluding password and collectorId)
    const allowedUpdates = ['name', 'email', 'phoneNumber', 'assignedWards', 'vehicleId', 'status', 'badge', 'rating', 'efficiency'];
    
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        collector[key] = req.body[key];
      }
    });

    await collector.save();

    res.status(200).json({
      success: true,
      data: collector,
      message: 'Collector updated successfully',
    });
  } catch (error) {
    console.error('Update collector error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete collector
// @route   DELETE /api/collectors/:id
// @access  Private/Admin
export const deleteCollector = async (req, res) => {
  try {
    const collector = await Collector.findById(req.params.id);

    if (!collector) {
      return res.status(404).json({
        success: false,
        message: 'Collector not found',
      });
    }

    await collector.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Collector deleted successfully',
    });
  } catch (error) {
    console.error('Delete collector error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get logged-in collector's profile
// @route   GET /api/collectors/profile
// @access  Private (Collector only)
export const getCollectorProfile = async (req, res) => {
  try {
    // req.collector is set by protectCollector middleware
    const collector = req.collector;

    res.status(200).json({
      success: true,
      data: {
        id: collector._id,
        collectorId: collector.collectorId,
        name: collector.name,
        email: collector.email,
        phoneNumber: collector.phoneNumber,
        assignedWards: collector.assignedWards,
        vehicleId: collector.vehicleId,
        status: collector.status,
        badge: collector.badge,
        rating: collector.rating,
        efficiency: collector.efficiency,
        totalCollections: collector.totalCollections,
        joinDate: collector.createdAt,
      },
    });
  } catch (error) {
    console.error('Get collector profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update logged-in collector's profile
// @route   PUT /api/collectors/profile
// @access  Private (Collector only)
export const updateCollectorProfile = async (req, res) => {
  try {
    const collector = await Collector.findById(req.collector._id);

    if (!collector) {
      return res.status(404).json({
        success: false,
        message: 'Collector not found',
      });
    }

    // Only allow updating certain fields
    const allowedUpdates = ['phoneNumber', 'email'];
    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const updatedCollector = await Collector.findByIdAndUpdate(
      req.collector._id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: updatedCollector,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update collector profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get collector by ward number
// @route   GET /api/collectors/ward/:wardNumber
// @access  Public
export const getCollectorByWard = async (req, res) => {
  try {
    const wardNumber = parseInt(req.params.wardNumber);

    if (isNaN(wardNumber) || wardNumber < 1 || wardNumber > 33) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ward number. Must be between 1 and 33.',
      });
    }

    // Find collector whose assignedWards includes this ward number
    const collector = await Collector.findOne({
      assignedWards: wardNumber,
      status: 'active'
    }).select('collectorId name vehicleId assignedWards phoneNumber rating badge');

    if (!collector) {
      return res.status(404).json({
        success: false,
        message: 'No collector assigned to this ward',
      });
    }

    res.status(200).json({
      success: true,
      data: collector,
    });
  } catch (error) {
    console.error('Get collector by ward error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get reports assigned to the logged-in collector (by their assigned wards)
// @route   GET /api/collectors/my-reports
// @access  Private/Collector
export const getCollectorReports = async (req, res) => {
  try {
    const collector = req.collector;
    const assignedWards = collector.assignedWards || [];

    console.log('📋 Fetching reports for collector:', collector.collectorId, 'Wards:', assignedWards);

    // Find reports whose ward is in this collector's assignedWards
    const reports = await Report.find({
      ward: { $in: assignedWards }
    }).sort({ createdAt: -1 });

    console.log(`✅ Found ${reports.length} reports for collector ${collector.collectorId}`);

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error('Get collector reports error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update report status by collector
// @route   PUT /api/collectors/reports/:reportId/status
// @access  Private/Collector
export const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, completionNote } = req.body;

    const validStatuses = ['received', 'in-progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Verify the report is in collector's assigned wards
    const collector = req.collector;
    if (!collector.assignedWards.includes(report.ward)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this report',
      });
    }

    // When collector marks as resolved, set to pending-verification instead
    if (status === 'resolved') {
      report.status = 'pending-verification';
      report.completionNote = completionNote || '';
      report.collectorCompletedAt = new Date();
      await report.save();

      console.log(`⏳ Report ${reportId} marked as 'pending-verification' by collector ${collector.collectorId}. Awaiting admin verification.`);

      return res.status(200).json({
        success: true,
        data: report,
        message: 'Report marked as completed and sent for admin verification.',
      });
    }

    // For other statuses (received, in-progress), update directly
    report.status = status;
    await report.save();

    console.log(`✅ Report ${reportId} status updated to '${status}' by collector ${collector.collectorId}`);

    res.status(200).json({
      success: true,
      data: report,
      message: `Report status updated to ${status}`,
    });
  } catch (error) {
    console.error('Update report status error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get collector statistics
// @route   GET /api/collectors/stats/summary
// @access  Private/Admin
export const getCollectorStats = async (req, res) => {
  try {
    const totalCollectors = await Collector.countDocuments();
    const activeCollectors = await Collector.countDocuments({ status: 'active' });
    const inactiveCollectors = await Collector.countDocuments({ status: 'inactive' });

    res.status(200).json({
      success: true,
      data: {
        total: totalCollectors,
        active: activeCollectors,
        inactive: inactiveCollectors,
        maxLimit: MAX_COLLECTORS,
        remaining: MAX_COLLECTORS - totalCollectors,
      },
    });
  } catch (error) {
    console.error('Get collector stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
