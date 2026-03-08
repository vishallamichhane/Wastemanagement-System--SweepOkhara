/**
 * View Email Template Script
 * This script generates and saves the email HTML to a file so you can view it in a browser
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simulate the email template
const appName = "SweepPokhara";
const name = "Shisheer Chantel";
const ward = 2;
const timeSlot = "6:00 AM - 8:00 AM";
const dayName = "Thursday";
const vehicle = "TRK-09";
const driver = "Awan Poudel";

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

// Save to file
const outputPath = path.join(__dirname, '../../../email-preview.html');
fs.writeFileSync(outputPath, html, 'utf-8');

console.log('\n✅ Email template saved to:', outputPath);
console.log('📂 Open this file in your web browser to preview the email\n');
console.log('Email Details:');
console.log('  Name:', name);
console.log('  Ward:', ward);
console.log('  Day:', dayName);
console.log('  Time:', timeSlot);
console.log('  Vehicle:', vehicle);
console.log('  Driver:', driver);
console.log('');
