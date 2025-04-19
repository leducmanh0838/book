import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {MyContext} from "../App";
import { Button, TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";

const SignIn = () => {
    const context = useContext(MyContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); 
    const [showPassword, setShowPassword] = useState(false);
 
    useEffect(() => {
        context.setIsHeaderFooterShow(false);
        // Kiểm tra token trong localStorage
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Giải mã token
            const role = decodedToken.role;

            if (role === 'merchant') {
                navigate('/merchant'); // Điều hướng tới trang merchant nếu là merchant
            } 
            else if(role === 'admin') {
                navigate('/admin');
            }
            else {
                navigate('/'); // Điều hướng tới trang home nếu là user
            }
        }
    }, [context, navigate]);

    // Hàm xử lý sự kiện khi bấm nút đăng nhập
    const handleSignIn = async (e) => {
        e.preventDefault();
        try {

            const userData = {
                email,
                password
            };
            const response = await context.login(userData); // Gọi hàm login từ context
            
            // Giả sử response trả về có user và token
            const { token} = response; // Chỉnh sửa nếu cấu trúc dữ liệu khác
            localStorage.setItem('token', token); // Lưu token vào localStorage

            console.log('Đăng nhập thành công:', response);
            // Giải mã token để lấy vai trò
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const role = decodedToken.role;

            // Điều hướng dựa trên vai trò của người dùng
            if (role === 'merchant') {
                navigate('/merchant'); // Điều hướng tới dashboard dành cho merchant
            } 
            else if (role === 'admin') {
                navigate('/admin'); // Điều hướng tới dashboard dành cho merchant
            } 
            else {
                navigate('/'); // Điều hướng tới trang home dành cho user
            }
            window.location.reload(); // Tải lại trang nếu cần
        } catch (error) {
            console.error('Đăng nhập thất bại:', error);
        }
    };

    // Hàm điều chỉnh trạng thái hiển thị mật khẩu
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
 
    return (
        <section className="section signInPage">
            <div className="container">
                <div className="box card p-3 shadow border-0">
                    <div className="text-center"></div>
                    
                    <form onSubmit={handleSignIn}>
                        <h2 className="custom-font">Sign In</h2>
 
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
                        
                        <div className="form-group mt-3">
                            <TextField
                                id="outlined-password-input"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                autoComplete="current-password"
                                className="w-100"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} // Cập nhật state password
                                required // Bắt buộc nhập mật khẩu
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={togglePasswordVisibility}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />} 
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />                          
                        </div>
                        
                        <Link to="/fogetpass" className="mt-2">Forget Password?</Link>
                        
                        <Button type="submit" className="w-100 mt-3">Sign In</Button>
 
                        <p className="mt-2">Not Registered? <Link to="/signup" className="border-effect">Sign Up</Link>
                        </p>
                        
                        <h6 className="mt-4 text-center font-weight-bold">Sign in with Google</h6>
 
                        <ul className="social-icons">
                            <li>
                                <Link to="#">
                                    <FcGoogle />
                                </Link>
                            </li>
                        </ul>
                    </form>
                </div>
            </div>
        </section>
    );
 };
 
 export default SignIn;