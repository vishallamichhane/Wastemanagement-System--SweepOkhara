/**
 * Email Service Test Script
 * 
 * Usage: node src/scripts/testEmail.js <recipient-email>
 * 
 * Tests the SMTP email configuration by sending a test email.
 * Prerequisites: SMTP credentials must be set in .env
 */

import dotenv from 'dotenv';
import { sendVerificationEmail } from '../utils/email.js';

dotenv.config();

async function testEmail(recipientEmail) {
  if (!recipientEmail) {
    console.error('❌ Usage: node src/scripts/testEmail.js <recipient-email>');
    console.error('   Example: node src/scripts/testEmail.js test@example.com');
    process.exit(1);
  }

  console.log(`\n📧 Testing email service...\n`);
  console.log(`SMTP Configuration:`);
  console.log(`  Host: ${process.env.SMTP_HOST}`);
  console.log(`  Port: ${process.env.SMTP_PORT}`);
  console.log(`  User: ${process.env.SMTP_USER}`);
  console.log(`  From: ${process.env.FROM_EMAIL || process.env.SMTP_USER}`);
  console.log(`  To: ${recipientEmail}\n`);

  try {
    await sendVerificationEmail({
      to: recipientEmail,
      name: 'Test User',
      url: 'http://localhost:5173/verify-email?token=TEST123',
      token: 'TEST123ABC456',
    });

    console.log('\n✅ Test email sent successfully!');
    console.log('   Check the inbox for:', recipientEmail);
    console.log('   (Also check spam/junk folder)\n');
  } catch (error) {
    console.error('\n❌ Email sending failed:');
    console.error('   Error:', error.message);
    if (error.response) {
      console.error('   Response:', error.response);
    }
    console.error('\nTroubleshooting:');
    console.error('  1. Verify SMTP credentials in .env are correct');
    console.error('  2. For Gmail: Enable "Less secure app access" or use App Password');
    console.error('  3. Check if SMTP_HOST and SMTP_PORT are correct');
    console.error('  4. Verify network/firewall allows SMTP connections\n');
  } finally {
    process.exit(0);
  }
}

const recipientEmail = process.argv[2];
testEmail(recipientEmail);
