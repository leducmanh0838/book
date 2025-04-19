import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "../App";
import { TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FcGoogle } from "react-icons/fc";

const SignUp = () => {
  const context = useContext(MyContext);

  // Quản lý state cho form input
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State để điều chỉnh hiển thị mật khẩu

  useEffect(() => {
    context.setIsHeaderFooterShow(false);
  }, [context]);

  // Hàm cập nhật state khi người dùng nhập thông tin
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Hàm xử lý khi nhấn "Sign Up"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn reload trang
    setErrorMessage("");
    setSuccessMessage("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    setErrorMessage("Email không hợp lệ.");
    return;
  }

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/;
  if (!passwordRegex.test(formData.password)) {
    setErrorMessage(
      "Mật khẩu phải chứa ít nhất 6 ký tự, 1 chữ hoa, 1 ký tự đặc biệt và 1 số."
    );
    return;
  }

  console.log("Form data:", formData);

  try {
    await context.signUp(formData); // Gọi hàm signUp từ context
    setSuccessMessage("Đăng ký thành công!");
    } catch (error) {
      setErrorMessage("Đăng ký thất bại. Vui lòng thử lại.");
      console.error("Đăng ký thất bại:", error);
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
          <div className="text-center">{/* Tiêu đề hoặc logo */}</div>

          <form onSubmit={handleSubmit}>
            <h2 className="custom-font">Sign Up</h2>

            <div className="form-group mt-3">
              <TextField
                id="outlined-name-input"
                label="Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange} // Cập nhật giá trị khi nhập
                className="w-100"
                required
              />
            </div>

            <div className="form-group mt-3">
              <TextField
                id="outlined-email-input"
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-100"
                required
              />
            </div>

            <div className="form-group mt-3">
              <TextField
                id="outlined-password-input"
                label="Password"
                type={showPassword ? "text" : "password"} // Điều chỉnh hiển thị mật khẩu
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-100"
                required
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

            {/* Hiển thị thông báo lỗi hoặc thành công */}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {successMessage && (
              <p style={{ color: "green" }}>{successMessage}</p>
            )}

            <Button type="submit" className="w-100 mt-3">
              Sign Up
            </Button>

            <p className="mt-2">
              Already have an account?{" "}
              <Link to="/signin" className="border-effect">
                Sign In
              </Link>
            </p>

            <h6 className="mt-4 text-center font-weight-bold">
              Sign up with Google
            </h6>

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

export default SignUp;
