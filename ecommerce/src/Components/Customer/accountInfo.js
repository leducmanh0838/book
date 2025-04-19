import React, { useContext,  useState, useEffect } from 'react';
import { TextField, Button, CircularProgress } from '@mui/material';
import {AuthContext}  from '../Context/authContext';
import axios from 'axios';
import Cookies from 'js-cookie';

const AccountInfo = () => {
    const { user,setUser, loading } = useContext(AuthContext); // Lấy thông tin người dùng và trạng thái loading
    const [isEditing, setIsEditing] = useState(false); // Trạng thái để xác định có đang chỉnh sửa không
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        address: '',
        phoneNumber: '',
    });

    // Đặt giá trị mặc định cho userInfo khi người dùng được lấy
    useEffect(() => {
        if (user) {
            setUserInfo({
                name: user.name || '',
                email: user.email || '',
                address: user.address || '',
                phoneNumber: user.phoneNumber || '',
            });
        }
    }, [user]); // Chạy lại khi user thay đổi

    const handleEditProfile = async () => {
        if (isEditing) {
            const token = localStorage.getItem('token'); // Hoặc phương thức bạn sử dụng để lưu trữ token

            if (!token) {
                console.error('Không có token. Không thể thực hiện yêu cầu.');
                return;
            }

            const userId = user._id; // Lấy ID người dùng từ context

            try {
                // Gọi API để cập nhật thông tin người dùng
                const response = await axios.put(`http://localhost:5000/api/user/updateProfile/${userId}`, userInfo, {
                    headers: {
                        Authorization: `Bearer ${token}` // Gửi token trong header
                    }
                });

                console.log('Thông tin người dùng đã được cập nhật:', response.data.user);
                // Cập nhật cookie với thông tin người dùng mới
                Cookies.set('user', JSON.stringify(response.data.user)); // Lưu thông tin người dùng vào cookie
                
                // Cập nhật thông tin người dùng trong AuthContext
                setUser(response.data.user); // Cập nhật user trong context

            } catch (error) {
                console.error('Lỗi khi cập nhật thông tin người dùng:', error);
            }
        }
        setIsEditing(!isEditing); // Đảo ngược trạng thái chỉnh sửa
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevInfo) => ({ ...prevInfo, [name]: value })); // Cập nhật thông tin người dùng
    };

    if (loading) {
        return <CircularProgress />; // Hiển thị loading khi đang tải dữ liệu
    }

    if (!user) {
        return <div>Không tìm thấy thông tin người dùng.</div>; // Thông báo nếu không có thông tin người dùng
    }

    return (
        <div>
            <h2>Tài khoản của bạn</h2>
            <TextField
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                name="name"
                value={userInfo.name}
                onChange={handleChange}
                disabled={!isEditing} // Bỏ khóa trường nếu không đang chỉnh sửa
            />
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                name="email"
                value={userInfo.email}
                onChange={handleChange}
                disabled={!isEditing} // Bỏ khóa trường nếu không đang chỉnh sửa
            />
            <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                margin="normal"
                name="phoneNumber"
                value={userInfo.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing} // Bỏ khóa trường nếu không đang chỉnh sửa
            />
            <TextField
                label="Address"
                variant="outlined"
                fullWidth
                margin="normal"
                name="address"
                value={userInfo.address}
                onChange={handleChange}
                disabled={!isEditing} // Bỏ khóa trường nếu không đang chỉnh sửa
            />
        
            <Button variant="contained" color="primary" onClick={handleEditProfile}>
                {isEditing ? 'Save Profile' : 'Edit Profile'}
            </Button>
        </div>
    );
};

export default AccountInfo;