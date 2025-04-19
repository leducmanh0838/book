import React, { useState } from 'react';
import { FaRegHeart } from 'react-icons/fa';
import Rating from '@mui/material/Rating';

const ProductItem = ({ book }) => {
  const [isLiked, setIsLiked] = useState(false);
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  // Kiểm tra xem book có dữ liệu không
  if (!book) {
    return <p>Loading...</p>; // Hiển thị loading nếu không có dữ liệu
  }

  return (
    <div className="item productItem">
      <div className="imgWrapper">
        <img src={book.bookImage} className="w-100" alt={book.bookTitle} />
        <span className="badge badge-primary">{book.discountCode ? book.discountCode : '20%'}</span>
        <div className="actions">
          <button className="like" onClick={toggleLike}>
            {isLiked ? <FaRegHeart /> : <FaRegHeart />}
          </button>
        </div>
      </div>

      <div className="info">
        <h4 className='text-long'>{book.bookTitle}</h4>
        <span className="text-success d-block">{book.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}</span>
        <Rating className="mt-2 mb-2" name="read-only" value={book.ratingStars} readOnly size="small" />
        <div className="d-flex">
          <span className="beforePrice">{book.price.toLocaleString()} VND</span>
          <span className="afterPrice">{(book.price * 0.8).toLocaleString()} VND</span>
          {/* <span className="afterPrice ml-2">{(book.price * (1 - (parseInt(book.discountCode) / 100))).toLocaleString()} VND</span> */}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;