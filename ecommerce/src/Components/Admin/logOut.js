import React, { useContext } from 'react';
import MyContext from '../../App';
import { Button } from '@mui/material';

const Logout = () => {
    const context = useContext(MyContext);

    const handleLogout = () => {
        // Thực hiện logic đăng xuất, ví dụ: xóa token, chuyển hướng
        context.setUser(null); // Xóa thông tin người dùng trong context
        console.log("User logged out");
        window.location.href = '/login'; // Chuyển hướng về trang đăng nhập
    };

    return (
        <div>
            <h2>Logout</h2>
            <Button variant="contained" color="secondary" onClick={handleLogout}>
                Đăng xuất
            </Button>
        </div>
    );
};

export default Logout;