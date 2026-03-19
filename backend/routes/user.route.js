import express from "express";
import { login, logout, register, getUserProfile,
     updateProfile, deleteUser, createHRAccount,
      getSystemStats,getAllUsers,adminDeleteUser,
      forgotPassword, resetPassword,googleLogin } from "../controllers/user.controller.js";import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", isAuthenticated, getUserProfile); 
router.put("/profile/update", isAuthenticated, updateProfile);
router.delete("/profile/delete", isAuthenticated, deleteUser); 
router.post("/admin/create-hr", isAuthenticated, createHRAccount);
router.get("/admin/stats", isAuthenticated, getSystemStats);
router.get("/admin/users", isAuthenticated, getAllUsers);
router.delete("/admin/user/:id", isAuthenticated, adminDeleteUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.post("/google-login", googleLogin);

export default router;