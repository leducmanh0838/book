import React from 'react';
import '../css/freeShip.css';
import { Link } from 'react-router-dom';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const VoucherPage = () => {
  return (
    <section className="freeship-page">
      <div className="container">
        <div className="freeship-content">
          <h1 className="freeship-title">Voucher</h1>
          <p className="freeship-description">
            Chương trình đại giảm giá đang diễn ra!!! <br/>
            Hãy truy cập trang web mua những cuốn sách mà bạn thích nào 
            <Link to='/cat'>
            <ShoppingBagIcon/><ShoppingBagIcon/><ShoppingBagIcon/>
            </Link>
          </p>
        </div>
        <div className="freeship-animation">
        <img 
            src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3B1MnBidDc5eXVpZW51MWhrcmRyajJ2OXV2NzdmMWk1NG9scHk1aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/EBSECypExxqvOY6Te1/giphy.webp" 
            alt="Delivery Animation" 
            style={{ width: '30%', height: 'auto' }} 
        />
        </div>
      </div>
    </section>
  );
};

export default VoucherPage;