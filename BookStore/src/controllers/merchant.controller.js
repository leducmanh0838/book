import Book from "../models/book.model.js";

// book manage
export const createBook = async (req, res) => {
    try {
        // Kiểm tra vai trò của người dùng
        if (req.user.role !== 'merchant') {
            return res.status(403).json({ success: false, message: "Only merchants can create books." });
        }

        // Lấy dữ liệu từ req.body
        const { bookType, bookTitle, author, price, publisher, discountCode, supplier, stockQuantity, description, category, subCategory, publicationDate, pageCount, bookImage } = req.body;

        // Kiểm tra xem bookImage có phải là một chuỗi không rỗng
        if (!bookImage || typeof bookImage !== 'string' || !bookImage.trim()) {
            return res.status(400).json({ success: false, message: "Book image URL is required." });
        }

        // Tạo sách mới
        const newBook = new Book({
            bookType,
            bookTitle,
            author,
            price,
            publisher,
            discountCode,
            supplier,
            stockQuantity,
            description,
            bookImage, // Lưu URL của hình ảnh
            category,
            subCategory,
            publicationDate,
            pageCount,
            merchantId: req.user.userId // Lưu ID của merchant
        });

        // Lưu sách vào cơ sở dữ liệu
        const savedBook = await newBook.save();
        res.status(201).json({ success: true, message: "Book created successfully", book: savedBook });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Lấy tất cả sách
export const getAllBooks = async (req, res) => {
    try {
        // Lấy tất cả sách của merchant đang đăng nhập
        const books = await Book.find({ merchantId: req.user.userId });
        res.status(200).json({ success: true, books });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Cập nhật sách
export const updateBook = async (req, res) => {
    try {
        if (req.user.role !== 'merchant') {
            return res.status(403).json({ success: false, message: "Only merchants can update books." });
        }

        // Tìm cuốn sách và kiểm tra xem nó có thuộc về merchant đang đăng nhập không
        const book = await Book.findById(req.params.bookId);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        if (book.merchantId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ success: false, message: "You can only update your own books." });
        }

        const updatedBook = await Book.findByIdAndUpdate(req.params.bookId, req.body, { new: true });
        res.status(200).json({ success: true, message: "Book updated successfully", book: updatedBook });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteBook = async (req, res) => {
    try {
        if (req.user.role !== 'merchant') {
            return res.status(403).json({ success: false, message: "Only merchants can delete books." });
        }

        // Tìm cuốn sách và kiểm tra xem nó có thuộc về merchant đang đăng nhập không
        const book = await Book.findById(req.params.bookId);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        if (book.merchantId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ success: false, message: "You can only delete your own books." });
        }

        const deletedBook = await Book.findByIdAndDelete(req.params.bookId);
        res.status(200).json({ success: true, message: "Book deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const searchBooks = async (req, res) => {
    const { query } = req.query;

    try {
        const books = await Book.find({
            merchantId: req.user.userId, // Chỉ tìm sách của merchant đang đăng nhập
            $or: [
                { bookTitle: { $regex: query, $options: 'i' } },
                { bookType: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } },
                { publisher: { $regex: query, $options: 'i' } },
                { supplier: { $regex: query, $options: 'i' } }
            ]
        });

        res.status(200).json({
            success: true,
            books,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
