import React, { useState } from 'react';
import { TextField, Button} from '@mui/material';
import axios from 'axios';

const NewMerchantForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    address:''
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
    console.log('Token:', token); // In token ra để kiểm tra

    axios.post('http://localhost:5000/api/admin/createMerchants', formData, {
      headers: {
          'Authorization': `Bearer ${token}` // Thêm token vào header
      }
    })
    .then(response => {
        console.log('Merchant created successfully', response.data);
        alert('Merchant created successfully!'); // Thông báo thành công

        // Đặt lại formData về giá trị mặc định
        setFormData({
          name: '',
          email: '',
          password: '',
            phoneNumber: '',
            address:''
        });
    })
    .catch(error => {
        console.error('There was an error creating the merchant!', error);
        alert('There was an error creating the merchant!'); // Thông báo lỗi nếu có
    });
  };

  return (
    <div className="new-user-container">
      <h2 className="new-user-title">Tạo mới Đối Tác</h2>
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
      <TextField
        fullWidth
        label="Phone Number"
        name="phoneNumber" // Đảm bảo tên khớp với formData
        value={formData.phoneNumber} // Đảm bảo giá trị khớp với formData
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Address"
        name="address" // Đảm bảo tên khớp với formData
        value={formData.address} // Đảm bảo giá trị khớp với formData
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

export default NewMerchantForm;
