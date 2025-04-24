import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index';
import User from '../models/user.model';
import Book from '../models/book.model';
import Cart from '../models/cart.model';
import jwt from 'jsonwebtoken';

let token;
let userId;
let bookId;
let cartId;
let merchantId;

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/Test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Order Creation', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Book.deleteMany({});
        await Cart.deleteMany({});

        // Tạo user và tạo token
        const user = new User({
            name: 'Test User',
            email: 'test@example.com',
            password: 'Password123!',
            role: 'user',
            verified: true
        });
        await user.save();
        userId = user._id;

        token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret');

        // Tạo merchant
        const merchant = new User({
            name: 'Merchant A',
            email: 'merchant@example.com',
            password: 'Password123!',
            role: 'merchant',
            verified: true
        });
        await merchant.save();
        merchantId = merchant._id;

        // Tạo book với đầy đủ các trường bắt buộc
        const book = new Book({
            bookTitle: 'Book A',
            price: 100,
            category: 'Fiction',       
            supplier: 'ABC Supplier',  
            publisher: 'XYZ Publisher',
            bookType: 'Hardcover',     
            merchantId: merchant._id,
            bookImage: 'image_url.jpg'
        });
        await book.save();
        bookId = book._id;

        // Tạo giỏ hàng với sản phẩm
        const cart = new Cart({
            userId,
            items: [{
                bookId: book._id,
                bookName: 'Book A',       // Thêm trường bookName
                merchantName: 'Merchant A', // Thêm trường merchantName
                quantity: 2,
                merchantId: merchant._id,
                price: book.price
            }]
        });
        await cart.save();
        cartId = cart._id;
    });

    it('should create order successfully', async () => {
        const res = await request(app)
            .post('/api/order/createOrder')
            .set('Authorization', `Bearer ${token}`)
            .send({
                cartId: cartId.toString(),
                merchantId: merchantId.toString()
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Order created successfully');
        expect(res.body.order).toBeDefined();
        expect(res.body.order.totalAmount).toBe(200);  // price * quantity
        expect(res.body.order.status).toBe('Pending');
    });

    it('should return 404 if cart not found', async () => {
        const invalidCartId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .post('/api/order/createOrder')
            .set('Authorization', `Bearer ${token}`)
            .send({
                cartId: invalidCartId.toString(),
                merchantId: merchantId.toString()
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Cart not found');
    });

    it('should return 404 if no items found for the specified merchant', async () => {
        // Xóa sản phẩm của merchant này trong giỏ hàng
        const cart = await Cart.findById(cartId);
        cart.items = [];  // Xóa hết sản phẩm
        await cart.save();

        const res = await request(app)
            .post('/api/order/createOrder')
            .set('Authorization', `Bearer ${token}`)
            .send({
                cartId: cartId.toString(),
                merchantId: merchantId.toString()
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('No items found for the specified merchant');
    });

    it('should return 401 if token is missing', async () => {
        const res = await request(app)
            .post('/api/order/createOrder')
            .send({
                cartId: cartId.toString(),
                merchantId: merchantId.toString()
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Quyền bị từ chối, không có token');
    });

    it('should return 401 if token is invalid', async () => {
        const res = await request(app)
            .post('/api/order/createOrder')
            .set('Authorization', 'Bearer invalid_token')
            .send({
                cartId: cartId.toString(),
                merchantId: merchantId.toString()
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Token không hợp lệ hoặc đã hết hạn');
    });
});
