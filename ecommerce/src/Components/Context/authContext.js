import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Box } from '@mui/material';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);

    const login = async (userData) => {
        try {
            // Gọi API để xác thực thông tin đăng nhập
            const response = await axios.post('http://localhost:5000/api/user/login', userData);
            const { token, user } = response.data; // Giả sử API trả về token và user
            localStorage.setItem('token', token); // Lưu token vào localStorage
            setUser(user); // Cập nhật user
            setUserLoggedIn(true);
        } catch (error) {
            console.error('Đăng nhập thất bại:', error);
            setUser(null);
            setUserLoggedIn(false);
        }
    };

    // Hàm đăng xuất
    const logout = () => {
        localStorage.removeItem('token'); // Xóa token
        setUser(null); // Xóa user
        setUserLoggedIn(false);
    };
    
    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token);
            if (!token) {
                throw new Error('Token not found');
            }
    
            // Giải mã token để lấy userId
            const decodedToken = jwtDecode(token);
            console.log('Decoded token:', decodedToken);
            const userId = decodedToken.userId; // Sử dụng userId từ token
    
            if (!userId) {
                throw new Error('UserId not found in token');
            }
    
            const url = `http://localhost:5000/api/user/getUserProfile/${userId}`;
            console.log('Fetching user profile from:', url); // Log URL
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(response.data.user);
            setUserLoggedIn(true);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setUser(null);
            setUserLoggedIn(false);
        } finally {
            setLoading(false);
        }
    };

    // Thêm sản phẩm vào giỏ hàng
    const addToCart = (newItem) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.bookId === newItem.bookId);
            if (existingItem) {
                // Nếu có, tăng số lượng
                return prevItems.map(item =>
                    item.bookId === newItem.bookId ? { ...item, quantity: item.quantity + newItem.quantity } : item
                );
            } else {
                // Nếu chưa có, thêm mới
                return [...prevItems, { ...newItem, quantity: newItem.quantity }];
            }
        });
    };

    // Xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    // Hàm cập nhật số lượng sản phẩm trong giỏ hàng
    const updateQuantity = (id, newQuantity) => {
        setCartItems((prevItems) =>
            prevItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
        );
    };

    // Thêm hàm updateCartItems
    const updateCartItems = (items) => {
        setCartItems(items);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserProfile(); // Gọi hàm lấy thông tin người dùng nếu có token
        } else {
            setLoading(false); // Không có token
        }
    }, []);

    return (
        <AuthContext.Provider value={{ 
            userLoggedIn, setUserLoggedIn, user, setUser, login, logout, loading,             
            cartItems, addToCart, updateQuantity, removeFromCart, setCartItems
            }}>
        {loading ? (
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh' // Chiều cao 100% viewport
                }}
            >
                <CircularProgress variant="indeterminate" />
            </Box>
        ) : (
            children
        )}
    </AuthContext.Provider>
    );
};