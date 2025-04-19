import Book from "../models/book.model.js";
import Cart from "../models/cart.model.js";
import User from "../models/user.model.js";

// Thêm sách vào giỏ hàng
export const addToCart = async (req, res) => {
    try {
        const { bookId, quantity } = req.body;
        const userId = req.user.userId;
        
        const book = await Book.findById(bookId).select('bookTitle price merchantId bookImage');

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        const merchant = await User.findById(book.merchantId).select('name');

        if (!merchant) {
            return res.status(404).json({ message: "Merchant not found" });
        }

        // Kiểm tra xem giỏ hàng đã tồn tại cho user chưa
        let cart = await Cart.findOne({ userId });

        // Nếu giỏ hàng chưa tồn tại, tạo giỏ hàng mới
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Kiểm tra xem sách đã tồn tại trong giỏ hàng chưa
        const existingItem = cart.items.find(item => item.bookId.toString() === bookId);

        if (existingItem) {
            // Nếu sách đã có trong giỏ hàng, cập nhật số lượng
            existingItem.quantity += quantity;
        } else {
            // Nếu sách chưa có, thêm mới vào giỏ hàng
            cart.items.push({
                bookId,
                bookName: book.bookTitle,  // Lấy bookTitle từ document book
                price: book.price,
                quantity,
                merchantId: book.merchantId, // Lấy merchantId từ document book
                merchantName: merchant.name,
                bookImage: book.bookImage // Lấy bookImage từ document book
            });
        }

        // Lưu giỏ hàng
        await cart.save();

        return res.status(200).json(cart);
    } catch (error) {
        console.error("Error adding to cart:", error); // Ghi log lỗi
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({ userId});
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Cập nhật giỏ hàng
export const updateCartItem = async (req, res) => {
    const { id, quantity } = req.body;
    const userId = req.user.userId;

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const existingItem = cart.items.id(id);
        if (!existingItem) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        existingItem.quantity = quantity; 
        await cart.save();

        // Trả về giỏ hàng sau khi cập nhật thành công
        res.status(200).json({ message: "Cart updated successfully", cart });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const removeItemFromCart = async (req, res) => {
    const { id } = req.body;  // Lấy itemId từ yêu cầu để xác định sản phẩm cần xóa
    const userId = req.user.userId;  // Lấy userId từ thông tin xác thực

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Tìm và loại bỏ sản phẩm khỏi giỏ hàng dựa trên _id
        cart.items = cart.items.filter(item => item._id.toString() !== id);
        await cart.save();

        res.status(200).json({ message: "Item removed from cart successfully", cart });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};