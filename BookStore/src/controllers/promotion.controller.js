import Promotion from "../models/promotion.model.js";

export const createPromotion = async (req, res) => {
    try {
        const { code, discount, validFrom, validTo } = req.body;

        const newPromotion = new Promotion({
            code,
            discount,
            validFrom,
            validTo,
            merchantId: req.user.userId, // Lấy merchantId từ token của merchant đã đăng nhập
        });

        const savedPromotion = await newPromotion.save();
        res.status(201).json({ success: true, message: "Promotion created successfully", promotion: savedPromotion });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Lấy tất cả khuyến mãi của Merchant
export const getAllPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.find({ merchantId: req.user.userId});
        res.status(200).json({
            success: true,
            promotions,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Cập nhật khuyến mãi
export const updatePromotion = async (req, res) => {
    const { promotionId } = req.params;
    const updates = req.body;

    try {
        const promotion = await Promotion.findByIdAndUpdate(promotionId, updates, { new: true, runValidators: true });
        if (!promotion) {
            return res.status(404).json({ success: false, message: "Promotion not found" });
        }
        res.status(200).json({
            success: true,
            message: "Promotion updated successfully",
            promotion,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Xóa khuyến mãi
export const deletePromotion = async (req, res) => {
    const { promotionId } = req.params;

    try {
        const promotion = await Promotion.findByIdAndDelete(promotionId);
        if (!promotion) {
            return res.status(404).json({ success: false, message: "Promotion not found" });
        }
        res.status(200).json({
            success: true,
            message: "Promotion deleted successfully",
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};