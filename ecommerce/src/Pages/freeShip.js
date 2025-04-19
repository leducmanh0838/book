import React from 'react';
import '../css/freeShip.css';

const FreeshipPage = () => {
  return (
    <section className="freeship-page">
      <div className="container">
        <div className="freeship-content">
          <h1 className="freeship-title">Dịch vụ Freeship</h1>
          <p className="freeship-description">
            Với dịch vụ Freeship của chúng tôi, bạn có thể mua sắm thoải mái mà không lo về phí giao hàng! 
            Đơn hàng của bạn sẽ được giao đến tận nơi mà không mất phí.
          </p>
          <p className="freeship-terms">
            * Điều kiện áp dụng: Đơn hàng từ 200.000 VNĐ trở lên.
          </p>
        </div>
        <div className="freeship-animation">
        <img 
            src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXZkcnZnZWs5OHgwNTNhc3Vwa3VrcDR4cWJtc3d6enFucTBxeGlwZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LP5BIhoTTyn8kgmo0Y/giphy.webp" 
            alt="Delivery Animation" 
            style={{ width: '30%', height: 'auto' }} 
        />
        </div>
      </div>
    </section>
  );
};

export default FreeshipPage;