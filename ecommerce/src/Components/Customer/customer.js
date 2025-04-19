import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { AccountCircle, ShoppingCart, Favorite, RateReview, History } from '@mui/icons-material';
import Logout from './logOut';
import MyComment from './myComment';
import Wishlist from './wishList';
import Orders from './order';
import AccountInfo from './accountInfo';
import PurchaseHistory from './purchaseHistory'; 
import AuthSignIn from '../AuthMenu/authUser';

const Customer = ()=>{
    const [selectedSection, setSelectedSection] = useState('account'); // Section hiện tại
    const [user, setUser] = useState(null); // Khởi tạo state cho user

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user')); // Lấy thông tin người dùng từ localStorage
        if (storedUser) {
            setUser(storedUser); // Cập nhật state user
        }
    }, []);

    const handleListItemClick = (section) => {
        setSelectedSection(section); // Cập nhật section hiện tại
    };

    // Render nội dung tương ứng với section đã chọn
    const renderContent = () => {
        switch (selectedSection) {
            case 'account':
                return <AccountInfo />;
            case 'orders':
                return <Orders />;
            case 'wishlist':
                return <Wishlist />;
            case 'reviews':
                return <MyComment />;
            case 'purchaseHistory':
                return <PurchaseHistory />;
            case 'logout':
                return <Logout />;
            default:
                return <Typography paragraph>Welcome to your account dashboard!</Typography>;
        }
    };    
    return(
        <div style={{ display: 'flex' }}>
            <AppBar position="fixed" style={{ zIndex: 1202 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" >
                    {user ? `Welcome, ${user.name}` : 'User Dashboard'} 
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Toolbar />
                <Divider />
                <List>
                    <ListItem button onClick={() => handleListItemClick('account')}>
                        <ListItemIcon><AccountCircle /></ListItemIcon>
                        <ListItemText primary="Tài khoản" />
                    </ListItem>
                    <ListItem button onClick={() => handleListItemClick('orders')}>
                        <ListItemIcon><ShoppingCart /></ListItemIcon>
                        <ListItemText primary="Đơn hàng" />
                    </ListItem>
                    <ListItem button onClick={() => handleListItemClick('wishlist')}>
                        <ListItemIcon><Favorite /></ListItemIcon>
                        <ListItemText primary="Đã thích" />
                    </ListItem>
                    <ListItem button onClick={() => handleListItemClick('reviews')}>
                        <ListItemIcon><RateReview /></ListItemIcon>
                        <ListItemText primary="Đánh giá của tôi" />
                    </ListItem>
                    <ListItem button onClick={() => handleListItemClick('purchaseHistory')}>
                        <ListItemIcon><History /></ListItemIcon>
                        <ListItemText primary="Lịch sử mua hàng" />
                    </ListItem>
                    {/* Thêm AuthSignIn ở đây */}
                    <AuthSignIn />
                </List>
            </Drawer>
            <main style={{ flexGrow: 1, padding: 16 }}>
                <Toolbar />
                {renderContent()} {/* Hiển thị nội dung tương ứng với mục đã chọn */}
            </main>
        </div>
    )
}
export default Customer;