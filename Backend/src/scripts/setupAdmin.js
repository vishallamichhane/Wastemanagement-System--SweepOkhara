/**
 * Admin Setup Script
 * 
 * Usage: node src/scripts/setupAdmin.js <email>
 * 
 * This script promotes a Clerk user to admin by:
 * 1. Setting publicMetadata.role = 'admin' in Clerk
 * 2. Updating the role field in MongoDB
 * 
 * Prerequisites:
 * - CLERK_SECRET_KEY must be set in .env
 * - MONGODB_URI must be set in .env
 * - The user must already exist (registered via Clerk)
 */

import dotenv from 'dotenv';
import { createClerkClient } from '@clerk/express';
import mongoose from 'mongoose';
import User from '../models/user.js';

dotenv.config();

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function setupAdmin(email) {
  if (!email) {
    console.error('❌ Usage: node src/scripts/setupAdmin.js <email>');
    console.error('   Example: node src/scripts/setupAdmin.js admin@sweeppokhara.com');
    process.exit(1);
  }

  console.log(`\n🔧 Setting up admin for: ${email}\n`);

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find user in Clerk by email
    const clerkUsers = await clerkClient.users.getUserList({
      emailAddress: [email],
    });

    if (!clerkUsers.data || clerkUsers.data.length === 0) {
      console.error(`❌ No Clerk user found with email: ${email}`);
      console.error('   Make sure the user has registered first.');
      process.exit(1);
    }

    const clerkUser = clerkUsers.data[0];
    console.log(`✅ Found Clerk user: ${clerkUser.firstName} ${clerkUser.lastName} (${clerkUser.id})`);

    // Update Clerk publicMetadata
    await clerkClient.users.updateUserMetadata(clerkUser.id, {
      publicMetadata: {
        ...clerkUser.publicMetadata,
        role: 'admin',
      },
    });
    console.log('✅ Clerk publicMetadata.role set to "admin"');

    // Update MongoDB user record
    const mongoUser = await User.findOneAndUpdate(
      { $or: [{ clerkId: clerkUser.id }, { email: email }] },
      { role: 'admin' },
      { new: true }
    );

    if (mongoUser) {
      console.log(`✅ MongoDB user role updated to "admin" (ID: ${mongoUser._id})`);
    } else {
      console.warn('⚠️  No matching user found in MongoDB. The Clerk metadata was updated.');
      console.warn('   The user will still be recognized as admin via Clerk.');
    }

    console.log(`\n🎉 Admin setup complete for ${email}!`);
    console.log('   The user can now access /admin and all admin API endpoints.\n');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    if (error.errors) {
      error.errors.forEach(e => console.error('  -', e.message));
    }
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Get email from command line args
const email = process.argv[2];
setupAdmin(email);
