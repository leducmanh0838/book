import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const AddressDialog = () => {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [savedAddress, setSavedAddress] = useState('Nhập Địa Chỉ Giao Hàng'); // Địa chỉ lưu trữ sẽ hiển thị trên nút

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveAddress = () => {
    // Cập nhật địa chỉ đã nhập vào nút
    if (address.trim()) {
      setSavedAddress(address); // Cập nhật địa chỉ hiển thị trên nút
    } else {
      setSavedAddress('Nhập Địa Chỉ Giao Hàng'); // Nếu không có địa chỉ, hiện text mặc định
    }
    setOpen(false); // Đóng dialog sau khi lưu
  };

  return (
    <div>
      {/* Button để mở dialog, hiển thị địa chỉ đã lưu */}
      <Button variant="outlined" onClick={handleClickOpen}>
        {savedAddress} {/* Hiển thị địa chỉ đã lưu trên nút */}
      </Button>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm"> {/* Full width and larger size */}
        <DialogTitle>Nhập Địa Chỉ Giao Hàng</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Địa chỉ"
            type="text"
            fullWidth
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)} // Cập nhật địa chỉ
            multiline // Cho phép nhập nhiều dòng
            rows={4} // Tăng số dòng để khung to hơn
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSaveAddress} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddressDialog;
