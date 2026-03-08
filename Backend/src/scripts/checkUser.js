import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/user.js';

await connectDB();

// Find Bishal
const users = await User.find({ fullName: { $regex: /bishal/i } }).select('fullName email ward username createdAt updatedAt');
console.log('=== Users matching Bishal ===');
for (const u of users) {
  console.log(JSON.stringify(u.toObject(), null, 2));
}

// Also show all users with their wards
const allUsers = await User.find({ ward: { $exists: true, $ne: '' } }).select('fullName email ward');
console.log('\n=== All users with ward set ===');
for (const u of allUsers) {
  console.log(`  ${u.fullName || u.email} - Ward: "${u.ward}"`);
}

// Check today and tomorrow
const now = new Date();
const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
console.log('\nToday:', now.toLocaleDateString('en-US', {weekday:'long'}), now.toISOString());
console.log('Tomorrow:', tomorrow.toLocaleDateString('en-US', {weekday:'long'}), '- dayOfWeek =', tomorrow.getDay());

await mongoose.disconnect();
