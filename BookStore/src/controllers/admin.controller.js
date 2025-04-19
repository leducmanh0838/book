import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { sendVerificationEmail} from "../config/email.js";

// create new Merchant
export const createMerchant = async (req, res) => {
    const { email, password, name, address, phoneNumber} = req.body;

    try {
        // Kiểm tra xem người dùng đã tồn tại chưa dựa trên email
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User with this email already exists" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo mã xác thực
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 giờ

        // Tạo người dùng mới
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            address,
            phoneNumber,
            role: 'merchant',
            verificationToken,
            verificationTokenExpiresAt,
        });        

        // Lưu merchant vào database
        await newUser.save();

        // Gửi email xác minh
        await sendVerificationEmail(newUser.email, verificationToken);

        res.status(201).json({ success: true, message: "Merchant created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// update Merchant
export const updateMerchant = async (req, res) => {
    const { id } = req.params;
    const { name, address, phoneNumber, role } = req.body;

    try {
        // Tìm người dùng dựa trên _id
        const user = await User.findById(id);

        if (!user || user.role !== 'merchant') {
            return res.status(404).json({ success: false, message: "Merchant not found" });
        }

        // Cập nhật thông tin merchant
        user.name = name || user.name; // Cập nhật storeName
        user.address = address || user.address; // Cập nhật storeAddress
        user.phoneNumber = phoneNumber || user.phoneNumber; // Cập nhật phoneNumber
        // Cập nhật vai trò nếu có
        if (role) {
            user.role = role;
        }

        // Kiểm tra vai trò mới có hợp lệ hay không
        const validRoles = ['admin', 'merchant', 'user'];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role specified" });
        }

        await user.save();

        res.status(200).json({ success: true, message: "Merchant updated successfully", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// delete Merchant
export const deleteMerchant = async (req, res) => {
    try {
        const { id } = req.params;

        // Tìm merchant dựa trên id
        const merchant = await User.findById(id);

        // Kiểm tra xem merchant có tồn tại và vai trò có phải là 'merchant' không
        if (!merchant || merchant.role !== 'merchant') {
            return res.status(404).json({ success: false, message: "Merchant not found or user is not a merchant" });
        }

        // Xóa merchant nếu điều kiện trên thỏa mãn
        await User.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Merchant deleted successfully", merchant });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// get Merchant
export const getMerchant = async (req, res) => {
    try {
        const { id, email, name } = req.query;
        let query = { role: 'merchant' }; // Chỉ tìm người dùng có role merchant

        // Tìm theo id nếu có và hợp lệ
        if (id && mongoose.Types.ObjectId.isValid(id)) {
            query = { _id: id, role: 'merchant' };
        }

        // Tìm theo email nếu có
        if (email) {
            query.email = { $regex: email, $options: "i" }; // Không phân biệt chữ hoa/chữ thường
        }

        // Tìm theo name nếu có
        if (name) {
            query.name = { $regex: name, $options: "i" }; // Không phân biệt chữ hoa/chữ thường
        }

        // Tìm merchant dựa trên query đã xây dựng
        const merchants = await User.find(query);

        if (merchants.length === 0) {
            return res.status(404).json({ success: false, message: "Merchant not found" });
        }

        res.status(200).json({ success: true, merchants });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// get all Merchant
export const getAllMerchants = async (req, res) => {
    try {
        // Tìm tất cả người dùng có vai trò là merchant
        const merchants = await User.find({ role: 'merchant' });

        res.status(200).json({ success: true, merchants });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// User
export const createUser = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        // Kiểm tra xem tất cả các trường có được cung cấp hay không
        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }

        // Kiểm tra xem người dùng đã tồn tại chưa
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo mã xác thực
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 giờ

        // Tạo người dùng mới
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            role: role || 'user', // Nếu không có vai trò, mặc định là user
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
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' });
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const { id, email, name } = req.query;
        let query = { role: 'user' };

        if (id && mongoose.Types.ObjectId.isValid(id)) {
            query = await User.findById(id);
        } 
        
        if (email) {
            query.email = { $regex: email, $options: "i" }; // Tìm kiếm không phân biệt chữ hoa chữ thường
        }

        if (name) {
            query.name = { $regex: name, $options: "i" }; // Tìm kiếm không phân biệt chữ hoa chữ thường
        }

        // Tìm người dùng theo query đã xây dựng
        const users = await User.find(query);

        if (!users) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, users });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Cập nhật thông tin
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        await user.save();

        res.status(200).json({ success: true, message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};