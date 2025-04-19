import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; 

    console.log("Received token:", token); // Log token nhận được

    if (!token) {
        return res.status(401).json({ message: "Quyền bị từ chối, không có token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded); // Kiểm tra giá trị decoded
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Token error:", err);
        res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        console.log("User role:", req.user.role);
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: `Access denied, only ${roles.join(", ")} allowed` });
        }
        next(); 
    };
};