import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  resumeUrl: { type: String, required: true }, 
  status: { 
    type: String, 
    enum: ['Pending', 'Interview Scheduled', 'Selected', 'Rejected'], 
    default: 'Pending' 
  }
}, { timestamps: true });

export const Application = mongoose.model("Application", applicationSchema);