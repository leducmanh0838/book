import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const PurchaseHistory = () => {
    const [orders, setOrders] = useState([]);

    // Lấy dữ liệu lịch sử mua hàng từ API
    useEffect(() => {
        axios.get('http://localhost:5000/api/user/purchaseHistory')  // Thay bằng API thật
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the purchase history!", error);
            });
    }, []);

    return (
        <div>
            <Typography variant="h4" gutterBottom>Lịch sử mua hàng</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Ngày mua</TableCell>
                            <TableCell>Sản phẩm</TableCell>
                            <TableCell>Số lượng</TableCell>
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Trạng thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{new Date(order.purchaseDate).toLocaleDateString()}</TableCell>
                                <TableCell>{order.productName}</TableCell>
                                <TableCell>{order.quantity}</TableCell>
                                <TableCell>{order.totalPrice} VND</TableCell>
                                <TableCell>{order.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default PurchaseHistory;
