import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  pushupData: [
    {
      day: { type: Number, required: true },
      target: { type: Number },
      isCompleted: { type: Boolean, default: false },
    },
  ],
  badges: [String],
}, { timestamps: true });

// Prevent recompilation errors during hot reloading.
const UserProgress = mongoose.models.UserProgress || mongoose.model('UserProgress', userProgressSchema);

export default UserProgress;
