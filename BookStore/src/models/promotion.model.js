import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: false,
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: false,
    },
    discount: {
        type: Number,
        required: function() { return this.code !== undefined; },
    },
    validFrom: {
        type: Date,
        required: function() { return this.code !== undefined; },
    },
    validTo: {
        type: Date,
        required: function() { return this.code !== undefined; },
    },
    merchantId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Merchant' },
}, { timestamps: true });

const Promotion = mongoose.model("Promotion", promotionSchema);
export default Promotion;