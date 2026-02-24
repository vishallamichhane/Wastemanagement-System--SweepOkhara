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
    priority:{
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    ward: {
      type: Number,
      required: [true, 'Please select a ward'],
      min: [1, 'Ward number must be between 1 and 33'],
      max: [33, 'Ward number must be between 1 and 33'],
    },
    latitude:{
      type: Number,
      required: [true, 'Latitude is required'],
    },
    longitude:{
      type: Number,
      required: [true, 'Longitude is required'],
    },
    images: [{
      type: String,
    }],
    status: {
      type: String,
      enum: ['received', 'in-progress', 'resolved'],
      default: 'in-progress',
    },
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
    },
    userEmail: {
      type: String,
    },
    assignedCollectorId: {
      type: String,
    },
    assignedCollectorName: {
      type: String,
    },
    assignedVehicleId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;