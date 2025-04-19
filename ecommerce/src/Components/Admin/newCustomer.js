import React, { useState } from 'react';
import { TextField, Button} from '@mui/material';
import axios from 'axios';

const NewUserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Lấy token từ localStorage hoặc nơi bạn lưu trữ

    axios.post('http://localhost:5000/api/admin/createUsers', formData, {
        headers: {
            'Authorization': `Bearer ${token}` // Thêm token vào header
        }
    })
    .then(response => {
        console.log('User created successfully', response.data);
        alert('User created successfully!'); // Thông báo thành công

        // Đặt lại formData về giá trị mặc định
        setFormData({
          name: '',
          email: '',
          password: ''
        });
    })
    .catch(error => {
        console.error('There was an error creating the user!', error);
        alert('There was an error creating the user!'); // Thông báo lỗi nếu có
    });
  };


  return (
    <div className="new-user-container">
      <h2 className="new-user-title">Tạo mới Khách Hàng</h2>
      <form onSubmit={handleSubmit} className="new-user-form">
      <TextField
          fullWidth
          type="name"
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
        />
        <Button
          type="submit"
          className="new-user-save-btn"
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default NewUserForm;
