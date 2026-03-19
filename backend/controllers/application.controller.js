import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import cloudinary from "../config/cloudinary.js";

export const applyJob = async (req, res) => {
    try {
        if (req.role !== 'candidate') return res.status(403).json({ message: "Only Candidates can apply.", success: false });

        const userId = req.id;
        const jobId = req.params.id;

        // SMART FIX 1: Pehle check karo ki apply kiya hai ya nahi (Taaki Cloudinary par faltu upload na ho)
        const existingApplication = await Application.findOne({ jobId: jobId, candidateId: userId });
        if (existingApplication) return res.status(400).json({ message: "You have already applied for this role.", success: false });
        
        const file = req.file; 
        if (!file) return res.status(400).json({ message: "Resume upload is required.", success: false });

        const fileUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

        // SMART FIX 2: resource_type ko "auto" kar diya hai jisse Cloudinary isko document (PDF) maan kar inline open karne dega
        const cloudResponse = await cloudinary.uploader.upload(fileUri, {
            folder: "resumes",
            resource_type: "auto", // <-- Yahan "raw" ki jagah "auto" aayega
            original_filename: file.originalname 
        });

        const newApplication = await Application.create({
            candidateId: userId,
            jobId: jobId,
            resumeUrl: cloudResponse.secure_url 
        });

        return res.status(201).json({ message: "Application submitted successfully!", success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ candidateId: userId }).populate("jobId").sort({ createdAt: -1 });
        if (!application) return res.status(404).json({ message: "No application found.", success: false });

        return res.status(200).json({ application, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const applications = await Application.find({ jobId }).populate("candidateId", "name email");
        if (!applications) return res.status(404).json({ message: "No candidate found.", success: false });

        return res.status(200).json({ applications, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const updateStatus = async (req, res) => {
    try {
        if (req.role !== 'hr') return res.status(403).json({ message: "Only HR can update status.", success: false });

        const applicationId = req.params.id;
        const { status } = req.body;

        const application = await Application.findByIdAndUpdate(applicationId, { status }, { new: true });
        if (!application) return res.status(404).json({ message: "Application not found.", success: false });

        return res.status(200).json({ message: "Status updated successfully.", success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const deleteApplication = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const application = await Application.findByIdAndDelete(applicationId);
        if (!application) return res.status(404).json({ message: "Application not found.", success: false });

        return res.status(200).json({ message: "You have cancelled the application.", success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const getHRReportData = async (req, res) => {
    try {
        if (req.role !== 'hr') return res.status(403).json({ message: "Access denied.", success: false });

        const jobs = await Job.find({ postedBy: req.id });
        const jobIds = jobs.map(job => job._id);

        const applications = await Application.find({ jobId: { $in: jobIds } })
            .populate('candidateId', 'name email')
            .populate('jobId', 'title location');

        return res.status(200).json({ success: true, applications, totalJobs: jobs.length });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const getAdminReportData = async (req, res) => {
    try {
        if (req.role !== 'admin') return res.status(403).json({ message: "Access denied.", success: false });

        const applications = await Application.find()
            .populate('candidateId', 'name email')
            .populate({
                path: 'jobId',
                populate: { path: 'postedBy', select: 'name' } 
            });

        return res.status(200).json({ success: true, applications });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};