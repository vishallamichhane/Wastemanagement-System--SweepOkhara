/**
 * Completion Email Test Script
 * 
 * Usage: node src/scripts/testCompletion.js <email> <ward>
 * 
 * Example: node src/scripts/testCompletion.js test@gmail.com 5
 * 
 * Tests the pickup completion email by sending to a specific email
 */

import dotenv from 'dotenv';
import { sendPickupCompletionEmail } from '../utils/email.js';

dotenv.config();

async function testCompletionEmail(email, ward) {
  if (!email || !ward) {
    console.error('❌ Usage: node src/scripts/testCompletion.js <email> <ward>');
    console.error('   Example: node src/scripts/testCompletion.js test@gmail.com 5');
    process.exit(1);
  }

  console.log(`\n🧪 Testing Pickup Completion Email...\n`);
  console.log(`📧 Sending to: ${email}`);
  console.log(`📍 Ward: ${ward}\n`);

  try {
    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    await sendPickupCompletionEmail({
      to: email,
      name: 'Test User',
      ward: ward,
      timeSlot: '6:00 AM - 8:00 AM',
      date: today,
      collectorName: 'Awan Poudel',
      vehicleId: 'SW-01',
    });

    console.log('\n✅ Completion email sent successfully!');
    console.log('   Check the inbox for:', email);
    console.log('   (Also check spam/junk folder)\n');
  } catch (error) {
    console.error('\n❌ Email sending failed:');
    console.error('   Error:', error.message);
    if (error.response) {
      console.error('   Response:', error.response);
    }
  } finally {
    process.exit(0);
  }
}

const email = process.argv[2];
const ward = process.argv[3];
testCompletionEmail(email, ward);
