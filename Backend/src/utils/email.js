import nodemailer from "nodemailer";
import { Resend } from "resend";

/**
 * Email Service Configuration
 * 
 * Priority order:
 * 1. Resend (recommended - free tier: 100 emails/day)
 * 2. SMTP (Gmail, Outlook, etc.)
 * 3. Console logging (development fallback)
 * 
 * Setup instructions:
 * 
 * OPTION 1 - Resend (Recommended):
 * 1. Go to https://resend.com and create free account
 * 2. Get your API key from dashboard
 * 3. Add to .env: RESEND_API_KEY=re_xxxxxxxxxx
 * 
 * OPTION 2 - Gmail SMTP:
 * 1. Enable 2FA on your Google account
 * 2. Create App Password: https://myaccount.google.com/apppasswords
 * 3. Add to .env:
 *    SMTP_HOST=smtp.gmail.com
 *    SMTP_PORT=587
 *    SMTP_USER=your-email@gmail.com
 *    SMTP_PASS=your-app-password
 */

// Lazy-loaded clients (initialized on first use after dotenv loads)
let resendClient = null;
let smtpTransporter = null;
let initialized = false;

const getAppName = () => process.env.APP_NAME || "SweepPokhara";
const getFromEmail = () => process.env.FROM_EMAIL || "onboarding@resend.dev";

// Initialize email services lazily
const initializeEmailServices = () => {
  if (initialized) return;
  initialized = true;

  // Initialize Resend if API key exists
  if (process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
    console.log("✅ Resend email service initialized");
  }

  // Initialize SMTP if configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    smtpTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log("✅ SMTP email service initialized");
  }
};

/**
 * Generate beautiful HTML email template for verification
 */
const generateVerificationEmailHtml = ({ name, token, verificationUrl, appName }) => {
  // Extract a short code from the token (last 8 chars uppercase)
  const shortCode = token.length > 8 ? token.slice(-8).toUpperCase() : token.toUpperCase();
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <!-- Logo/Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; margin: 0 auto 16px; line-height: 60px;">
          <span style="font-size: 32px;">🌿</span>
        </div>
        <h1 style="color: #10b981; margin: 0; font-size: 28px; font-weight: 700;">${appName}</h1>
        <p style="color: #6b7280; margin-top: 8px; font-size: 14px;">Clean City, Green Future</p>
      </div>
      
      <!-- Welcome Message -->
      <div style="margin-bottom: 32px; text-align: center;">
        <h2 style="color: #1f2937; margin-bottom: 12px; font-size: 24px;">Welcome, ${name || "there"}! 👋</h2>
        <p style="color: #4b5563; line-height: 1.6; font-size: 16px; margin: 0;">
          Thanks for signing up! Please verify your email address to get started.
        </p>
      </div>
      
      <!-- Verification Code Box -->
      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #86efac; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
        <p style="color: #166534; margin: 0 0 12px 0; font-size: 14px; font-weight: 500;">Your Verification Code</p>
        <div style="background-color: #ffffff; border-radius: 8px; padding: 16px; display: inline-block; min-width: 200px;">
          <p style="color: #059669; font-size: 28px; font-weight: 700; letter-spacing: 4px; margin: 0; font-family: 'Courier New', monospace;">${shortCode}</p>
        </div>
        <p style="color: #166534; margin: 12px 0 0 0; font-size: 12px;">Enter this code on the verification page</p>
      </div>
      
      <!-- OR Divider -->
      <div style="text-align: center; margin-bottom: 24px; position: relative;">
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0;">
        <span style="color: #9ca3af; font-size: 14px; background: #fff; padding: 0 16px; position: relative; top: -10px;">or click the button below</span>
      </div>
      
      <!-- Verification Button -->
      <div style="text-align: center; margin-bottom: 32px;">
        <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">
          ✓ Verify My Email
        </a>
      </div>
      
      <!-- Security Note -->
      <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="color: #92400e; font-size: 13px; margin: 0; line-height: 1.5;">
          ⏰ <strong>This link expires in 24 hours.</strong><br>
          If you didn't create an account with ${appName}, please ignore this email.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} ${appName}. All rights reserved.<br>
          Pokhara, Nepal
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
};

/**
 * Generate plain text email for verification
 */
const generateVerificationEmailText = ({ name, token, verificationUrl, appName }) => {
  const shortCode = token.length > 8 ? token.slice(-8).toUpperCase() : token.toUpperCase();
  
  return `
Welcome to ${appName}!

Hello ${name || "there"},

Thanks for signing up! Please verify your email address.

Your verification code is: ${shortCode}

Or click this link to verify: ${verificationUrl}

This link expires in 24 hours.

If you didn't create an account, please ignore this email.

- The ${appName} Team
`;
};

/**
 * Send verification email using available service
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.name - Recipient name
 * @param {string} options.url - Verification URL
 * @param {string} options.token - Verification token
 */
export const sendVerificationEmail = async ({ to, name, url, token }) => {
  // Initialize email services on first use
  initializeEmailServices();
  
  const appName = getAppName();
  const fromEmail = getFromEmail();
  const subject = `Verify your email - ${appName}`;
  const html = generateVerificationEmailHtml({ name, token, verificationUrl: url, appName });
  const text = generateVerificationEmailText({ name, token, verificationUrl: url, appName });
  const shortCode = token.length > 8 ? token.slice(-8).toUpperCase() : token.toUpperCase();

  console.log("📧 Attempting to send verification email to:", to);

  // Method 1: Use Resend (recommended)
  if (resendClient) {
    try {
      console.log("📧 Using Resend service...");
      const { data, error } = await resendClient.emails.send({
        from: `${appName} <${fromEmail}>`,
        to: [to],
        subject,
        html,
        text,
      });

      if (error) {
        console.error("❌ Resend error:", error);
        throw new Error(error.message);
      }

      console.log("✅ Verification email sent via Resend to:", to);
      console.log("📧 Verification code:", shortCode);
      return { success: true, messageId: data.id, provider: "resend" };
    } catch (error) {
      console.error("❌ Resend failed:", error.message);
      // Fall through to try SMTP
    }
  }

  // Method 2: Use SMTP (nodemailer)
  if (smtpTransporter) {
    try {
      const info = await smtpTransporter.sendMail({
        from: `"${appName}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html,
      });

      console.log("✅ Verification email sent via SMTP to:", to);
      console.log("📧 Verification code:", shortCode);
      return { success: true, messageId: info.messageId, provider: "smtp" };
    } catch (error) {
      console.error("❌ SMTP failed:", error.message);
      // Fall through to console logging
    }
  }

  // Method 3: Console logging (development fallback)
  console.log("\n" + "═".repeat(70));
  console.log("📧 EMAIL VERIFICATION - Development Mode");
  console.log("═".repeat(70));
  console.log(`📬 To: ${to}`);
  console.log(`👤 Name: ${name}`);
  console.log(`🔑 Code: ${shortCode}`);
  console.log(`🔗 URL: ${url}`);
  console.log("═".repeat(70));
  console.log("⚠️  To send real emails, add one of these to your .env:");
  console.log("    RESEND_API_KEY=re_xxxxxxxxxx");
  console.log("    or SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS");
  console.log("═".repeat(70) + "\n");

  return { success: true, messageId: "dev-" + Date.now(), provider: "console" };
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async ({ to, name, url }) => {
  // Initialize email services on first use
  initializeEmailServices();
  
  const appName = getAppName();
  const fromEmail = getFromEmail();
  const subject = `Reset your password - ${appName}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #10b981; margin: 0; font-size: 28px;">🌿 ${appName}</h1>
      </div>
      
      <h2 style="color: #1f2937; text-align: center;">Password Reset Request</h2>
      <p style="color: #4b5563; line-height: 1.6; text-align: center;">
        Hello ${name || "there"}, we received a request to reset your password.
      </p>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 12px; font-weight: 600;">
          Reset Password
        </a>
      </div>
      
      <p style="color: #9ca3af; font-size: 13px; text-align: center;">
        This link expires in 1 hour. If you didn't request this, please ignore.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Password Reset - ${appName}

Hello ${name || "there"},

We received a request to reset your password. Click the link below:

${url}

This link expires in 1 hour.

If you didn't request this, please ignore this email.

- The ${appName} Team
  `;

  // Use same priority: Resend > SMTP > Console
  if (resendClient) {
    try {
      const { data, error } = await resendClient.emails.send({
        from: `${appName} <${fromEmail}>`,
        to: [to],
        subject,
        html,
        text,
      });
      if (!error) {
        console.log("✅ Password reset email sent via Resend to:", to);
        return { success: true, messageId: data.id };
      }
    } catch (e) {
      console.error("Resend failed for password reset:", e.message);
    }
  }

  if (smtpTransporter) {
    try {
      const info = await smtpTransporter.sendMail({
        from: `"${appName}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text,
      });
      console.log("✅ Password reset email sent via SMTP to:", to);
      return { success: true, messageId: info.messageId };
    } catch (e) {
      console.error("SMTP failed for password reset:", e.message);
    }
  }

  console.log(`📧 Password Reset (Dev Mode): ${to} -> ${url}`);
  return { success: true, messageId: "dev-" + Date.now() };
};

/**
 * Send waste pickup schedule reminder email
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - Recipient name
 * @param {string|number} options.ward - Ward number
 * @param {string} options.timeSlot - e.g. "6:00 AM - 8:00 AM"
 * @param {string} options.dayName - e.g. "Monday"
 * @param {string} options.vehicle - Vehicle ID
 * @param {string} options.driver - Driver name
 */
export const sendScheduleReminderEmail = async ({ to, name, ward, timeSlot, dayName, vehicle, driver }) => {
  initializeEmailServices();

  const appName = getAppName();
  const fromEmail = getFromEmail();
  const subject = `🚛 Waste Pickup Reminder - ${dayName} | Ward ${ward} | ${appName}`;

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
        <h2 style="color: #1f2937; margin-bottom: 8px; font-size: 22px;">Hello, ${name || "Resident"}! 👋</h2>
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

Hello ${name || "Resident"},

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

  // Use same priority: Resend > SMTP > Console
  if (resendClient) {
    try {
      const { data, error } = await resendClient.emails.send({
        from: `${appName} <${fromEmail}>`,
        to: [to],
        subject,
        html,
        text,
      });
      if (!error) {
        console.log("✅ Schedule reminder email sent via Resend to:", to);
        return { success: true, messageId: data.id, provider: "resend" };
      }
    } catch (e) {
      console.error("Resend failed for schedule reminder:", e.message);
    }
  }

  if (smtpTransporter) {
    try {
      const info = await smtpTransporter.sendMail({
        from: `"${appName}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text,
      });
      console.log("✅ Schedule reminder email sent via SMTP to:", to);
      return { success: true, messageId: info.messageId, provider: "smtp" };
    } catch (e) {
      console.error("SMTP failed for schedule reminder:", e.message);
    }
  }

  // Development fallback
  console.log("\n" + "═".repeat(70));
  console.log("📧 SCHEDULE REMINDER EMAIL - Development Mode");
  console.log("═".repeat(70));
  console.log(`📬 To: ${to}`);
  console.log(`👤 Name: ${name}`);
  console.log(`📍 Ward: ${ward}`);
  console.log(`📅 Day: ${dayName}`);
  console.log(`⏰ Time: ${timeSlot}`);
  console.log(`🚛 Vehicle: ${vehicle}`);
  console.log(`👤 Driver: ${driver}`);
  console.log("═".repeat(70) + "\n");

  return { success: true, messageId: "dev-" + Date.now(), provider: "console" };
};

/**
 * Send waste pickup completion email
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - Recipient name
 * @param {string|number} options.ward - Ward number
 * @param {string} options.timeSlot - e.g. "6:00 AM - 8:00 AM"
 * @param {string} options.date - Formatted date string
 * @param {string} options.collectorName - Collector name
 * @param {string} options.vehicleId - Vehicle ID
 */
export const sendPickupCompletionEmail = async ({ to, name, ward, timeSlot, date, collectorName, vehicleId }) => {
  initializeEmailServices();

  const appName = getAppName();
  const fromEmail = getFromEmail();
  const subject = `✅ Waste Pickup Completed - ${date} | Ward ${ward} | ${appName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pickup Completed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <!-- Logo/Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; margin: 0 auto 16px; line-height: 60px;">
          <span style="font-size: 32px;">✅</span>
        </div>
        <h1 style="color: #10b981; margin: 0; font-size: 28px; font-weight: 700;">${appName}</h1>
        <p style="color: #6b7280; margin-top: 8px; font-size: 14px;">Waste Collection Complete</p>
      </div>

      <!-- Success Message -->
      <div style="margin-bottom: 24px; text-align: center;">
        <h2 style="color: #1f2937; margin-bottom: 8px; font-size: 22px;">Hello, ${name || "Resident"}! 👋</h2>
        <p style="color: #4b5563; line-height: 1.6; font-size: 16px; margin: 0;">
          Great news! Your scheduled waste collection has been completed successfully.
        </p>
      </div>

      <!-- Completion Details Box -->
      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #86efac; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <div style="text-align: center; margin-bottom: 16px;">
          <span style="display: inline-block; background-color: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px;">
            ✨ Collection Completed
          </span>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 12px; color: #065f46; font-weight: 600; font-size: 14px; width: 130px;">📅 Date</td>
            <td style="padding: 8px 12px; color: #1f2937; font-size: 15px; font-weight: 700;">${date}</td>
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
            <td style="padding: 8px 12px; color: #1f2937; font-size: 15px; font-weight: 700;">${vehicleId || 'Collection Vehicle'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; color: #065f46; font-weight: 600; font-size: 14px;">👤 Driver</td>
            <td style="padding: 8px 12px; color: #1f2937; font-size: 15px; font-weight: 700;">${collectorName || 'Collection Team'}</td>
          </tr>
        </table>
      </div>

      <!-- Thank You Note -->
      <div style="background-color: #dbeafe; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
        <p style="color: #1e40af; font-size: 15px; margin: 0; font-weight: 500;">
          🙏 Thank you for keeping Pokhara clean and green!
        </p>
      </div>

      <!-- Next Pickup Info -->
      <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="color: #78350f; font-size: 14px; margin: 0 0 8px 0; font-weight: 600;">📅 Next Scheduled Pickup:</p>
        <p style="color: #78350f; font-size: 13px; margin: 0;">
          You will receive a reminder email one day before your next collection. 
          Stay tuned for the schedule!
        </p>
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
Waste Pickup Completed - ${appName}

Hello ${name || "Resident"},

Great news! Your scheduled waste collection has been completed successfully.

📅 Date: ${date}
⏰ Time: ${timeSlot}
📍 Ward: Ward ${ward}
🚛 Vehicle: ${vehicleId || 'Collection Vehicle'}
👤 Driver: ${collectorName || 'Collection Team'}

Thank you for keeping Pokhara clean and green!

You will receive a reminder email one day before your next collection.

- The ${appName} Team
`;

  // Use same priority: Resend > SMTP > Console
  if (resendClient) {
    try {
      const { data, error } = await resendClient.emails.send({
        from: `${appName} <${fromEmail}>`,
        to: [to],
        subject,
        html,
        text,
      });
      if (!error) {
        console.log("✅ Pickup completion email sent via Resend to:", to);
        return { success: true, messageId: data.id, provider: "resend" };
      }
    } catch (e) {
      console.error("Resend failed for completion email:", e.message);
    }
  }

  if (smtpTransporter) {
    try {
      const info = await smtpTransporter.sendMail({
        from: `"${appName}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text,
      });
      console.log("✅ Pickup completion email sent via SMTP to:", to);
      return { success: true, messageId: info.messageId, provider: "smtp" };
    } catch (e) {
      console.error("SMTP failed for completion email:", e.message);
    }
  }

  console.log(`📧 Pickup Completion (Dev Mode): ${to} -> ${date}, Ward ${ward}`);
  return { success: true, messageId: "dev-" + Date.now(), provider: "console" };
};

/**
 * Send report resolution email to the user who submitted the report
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.userName - Name of the user who reported
 * @param {string} options.reportLabel - Report type label (e.g. "Overflowing Bin")
 * @param {string} options.description - Report description
 * @param {string} options.location - Report location
 * @param {number} options.ward - Ward number
 * @param {string} options.collectorName - Name of the collector who resolved it
 * @param {string} options.vehicleId - Vehicle ID used
 * @param {string} options.reportDate - When the report was submitted
 * @param {string} options.resolvedDate - When the report was resolved
 * @param {string} options.priority - Report priority
 */
export const sendReportResolutionEmail = async ({
  to,
  userName,
  reportLabel,
  description,
  location,
  ward,
  collectorName,
  vehicleId,
  reportDate,
  resolvedDate,
  priority,
}) => {
  initializeEmailServices();

  const appName = getAppName();
  const fromEmail = getFromEmail();
  const subject = `✅ Your Report Has Been Resolved - ${reportLabel} | ${appName}`;

  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981',
  };
  const priorityColor = priorityColors[priority] || '#f59e0b';
  const priorityLabel = priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Medium';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Report Resolved</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <!-- Logo/Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; margin: 0 auto 16px; line-height: 60px;">
          <span style="font-size: 32px;">✅</span>
        </div>
        <h1 style="color: #10b981; margin: 0; font-size: 28px; font-weight: 700;">${appName}</h1>
        <p style="color: #6b7280; margin-top: 8px; font-size: 14px;">Report Resolution Notification</p>
      </div>

      <!-- Greeting & Status Badge -->
      <div style="margin-bottom: 24px; text-align: center;">
        <h2 style="color: #1f2937; margin-bottom: 12px; font-size: 22px;">Hello, ${userName || "Resident"}! 👋</h2>
        <div style="margin-bottom: 16px;">
          <span style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 10px 24px; border-radius: 24px; font-weight: 700; font-size: 15px; letter-spacing: 0.5px;">
            ✅ ISSUE RESOLVED
          </span>
        </div>
        <p style="color: #4b5563; line-height: 1.6; font-size: 16px; margin: 0;">
          Great news! The issue you reported has been <strong>successfully resolved</strong> by our waste management team.
        </p>
      </div>

      <!-- Report Details Box -->
      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #86efac; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <p style="color: #065f46; font-weight: 700; font-size: 15px; margin: 0 0 16px 0; text-align: center;">📋 Report Details</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 12px; color: #065f46; font-weight: 600; font-size: 14px; width: 140px; vertical-align: top;">🏷️ Issue Type</td>
            <td style="padding: 10px 12px; color: #1f2937; font-size: 15px; font-weight: 700;">${reportLabel}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; color: #065f46; font-weight: 600; font-size: 14px; vertical-align: top;">📝 Description</td>
            <td style="padding: 10px 12px; color: #1f2937; font-size: 14px; line-height: 1.5;">${description || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; color: #065f46; font-weight: 600; font-size: 14px; vertical-align: top;">📍 Location</td>
            <td style="padding: 10px 12px; color: #1f2937; font-size: 14px;">${location}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; color: #065f46; font-weight: 600; font-size: 14px;">🏘️ Ward</td>
            <td style="padding: 10px 12px; color: #1f2937; font-size: 15px; font-weight: 700;">Ward ${ward}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; color: #065f46; font-weight: 600; font-size: 14px;">⚡ Priority</td>
            <td style="padding: 10px 12px;">
              <span style="display: inline-block; background-color: ${priorityColor}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">${priorityLabel}</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Collector / Resolution Info -->
      <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 2px solid #93c5fd; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <p style="color: #1e40af; font-weight: 700; font-size: 15px; margin: 0 0 16px 0; text-align: center;">🛠️ Resolution Information</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 12px; color: #1e40af; font-weight: 600; font-size: 14px; width: 140px;">👤 Resolved By</td>
            <td style="padding: 10px 12px; color: #1f2937; font-size: 15px; font-weight: 700;">${collectorName || 'Collection Team'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; color: #1e40af; font-weight: 600; font-size: 14px;">🚛 Vehicle ID</td>
            <td style="padding: 10px 12px; color: #1f2937; font-size: 15px; font-weight: 700;">${vehicleId || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; color: #1e40af; font-weight: 600; font-size: 14px;">📅 Reported On</td>
            <td style="padding: 10px 12px; color: #1f2937; font-size: 14px;">${reportDate}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; color: #1e40af; font-weight: 600; font-size: 14px;">✅ Resolved On</td>
            <td style="padding: 10px 12px; color: #1f2937; font-size: 14px; font-weight: 700;">${resolvedDate}</td>
          </tr>
        </table>
      </div>

      <!-- Thank You Message -->
      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
        <p style="font-size: 28px; margin: 0 0 12px 0;">🙏</p>
        <h3 style="color: #78350f; font-size: 18px; margin: 0 0 8px 0;">Thank You for Your Contribution!</h3>
        <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.6;">
          Your report played a vital role in keeping our city clean and healthy. 
          Citizens like you make Pokhara a better place to live. Together, we are building 
          a <strong>cleaner, greener, and more sustainable city</strong>.
        </p>
      </div>

      <!-- Call to Action -->
      <div style="background-color: #f0f9ff; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="color: #0c4a6e; font-size: 14px; margin: 0 0 8px 0; font-weight: 600;">🔔 Keep Contributing:</p>
        <p style="color: #0369a1; font-size: 13px; margin: 0; line-height: 1.6;">
          If you notice any other waste management issues in your area, don't hesitate to report them through the ${appName} app. 
          Every report helps us improve our services!
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">
          Clean City, Green Future 🌿
        </p>
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} ${appName}. All rights reserved.<br>
          Pokhara, Nepal
        </p>
        <p style="color: #d1d5db; font-size: 11px; margin-top: 8px;">
          You received this email because you submitted a report on ${appName}.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  const text = `
Report Resolved - ${appName}

Hello ${userName || "Resident"},

Great news! The issue you reported has been successfully resolved.

📋 REPORT DETAILS:
🏷️ Issue Type: ${reportLabel}
📝 Description: ${description || 'N/A'}
📍 Location: ${location}
🏘️ Ward: Ward ${ward}
⚡ Priority: ${priorityLabel}

🛠️ RESOLUTION INFORMATION:
👤 Resolved By: ${collectorName || 'Collection Team'}
🚛 Vehicle ID: ${vehicleId || 'N/A'}
📅 Reported On: ${reportDate}
✅ Resolved On: ${resolvedDate}

🙏 Thank You for Your Contribution!
Your report played a vital role in keeping our city clean and healthy.
Citizens like you make Pokhara a better place to live.
Together, we are building a cleaner, greener, and more sustainable city.

If you notice any other issues, don't hesitate to report them through ${appName}!

- The ${appName} Team
Pokhara, Nepal 🌿
`;

  // Use same priority: Resend > SMTP > Console
  if (resendClient) {
    try {
      const { data, error } = await resendClient.emails.send({
        from: `${appName} <${fromEmail}>`,
        to: [to],
        subject,
        html,
        text,
      });
      if (!error) {
        console.log("✅ Report resolution email sent via Resend to:", to);
        return { success: true, messageId: data.id, provider: "resend" };
      }
    } catch (e) {
      console.error("Resend failed for report resolution email:", e.message);
    }
  }

  if (smtpTransporter) {
    try {
      const info = await smtpTransporter.sendMail({
        from: `"${appName}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text,
      });
      console.log("✅ Report resolution email sent via SMTP to:", to);
      return { success: true, messageId: info.messageId, provider: "smtp" };
    } catch (e) {
      console.error("SMTP failed for report resolution email:", e.message);
    }
  }

  // Development fallback
  console.log("\n" + "═".repeat(70));
  console.log("📧 REPORT RESOLUTION EMAIL - Development Mode");
  console.log("═".repeat(70));
  console.log(`📬 To: ${to}`);
  console.log(`👤 User: ${userName}`);
  console.log(`🏷️ Report: ${reportLabel}`);
  console.log(`📍 Location: ${location}`);
  console.log(`🏘️ Ward: ${ward}`);
  console.log(`👤 Resolved By: ${collectorName}`);
  console.log(`🚛 Vehicle: ${vehicleId}`);
  console.log(`📅 Reported: ${reportDate}`);
  console.log(`✅ Resolved: ${resolvedDate}`);
  console.log("═".repeat(70) + "\n");

  return { success: true, messageId: "dev-" + Date.now(), provider: "console" };
};

/**
 * Send bin full alert email to ward users
 */
export const sendBinFullAlertEmail = async ({ to, name, binId, ward, location, fillLevel }) => {
  initializeEmailServices();

  const appName = getAppName();
  const fromEmail = getFromEmail();
  const subject = `🚨 Dustbin Full Alert - ${binId} | Ward ${ward} | ${appName}`;
  const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dustbin Full Alert</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <!-- Logo/Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 16px; margin: 0 auto 16px; line-height: 60px;">
          <span style="font-size: 32px;">🚨</span>
        </div>
        <h1 style="color: #10b981; margin: 0; font-size: 28px; font-weight: 700;">${appName}</h1>
        <p style="color: #6b7280; margin-top: 8px; font-size: 14px;">Smart Bin Monitoring System</p>
      </div>

      <!-- Alert Badge -->
      <div style="margin-bottom: 24px; text-align: center;">
        <div style="margin-bottom: 16px;">
          <span style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 10px 24px; border-radius: 24px; font-weight: 700; font-size: 15px; letter-spacing: 0.5px;">
            ⚠️ DUSTBIN FULL
          </span>
        </div>
        <h2 style="color: #1f2937; margin-bottom: 8px; font-size: 22px;">Hello, ${name || "Resident"}! 👋</h2>
        <p style="color: #4b5563; line-height: 1.6; font-size: 16px; margin: 0;">
          We would like to inform you that a smart dustbin in your ward has reached <strong>full capacity</strong> and requires immediate attention.
        </p>
      </div>

      <!-- Bin Details Box -->
      <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 2px solid #fca5a5; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <p style="color: #991b1b; font-weight: 700; font-size: 15px; margin: 0 0 16px 0; text-align: center;">🗑️ Bin Status Details</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 12px; color: #991b1b; font-weight: 600; font-size: 14px; width: 140px;">🆔 Bin ID</td>
            <td style="padding: 10px 12px; color: #1f2937; font-size: 15px; font-weight: 700;">${binId}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; color: #991b1b; font-weight: 600; font-size: 14px;">📍 Location</td>
            <td style="padding: 10px 12px; color: #1f2937; font-size: 14px;">${location}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; color: #991b1b; font-weight: 600; font-size: 14px;">🏘️ Ward</td>
            <td style="padding: 10px 12px; color: #1f2937; font-size: 15px; font-weight: 700;">Ward ${ward}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; color: #991b1b; font-weight: 600; font-size: 14px;">📊 Fill Level</td>
            <td style="padding: 10px 12px;">
              <span style="display: inline-block; background-color: #ef4444; color: white; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 700;">${fillLevel}% FULL</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; color: #991b1b; font-weight: 600; font-size: 14px;">🕐 Detected At</td>
            <td style="padding: 10px 12px; color: #1f2937; font-size: 14px;">${now}</td>
          </tr>
        </table>
      </div>

      <!-- What This Means -->
      <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="color: #78350f; font-size: 14px; margin: 0 0 8px 0; font-weight: 600;">ℹ️ What does this mean?</p>
        <ul style="color: #78350f; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.8;">
          <li>The dustbin at <strong>${location}</strong> is now full and cannot accept more waste</li>
          <li>Our waste collection team has been notified for immediate pickup</li>
          <li>Please <strong>avoid disposing waste</strong> at this bin until it is cleared</li>
          <li>You will receive another notification once the bin has been emptied</li>
        </ul>
      </div>

      <!-- Eco Tip -->
      <div style="background-color: #f0fdf4; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
        <p style="color: #166534; font-size: 14px; margin: 0; font-weight: 500;">
          🌿 <strong>Eco Tip:</strong> Consider composting organic waste at home to reduce the load on community dustbins!
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">
          Clean City, Green Future 🌿
        </p>
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} ${appName}. All rights reserved.<br>
          Pokhara, Nepal
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
🚨 Dustbin Full Alert - ${appName}

Hello ${name || "Resident"},

A smart dustbin in your ward (Ward ${ward}) has reached full capacity.

🗑️ BIN STATUS DETAILS:
🆔 Bin ID: ${binId}
📍 Location: ${location}
🏘️ Ward: Ward ${ward}
📊 Fill Level: ${fillLevel}% FULL
🕐 Detected At: ${now}

ℹ️ What does this mean?
- The dustbin at ${location} is now full and cannot accept more waste.
- Our waste collection team has been notified for immediate pickup.
- Please avoid disposing waste at this bin until it is cleared.
- You will receive another notification once the bin has been emptied.

🌿 Eco Tip: Consider composting organic waste at home!

- The ${appName} Team
Pokhara, Nepal
`;

  if (resendClient) {
    try {
      const { data, error } = await resendClient.emails.send({
        from: `${appName} <${fromEmail}>`,
        to: [to],
        subject,
        html,
        text,
      });
      if (!error) {
        console.log("✅ Bin full alert email sent via Resend to:", to);
        return { success: true, messageId: data.id, provider: "resend" };
      }
    } catch (e) {
      console.error("Resend failed for bin full alert:", e.message);
    }
  }

  if (smtpTransporter) {
    try {
      const info = await smtpTransporter.sendMail({
        from: `"${appName}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text,
      });
      console.log("✅ Bin full alert email sent via SMTP to:", to);
      return { success: true, messageId: info.messageId, provider: "smtp" };
    } catch (e) {
      console.error("SMTP failed for bin full alert:", e.message);
    }
  }

  // Development fallback
  console.log("\n" + "═".repeat(70));
  console.log("📧 BIN FULL ALERT EMAIL - Development Mode");
  console.log("═".repeat(70));
  console.log(`📬 To: ${to}`);
  console.log(`👤 Name: ${name}`);
  console.log(`🗑️ Bin: ${binId}`);
  console.log(`📍 Location: ${location}`);
  console.log(`🏘️ Ward: ${ward}`);
  console.log(`📊 Fill: ${fillLevel}%`);
  console.log("═".repeat(70) + "\n");

  return { success: true, messageId: "dev-" + Date.now(), provider: "console" };
};

/**
 * Send bin emptied notification email to ward users
 */
export const sendBinEmptiedAlertEmail = async ({ to, name, binId, ward, location, fillLevel }) => {
  initializeEmailServices();

  const appName = getAppName();
  const fromEmail = getFromEmail();
  const subject = `✅ Dustbin Emptied - ${binId} | Ward ${ward} | ${appName}`;
  const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dustbin Emptied</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <!-- Logo/Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; margin: 0 auto 16px; line-height: 60px;">
          <span style="font-size: 32px;">✅</span>
        </div>
        <h1 style="color: #10b981; margin: 0; font-size: 28px; font-weight: 700;">${appName}</h1>
        <p style="color: #6b7280; margin-top: 8px; font-size: 14px;">Smart Bin Monitoring System</p>
      </div>

      <!-- Success Badge -->
      <div style="margin-bottom: 24px; text-align: center;">
        <div style="margin-bottom: 16px;">
          <span style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 10px 24px; border-radius: 24px; font-weight: 700; font-size: 15px; letter-spacing: 0.5px;">
            ✅ DUSTBIN EMPTIED
          </span>
        </div>
        <h2 style="color: #1f2937; margin-bottom: 8px; font-size: 22px;">Hello, ${name || "Resident"}! 👋</h2>
        <p style="color: #4b5563; line-height: 1.6; font-size: 16px; margin: 0;">
          Great news! The dustbin in your ward that was previously full has now been <strong>emptied by our waste collection team</strong> and is ready to accept waste again.
        </p>
      </div>

      <!-- Bin Details Box -->
      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #86efac; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <p style="color: #065f46; font-weight: 700; font-size: 15px; margin: 0 0 16px 0; text-align: center;">🗑️ Bin Status Update</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 12px; color: #065f46; font-weight: 600; font-size: 14px; width: 140px;">🆔 Bin ID</td>
            <td style="padding: 10px 12px; color: #1f2937; font-size: 15px; font-weight: 700;">${binId}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; color: #065f46; font-weight: 600; font-size: 14px;">📍 Location</td>
            <td style="padding: 10px 12px; color: #1f2937; font-size: 14px;">${location}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; color: #065f46; font-weight: 600; font-size: 14px;">🏘️ Ward</td>
            <td style="padding: 10px 12px; color: #1f2937; font-size: 15px; font-weight: 700;">Ward ${ward}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; color: #065f46; font-weight: 600; font-size: 14px;">📊 Current Level</td>
            <td style="padding: 10px 12px;">
              <span style="display: inline-block; background-color: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 700;">${fillLevel}% — READY</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; color: #065f46; font-weight: 600; font-size: 14px;">🕐 Emptied At</td>
            <td style="padding: 10px 12px; color: #1f2937; font-size: 14px;">${now}</td>
          </tr>
        </table>
      </div>

      <!-- Thank You Section -->
      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
        <p style="font-size: 28px; margin: 0 0 12px 0;">🙏</p>
        <h3 style="color: #78350f; font-size: 18px; margin: 0 0 8px 0;">Thank You for Your Patience!</h3>
        <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.6;">
          Our waste collection team has successfully emptied the dustbin. You can now resume using this bin for waste disposal.
          Together, we keep our city <strong>clean, green, and sustainable</strong>.
        </p>
      </div>

      <!-- Tips -->
      <div style="background-color: #f0f9ff; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="color: #0c4a6e; font-size: 14px; margin: 0 0 8px 0; font-weight: 600;">💡 Waste Disposal Reminders:</p>
        <ul style="color: #0369a1; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.8;">
          <li>Please segregate your waste — separate organic and recyclable materials</li>
          <li>Tie waste bags securely before disposal</li>
          <li>Avoid overfilling the bin — use the next scheduled pickup if the bin is nearly full</li>
        </ul>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">
          Clean City, Green Future 🌿
        </p>
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} ${appName}. All rights reserved.<br>
          Pokhara, Nepal
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
✅ Dustbin Emptied - ${appName}

Hello ${name || "Resident"},

Great news! The dustbin that was previously full in your ward (Ward ${ward}) has been emptied.

🗑️ BIN STATUS UPDATE:
🆔 Bin ID: ${binId}
📍 Location: ${location}
🏘️ Ward: Ward ${ward}
📊 Current Level: ${fillLevel}% — READY
🕐 Emptied At: ${now}

You can now resume using this bin for waste disposal.
Please remember to segregate your waste — separate organic and recyclable materials.

Thank you for keeping Pokhara clean! 🙏

- The ${appName} Team
Pokhara, Nepal
`;

  if (resendClient) {
    try {
      const { data, error } = await resendClient.emails.send({
        from: `${appName} <${fromEmail}>`,
        to: [to],
        subject,
        html,
        text,
      });
      if (!error) {
        console.log("✅ Bin emptied alert email sent via Resend to:", to);
        return { success: true, messageId: data.id, provider: "resend" };
      }
    } catch (e) {
      console.error("Resend failed for bin emptied alert:", e.message);
    }
  }

  if (smtpTransporter) {
    try {
      const info = await smtpTransporter.sendMail({
        from: `"${appName}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text,
      });
      console.log("✅ Bin emptied alert email sent via SMTP to:", to);
      return { success: true, messageId: info.messageId, provider: "smtp" };
    } catch (e) {
      console.error("SMTP failed for bin emptied alert:", e.message);
    }
  }

  // Development fallback
  console.log("\n" + "═".repeat(70));
  console.log("📧 BIN EMPTIED ALERT EMAIL - Development Mode");
  console.log("═".repeat(70));
  console.log(`📬 To: ${to}`);
  console.log(`👤 Name: ${name}`);
  console.log(`🗑️ Bin: ${binId}`);
  console.log(`📍 Location: ${location}`);
  console.log(`🏘️ Ward: ${ward}`);
  console.log(`📊 Fill: ${fillLevel}%`);
  console.log("═".repeat(70) + "\n");

  return { success: true, messageId: "dev-" + Date.now(), provider: "console" };
};

export default {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendScheduleReminderEmail,
  sendPickupCompletionEmail,
  sendReportResolutionEmail,
  sendBinFullAlertEmail,
  sendBinEmptiedAlertEmail,
};
