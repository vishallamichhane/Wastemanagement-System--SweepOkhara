/**
 * Debug Email Script
 * This script generates the email and saves both HTML and text versions to files
 * Also sends a test email to verify content
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendScheduleReminderEmail } from '../utils/email.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function debugEmail() {
  console.log('\n🔍 Debugging Email Content...\n');

  const testData = {
    to: 'ccr.xxantel9@gmail.com', // Send to actual user email
    name: 'Shisheer Chantel',
    ward: 2,
    timeSlot: '6:00 AM - 8:00 AM',
    dayName: 'Thursday',
    vehicle: 'TRK-09',
    driver: 'Awan Poudel'
  };

  console.log('Test Data:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('\n');

  // Import the email module to access the template directly
  const appName = "SweepPokhara";
  const { name, ward, timeSlot, dayName, vehicle, driver } = testData;

  // Generate the HTML content directly
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Waste Pickup Reminder</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <!-- Logo/Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; margin: 0 auto 16px; line-height: 60px;">
          <span style="font-size: 32px;">🚛</span>
        </div>
        <h1 style="color: #10b981; margin: 0; font-size: 28px; font-weight: 700;">${appName}</h1>
        <p style="color: #6b7280; margin-top: 8px; font-size: 14px;">Waste Pickup Schedule Reminder</p>
      </div>

      <!-- Greeting -->
      <div style="margin-bottom: 24px; text-align: center;">
        <h2 style="color: #1f2937; margin-bottom: 8px; font-size: 22px;">Hello, ${name}! 👋</h2>
        <p style="color: #4b5563; line-height: 1.6; font-size: 16px; margin: 0;">
          This is a friendly reminder about your upcoming waste collection.
        </p>
      </div>

      <!-- Schedule Details Box -->
      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #86efac; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 12px; color: #065f46; font-weight: 600; font-size: 14px; width: 130px;">📅 Day</td>
            <td style="padding: 8px 12px; color: #1f2937; font-size: 15px; font-weight: 700;">${dayName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; color: #065f46; font-weight: 600; font-size: 14px;">⏰ Time Window</td>
            <td style="padding: 8px 12px; color: #1f2937; font-size: 15px; font-weight: 700;">${timeSlot}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; color: #065f46; font-weight: 600; font-size: 14px;">📍 Ward</td>
            <td style="padding: 8px 12px; color: #1f2937; font-size: 15px; font-weight: 700;">Ward ${ward}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; color: #065f46; font-weight: 600; font-size: 14px;">🚛 Vehicle</td>
            <td style="padding: 8px 12px; color: #1f2937; font-size: 15px; font-weight: 700;">${vehicle}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; color: #065f46; font-weight: 600; font-size: 14px;">👤 Driver</td>
            <td style="padding: 8px 12px; color: #1f2937; font-size: 15px; font-weight: 700;">${driver}</td>
          </tr>
        </table>
      </div>

      <!-- Tips Box -->
      <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="color: #78350f; font-size: 14px; margin: 0 0 8px 0; font-weight: 600;">💡 Quick Tips:</p>
        <ul style="color: #78350f; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.8;">
          <li>Please have your waste bags ready <strong>before ${timeSlot.split(' - ')[0]}</strong></li>
          <li>Separate organic and recyclable waste</li>
          <li>Place waste at your designated collection point</li>
          <li>Keep the area clean after collection</li>
        </ul>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} ${appName}. All rights reserved.<br>
          Pokhara, Nepal 🌿
        </p>
        <p style="color: #d1d5db; font-size: 11px; margin-top: 8px;">
          You received this email because you are registered in Ward ${ward} on ${appName}.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  const text = `
Waste Pickup Reminder - ${appName}

Hello ${name},

This is a reminder about your upcoming waste collection:

📅 Day: ${dayName}
⏰ Time: ${timeSlot}
📍 Ward: Ward ${ward}
🚛 Vehicle: ${vehicle}
👤 Driver: ${driver}

Please have your waste ready before ${timeSlot.split(' - ')[0]}.
Remember to separate organic and recyclable waste.

- The ${appName} Team
`;

  // Save HTML to file
  const htmlPath = path.join(__dirname, '../../../email-debug.html');
  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log('✅ HTML saved to:', htmlPath);

  // Save text to file
  const textPath = path.join(__dirname, '../../../email-debug.txt');
  fs.writeFileSync(textPath, text, 'utf-8');
  console.log('✅ Text saved to:', textPath);

  // Check HTML content length
  console.log('\n📊 Content Stats:');
  console.log('   HTML length:', html.length, 'characters');
  console.log('   Text length:', text.length, 'characters');
  console.log('   Contains "Thursday":', html.includes('Thursday'));
  console.log('   Contains "TRK-09":', html.includes('TRK-09'));
  console.log('   Contains "Awan Poudel":', html.includes('Awan Poudel'));

  // Try sending the email
  console.log('\n📧 Attempting to send test email...');
  try {
    const result = await sendScheduleReminderEmail(testData);
    console.log('✅ Email sent successfully!');
    console.log('   Result:', result);
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
  }

  console.log('\n📂 Open email-debug.html in your browser to verify the content\n');
}

debugEmail().catch(console.error);
