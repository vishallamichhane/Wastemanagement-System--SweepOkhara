/**
 * Quick script to manually send reminder to specific user(s) who missed the 6 PM cron
 * Usage: node src/scripts/sendNow.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/user.js';
import Collector from '../models/collector.js';
import { sendScheduleReminderEmail } from '../utils/email.js';

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

await connectDB();

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowDay = tomorrow.getDay();
const tomorrowDayName = DAY_NAMES[tomorrowDay];

console.log(`Tomorrow: ${tomorrowDayName} (day ${tomorrowDay})`);

// Find all wards with pickup tomorrow
const wardsWithPickup = [];
for (let w = 1; w <= 33; w++) {
  if (WARD_SCHEDULES[w].pickupDays.includes(tomorrowDay)) {
    wardsWithPickup.push(w);
  }
}
console.log(`Wards with pickup tomorrow: ${wardsWithPickup.join(', ')}`);

// Find ALL users with wards that have pickup tomorrow
let totalSent = 0;
for (const wardNum of wardsWithPickup) {
  const wardRegex = new RegExp(`^(ward[\\s\\-\\.]*)?${wardNum}$`, 'i');
  const users = await User.find({
    ward: { $regex: wardRegex },
    email: { $exists: true, $ne: '' },
  });

  if (users.length === 0) continue;

  const schedule = WARD_SCHEDULES[wardNum];

  // Fetch real collector from database
  const collector = await Collector.findOne({ assignedWards: wardNum, status: 'active' });
  const driverName = collector?.name || 'Not Assigned';
  const vehicleId = collector?.vehicleId || 'Not Assigned';

  console.log(`\nWard ${wardNum}: ${users.length} user(s) — Time: ${schedule.timeSlot} | Driver: ${driverName} | Vehicle: ${vehicleId}`);

  for (const user of users) {
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
      console.log(`  ✅ Sent to ${user.fullName} (${user.email})`);
      totalSent++;
    } catch (err) {
      console.error(`  ❌ Failed for ${user.email}: ${err.message}`);
    }
  }
}

console.log(`\nDone! ${totalSent} email(s) sent.`);
await mongoose.disconnect();
