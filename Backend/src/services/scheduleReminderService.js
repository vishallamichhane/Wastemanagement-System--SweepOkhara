/**
 * Scheduled Pickup Reminder Service
 * 
 * Runs daily at 6:00 PM to send reminder emails to users
 * whose ward has a scheduled pickup tomorrow.
 * 
 * Uses node-cron for scheduling.
 * Install: npm install node-cron
 */

import cron from 'node-cron';
import User from '../models/user.js';
import Collector from '../models/collector.js';
import { sendScheduleReminderEmail } from '../utils/email.js';

// Ward schedule data — only pickup days and time slots
// Driver/vehicle info comes from the real Collector database, NOT hardcoded
const WARD_SCHEDULES = {
  1:  { pickupDays: [0, 2, 4], timeSlot: '6:00 AM - 8:00 AM' },
  2:  { pickupDays: [1, 3, 5], timeSlot: '6:00 AM - 8:00 AM' },
  3:  { pickupDays: [0, 2, 4], timeSlot: '8:00 AM - 10:00 AM' },
  4:  { pickupDays: [1, 3, 5], timeSlot: '8:00 AM - 10:00 AM' },
  5:  { pickupDays: [0, 2, 4], timeSlot: '10:00 AM - 12:00 PM' },
  6:  { pickupDays: [1, 3, 5], timeSlot: '9:00 AM - 11:00 AM' },
  7:  { pickupDays: [0, 2, 4], timeSlot: '12:00 PM - 2:00 PM' },
  8:  { pickupDays: [1, 3, 5], timeSlot: '10:00 AM - 12:00 PM' },
  9:  { pickupDays: [0, 2, 4], timeSlot: '2:00 PM - 4:00 PM' },
  10: { pickupDays: [1, 3, 5], timeSlot: '12:00 PM - 2:00 PM' },
  11: { pickupDays: [0, 2, 4], timeSlot: '4:00 PM - 6:00 PM' },
  12: { pickupDays: [1, 3, 5], timeSlot: '2:00 PM - 4:00 PM' },
  13: { pickupDays: [0, 3, 5], timeSlot: '6:00 AM - 8:00 AM' },
  14: { pickupDays: [1, 4, 6], timeSlot: '4:00 PM - 6:00 PM' },
  15: { pickupDays: [2, 4, 6], timeSlot: '8:00 AM - 10:00 AM' },
  16: { pickupDays: [0, 3, 6], timeSlot: '8:00 AM - 10:00 AM' },
  17: { pickupDays: [1, 4, 6], timeSlot: '8:00 AM - 10:00 AM' },
  18: { pickupDays: [2, 5, 0], timeSlot: '9:00 AM - 11:00 AM' },
  19: { pickupDays: [1, 4, 6], timeSlot: '6:00 AM - 8:00 AM' },
  20: { pickupDays: [2, 5, 0], timeSlot: '2:00 PM - 4:00 PM' },
  21: { pickupDays: [0, 2, 5], timeSlot: '6:00 AM - 8:00 AM' },
  22: { pickupDays: [1, 3, 6], timeSlot: '10:00 AM - 12:00 PM' },
  23: { pickupDays: [2, 4, 0], timeSlot: '4:00 PM - 6:00 PM' },
  24: { pickupDays: [1, 3, 5], timeSlot: '12:00 PM - 2:00 PM' },
  25: { pickupDays: [0, 3, 5], timeSlot: '12:00 PM - 2:00 PM' },
  26: { pickupDays: [2, 4, 6], timeSlot: '8:00 AM - 10:00 AM' },
  27: { pickupDays: [1, 4, 6], timeSlot: '2:00 PM - 4:00 PM' },
  28: { pickupDays: [0, 2, 5], timeSlot: '10:00 AM - 12:00 PM' },
  29: { pickupDays: [1, 3, 6], timeSlot: '4:00 PM - 6:00 PM' },
  30: { pickupDays: [2, 5, 0], timeSlot: '6:00 AM - 8:00 AM' },
  31: { pickupDays: [1, 4, 6], timeSlot: '8:00 AM - 10:00 AM' },
  32: { pickupDays: [0, 3, 5], timeSlot: '9:00 AM - 11:00 AM' },
  33: { pickupDays: [2, 4, 6], timeSlot: '10:00 AM - 12:00 PM' },
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Get today's date string in YYYY-MM-DD format (Nepal timezone)
 */
function getTodayDateString() {
  const now = new Date();
  // Nepal is UTC+5:45
  const nepalOffset = 5 * 60 + 45;
  const nepalTime = new Date(now.getTime() + (nepalOffset + now.getTimezoneOffset()) * 60000);
  return nepalTime.toISOString().split('T')[0];
}

/**
 * Send reminder emails to all users whose ward has pickup tomorrow.
 * Skips users who already received a reminder today (prevents duplicates
 * between the 6 PM primary run and the 9 PM catch-up run).
 */
async function sendTomorrowReminders() {
  try {
    // Get tomorrow's date and day of week
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDayOfWeek = tomorrow.getDay();
    const tomorrowDayName = DAY_NAMES[tomorrowDayOfWeek];
    const todayStr = getTodayDateString();

    console.log(`\n🔔 [${new Date().toISOString()}] Running daily pickup reminder job for ${tomorrowDayName}...`);

    // Find all wards that have pickup tomorrow
    const wardsWithPickupTomorrow = [];
    for (let wardNum = 1; wardNum <= 33; wardNum++) {
      const schedule = WARD_SCHEDULES[wardNum];
      if (schedule && schedule.pickupDays.includes(tomorrowDayOfWeek)) {
        wardsWithPickupTomorrow.push(wardNum);
      }
    }

    if (wardsWithPickupTomorrow.length === 0) {
      console.log(`   ℹ️  No pickups scheduled for tomorrow (${tomorrowDayName})`);
      return;
    }

    console.log(`   📍 Wards with pickup tomorrow: ${wardsWithPickupTomorrow.join(', ')}`);

    let totalEmailsSent = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    // Start of today (Nepal time) for checking who already got emailed
    const todayStart = new Date(todayStr + 'T00:00:00+05:45');

    // Process each ward
    for (const wardNum of wardsWithPickupTomorrow) {
      const schedule = WARD_SCHEDULES[wardNum];
      
      // Fetch real collector data from database — only use real DB data, no fake fallback
      const collector = await Collector.findOne({ 
        assignedWards: wardNum,
        status: 'active'
      });
      
      // Use real collector data if found, otherwise show "Not Assigned"
      const driverName = collector?.name || 'Not Assigned';
      const vehicleId = collector?.vehicleId || 'Not Assigned';
      
      // Find all users in this ward — robust matching for any ward format
      // Users may store ward as "5", "Ward 5", "ward 5", "Ward-5", "ward-5", "Ward No. 5", etc.
      const wardRegex = new RegExp(`^(ward[\\s\\-\\.]*)?${wardNum}$`, 'i');
      const users = await User.find({
        ward: { $regex: wardRegex },
        email: { $exists: true, $ne: '' },
      });

      if (users.length === 0) {
        console.log(`   📧 Ward ${wardNum}: No users found`);
        continue;
      }

      console.log(`   📧 Ward ${wardNum}: Found ${users.length} users to notify (Driver: ${driverName}, Vehicle: ${vehicleId})`);

      // Send email to each user (skip if already reminded today)
      for (const user of users) {
        // Check if this user was already emailed today
        if (user.lastReminderSentAt && user.lastReminderSentAt >= todayStart) {
          console.log(`      ⏭️  Skipped ${user.email} (already reminded today)`);
          totalSkipped++;
          continue;
        }

        try {
          await sendScheduleReminderEmail({
            to: user.email,
            name: user.fullName || user.username || 'Resident',
            ward: wardNum,
            timeSlot: schedule.timeSlot,
            dayName: tomorrowDayName,
            vehicle: vehicleId,
            driver: driverName,
          });

          // Mark user as reminded today
          await User.updateOne({ _id: user._id }, { lastReminderSentAt: new Date() });

          totalEmailsSent++;
          console.log(`      ✅ Sent to ${user.email}`);
        } catch (emailErr) {
          console.error(`      ❌ Failed to email ${user.email}:`, emailErr.message);
          totalErrors++;
        }
      }
    }

    console.log(`\n   ✅ Reminder job complete!`);
    console.log(`      📨 Emails sent: ${totalEmailsSent}`);
    if (totalSkipped > 0) {
      console.log(`      ⏭️  Skipped (already sent): ${totalSkipped}`);
    }
    if (totalErrors > 0) {
      console.log(`      ⚠️  Errors: ${totalErrors}`);
    }
    console.log();

  } catch (error) {
    console.error('❌ Error in sendTomorrowReminders:', error);
  }
}

/**
 * Initialize the cron job
 * Runs every day at 6:00 PM NPT (Nepal Time is UTC+5:45)
 * Sends reminder emails for next-day waste pickups automatically
 */
export function initializeScheduleReminderService() {
  // Primary run at 6:00 PM — sends to all eligible users
  const primarySchedule = '0 18 * * *';
  // Catch-up run at 9:00 PM — sends only to users who missed the 6 PM batch
  // (e.g., users who registered/updated their ward after 6 PM)
  const catchupSchedule = '0 21 * * *';

  console.log('📅 Initializing Schedule Reminder Service...');
  console.log(`   ⏰ Primary cron: daily at 6:00 PM (Asia/Kathmandu)`);
  console.log(`   ⏰ Catch-up cron: daily at 9:00 PM (Asia/Kathmandu)`);
  console.log(`   📧 Sends pickup reminders for next day (duplicates prevented)\n`);

  // Primary reminder at 6 PM
  cron.schedule(primarySchedule, () => {
    console.log(`\n⏰ [CRON] 6:00 PM primary reminder triggered at ${new Date().toISOString()}`);
    sendTomorrowReminders();
  }, {
    scheduled: true,
    timezone: "Asia/Kathmandu"
  });

  // Catch-up reminder at 9 PM — picks up users who missed the 6 PM run
  cron.schedule(catchupSchedule, () => {
    console.log(`\n⏰ [CRON] 9:00 PM catch-up reminder triggered at ${new Date().toISOString()}`);
    sendTomorrowReminders();
  }, {
    scheduled: true,
    timezone: "Asia/Kathmandu"
  });

  console.log('✅ Schedule Reminder Service initialized successfully!');
  console.log('   📌 6 PM: sends to all users | 9 PM: catches users who joined late');
  console.log('   📌 Duplicate emails prevented via lastReminderSentAt tracking.\n');
}

// Export for manual testing
export { sendTomorrowReminders };

/**
 * Send an immediate reminder to a single user if their ward has pickup tomorrow.
 * Called when a user registers or updates their ward, so they don't have to wait
 * for the next cron cycle.
 *
 * @param {Object} user - MongoDB user document (must have email, ward, fullName/username)
 */
export async function sendReminderToUser(user) {
  try {
    if (!user || !user.email || !user.ward) return;

    // Extract ward number from any format ("Ward 14", "14", "ward-14", etc.)
    const wardMatch = String(user.ward).match(/(\d+)/);
    if (!wardMatch) return;
    const wardNum = parseInt(wardMatch[1], 10);
    if (wardNum < 1 || wardNum > 33) return;

    const schedule = WARD_SCHEDULES[wardNum];
    if (!schedule) return;

    // Check if ward has pickup tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDayOfWeek = tomorrow.getDay();

    if (!schedule.pickupDays.includes(tomorrowDayOfWeek)) {
      console.log(`   \u2139\ufe0f  Ward ${wardNum} has no pickup tomorrow — no instant reminder needed for ${user.email}`);
      return;
    }

    // Check if already reminded today
    const todayStr = getTodayDateString();
    const todayStart = new Date(todayStr + 'T00:00:00+05:45');
    if (user.lastReminderSentAt && user.lastReminderSentAt >= todayStart) {
      console.log(`   \u23ed\ufe0f  ${user.email} was already reminded today — skipping instant reminder`);
      return;
    }

    const tomorrowDayName = DAY_NAMES[tomorrowDayOfWeek];

    // Get real collector from DB
    const collector = await Collector.findOne({ assignedWards: wardNum, status: 'active' });
    const driverName = collector?.name || 'Not Assigned';
    const vehicleId = collector?.vehicleId || 'Not Assigned';

    await sendScheduleReminderEmail({
      to: user.email,
      name: user.fullName || user.username || 'Resident',
      ward: wardNum,
      timeSlot: schedule.timeSlot,
      dayName: tomorrowDayName,
      vehicle: vehicleId,
      driver: driverName,
    });

    // Mark as reminded
    await User.updateOne({ _id: user._id }, { lastReminderSentAt: new Date() });

    console.log(`   \u2705 Instant reminder sent to ${user.email} for Ward ${wardNum} (${tomorrowDayName} pickup)`);
  } catch (err) {
    console.error(`   \u274c Instant reminder failed for ${user?.email}:`, err.message);
  }
}
