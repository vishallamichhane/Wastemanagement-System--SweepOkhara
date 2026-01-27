// const mongoose = require('mongoose');
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbName = "waste_management_system";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {

    console.error(`❌ Error: ${error.message}`);
    console.warn(error)
    process.exit(1);
  }
};

// module.exports = connectDB;
export default connectDB;