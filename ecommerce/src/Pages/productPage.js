import { Button } from "@mui/material";
import saleBFImg from "../assets/images/free.png";
import { ImPointUp } from "react-icons/im";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useEffect, useState } from 'react';
import ProductItem from "../Components/Product/productItem";
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import '../css/productItems.css';
import Pagination from '@mui/material/Pagination';
import '../css/productPage.css';

const ProductPage = () => {
  const [books, setBooks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const openDropdown = Boolean(anchorEl);
  const [sortOption, setSortOption] = useState("popular");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const location = useLocation(); 
  const query = new URLSearchParams(location.search).get('query');
  const supplier = new URLSearchParams(location.search).get('supplier');
  const category = new URLSearchParams(location.search).get('category');
  const publisher = new URLSearchParams(location.search).get('publisher');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let url = 'http://localhost:5000/api/search/getAll';

        if (query) {

          url = 'http://localhost:5000/api/user/search';
        } 
        else if (supplier) {

          url = `http://localhost:5000/api/supplier/${supplier}`;
        } 
        else if (category) {

          url = `http://localhost:5000/api/category/${category}`;
        } 
        else if (category) {

          url = `http://localhost:5000/api/publisher/${publisher}`;
        }

        const response = await axios.get(url, {
          params: { query, supplier, category, publisher }
        });
        setBooks(response.data);
      } catch (error) {
        console.error('There was an error fetching the books!', error);
      }
    };

    fetchBooks();
  }, [query,supplier, category, publisher]);

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

            <div className="productGrid">
              {displayBooks.map((book) => (
                <Link key={book._id} to={`/product/${book._id}`}>
                  <ProductItem book={book} /> 
                </Link>
              ))}
            </div>

            <div className="pagination-container">
              <Pagination
                count={Math.ceil(sortedBooks().length / itemsPerPage)}
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

export default ProductPage;