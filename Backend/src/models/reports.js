// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reportType: {
      type: String,
      required: [true, 'Please select a report type'],
      enum: ['missed-pickup', 'overflowing-bin', 'illegal-dumping', 'broken-container', 'street-litter', 'other'],
    },
    reportLabel:{
      type: String,
      required: [true, 'Please add a report label'],
     enum: ['Missed Pickup', 'Overflowing Bin', 'Illegal Dumping', 'Broken Container', 'Street Litter', 'Other Issue'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    latitude:{
      type: Number,
    },
    longitude:{
      type: Number,   
    },
    imageUrl: [{
      type: String,
    }],
    status: {
      type: String,
      enum: ['Pending', 'In-Progress', 'Resolved'],
      default: 'Pending',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;