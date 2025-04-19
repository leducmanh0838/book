import { useContext, useEffect, useState } from "react";
import { MyContext } from "../App";
import { Button, TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const context = useContext(MyContext);
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // Sử dụng hook useNavigate để điều hướng

    useEffect(() => {
        context.setIsHeaderFooterShow(false);
    }, [context]);

    // Hàm xử lý khi nhấn
    const handleSignIn = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        const codeRegex = /^[a-zA-Z0-9]{6}$/;
        if (!codeRegex.test(verificationCode)) {
            setErrorMessage("Mã xác thực không hợp lệ. Vui lòng nhập 6 ký tự bao gồm số hoặc chữ.");
            return;
        }

        if (password.length < 6) {
            setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    verificationToken: verificationCode,
                    newPassword: password,
                }),
            });
        
            const data = await response.json();
            if (response.ok) {
                setSuccessMessage("Đặt lại mật khẩu thành công!");
                navigate("/signin"); // Chuyển hướng đến trang Sign In
            } else {
                setErrorMessage(data.message || "Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error('Đặt lại mật khẩu thất bại:', error);
            setErrorMessage("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
        }
    }; // Đóng hàm ở đây

    return (
        <section className="section signInPage">
            <div className="container">
                <div className="box card p-3 shadow border-0">
                    <div className="text-center">
                        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                    </div>
                    
                    <form onSubmit={handleSignIn}>
                        <h2 className="custom-font">Reset Password</h2>
 
                        <div className="form-group mt-3">
                            <TextField
                                id="outlined-verify-input"
                                label="Verification Code"
                                type="text"
                                autoComplete="off"
                                className="w-100"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                            />
                        </div>
                        
                        <div className="form-group mt-3">
                            <TextField
                                id="outlined-password-input"
                                label="New Password"
                                type="password"
                                autoComplete="current-password"
                                className="w-100"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        
                        <Button type="submit" className="w-100 mt-3">Reset Password</Button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ResetPassword;