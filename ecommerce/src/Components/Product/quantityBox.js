import React from 'react';

const QuantityBox = ({ quantity, onUpdateQuantity }) => {
    const handleChange = (e) => {
        const newQuantity = parseInt(e.target.value, 10);
        if (newQuantity > 0) {
            onUpdateQuantity(newQuantity); // Gọi callback với giá trị mới
        }
    };

    return (
        <input
            type="number"
            value={quantity}
            onChange={handleChange}
            min="1"
            style={{ width: '50px', textAlign: 'center' }}
        />
    );
};

export default QuantityBox;