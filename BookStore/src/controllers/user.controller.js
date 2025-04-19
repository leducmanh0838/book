import Book from "../models/book.model.js";
import User from "../models/user.model.js";

// Lấy thông tin hồ sơ người dùng
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId); // Kiểm tra giá trị userId
        const user = await User.findById(userId).select("-password"); // Không trả về mật khẩu

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user profile: ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Cập nhật thông tin hồ sơ người dùng
export const updateProfile = async (req, res) => {
    try {
        const userId = req.params.id; // Lấy userId từ params
        const { name, email, phoneNumber, address, default: isDefault } = req.body; // Lấy các thông tin từ body

        const user = await User.findById(userId); // Tìm người dùng theo ID
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Cập nhật name và email
        if (name) user.name = name;
        if (email) user.email = email;

        // Cập nhật phoneNumber
        if (phoneNumber) user.phoneNumber = phoneNumber;

        // Cập nhật địa chỉ
        if (address) user.address = address; // Cập nhật trực tiếp

        await user.save(); // Lưu thay đổi vào cơ sở dữ liệu

        res.status(200).json({ success: true, message: "User profile updated successfully", user });
    } catch (error) {
        console.error("Error updating user profile: ", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const getAllBook = async () => {
    try {
        const books = await Book.find({});
        return books; 
    } catch (error) {
        throw new Error("Error fetching books"); 
    }
};

// user search
export const searchBookForUser = async (req, res) => {
    const { query } = req.query;

    try {
        const allBooks = await getAllBook(); // Lấy danh sách sách

        if (!allBooks) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sách nào." });
        }

        // Tìm kiếm các sách phù hợp với truy vấn
        const suggestions = allBooks.filter(book => 
            book.bookTitle.toLowerCase().includes(query.toLowerCase()) ||
            book.publisher.toLowerCase().includes(query.toLowerCase()) ||
            book.supplier.toLowerCase().includes(query.toLowerCase())
        );

        res.json(suggestions);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình tìm kiếm." });
    }
};

