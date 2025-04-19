import { useState, useEffect } from 'react';
import Rating from "@mui/material/Rating";
import QuantityBox from "../Components/Product/quantityBox";
import { BsCart3 } from "react-icons/bs";
import { FaRegHeart,FaHeart } from "react-icons/fa";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../css/productDetail.css';

const ProductDetail = () => {
  const { bookId } = useParams(); // Lấy bookId từ URL
  const [bookData, setBookData] = useState(null); // Dữ liệu sách
  const [quantity, setQuantity] = useState(1); // Số lượng mặc định là 1
  const [isLiked, setIsLiked] = useState(false); // Trạng thái thích
  const [rating, setRating] = useState(0); // Điểm đánh giá
  const [comment, setComment] = useState(''); // Bình luận người dùng
  const [comments, setComments] = useState([]); // Bình luận của người khác

  // Lấy dữ liệu sách và merchantId từ bookData
  const merchantId = bookData?.merchantId;
  const bookName = bookData?.title; // Giả sử bạn có trường "title" trong dữ liệu sách
  const price = bookData?.price;

  // Hàm xử lý khi nhấn nút submit đánh giá
  const handleSubmit = () => {
    console.log('Đánh giá của bạn là:', rating); // Sử dụng rating thay vì value
    console.log('Bình luận của bạn là:', comment);
    setRating(0);
    setComment('');
    // Có thể gọi API để gửi đánh giá và bình luận ở đây
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/search/getBook/${bookId}`);
        console.log('Fetched book data:', response.data);
        setBookData(response.data);
        // Giả sử bạn cũng có thể lấy bình luận từ API
        // setComments(response.data.comments || []); // Nếu dữ liệu sách cũng có comments
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchBookData();
  }, [bookId]);

  if (!bookData) {
    return <p>Loading...</p>; // Hiển thị loading khi đang tải dữ liệu
  }

  // Hàm xử lý khi nhấn vào nút "Thêm vào giỏ hàng"
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      if (!token) {
        alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
        return;
      }
      
      const response = await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          bookId,
          quantity,
          merchantId,
          bookName,
          price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token JWT để xác thực
          },
        }
      );

      if (response.status === 200) {
        alert("Sản phẩm đã được thêm vào giỏ hàng thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      console.error("Lỗi khi thêm vào giỏ hàng:", error.response ? error.response.data : error.message);
    }
  };

  return (
      <>
        <section className="productDetail section">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <img src={bookData.bookImage} alt={bookData.bookTitle}></img>
                <div className="product-info">
                  <table className="info-table">
                    <tbody>
                      <tr>
                        <td className="publisher-label">Nhà cung cấp:</td>
                        <td className="publisher-value">{bookData.supplier}</td>
                      </tr>
                      <tr>
                        <td className="publisher-label">Nhà xuất bản:</td>
                        <td className="publisher-value">{bookData.publisher}</td>
                      </tr>
                      <tr>
                        <td className="publisher-label">Ngày xuất bản:</td>
                        <td className="publisher-value">{bookData.publishDate}</td> 
                      </tr>
                      <tr>
                        <td className="publisher-label">Số trang sách:</td>
                        <td className="publisher-value">{bookData.pageCount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
  
              <div className="col-md-7">
                <h4 className="hd text-capitalize">{bookData.bookTitle}</h4>
                <ul className="list list-inline d-flex align-items-center">
                  <li className="list-inline-item">
                    <div className="d-flex align-items-center">
                      <Rating name="read-only" value={bookData.ratingStars} readOnly precision={0.5} />
                      <span className="publisher-value cursor ml-2">{comments.length} bình luận</span>
                    </div>
                  </li>
                </ul>
  
                <div className="info mb-1">
                  <span className="afterPrice text-danger">
                  {(bookData.price * 0.8).toLocaleString()} VND
                  </span>
                </div>
  
                <span className="text-success">Còn hàng 
                  <button className="like" onClick={toggleLike} aria-label="Toggle like">
                  {isLiked ? <FaHeart style={{ color: 'red', fontSize: '20px' }} /> : <FaRegHeart style={{ fontSize: '20px' }} />}
                  </button>
                </span>
                
                <h6 className="mt-2">Tóm tắt nội dung:</h6>
                <p className="mt-2">{bookData.description}</p>
  
                <div className='product-info'>
                  <span className="publisher-label mr-2">{bookData.totalSales}</span>
                  <span className="publisher-value">lượt mua</span> 
                </div>
  
                <div className="d-flex align-items-center mt-3">
                <QuantityBox
                  quantity={quantity}
                  onUpdateQuantity={(newQuantity) => setQuantity(newQuantity)}
                />
                  <button className="btn-bule" onClick={handleAddToCart}>Thêm vào <BsCart3 /></button>
                </div>
  
                <div className="comment-section">
                  <div className="comment-input">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Viết bình luận của bạn..."
                    />
                  </div>
  
                  <div className="rating">
                    <Rating
                      name="user-rating"
                      value={rating}  // Thay 'value' bằng 'rating'
                      onChange={(event, newValue) => {
                        setRating(newValue);  // Thay 'setValue' bằng 'setRating'
                      }}
                      precision={0.5}
                    />
                    <button onClick={handleSubmit}>Đánh giá</button>
                  </div>
  
                  <div className="comments-list mt-3">
                    {comments.map((item, index) => (
                      <div key={index} className="comment-item d-flex align-items-center mb-2">
                        <img src={item.userIcon} alt="User Icon" className="comment-user-icon" />
                        <div className="comment-content">
                          <p className="comment-user-name">{item.userName}</p>
                          <p className="comment-text">{item.text}</p>
                          <Rating name="read-only" value={item.rating} readOnly precision={0.5} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>                 
            </div>
          </div>
        </section>
      </>
    );
  };
  
  export default ProductDetail;