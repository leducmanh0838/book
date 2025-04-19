import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PromotionManage = ()=>{
    const [promotions, setPromotions] = useState([]); // Danh sách khuyến mãi
    const [promotionData, setPromotionData] = useState({
        code: '',
        discount: 0,
        validFrom: '',
        validTo: ''
    }); // Dữ liệu khuyến mãi đang tạo hoặc chỉnh sửa
    const [editingPromotion, setEditingPromotion] = useState(null); // Khuyến mãi đang chỉnh sửa
    const [error, setError] = useState(null); // Xử lý lỗi

    const fetchPromotions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/promotion/getAllPromotions', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPromotions(response.data.promotions);
            clearError(); // Xóa lỗi nếu thành công
        } catch (error) {
            setError(error.response?.data?.message || 'Error fetching promotions');
        }
    };
    // Lấy tất cả khuyến mãi khi component được render
    useEffect(() => {
        fetchPromotions();
    }, []);

    const clearError = () => {
        setError(null);
    };

    // Tạo khuyến mãi mới
    const handleCreatePromotion = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/promotion/createPromotion', {
                code: promotionData.code,
                discount: promotionData.discount,
                validFrom: promotionData.validFrom,
                validTo: promotionData.validTo
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPromotions([...promotions, response.data.promotion]);
            setPromotionData({
                code: '',
                discount: 0,
                validFrom: '',
                validTo: ''
            }); // Reset form
            clearError(); // Xóa lỗi nếu thành công
        } catch (error) {
            setError(error.response?.data?.message || 'Error creating promotion');
        }
    };

    // Cập nhật khuyến mãi
    const handleUpdatePromotion = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/promotion/updatePromotion/${editingPromotion._id}`, {
                code: promotionData.code,
                discount: promotionData.discount,
                validFrom: promotionData.validFrom,
                validTo: promotionData.validTo
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPromotions(promotions.map(promo => promo._id === editingPromotion._id ? response.data.promotion : promo));
            setEditingPromotion(null);
            setPromotionData({
                code: '',
                discount: 0,
                validFrom: '',
                validTo: ''
            }); // Reset form
            clearError(); // Xóa lỗi nếu thành công
        } catch (error) {
            setError(error.response?.data?.message || 'Error updating promotion');
        }
    };

    // Xóa khuyến mãi
    const handleDeletePromotion = async (promotionId) => {
        try {
            await axios.delete(`http://localhost:5000/api/promotion/deletePromotion/${promotionId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPromotions(promotions.filter(promo => promo._id !== promotionId));
            clearError(); // Xóa lỗi nếu thành công
        } catch (error) {
            setError(error.response?.data?.message || 'Error deleting promotion');
        }
    };

    // Xử lý thay đổi dữ liệu form (cho cả tạo và cập nhật)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPromotionData({
            ...promotionData,
            [name]: value
        });
        clearError(); // Xóa lỗi khi người dùng thay đổi dữ liệu
    };

    // Đưa dữ liệu khuyến mãi vào form để chỉnh sửa
    const handleEditPromotion = (promotion) => {
        setEditingPromotion(promotion);
        setPromotionData({
            code: promotion.code,
            discount: promotion.discount,
            validFrom: promotion.validFrom,
            validTo: promotion.validTo
        });
        clearError(); // Xóa lỗi khi bắt đầu chỉnh sửa
    };

    return (
        <div className="promotion-manage">
            <h3 className="promotion-manage__title">Quản lý khuyến mãi</h3>
            
            <div className="promotion-manage__form">
                <input
                    className="promotion-manage__input"
                    type="text"
                    name="code"
                    value={promotionData.code}
                    onChange={handleInputChange}
                    placeholder="Mã khuyến mãi"
                />
                <input
                    className="promotion-manage__input"
                    type="number"
                    name="discount"
                    value={promotionData.discount}
                    onChange={handleInputChange}
                    placeholder="Giảm giá (%)"
                />
                <input
                    className="promotion-manage__input"
                    type="date"
                    name="validFrom"
                    value={promotionData.validFrom}
                    onChange={handleInputChange}
                    placeholder="Ngày bắt đầu"
                />
                <input
                    className="promotion-manage__input"
                    type="date"
                    name="validTo"
                    value={promotionData.validTo}
                    onChange={handleInputChange}
                    placeholder="Ngày kết thúc"
                />
                {editingPromotion ? (
                    <button className="promotion-manage__button" onClick={handleUpdatePromotion}>Cập nhật khuyến mãi</button>
                ) : (
                    <button className="promotion-manage__button" onClick={handleCreatePromotion}>Tạo khuyến mãi</button>
                )}
            </div>

            {error && <p className="promotion-manage__error">{error}</p>}

            <ul className="promotion-manage__list">
                {promotions.map(promotion => (
                    <li className="promotion-manage__item" key={promotion._id}>
                        <h4 className="promotion-manage__item-title">{promotion.code} - Giảm {promotion.discount}%</h4>
                        <button className="promotion-manage__edit-button" onClick={() => handleEditPromotion(promotion)}>Chỉnh sửa</button>
                        <button className="promotion-manage__delete-button" onClick={() => handleDeletePromotion(promotion._id)}>Xóa</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PromotionManage;