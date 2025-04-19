import Book from "../models/book.model.js";

// Hàm lấy sách theo ID
export const getBookById = async (req, res) => {
  const { bookId } = req.params;

  try {
      const book = await Book.findById(bookId); // Tìm sách theo ID
      if (!book) {
          return res.status(404).json({ message: 'Book not found' });
      }
      res.status(200).json(book);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching book data', error });
  }
};

export const getAllBooks = async (req, res) => {
  try {
      const books = await Book.find({});
      res.json(books);
  } catch (error) {
      res.status(500).json({ message: "Error fetching books", error });
  }
};
  
export const getCategory = async (req, res) => {
  try {
      // Lấy tất cả sách
      const books = await Book.find({});
      
      // Lấy danh sách danh mục, nhà xuất bản và nhà cung cấp
      const category = [...new Set(books.map(book => book.category))]; 
      const publishers = [...new Set(books.map(book => book.publisher))];
      const suppliers = [...new Set(books.map(book => book.supplier))]; 

      res.status(200).json({ category, publishers, suppliers });
  } catch (error) {
      res.status(500).json({ message: "Error fetching data", error });
  }
};