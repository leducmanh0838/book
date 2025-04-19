import multer from 'multer';
import path from 'path';
import fs from 'fs';

//nơi lưu trữ ảnh và tên file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Nơi lưu trữ file
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Đặt tên file
    }
});

//upload ảnh
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error("Only images"));
    }
};

// Khởi tạo multer
export const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 20 }, // 20MB
    fileFilter: fileFilter
});
