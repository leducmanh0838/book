import React, {useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import SearchBox from "./searchBox";
import { Button } from "@mui/material";
import { FaRegUser } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { GoHome } from "react-icons/go";
import FavoriteIcon from '@mui/icons-material/Favorite';
import Navigation from "../Navigation/navigation";
import { AuthContext } from "../Context/authContext";
import '../../App.css'

const Header = () => {
  const navigate = useNavigate();
  const { cartItems} = useContext(AuthContext);

  const handleListItemClick = (section) => {
    switch(section) {
        case 'account':
            navigate('/customer');
            break;
        case 'cart':
            navigate('/cart');
            break;
            case 'home':
              navigate('/');
              break;            

        default:
            break;
    }
  };
  return (
    <div className="headerWrapper">
      <div className="header">
        <div className="container">
          <div className="row align-items-center">
            <div className="logoWrapper d-flex col-sm-2">

              <Link to={"/"}>
                <img src={Logo} alt="Logo" />
              </Link>
            </div>

            <div className="col-sm-10 d-flex align-items-center justify-content-between part2">

              {/* search */}
              <SearchBox />

              {/* Home */}
              <div className="goHome" onClick={() => handleListItemClick('home')}>
                <Button className="circleHome">
                  <FavoriteIcon />
                </Button>
              </div>

              {/* account */}
              <div className="part3 d-flex align-items-center" onClick={() => handleListItemClick('account')}>
                <Button className="circleUser">
                  <FaRegUser />
                </Button>
                <span className="account-text">Tài khoản</span>
              </div>

              {/* cart */}
              <div className="cartTab" onClick={() => handleListItemClick('cart')}>
                <Button className="circleCart">
                  <AiOutlineShoppingCart />
                </Button>
                <span className="count d-flex align-items-center justify-content-center">
                  {cartItems.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Navigation></Navigation>
    </div>
  );
};

export default Header;
