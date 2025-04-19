import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, TextField } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios'; 
import NewUserForm from './newCustomer';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State lưu giá trị tìm kiếm thực tế sau khi nhấn "Search"
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: ''
  });

    // Hàm xử lý khi nhấn nút Search
    const handleSearch = () => {
      setSearchQuery(searchTerm); // Gán giá trị searchTerm vào searchQuery để lọc danh sách
  };

  const handleNewUserClick = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUserId(null); // Đặt lại khi đóng form
    setEditFormData({
      name: '',
      email: '',
      phoneNumber: '',
      address: ''
    });
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    try {
      const response = await axios.get('http://localhost:5000/api/admin/getAllUsers', {
        headers: {
          'Authorization': `Bearer ${token}` // Thêm token vào header
        }
      });
      setUsers(response.data.users); // Lưu trữ danh sách users
    } catch (error) {
      console.error("There was an error fetching the users!", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (id) => {
    const user = users.find(user => user._id === id);
    setEditingUserId(id);
    setEditFormData({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const token = localStorage.getItem('token'); // Lấy token từ localStorage
      axios.delete(`http://localhost:5000/api/admin/deleteUsers/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}` // Thêm token vào header
        }
      })
      .then(() => {
        setUsers(users.filter(user => user._id !== id));
      })
      .catch(error => {
        console.error("There was an error deleting the user!", error);
      });
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault(); // Ngăn form reload lại trang
    const token = localStorage.getItem('token');

    axios.put(`http://localhost:5000/api/admin/updateUsers/${editingUserId}`, editFormData, {
      headers: {
        'Authorization': `Bearer ${token}` // Thêm token vào header
      }
    })
    .then((response) => {
      console.log('User updated successfully', response.data);
      alert('User updated successfully!');
      fetchUsers();
      
      // Cập nhật danh sách users sau khi cập nhật thành công
      setUsers(users.map(user => 
        user._id === editingUserId ? { ...user, ...editFormData } : user
      ));
      setEditingUserId(null); // Đặt lại chế độ chỉnh sửa
      setEditFormData({
        name: '',
        email: '',
        phoneNumber: '',
        address: ''
      });
    })
    .catch(error => {
      console.error('There was an error updating the user!', error);
      alert('There was an error updating the user!');
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Bộ lọc người dùng dựa trên từ khóa tìm kiếm
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TableContainer component={Paper}>
      <Button variant="contained" color="primary" style={{ margin: '10px' }} onClick={handleNewUserClick}>
        New User
      </Button>

      {/* Thanh tìm kiếm */}
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <TextField
          label="Search by Name or Email"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật giá trị searchTerm khi người dùng nhập
        />
        <Button variant="contained" color="primary" style={{ marginLeft: '10px' }} onClick={handleSearch}>
          Search
        </Button>
      </div>

      {/* Hiển thị form tạo user nếu state isFormOpen là true */}
      {isFormOpen && (
        <div>
          <NewUserForm />
          <Button variant="contained" color="secondary" onClick={handleCloseForm}>
            Cancel
          </Button>
        </div>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Verified</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user._id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.address}</TableCell>
              <TableCell>{user.phoneNumber}</TableCell>
              <TableCell>{user.isVerified ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(user._id)} color="primary">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(user._id)} color="secondary">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Hiển thị form chỉnh sửa nếu có user đang được chỉnh sửa */}
      {editingUserId && (
        <form onSubmit={handleUpdate}>
          <h3>Edit User</h3>
          <TextField
            label="Name"
            name="name"
            value={editFormData.name}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            value={editFormData.email}
            onChange={handleChange}
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={editFormData.phoneNumber}
            onChange={handleChange}
          />
          <TextField
            label="Address"
            name="address"
            value={editFormData.address}
            onChange={handleChange}
          />
          <Button type="submit" variant="contained" color="primary">
            Update
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCloseForm}>
            Cancel
          </Button>
        </form>
      )}
    </TableContainer>
  );
};

export default UserManagement;