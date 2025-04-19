import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText } from '@mui/material';

const VoucherDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null); // Lưu voucher được chọn

  const vouchers = [
    { id: 1, label: 'giảm 10%' },
    { id: 2, label: 'giảm 20%' },
    { id: 3, label: 'miễn phí vận chuyển' },
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectVoucher = (voucher) => {
    setSelectedVoucher(voucher); // Cập nhật voucher được chọn
    setOpen(false); // Đóng dialog sau khi chọn
  };

  return (
    <div>
      {/* Button luôn hiển thị, có thể chọn lại voucher */}
      <Button variant="outlined" onClick={handleClickOpen}>
        {selectedVoucher ? selectedVoucher.label : 'Chọn Voucher'}
      </Button>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Chọn Voucher</DialogTitle>
        <DialogContent>
          {/* Danh sách voucher có thể chọn */}
          <List>
            {vouchers.map((voucher) => (
              <ListItem 
                button 
                key={voucher.id} 
                onClick={() => handleSelectVoucher(voucher)} 
                selected={selectedVoucher?.id === voucher.id}  // Đánh dấu voucher được chọn
              >
                <ListItemText primary={voucher.label} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VoucherDialog;
