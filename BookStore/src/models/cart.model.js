import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            bookId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book",
                required: true,
            },
            bookName: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
            merchantId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Merchant",
                required: true,
            },
            merchantName: {
                type: String,
                required: true,
            },
            bookImage: {
                type: String,
                required: false,
            }
        }
    ],
    merchantTotals: [
        {
            merchantId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Merchant",
                required: true,
            },
            merchantName: {
                type: String,
                required: true,
            },
            total: {
                type: Number,
                required: true,
                default: 0,
            }
        }
    ],
}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;