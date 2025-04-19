import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductItem from '../Components/Product/productItem';
import saleBFImg from "../assets/images/free.png";
import Pagination from '@mui/material/Pagination';
import { Link, useParams } from 'react-router-dom'; 
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Button } from "@mui/material";
import { ImPointUp } from "react-icons/im";

const BookType = () => {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1); 
    const itemsPerPage = 10; 
    const {type } = useParams();
    const [anchorEl, setAnchorEl] = useState(null);
    const [sortOption, setSortOption] = useState("popular");
    const openDropdown = Boolean(anchorEl);
  
    // Hàm lấy dữ liệu sách từ API theo loại sách (type)
    useEffect(() => {
      const fetchBooks = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/type/${type}`);
          setBooks(response.data); // Lưu dữ liệu sách vào state
        } catch (error) {
          console.error('Error fetching books:', error);
        }
      };
  
      fetchBooks();
    }, [type]); // Khi `type` thay đổi thì gọi lại API
  

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };
    
      const handleSortChange = (option) => {
        setSortOption(option);
        setAnchorEl(null);
        setPage(1);
      };
    
      const sortedBooks = () => {
        switch (sortOption) {
          case "priceAsc":
            return [...books].sort((a, b) => a.price - b.price);
          case "priceDesc":
            return [...books].sort((a, b) => b.price - a.price);
          case "newArrivals":
            return [...books].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
          case "bestSellers":
            return [...books].sort((a, b) => b.sales - a.sales);
          default:
            return books;
        }
      };
    
      const displayBooks = sortedBooks().slice((page - 1) * itemsPerPage, page * itemsPerPage);
    
      const handleChangePage = (event, value) => {
        setPage(value);
      };
  
    return (
      <section className="productPage">
        <div className="container">
          <div className="productListing d-flex mt-3">
            <div className="content">
              {/* Banner hình ảnh */}
              <img src={saleBFImg} className="w-100" alt="sale img" style={{ borderRadius: '8px' }} />

              <div className="showBy mt-2 mb-3 d-flex">
              <div className="ml-auto showBySort">
                <Button onClick={handleClick}>Sắp xếp <ImPointUp /></Button>
                <Menu
                  className="w-100 showBySortDropdown"
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={openDropdown}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={() => handleSortChange("popular")}>Phổ biến</MenuItem>
                  <MenuItem onClick={() => handleSortChange("bestSellers")}>Bán chạy</MenuItem>
                  <MenuItem onClick={() => handleSortChange("newArrivals")}>Hàng mới</MenuItem>
                  <MenuItem onClick={() => handleSortChange("priceAsc")}>Giá thấp đến cao</MenuItem>
                  <MenuItem onClick={() => handleSortChange("priceDesc")}>Giá cao đến thấp</MenuItem>
                </Menu>
              </div>
            </div>

              {/* Grid hiển thị sách */}
              <div className="productGrid">
                {displayBooks.map((book) => (
                  <Link key={book._id} to={`/product/${book._id}`}>
                    <ProductItem book={book} /> 
                  </Link>
                ))}
              </div>
  
              {/* Phân trang */}
              <div className="pagination-container">
                <Pagination
                  count={Math.ceil(books.length / itemsPerPage)}
                  page={page}
                  onChange={handleChangePage}
                  variant="outlined"
                  color="primary"
                  sx={{ marginTop: 3 }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

export default BookType;