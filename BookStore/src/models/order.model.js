import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    bookName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Merchant có thể là User
    merchantName: { type: String, required: true },
    bookImage: { type: String, required: false }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    name: { type: String, required: true },
    paymentMethod: { type: String, required: false },
    status: { type: String, default: 'Pending' },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;