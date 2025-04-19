import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../css/order.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import PersonIcon from '@mui/icons-material/Person';

const Order = () => {
    const location = useLocation();
    const { orderId } = location.state; // Lấy orderId từ state
    const [orderDetails, setOrderDetails] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [voucher, setVoucher] = useState('');
    const [vouchers, setVouchers] = useState([]); // Danh sách voucher


    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const token = localStorage.getItem('token'); // Lấy token từ localStorage
                const response = await axios.get(`http://localhost:5000/api/order/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Gửi token trong header
                    },
                });
                setOrderDetails(response.data); // Lưu thông tin đơn hàng
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };
    
        if (orderId) {
            fetchOrderDetails(); // Gọi API lấy thông tin đơn hàng
        }
    }, [orderId]);
    
    if (!orderDetails) {
        return <div>Loading...</div>; // Hiển thị loading nếu chưa có thông tin
    }

    const handlePayment = () => {
        // Logic xử lý thanh toán
        console.log("Processing payment with:", paymentMethod, "and voucher:", voucher);
    };

    return (
        <div className="order-container">
            <h5>THÔNG TIN ĐƠN HÀNG</h5>
            <div className="order-summary">
                <h6>Đơn Hàng ID: {orderDetails._id}</h6>
                <h6>Thông Tin Người Nhận</h6>
                <p className='mt-4'><PersonIcon/> {orderDetails.name}</p>
                <p><AddLocationIcon/> {orderDetails.address}</p>
                <p><AdUnitsIcon/> {orderDetails.phoneNumber}</p>
            </div>

            <h5>{orderDetails.items[0].merchantName} </h5>
            <table className="order-table">
                <thead>
                    <tr>
                        <th>Sản Phẩm</th>
                        <th>Giá</th>
                        <th>Số Lượng</th>
                        <th>Tổng Tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {orderDetails.items.map(item => (
                        <tr key={item.bookId}>
                            <td>
                                <div className="product-info">
                                    <img src={item.bookImage} alt={item.bookName} className="book-image" />
                                    <span>{item.bookName}</span>
                                </div>
                            </td>
                            <td>{item.price.toLocaleString()} VNĐ</td>
                            <td>{item.quantity}</td>
                            <td>{(item.price * item.quantity).toLocaleString()} VNĐ</td>
                        </tr>
                    ))}
                </tbody>  
            </table>

            <div className="total-section">
            <h6>Tổng số tiền: {orderDetails.totalAmount.toLocaleString()} VNĐ</h6>
            </div>

            <div className="payment-section">
                <h3>Chọn Phương Thức Thanh Toán</h3>
                <select onChange={e => setPaymentMethod(e.target.value)} className="payment-select">
                    <option value="COD">Thanh toán khi nhận hàng</option>
                    <option value="VNPAY">VNPAY</option>
                </select>

                <div className="voucher-section">
                    <h3>Nhập Voucher</h3>
                    <input 
                        type="text" 
                        value={voucher} 
                        onChange={e => setVoucher(e.target.value)} 
                        placeholder="Nhập mã voucher tại đây" 
                        className="voucher-input"
                    />
                    <ul className="voucher-list">
                        {vouchers.map(v => (
                            <li key={v.id} onClick={() => setVoucher(v.code)} className="voucher-item">
                                {v.code} - {v.discount} VNĐ
                            </li>
                        ))}
                    </ul>
                </div>

            </div>

            <button onClick={handlePayment} className="btn-payment">Đặt hàng</button>
        </div>
    );
};

export default Order;