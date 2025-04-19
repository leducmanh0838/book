import React, { useContext} from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/authContext';

const AuthMerchant = () => {
    const navigate = useNavigate();
    const { userLoggedIn, setUserLoggedIn, setUser  } = useContext(AuthContext);

    const handleListItemClick = async (section) => {
        if (section === 'logout') {
            try {
                // Gọi API đăng xuất
                await axios.post('http://localhost:5000/api/auth/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                // Xóa token và cập nhật trạng thái
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null); // Xóa thông tin người dùng trong state
                setUserLoggedIn(false); // Đánh dấu là đã đăng xuất
                navigate('/signin');
                window.location.reload();
            } catch (error) {
                console.error('Error logging out:', error);
            }
        } else if (section === 'login') {
            navigate('/signin'); 
        }
    };

    return (
        <List>
            {userLoggedIn ? (
                <ListItem button onClick={() => handleListItemClick('logout')}>
                    <ListItemIcon><ExitToApp /></ListItemIcon>
                    <ListItemText primary="Đăng xuất" />
                </ListItem>
            ) : (
                <ListItem button onClick={() => handleListItemClick('login')}>
                    <ListItemIcon><ExitToApp /></ListItemIcon>
                    <ListItemText primary="Đăng nhập" />
                </ListItem>
            )}
        </List>
    );
};

export default AuthMerchant;