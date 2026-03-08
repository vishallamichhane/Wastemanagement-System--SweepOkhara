/**
 * Manual Reminder Test Script
 * 
 * Usage: node src/scripts/testReminder.js
 * 
 * Manually triggers the pickup reminder job to test email delivery
 */

import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import { sendTomorrowReminders } from '../services/scheduleReminderService.js';

dotenv.config();

async function testReminderService() {
  console.log('🧪 Testing Pickup Reminder Service...\n');

  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Run the reminder job
    await sendTomorrowReminders();

    console.log('\n✅ Test complete! Check user emails for reminders.\n');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

testReminderService();
