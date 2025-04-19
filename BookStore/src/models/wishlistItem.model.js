import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
    },
    wishlistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wishlist",
        required: true,
    },
}, { timestamps: true });

const WishlistItem = mongoose.model("WishlistItem", wishlistItemSchema);

export default WishlistItem;