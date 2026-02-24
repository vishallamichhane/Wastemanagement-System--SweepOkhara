import express from 'express';
import { getAuth, clerkClient } from '@clerk/express';
import User from '../models/user.js';
import { sendScheduleReminderEmail } from '../utils/email.js';

const router = express.Router();

// Debug endpoint to check session
router.get('/debug/session', async (req, res) => {
  try {
    const auth = getAuth(req);

    if (!auth || !auth.userId) {
      return res.json({ authenticated: false, message: 'No active session' });
    }

    const user = await clerkClient.users.getUser(auth.userId);
    console.log('Session debug:', JSON.stringify(user, null, 2));
    res.json({
      authenticated: true,
      userId: user.id,
      email: user.emailAddresses?.[0]?.emailAddress,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      metadata: user.publicMetadata
    });
  } catch (error) {
    console.error('Session debug error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Note: User creation endpoint is now public and defined in app.js before Clerk middleware

// Middleware to verify user session using Clerk
const verifySession = async (req, res, next) => {
  try {
    const auth = getAuth(req);

    console.log('Session verification - auth:', auth);

    if (!auth || !auth.userId) {
      console.log('No session or user found');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get full user data from Clerk
    const user = await clerkClient.users.getUser(auth.userId);

    req.user = {
      id: user.id,
      email: user.emailAddresses?.[0]?.emailAddress || '',
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || '',
      emailVerified: user.emailAddresses?.[0]?.verification?.status === 'verified',
      image: user.imageUrl,
      phone: user.publicMetadata?.phone || user.unsafeMetadata?.phone || '',
      address: user.publicMetadata?.address || user.unsafeMetadata?.address || '',
      ward: user.publicMetadata?.ward || user.unsafeMetadata?.ward || '',
      houseNumber: user.publicMetadata?.houseNumber || user.unsafeMetadata?.houseNumber || '',
      role: user.publicMetadata?.role || 'user',
    };
    req.clerkUser = user;
    next();
  } catch (error) {
    console.error('Session verification error:', error);
    return res.status(401).json({ error: 'Unauthorized: ' + error.message });
  }
};

// Update user profile using Clerk metadata
router.put('/profile', verifySession, async (req, res) => {
  try {
    const { name, phone, address, ward, houseNumber } = req.body;
    const userId = req.user.id;

    console.log('=== Profile Update Request ===');
    console.log('User ID:', userId);
    console.log('Update data:', { name, phone, address, ward, houseNumber });

    // Parse first and last name from full name
    const nameParts = (name || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Update Clerk user profile and metadata
    const updatedUser = await clerkClient.users.updateUser(userId, {
      firstName: firstName,
      lastName: lastName,
      publicMetadata: {
        ...req.clerkUser.publicMetadata,
        phone: phone,
        address: address,
        ward: ward,
        houseNumber: houseNumber,
      },
    });

    console.log('✅ Clerk updated successfully:', updatedUser.id);

    // Also update MongoDB
    try {
      const mongoUser = await User.findOneAndUpdate(
        { clerkId: userId },
        {
          firstName: firstName,
          lastName: lastName,
          fullName: name,
          phone: phone,
          address: address,
          ward: ward,
          houseNumber: houseNumber,
        },
        { new: true, upsert: false }
      );

      if (mongoUser) {
        console.log('✅ MongoDB updated successfully:', mongoUser._id);
      } else {
        console.log('⚠️ User not found in MongoDB, skipping update');
      }
    } catch (mongoError) {
      console.error('⚠️ MongoDB update error:', mongoError.message);
      // Don't fail the request if MongoDB update fails
    }

    console.log('Profile update complete');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: `${updatedUser.firstName || ''} ${updatedUser.lastName || ''}`.trim(),
        email: updatedUser.emailAddresses?.[0]?.emailAddress || '',
        phone: updatedUser.publicMetadata?.phone || '',
        address: updatedUser.publicMetadata?.address || '',
        ward: updatedUser.publicMetadata?.ward || '',
        houseNumber: updatedUser.publicMetadata?.houseNumber || '',
        role: updatedUser.publicMetadata?.role || 'user',
      }
    });
  } catch (error) {
    console.error('=== Profile Update Error ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to update profile',
      details: error.message 
    });
  }
});

// Debug endpoint to get current user profile
router.get('/profile', verifySession, async (req, res) => {
  try {
    console.log('Fetching profile for user:', req.user.id);

    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch profile',
      details: error.message 
    });
  }
});

// Ward schedule data (mirrors frontend wardSchedules.js)
const WARD_SCHEDULES = {
  1: { timeSlot: '6:00 AM - 8:00 AM', vehicle: 'SW-01', driver: 'Ram Bahadur', pickupDays: [0, 2, 4] },
  2: { timeSlot: '6:00 AM - 8:00 AM', vehicle: 'SW-02', driver: 'Hari Prasad', pickupDays: [1, 3, 5] },
  3: { timeSlot: '8:00 AM - 10:00 AM', vehicle: 'SW-03', driver: 'Shyam Kumar', pickupDays: [0, 2, 4] },
  4: { timeSlot: '8:00 AM - 10:00 AM', vehicle: 'SW-04', driver: 'Gopal Thapa', pickupDays: [1, 3, 5] },
  5: { timeSlot: '10:00 AM - 12:00 PM', vehicle: 'SW-05', driver: 'Bikram Gurung', pickupDays: [0, 2, 4] },
  6: { timeSlot: '9:00 AM - 11:00 AM', vehicle: 'SW-06', driver: 'Prakash Rai', pickupDays: [1, 3, 5] },
  7: { timeSlot: '12:00 PM - 2:00 PM', vehicle: 'SW-07', driver: 'Dipak Shrestha', pickupDays: [0, 2, 4] },
  8: { timeSlot: '10:00 AM - 12:00 PM', vehicle: 'SW-08', driver: 'Sujit Tamang', pickupDays: [1, 3, 5] },
  9: { timeSlot: '2:00 PM - 4:00 PM', vehicle: 'SW-09', driver: 'Rajan Magar', pickupDays: [0, 2, 4] },
  10: { timeSlot: '12:00 PM - 2:00 PM', vehicle: 'SW-10', driver: 'Binod KC', pickupDays: [1, 3, 5] },
  11: { timeSlot: '4:00 PM - 6:00 PM', vehicle: 'SW-11', driver: 'Kiran Poudel', pickupDays: [0, 2, 4] },
  12: { timeSlot: '2:00 PM - 4:00 PM', vehicle: 'SW-12', driver: 'Anil Bhattarai', pickupDays: [1, 3, 5] },
  13: { timeSlot: '6:00 AM - 8:00 AM', vehicle: 'SW-13', driver: 'Rajesh Adhikari', pickupDays: [0, 3, 5] },
  14: { timeSlot: '7:00 AM - 9:00 AM', vehicle: 'SW-14', driver: 'Sunil Karki', pickupDays: [1, 4, 6] },
  15: { timeSlot: '8:00 AM - 10:00 AM', vehicle: 'SW-15', driver: 'Manoj Dahal', pickupDays: [0, 2, 5] },
  16: { timeSlot: '9:00 AM - 11:00 AM', vehicle: 'SW-16', driver: 'Arjun Bhandari', pickupDays: [1, 3, 6] },
  17: { timeSlot: '10:00 AM - 12:00 PM', vehicle: 'SW-17', driver: 'Puspa Pandey', pickupDays: [0, 4, 6] },
  18: { timeSlot: '6:00 AM - 8:00 AM', vehicle: 'SW-18', driver: 'Deepak Chhetri', pickupDays: [2, 4, 6] },
  19: { timeSlot: '7:00 AM - 9:00 AM', vehicle: 'SW-19', driver: 'Nabin Lama', pickupDays: [0, 1, 3] },
  20: { timeSlot: '8:00 AM - 10:00 AM', vehicle: 'SW-20', driver: 'Rajendra Thapa', pickupDays: [1, 3, 5] },
  21: { timeSlot: '9:00 AM - 11:00 AM', vehicle: 'SW-21', driver: 'Santosh Rana', pickupDays: [0, 2, 4] },
  22: { timeSlot: '10:00 AM - 12:00 PM', vehicle: 'SW-22', driver: 'Prem Bahadur', pickupDays: [1, 4, 6] },
  23: { timeSlot: '11:00 AM - 1:00 PM', vehicle: 'SW-23', driver: 'Bhim Nepali', pickupDays: [0, 3, 5] },
  24: { timeSlot: '12:00 PM - 2:00 PM', vehicle: 'SW-24', driver: 'Kamal Thakuri', pickupDays: [2, 4, 6] },
  25: { timeSlot: '6:00 AM - 8:00 AM', vehicle: 'SW-25', driver: 'Tej Bahadur', pickupDays: [0, 2, 5] },
  26: { timeSlot: '7:00 AM - 9:00 AM', vehicle: 'SW-26', driver: 'Dhan Bahadur', pickupDays: [1, 3, 6] },
  27: { timeSlot: '8:00 AM - 10:00 AM', vehicle: 'SW-27', driver: 'Min Bahadur', pickupDays: [0, 4, 6] },
  28: { timeSlot: '9:00 AM - 11:00 AM', vehicle: 'SW-28', driver: 'Lal Bahadur', pickupDays: [2, 4, 6] },
  29: { timeSlot: '10:00 AM - 12:00 PM', vehicle: 'SW-29', driver: 'Purna Lama', pickupDays: [0, 1, 3] },
  30: { timeSlot: '11:00 AM - 1:00 PM', vehicle: 'SW-30', driver: 'Ganga Thapa', pickupDays: [1, 3, 5] },
  31: { timeSlot: '6:00 AM - 8:00 AM', vehicle: 'SW-31', driver: 'Bishnu Shrestha', pickupDays: [0, 2, 4] },
  32: { timeSlot: '7:00 AM - 9:00 AM', vehicle: 'SW-32', driver: 'Hari Bahadur', pickupDays: [1, 4, 6] },
  33: { timeSlot: '8:00 AM - 10:00 AM', vehicle: 'SW-33', driver: 'Krishna Tamang', pickupDays: [0, 3, 5] },
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Send schedule reminder email to user
router.post('/schedule-reminder', verifySession, async (req, res) => {
  try {
    const { ward } = req.body;
    const wardNum = parseInt(ward);

    if (!wardNum || wardNum < 1 || wardNum > 33) {
      return res.status(400).json({ error: 'Valid ward number (1-33) is required' });
    }

    const schedule = WARD_SCHEDULES[wardNum];
    if (!schedule) {
      return res.status(404).json({ error: 'No schedule found for this ward' });
    }

    const today = new Date().getDay();
    const isPickupToday = schedule.pickupDays.includes(today);

    // Find next pickup day
    let nextPickupDay = today;
    let daysUntil = 0;
    if (!isPickupToday) {
      for (let i = 1; i <= 7; i++) {
        const checkDay = (today + i) % 7;
        if (schedule.pickupDays.includes(checkDay)) {
          nextPickupDay = checkDay;
          daysUntil = i;
          break;
        }
      }
    }

    const dayName = isPickupToday ? `Today (${DAY_NAMES[today]})` : DAY_NAMES[nextPickupDay];
    const userEmail = req.user.email;
    const userName = req.user.name;

    if (!userEmail) {
      return res.status(400).json({ error: 'User email not found' });
    }

    const result = await sendScheduleReminderEmail({
      to: userEmail,
      name: userName,
      ward: wardNum,
      timeSlot: schedule.timeSlot,
      dayName: dayName,
      vehicle: schedule.vehicle,
      driver: schedule.driver,
    });

    console.log(`📧 Schedule reminder sent to ${userEmail} for Ward ${wardNum} (${dayName})`);

    res.json({
      success: true,
      message: 'Schedule reminder email sent',
      details: {
        email: userEmail,
        ward: wardNum,
        day: dayName,
        timeSlot: schedule.timeSlot,
        provider: result.provider,
      },
    });
  } catch (error) {
    console.error('Schedule reminder error:', error);
    res.status(500).json({
      error: 'Failed to send schedule reminder',
      details: error.message,
    });
  }
});

export default router;
