import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { applyJob, getAppliedJobs, getApplicants, updateStatus, deleteApplication,getHRReportData, getAdminReportData } from "../controllers/application.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/apply/:id", isAuthenticated, singleUpload, applyJob);
router.get("/get", isAuthenticated, getAppliedJobs); 
router.get("/:id/applicants", isAuthenticated, getApplicants); 
router.put("/status/:id", isAuthenticated, updateStatus);
router.delete("/delete/:id", isAuthenticated, deleteApplication); 
router.get("/report/hr", isAuthenticated, getHRReportData);
router.get("/report/admin", isAuthenticated, getAdminReportData);

export default router;