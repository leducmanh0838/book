import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { createContext, useState, useEffect, useContext } from 'react';
import Header from './Components/Header';
import Home from './Pages/home';
import Footer from './Components/Footer/footer';
import ProductPage from './Pages/productPage';
import ProductDetail from './Pages/productDetail';
import Cart from './Pages/cart';
import SignIn from './Pages/signIn';
import SignUp from './Pages/signUp';
import VerifyEmail from './Pages/verifyEmail';
import ResetPassword from './Pages/resetPassword';
import Admin from './Components/Admin/admin';
import Merchant from './Components/Merchant/merchant';
import Customer from './Components/Customer/customer';
import { AuthContext, AuthProvider } from './Components/Context/authContext';
import ParentComponent from './Components/Product/parentProduct';
import Order from './Pages/order';
import BookType from './Pages/bookType';
import FreeshipPage from './Pages/freeShip';
import VoucherPage from './Pages/voucher';
import ContactPage from './Pages/contactUs';
import ForgetPassword from './Pages/fogetPassword';


export const MyContext = createContext();

function Layout() {
  const { setUserLoggedIn, setUser } = useContext(AuthContext);
  const location = useLocation();
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup' || location.pathname === '/verify' || location.pathname === '/resetpass';
  const isCustomerPage = location.pathname === '/customer';
  const isMerchantPage = location.pathname === '/merchant';
  const isAdminPage = location.pathname === '/admin';
  // Kiểm tra xem context có được cung cấp không
  if (!setUserLoggedIn || !setUser) {
    console.error('AuthContext is not available');
  }
  return (
    <>
      {!isAuthPage && !isCustomerPage && !isMerchantPage && !isAdminPage && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/resetpass" element={<ResetPassword />} />
        <Route path="/fogetpass" element={<ForgetPassword />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/merchant" element={<Merchant />} />
        <Route path="/order" element={<Order />} />
        <Route path="/freeship" element={<FreeshipPage />} />
        <Route path="/voucher" element={<VoucherPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/books/:type" element={<BookType />} />
        <Route path="/book/:id" element={<ParentComponent />} />
        <Route path="/cat" element={<ProductPage />} />
        <Route path="/product/:bookId" element={<ProductDetail />} />
      </Routes>
      {!isAuthPage && !isCustomerPage && !isMerchantPage && !isAdminPage && <Footer />}
    </>
  );
}

function App() {
  const [isHeaderFooterShow, setIsHeaderFooterShow] = useState(true);

  const signUp = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Đăng ký thành công:', response.data);
      return response.data;
    } catch (error) {
      console.error('Đăng ký thất bại:', error);
      throw error;
    }
  };

  const signIn = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', userData);
      console.log('Đăng nhập thành công:', response.data);

      // Nếu API trả về thông tin người dùng và token, lưu vào localStorage
      if (response.data.token) {
        console.log(response.data.token); // Kiểm tra giá trị của token trước khi lưu
        localStorage.setItem('token', response.data.token); // Lưu token
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Lưu thông tin người dùng

        // Phân trang dựa trên vai trò
        const user = response.data.user;
        if (user.role === 'merchant') {
          // Điều hướng đến trang merchant
          window.location.href = '/merchant'; // Hoặc sử dụng react-router-dom
        }
        if (user.role === 'admin') {
          // Điều hướng đến trang merchant
          window.location.href = '/admin'; // Hoặc sử dụng react-router-dom
        }
        if (user.role === 'user') {
          // Điều hướng đến trang user
          window.location.href = '/'; // Hoặc sử dụng react-router-dom
        }
        setIsHeaderFooterShow(true); // Hiển thị header và footer
      }

      return response.data;
    } catch (error) {
      console.error('Đăng nhập thất bại:', error.response ? error.response.data : error.message);
      throw error; // Ném lại lỗi để có thể xử lý ở nơi gọi
    }
  };

  const verifyEmail = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-email', userData);
      console.log('Xác thực thành công:', response.data);
      return response.data;
    } catch (error) {
      console.error('Xác thực thất bại:', error);
      throw error;
    }
  };

  const resetPassword = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', userData);
      console.log('Đặt lại mật khẩu thành công:', response.data);
      return response.data;
    } catch (error) {
      console.error('Đặt lại mật khẩu thất bại:', error);
      throw error;
    }
  };

  const value = {
    setIsHeaderFooterShow,
    isHeaderFooterShow,
    signUp,
    login: signIn,
    verifyEmail,
    resetPassword,
  };

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    const token = localStorage.getItem('token');
    if (token) {
      setIsHeaderFooterShow(true); // Hiển thị header và footer nếu đã đăng nhập
    } else {
      setIsHeaderFooterShow(true); // Ẩn header và footer nếu chưa đăng nhập
    }
  }, []);
  return (

    <BrowserRouter>
      <MyContext.Provider value={value}>
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;