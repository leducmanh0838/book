import { Button, Link} from "@mui/material";
import QuantityBox from "../Components/Product/quantityBox";
import { RiDeleteBin5Line } from "react-icons/ri";
import React, { useContext, useState, useEffect} from "react";
import { AuthContext } from "../Components/Context/authContext";
import axios from "axios";
import '../css/cart.css';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cartItems, user, setCartItems } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [cartId, setCartId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            if (user) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`http://localhost:5000/api/cart/getAllCart/${user._id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (response.data && response.data.items) {
                        setCartItems([...response.data.items]);
                        setCartId(response.data._id);
                    }
                } catch (error) {
                    console.error('Error fetching cart:', error.response ? error.response.data : error.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchCart();
    }, [user]);

    const handleUpdateQuantity = async (id, newQuantity, merchantId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/cart/update`,
                { id, quantity: newQuantity, merchantId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            setCartItems(prevCartItems =>
                prevCartItems.map(item =>
                    item._id === id ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (error) {
            console.error('Error updating quantity:', error.response ? error.response.data : error.message);
        }
    };
    

    const handleRemoveItem = async (itemId) => {
        try {
            const token = localStorage.getItem('token');
            // Gọi API để xóa mục khỏi backend
            await axios.delete(`http://localhost:5000/api/cart/remove`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    id: itemId // Đảm bảo truyền đúng `id` như API backend yêu cầu
                }
            });
    
            // Gọi lại API để cập nhật giỏ hàng sau khi đã xóa
            const response = await axios.get(`http://localhost:5000/api/cart/getAllCart/${user._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            if (response.data && response.data.items) {
                // Cập nhật lại giỏ hàng với dữ liệu mới nhất từ backend
                setCartItems([...response.data.items]);
            }
        } catch (error) {
            console.error('Error removing item:', error.response ? error.response.data : error.message);
        }
    };
    

    if (loading) {
        return <div>Loading...</div>;
    }

    const groupedByMerchant = cartItems.reduce((group, item) => {
        const { merchantId, merchantName } = item;
        if (!group[merchantId]) {
            group[merchantId] = { merchantName, items: [] };
        }
        group[merchantId].items.push(item);
        return group;
    }, {});

const handlePurchase = async (merchantId) => {
    const data = {
        cartId: cartId, // Lấy cartId từ state
        merchantId: merchantId,
    };

    const token = localStorage.getItem('token'); 

    try {
        // Gọi API để tạo đơn hàng và lưu vào MongoDB
        const response = await axios.post('http://localhost:5000/api/order/createOrder', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('Order created successfully:', response.data);
        const orderId = response.data.order._id; // Lấy orderId từ phản hồi

        // Chuyển đến trang /order với orderId
        navigate('/order', { state: { orderId: orderId } });
    } catch (error) {
        console.error('Error creating order:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
};

    
    return (
        <section className="section cartPage">
            <div className="container">
                <h3>Giỏ hàng</h3>
                <p>Bạn có <b>{cartItems.length}</b> sản phẩm trong giỏ hàng</p>
                {Object.entries(groupedByMerchant).map(([merchantId, group]) => (
                    <div key={merchantId} className="merchant-group">
                        <h5>{group.merchantName}</h5>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Giá</th>
                                        <th>Số lượng</th>
                                        <th>Tổng tiền</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {group.items.map((item, index) => (
                                        <tr key={`${item._id}_${index}`}>
                                            <td>
                                                <Link to={`/product/${item.bookId}`}>
                                                    <div className="cartItemimgWrapper">
                                                        <div className="imgWrapper">
                                                            <img src={item.bookImage} alt={item.bookName} />
                                                        </div>
                                                        <div className="info">
                                                            <h6 className="book-name">{item.bookName}</h6>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td>{item.price.toLocaleString()} VNĐ</td>
                                            <td>
                                                <QuantityBox 
                                                    quantity={item.quantity} 
                                                    onUpdateQuantity={(newQuantity) => handleUpdateQuantity(item._id, newQuantity, item.merchantId)}
                                                />
                                            </td>
                                            <td>{(item.price * item.quantity).toLocaleString()} VNĐ</td>
                                            <td>
                                                <Button onClick={() => handleRemoveItem(item._id)}><RiDeleteBin5Line /></Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="total-section">
                            <h6>Tổng thanh toán:</h6>
                            <p>{group.items.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()} VNĐ</p>
                            <Button onClick={() => handlePurchase(merchantId)} className="btn-buy">Mua hàng</Button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Cart;