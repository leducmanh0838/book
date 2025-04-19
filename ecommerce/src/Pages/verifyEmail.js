import React, { useState, useContext, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { MyContext } from "../App";
import { Link } from "react-router-dom";

const VerifyEmail = () => {
    const context = useContext(MyContext);

    const [verificationCode, setVerificationCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        context.setIsHeaderFooterShow(false);
      }, [context]);

    // Hàm xử lý khi nhấn
    const handleSignIn = (e) => {
        e.preventDefault(); // Ngăn chặn reload trang
        setErrorMessage('');
        setSuccessMessage('');

        // Kiểm tra định dạng mã xác thực (6 ký tự số và chữ)
        const codeRegex = /^[a-zA-Z0-9]{6}$/; // Định dạng 6 ký tự số và chữ
        if (!codeRegex.test(verificationCode)) {
            setErrorMessage("Mã xác thực không hợp lệ. Vui lòng nhập 6 ký tự bao gồm số hoặc chữ.");
            return;
        }

        // Logic xử lý mã xác thực, ví dụ gọi API
        // ...

        // Giả sử kiểm tra thành công
        setSuccessMessage("Xác thực thành công!");
    };

    return (
        <section className="section signInPage">
            <div className="container">
                <div className="box card p-3 shadow border-0">
                    <div className="text-center"></div>
                    
                    <form onSubmit={handleSignIn}>
                        <h2 className="custom-font">Verify Email</h2>
 
                        <div className="form-group mt-3">
                            <TextField
                                id="outlined-verify-input"
                                label="Verification Code"
                                type="text" // Thay đổi type thành text để nhập ký tự
                                autoComplete="off"
                                className="w-100"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)} // Cập nhật state mã xác thực
                            />
                        </div>

                        {/* Hiển thị thông báo lỗi hoặc thành công */}
                        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
 
                        <Button type="submit" className="w-100 mt-3"><Link to="/signin" className="link-button">Verify</Link></Button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default VerifyEmail;