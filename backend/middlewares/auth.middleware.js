import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not logged in!", success: false });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid Token", success: false });
        }

        req.id = decoded.userId;
        req.role = decoded.role; 
        next(); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
};