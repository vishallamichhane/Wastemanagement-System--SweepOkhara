import mongoose from 'mongoose';

const wardTaskSchema = new mongoose.Schema(
  {
    ward: {
      type: Number,
      required: [true, 'Ward number is required'],
      min: 1,
      max: 33,
    },
    date: {
      type: String, // 'YYYY-MM-DD' format for easy lookup
      required: [true, 'Date is required'],
    },
    timeSlot: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed'],
      default: 'scheduled',
    },
    collectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collector',
    },
    completedAt: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate tasks for same ward+date
wardTaskSchema.index({ ward: 1, date: 1 }, { unique: true });

const WardTask = mongoose.model('WardTask', wardTaskSchema);
export default WardTask;
