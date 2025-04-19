import Order from "../models/order.model.js"; 
import Cart from "../models/cart.model.js"; 
import axios from "axios";

export const createOrder = async (req, res) => {
    try {
        const { cartId, merchantId } = req.body; // Lấy thông tin từ request
        const userId = req.user.userId; // Lấy userId từ thông tin xác thực

        // Bước 1: Lấy giỏ hàng từ cartId
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Bước 2: Lọc các sản phẩm thuộc merchantId
        const filteredItems = cart.items.filter(item => item.merchantId.toString() === merchantId);
        if (filteredItems.length === 0) {
            return res.status(404).json({ message: "No items found for the specified merchant" });
        }

        // Bước 3: Lấy thông tin người dùng
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header is missing" });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Token is missing" });
        }

        console.log('token 2 \n', token)
        console.log('END token 2 \n')

        const userResponse = await axios.get(`http://localhost:5000/api/user/getUserProfile/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('TEST 2 ')

        if (!userResponse.data.success) {
            return res.status(404).json({ message: "User profile not found" });
        }

        // Lấy địa chỉ và số điện thoại
        const { address, phoneNumber, name } = userResponse.data.user;
        const userAddress = Array.isArray(address) ? address[0] : address; // Lấy địa chỉ đầu tiên
        const userPhoneNumber = Array.isArray(phoneNumber) ? phoneNumber[0] : phoneNumber; // Lấy số điện thoại đầu tiên

        // Bước 4: Tính tổng đơn hàng
        const totalAmount = filteredItems.reduce((total, item) => total + item.price * item.quantity, 0);

        // Bước 5: Tạo đơn hàng
        const newOrder = new Order({
            userId,
            items: filteredItems,
            totalAmount,
            address: userAddress,
            phoneNumber: userPhoneNumber, 
            name,
            status: 'Pending',
        });

        await newOrder.save();

        return res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getOrder = async (req, res) => { // Đảm bảo khai báo là async
    const { id } = req.params;

    try {
        const order = await Order.findById(id); // Sử dụng await trong hàm async
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}