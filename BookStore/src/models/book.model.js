import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    bookType: {
        type: String,
        required: true,
    },
    bookTitle: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    publisher: {
        type: String,
        required: true,
    },
    discountCode: {
        type: String,
        default: null,
    },
    supplier: {
        type: String,
        required: true,
    },
    stockQuantity: {
        type: Number,
        required: true,
        default: 1,
    },
    description: {
        type: String,
        required: false,
    },
    ratingStars: {
        type: Number,
        default: 5, 
    },
    totalComments: {
        type: Number,
        default: 0, // Mặc định là 0 comment
    },
    bookImage: { 
        type: String,
        required: true
    },
    author: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: true, // Thể loại chính
    },
    subCategory: {
        type: String,
        required: false, // Thể loại phụ
    },
    publicationDate: { 
        type: Date,
        required: false,
    },
    pageCount: {
        type: Number,
        required: true, 
        default: 100,
    },
    merchantId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Merchant' },
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
export default Book;