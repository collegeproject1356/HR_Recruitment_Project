import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String, required: true },
  salary: { type: String },
  location: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Kis HR ne post ki
  status: { 
    type: String, 
    enum: ['pending','interview', 'approved', 'rejected'], 
    default: 'pending' 
  }
}, { timestamps: true });

export const Job = mongoose.model("Job", jobSchema);