import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const collectorSchema = new mongoose.Schema(
  {
    collectorId: {
      type: String,
      required: [true, 'Please provide a collector ID'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    name: {
      type: String,
      required: [true, 'Please provide collector name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },
    assignedWards: {
      type: [Number],
      required: [true, 'Please provide assigned wards'],
      validate: {
        validator: function(wards) {
          return wards && wards.length >= 5;
        },
        message: 'Collector must be assigned to at least 5 wards'
      }
    },
    vehicleId: {
      type: String,
      required: [true, 'Please provide vehicle ID'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    badge: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold'],
      default: 'Bronze',
    },
    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },
    efficiency: {
      type: Number,
      default: 85,
      min: 0,
      max: 100,
    },
    totalCollections: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to admin who created this collector
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
collectorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
collectorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Collector = mongoose.model('Collector', collectorSchema);
export default Collector;
