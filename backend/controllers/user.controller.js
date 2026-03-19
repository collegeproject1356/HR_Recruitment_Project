import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import crypto from "crypto"; 
import sendEmail from "../utils/sendEmail.js";
import { OAuth2Client } from 'google-auth-library';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required.", success: false });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email.", success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'candidate' 
        });

        return res.status(201).json({ message: "Account created successfully.", success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required.", success: false });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password.", success: false });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid email or password.", success: false });
        }

        generateToken(res, user._id, user.role);

        user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        return res.status(200).json({ message: `Welcome back, ${user.name}!`, user, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const createHRAccount = async (req, res) => {
    try {
        if (req.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Only Admins can create HR accounts.", success: false });
        }

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required.", success: false });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already in use.", success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newHR = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'hr' 
        });

        return res.status(201).json({ message: "HR Account created successfully.", hr: newHR, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { 
            maxAge: 0,
            httpOnly: true,
            sameSite: "none", 
            secure: true     
        }).json({
            message: "You have logged out successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password"); 
        if (!user) return res.status(404).json({ message: "User not found.", success: false });
        
        return res.status(200).json({ user, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const userId = req.id;
        
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found.", success: false });

        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        user = { _id: user._id, name: user.name, email: user.email, role: user.role };
        return res.status(200).json({ message: "Profile updated successfully!", user, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.id;
        await User.findByIdAndDelete(userId);
        return res.status(200).cookie("token", "", { 
            maxAge: 0,
            httpOnly: true,
            sameSite: "none", 
            secure: true
        }).json({ message: "Account deleted permanently.", success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const getSystemStats = async (req, res) => {
    try {
        if (req.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin only.", success: false });
        }

        const totalCandidates = await User.countDocuments({ role: 'candidate' });
        const totalHRs = await User.countDocuments({ role: 'hr' });
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();

        return res.status(200).json({
            success: true,
            stats: {
                totalCandidates,
                totalHRs,
                totalJobs,
                totalApplications
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to fetch system stats.", success: false });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        if (req.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin only.", success: false });
        }
        
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        return res.status(200).json({ success: true, users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to fetch users.", success: false });
    }
};

export const adminDeleteUser = async (req, res) => {
    try {
        if (req.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin only.", success: false });
        }
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        return res.status(200).json({ success: true, message: "User record deleted successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to delete user.", success: false });
    }
};


export const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: "User not found with this email.", success: false });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");

        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
        await user.save();

        const frontendUrl = process.env.FRONTEND_URL ;
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        const message = `You requested a password reset. Please click on the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

        try {
            await sendEmail({
                email: user.email,
                subject: "HireMe - Password Reset",
                message: message
            });

            res.status(200).json({ message: `Email sent to ${user.email} successfully.`, success: true });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ message: "Failed to send email.", success: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const resetToken = req.params.token;

        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ message: "Token is invalid or has expired.", success: false });
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match.", success: false });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ message: "Password updated successfully! You can now login.", success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(generatedPassword, 10);

            user = await User.create({
                name,
                email,
                password: hashedPassword,
                role: 'candidate',
                'profile.profilePhoto': picture
            });
        }

        generateToken(res, user._id, user.role);

        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePhoto: user.profile?.profilePhoto
        };

        return res.status(200).json({ message: "Google Login Successful", user: userResponse, success: true });
    } catch (error) {
        res.status(500).json({ message: "Google Login Failed", success: false });
    }
};