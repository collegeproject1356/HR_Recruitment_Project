import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { getAllJobs, postJob, updateJobStatus, getJobById, updateJob, deleteJob,getPendingJobs,getHRJobs } from "../controllers/job.controller.js";

const router = express.Router();

router.post("/post", isAuthenticated, postJob); 
router.get("/get", getAllJobs); 
router.put("/status/:id", isAuthenticated, updateJobStatus); 
router.get("/get/:id", getJobById); 
router.put("/update/:id", isAuthenticated, updateJob);
router.delete("/delete/:id", isAuthenticated, deleteJob); 
router.get("/admin/pending", isAuthenticated, getPendingJobs);
router.get("/hr/my-jobs", isAuthenticated, getHRJobs);

export default router;