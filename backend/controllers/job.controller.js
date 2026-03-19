import { Job } from "../models/job.model.js";

export const postJob = async (req, res) => {
    try {
        if (req.role !== 'hr') {
            return res.status(403).json({ message: "You don't have permission to post jobs.", success: false });
        }

        const { title, description, requirements, salary, location } = req.body;
        const userId = req.id; 

        if (!title || !description || !requirements || !location) {
            return res.status(400).json({ message: "All job details are required.", success: false });
        }

        const job = await Job.create({
            title,
            description,
            requirements,
            salary,
            location,
            postedBy: userId,
            status: 'pending' 
        });

        return res.status(201).json({ message: "New Job created! Please wait for Admin approval.", job, success: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'approved' }).populate({
            path: 'postedBy',
            select: 'name email' 
        }).sort({ createdAt: -1 }); 

        if (!jobs) {
            return res.status(404).json({ message: "No jobs available right now.", success: false });
        }

        return res.status(200).json({ jobs, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const updateJobStatus = async (req, res) => {
    try {
        if (req.role !== 'admin') {
            return res.status(403).json({ message: "Only Admin can approve jobs.", success: false });
        }

        const jobId = req.params.id;
        const { status } = req.body; 

        const job = await Job.findByIdAndUpdate(jobId, { status }, { new: true });

        if (!job) {
            return res.status(404).json({ message: "Job not found.", success: false });
        }

        return res.status(200).json({ message: `Job is now ${status}.`, job, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({ path: "postedBy", select: "name email" });
        if (!job) return res.status(404).json({ message: "Job not found.", success: false });

        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const updateJob = async (req, res) => {
    try {
        if (req.role !== 'hr') return res.status(403).json({ message: "Only HR can edit jobs.", success: false });
        
        const jobId = req.params.id;
        const { title, description, requirements, salary, location } = req.body;

        const job = await Job.findByIdAndUpdate(jobId, { title, description, requirements, salary, location }, { new: true });
        if (!job) return res.status(404).json({ message: "Job not found.", success: false });

        return res.status(200).json({ message: "Job details updated successfully!", job, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const deleteJob = async (req, res) => {
    try {
        if (req.role !== 'hr' && req.role !== 'admin') return res.status(403).json({ message: "Permission denied.", success: false });

        const jobId = req.params.id;
        const job = await Job.findByIdAndDelete(jobId);
        if (!job) return res.status(404).json({ message: "Job not found.", success: false });

        return res.status(200).json({ message: "Job deleted successfully.", success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const getPendingJobs = async (req, res) => {
    try {
        if (req.role !== 'admin') return res.status(403).json({ message: "Only Admin can view pending jobs.", success: false });

        const jobs = await Job.find({ status: 'pending' }).populate('postedBy', 'name email').sort({ createdAt: -1 });
        return res.status(200).json({ jobs, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const getHRJobs = async (req, res) => {
    try {
        if (req.role !== 'hr') return res.status(403).json({ message: "Only HR can view their jobs.", success: false });

        const jobs = await Job.find({ postedBy: req.id }).sort({ createdAt: -1 });
        return res.status(200).json({ jobs, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};