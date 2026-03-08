import mongoose from 'mongoose';

const binAlertSchema = new mongoose.Schema(
  {
    binId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    ward: {
      type: Number,
      required: true,
    },
    lastStatus: {
      type: String,
      enum: ['full', 'emptied', 'normal'],
      default: 'normal',
    },
    lastAlertAt: {
      type: Date,
      default: null,
    },
    location: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const BinAlert = mongoose.model('BinAlert', binAlertSchema);

export default BinAlert;
