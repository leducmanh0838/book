import Book from "../models/book.model.js";

export const getBooksBySupplier = async (req, res) => {
    const { supplierName } = req.params;

    try {
        // Tìm sách theo nhà cung cấp
        const books = await Book.find({ supplier: supplierName });

        if (books.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy sách nào." });
        }

        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by supplier", error });
    }
};

export const getBooksByPublisher = async (req, res) => {
    const { publisherName } = req.params;

    try {
        const books = await Book.find({ publisher: publisherName });

        if (books.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy sách nào." });
        }

        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by publisher", error });
    }
};

export const getBooksByCategory = async (req, res) => {
    const { categoryName } = req.params;

    try {
        const books = await Book.find({ category: categoryName });

        if (books.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy sách nào." });
        }

        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by category", error });
    }
};

export const getBooksByType = async (req, res) => {
    const { bookType } = req.params; // Lấy bookType từ URL

    try {
        const books = await Book.find({ bookType }); // Lấy tất cả sách theo loại
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by type", error });
    }
};
