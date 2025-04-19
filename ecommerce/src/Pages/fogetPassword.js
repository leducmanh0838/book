import { useContext, useEffect, useState } from "react";
import { MyContext } from "../App";
import { Button, TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ForgetPassword = () => {
    const context = useContext(MyContext);
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        context.setIsHeaderFooterShow(false);
    }, [context]);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Đặt lại thông báo lỗi
        setSuccessMessage(''); // Đặt lại thông báo thành công

        try {
            const response = await fetch('http://localhost:5000/api/auth/forget-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }), // Gửi email vào body yêu cầu
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage("Code đặt lại mật khẩu đã được gửi đến email của bạn!");
                navigate('/resetpass');
            } else {
                setErrorMessage(data.message || "Có lỗi xảy ra. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error('Đặt lại mật khẩu thất bại:', error);
            setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    return (
        <section className="section signInPage">
            <div className="container">
                <div className="box card p-3 shadow border-0">
                    <div className="text-center">
                        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                    </div>
                    
                    <form onSubmit={handleSignIn}>
                        <h2 className="custom-font">Forget Password</h2>
 
                        <div className="form-group mt-3">
                            <TextField
                                id="outlined-email-input"
                                label="Email"
                                type="email"
                                autoComplete="current-email"
                                className="w-100"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} // Cập nhật state email
                            />
                        </div>
                        
                        <Button type="submit" className="w-100 mt-3">Next</Button>

                    </form>
                </div>
            </div>
        </section>
    );
};

export default ForgetPassword;

