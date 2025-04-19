import bcrypt from "bcrypt";
import crypto from 'crypto';
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail} from "../config/email.js";


export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        // Kiểm tra xem tất cả các trường có được cung cấp hay không
        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }

        // Kiểm tra xem người dùng đã tồn tại chưa
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Kiểm tra mật khẩu
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({ success: false, message: passwordValidation.message });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 8);

        // Tạo mã xác thực
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 giờ

        // Tạo người dùng mới
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt,
        });

        await newUser.save();

        // Gửi email xác minh
        await sendVerificationEmail(newUser.email, verificationToken);

        // Phản hồi người dùng được tạo thành công
        res.status(201).json({
            success: true,
            message: "User created successfully. Please check your email for verification.",
            user: {
                ...newUser._doc,
                password: undefined, // Không gửi mật khẩu ra ngoài
            }
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Hàm kiểm tra mật khẩu
const validatePassword = (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return { isValid: false, message: "Password must be at least 6 characters long" };
    }
    if (!hasUpperCase) {
        return { isValid: false, message: "Password must contain at least one uppercase letter" };
    }
    if (!hasLowerCase) {
        return { isValid: false, message: "Password must contain at least one lowercase letter" };
    }
    if (!hasNumber) {
        return { isValid: false, message: "Password must contain at least one number" };
    }
    if (!hasSpecialChar) {
        return { isValid: false, message: "Password must contain at least one special character" };
    }
    return { isValid: true };
};

export const verifyEmail = async(req, res) =>{
    
    const {code} = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });
        
        if(!user){
            return res.status(400).json({success:false, message: "Invalid or expired verification code"})
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message:"Email varified successfully",
            user:{
                ...user._doc,
                password: undefined,
            }
        })
    } catch (error) {}  
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Tìm người dùng trong collection User (bao gồm cả admin và merchant)
        const user = await User.findOne({ email });

        // Nếu không tìm thấy người dùng
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // In ra thông tin người dùng trước khi tạo token
        console.log('User before token generation:', user); // Thêm dòng này

        // Tạo token JWT và thiết lập cookie
        const token = generateTokenAndSetCookie(res, { _id: user._id, role: user.role }); // Sửa lại _id

        // Cập nhật thông tin đăng nhập cuối cùng
        user.lastLogin = new Date();
        await user.save();

        // Phản hồi đăng nhập thành công
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined, // Ẩn mật khẩu trong phản hồi
            },
            token // Thêm token vào phản hồi
        });

    } catch (error) {
        console.log("Error in login ", error);
        res.status(500).json({ success: false, message: error.message });
    }
};



export const logout = async(req, res) => {
    res.clearCookie("token");
    res.status(200).json({success: true, message:"Logged out successfully"});
}

// forget password
export const forgetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Tạo mã xác minh
        const resetToken = crypto.randomBytes(3).toString("hex");
        const resetTokenExpiresAt = Date.now() + 15 * 60 * 1000; // Hết hạn sau 15p

        // Lưu mã xác minh và thời gian hết hạn vào người dùng
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        // Gửi email
        await sendPasswordResetEmail(user.email, resetToken);

        res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    } catch (error) {
        console.log("Error in forgetPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        // Lấy mã xác minh từ body yêu cầu
        const { verificationToken, newPassword } = req.body;

        // Tìm người dùng bằng mã xác minh và thời gian hết hạn
        const user = await User.findOne({
            resetPasswordToken: verificationToken, // Sử dụng verificationToken từ body
            resetPasswordExpiresAt: { $gt: Date.now() }, // Kiểm tra thời gian hết hạn
        });

        // Kiểm tra xem người dùng có tồn tại không
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

                // Kiểm tra mật khẩu mới
                const passwordValidation = validatePassword(newPassword);
                if (!passwordValidation.isValid) {
                    return res.status(400).json({ success: false, message: passwordValidation.message });
        }

        // Cập nhật mật khẩu
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        
        // Xóa mã xác minh và thời gian hết hạn
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        
        // Lưu người dùng
        await user.save();

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.log("Error in resetPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};