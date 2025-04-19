import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, user) => {
    console.log('User object:', user);
    // Tạo token JWT với userId và role của người dùng
    const token = jwt.sign(
        { userId: user._id.toString(), role: user.role },
        process.env.JWT_SECRET, 
        { expiresIn: "2d" } // Thời gian hết hạn của token là 2 ngày
    );
    console.log('Generated Token:', token);

    // Thiết lập cookie chứa token với các tùy chọn bảo mật
    res.cookie("token", token, {
        httpOnly: true, // Cookie chỉ truy cập được từ phía server
        secure: process.env.NODE_ENV === "production", // Chỉ gửi cookie qua HTTPS trong production
        sameSite: "strict", // Chặn cookie được gửi từ các trang khác (giảm thiểu CSRF)
        maxAge: 2 * 24 * 60 * 60 * 1000, // Thời gian tồn tại của cookie là 2 ngày
    });

    return token; // Trả về token để sử dụng nếu cần trong phản hồi
};