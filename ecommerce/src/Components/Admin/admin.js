import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { AccountCircle  } from '@mui/icons-material'; // Import icon mới
import StorefrontIcon from '@mui/icons-material/Storefront';
import AuthMerchant from '../AuthMenu/authMerchant';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import Logout from './logOut';
import UserManagement from './customerManage';
import MerchantsManage from './merchantManage';
import NewUserForm from './newCustomer';
import NewMerchantForm from './newMerchant';
import '../../css/merchant.css'

const Admin = () => {
    const [selectedSection, setSelectedSection] = useState('account'); // Section hiện tại
    const [user, setUser] = useState(null); // Khởi tạo state cho user

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user')); // Lấy thông tin người dùng từ localStorage
        if (storedUser) {
            setUser(storedUser); // Cập nhật state user
        }
    }, []);

    // Kiểm tra xem người dùng có phải là merchant không
    if (!user || user.role !== 'admin') {
        return <Typography paragraph>Unauthorized access. Please log in as a merchant.</Typography>;
    }    

    const handleListItemClick = (section) => {
        setSelectedSection(section); // Cập nhật section hiện tại
    };

    // Render nội dung tương ứng với section đã chọn
    const renderContent = () => {
        switch (selectedSection) {
            case 'user manage':
                return <UserManagement />;
            case 'create user': 
                return <NewUserForm />;
            case 'merchant manage': 
                return <MerchantsManage />;  
            case 'create merchant': 
                return <NewMerchantForm />;                                
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
                        {user ? `Welcome, ${user.name}` : 'Admin Dashboard'}
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
                    <ListItem button onClick={() => handleListItemClick('create user')}>
                        <ListItemIcon><AccountCircle /></ListItemIcon> {/* Sử dụng icon sách */}
                        <ListItemText primary="Tạo mới Khách Hàng" />
                    </ListItem>

                    <ListItem button onClick={() => handleListItemClick('create merchant')}>
                        <ListItemIcon><AddBusinessIcon /></ListItemIcon> {/* Sử dụng icon sách */}
                        <ListItemText primary="Tạo mới Đối Tác" />
                    </ListItem>                    

                    <ListItem button onClick={() => handleListItemClick('user manage')}>
                        <ListItemIcon><AccountCircle /></ListItemIcon>
                        <ListItemText primary="Quản lý Khách Hàng" />
                    </ListItem>

                    <ListItem button onClick={() => handleListItemClick('merchant manage')}>
                        <ListItemIcon><StorefrontIcon  /></ListItemIcon> {/* Sử dụng icon sách */}
                        <ListItemText primary="Quản lý Đối Tác" />
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

export default Admin;