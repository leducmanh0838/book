import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { AccountCircle, Book, MonetizationOn, DiscountSharp } from '@mui/icons-material'; // Import icon mới
import Profile from './profileMerchant';
import PromotionManage from './promotionManage';
import BusinessManage from './baManage';
import AuthMerchant from '../AuthMenu/authMerchant';
import Logout from './logOut';
import CreateBook from './createBook';
import DeleteBook from './deleteBook';
import UpdateBook from './updateBook';
import '../../css/merchant.css'

const Merchant = () => {
    const [selectedSection, setSelectedSection] = useState('account'); // Section hiện tại
    const [user, setUser] = useState(null); // Khởi tạo state cho user

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user')); // Lấy thông tin người dùng từ localStorage
        if (storedUser) {
            setUser(storedUser); // Cập nhật state user
        }
    }, []);

    // Kiểm tra xem người dùng có phải là merchant không
    if (!user || user.role !== 'merchant') {
        return <Typography paragraph>Unauthorized access. Please log in as a merchant.</Typography>;
    }    

    const handleListItemClick = (section) => {
        setSelectedSection(section); // Cập nhật section hiện tại
    };

    // Render nội dung tương ứng với section đã chọn
    const renderContent = () => {
        switch (selectedSection) {
            case 'account':
                return <Profile />;
            case 'create book': 
                return <CreateBook />;
            case 'delete book': 
                return <DeleteBook />;  
            case 'update book': 
                return <UpdateBook />;                                
            case 'promotion create': 
                return <PromotionManage />;
            case 'business manage': 
                return <BusinessManage />;
            case 'logout':
                return <Logout />;
            default:
                return <Typography paragraph>Welcome to your merchant dashboard!</Typography>;
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <AppBar position="fixed" style={{ zIndex: 1202 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        {user ? `Welcome, ${user.name}` : 'Merchant Dashboard'}
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
                    <ListItem button onClick={() => handleListItemClick('create book')}>
                        <ListItemIcon><Book /></ListItemIcon> {/* Sử dụng icon sách */}
                        <ListItemText primary="Tạo sách" />
                    </ListItem>
                    <ListItem button onClick={() => handleListItemClick('delete book')}>
                        <ListItemIcon><Book /></ListItemIcon> {/* Sử dụng icon sách */}
                        <ListItemText primary="Xóa sách" />
                    </ListItem> 
                    <ListItem button onClick={() => handleListItemClick('update book')}>
                        <ListItemIcon><Book /></ListItemIcon> {/* Sử dụng icon sách */}
                        <ListItemText primary="Cập nhập sách" />
                    </ListItem>                                            
                    <ListItem button onClick={() => handleListItemClick('promotion create')}>
                        <ListItemIcon><DiscountSharp /></ListItemIcon> {/* Sử dụng icon phiếu giảm giá */}
                        <ListItemText primary="Quản lý giảm giá" />
                    </ListItem>                  
                    <ListItem button onClick={() => handleListItemClick('business manage')}>
                        <ListItemIcon><MonetizationOn /></ListItemIcon>
                        <ListItemText primary="Quản lý doanh thu" />
                    </ListItem>
                    {/* Thêm AuthSignIn ở đây nếu cần */}
                    <AuthMerchant />
                </List>
            </Drawer>
            <main style={{ flexGrow: 1, padding: 16 }}>
                <Toolbar />
                {renderContent()} {/* Hiển thị nội dung tương ứng với mục đã chọn */}
            </main>
        </div>
    );
}

export default Merchant;
