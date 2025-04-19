import React, { useEffect, useState } from "react";
import axios from 'axios';
import HomeBanner from "../Components/HomeBanners/banners";
import cursorImg from "../assets/imgCursor/cursor.png";
import saleImg from "../assets/imgCursor/sale.png";
import footerImg from "../assets/images/coupon.png";
import { Button } from "@mui/material";
import { FaLongArrowAltRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { LiaShippingFastSolid } from "react-icons/lia";
import { RiCoupon2Line } from "react-icons/ri";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ProductItem from "../Components/Product/productItem";
import { Link } from 'react-router-dom';

const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/search/getAll');
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <>
      <HomeBanner />

      <section className="homeProduct">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              
              <div className="banner mt-2">
                <img
                  src='https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExazFzb3FuamsxOHh3Z2piN3ExajBkaXdoaTVycHFmbXl2eDYwYzMyNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1gwsoN0LKmU29CSKrB/giphy.webp'
                  className="cursor w-100"
                  alt="sale img"
                />
              </div>
              <div className="banner mt-2">
                <img
                  src={saleImg}
                  className="cursor w-100"
                  alt="sale img"
                />
              </div>
              <div className="banner">
                <img
                  src='https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXZkcnZnZWs5OHgwNTNhc3Vwa3VrcDR4cWJtc3d6enFucTBxeGlwZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LP5BIhoTTyn8kgmo0Y/giphy.webp'
                  className="cursor w-100"
                  alt="cursor img"
                />
              </div>

            </div>

            {/* Best Sellers */}
            <div className="col-md-9 productRow">
              <div className="d-flex align-items-center">
                <div className="info w-75">
                  <h3 className="mb-0 hd">BEST SELLERS</h3>
                  <p className="light-text text-sml mb-0">
                    Bao gồm tất cả sách bán chạy nhất.
                  </p>
                </div>

                <Button className="viewAllButton">
                  View All <FaLongArrowAltRight />{" "}
                </Button>
              </div>

              <div className="productRows w-100 mt-4">
                <Swiper
                  slidesPerView={4}
                  spaceBetween={5}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Navigation]}
                  className="mySwiper"
                >
                  {books.map(book => (
                    <SwiperSlide key={book._id}>
                      <Link to={`/product/${book._id}`}>
                        <ProductItem book={book} /> 
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Products Section */}
              <div className="d-flex align-items-center mt-5">
                <div className="info w-75">
                  <h3 className="mb-0 hd">BOOK</h3>
                  <p className="light-text text-sml mb-0">
                    Bao gồm tất cả sách.
                  </p>
                </div>

                <Button className="viewAllButton">
                  <Link to="/cat">View All <FaLongArrowAltRight /></Link>
                </Button>
              </div>

              <div className="productRows w-100 mt-4">
                <Swiper
                  slidesPerView={4}
                  spaceBetween={5}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Navigation]}
                  className="mySwiper"
                >
                  {books.map(book => (
                    <SwiperSlide key={book._id}>
                      <Link to={`/product/${book._id}`}>
                        <ProductItem book={book} /> {/* Truyền book để hiển thị thông tin */}
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="newsLetterSection mt-3 mb-3">
        <div className="container">
          <div className="row">
            <div className="col-md-100">
              <p className="text-white">Freeship cho đơn hàng từ 200k trở lên <LiaShippingFastSolid /></p>
              <p className="text-white">Voucher giảm đến 50% <RiCoupon2Line /></p>
              <h4 className="text-white">Nhà sách - Thế giới tri thức và tinh hoa nhân loại.</h4>
              <p className="text-light">Người ta thường nói “sách là một kho tàng vô giá”
                <br />vì nó chứa đựng nhiều kiến thức bổ ích của nhân loại.
                <br />Chính vì thế mà nhà sách, nơi được trưng bày hàng nghìn cuốn sách
                <br />có thể nói là một thế giới tri thức và hội tụ đủ muôn vàng tinh hoa
                <br />của các nền văn hóa khác nhau.</p>
            </div>

            <div className="col-md-6">
              <img src={footerImg} alt="book footer" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;