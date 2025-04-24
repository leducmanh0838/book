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

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/Test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Cart Functionality', () => {
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
    
        // Tạo book với đầy đủ các trường bắt buộc
        const book = new Book({
            bookTitle: 'Book A',
            price: 100,
            category: 'Fiction',       // Thêm category
            supplier: 'ABC Supplier',  // Thêm supplier
            publisher: 'XYZ Publisher',// Thêm publisher
            bookType: 'Hardcover',     // Thêm bookType
            merchantId: merchant._id,
            bookImage: 'image_url.jpg'
        });
        await book.save();
        bookId = book._id;
    });

    it('should return cart of user', async () => {
        // Thêm sách vào cart trước
        await request(app)
            .post('/api/cart/add')
            .set('Authorization', `Bearer ${token}`)
            .send({
                bookId: bookId.toString(),
                quantity: 3
            });
    
        // Gọi API lấy giỏ hàng
        const res = await request(app)
            .get(`/api/cart/getAllCart/${userId}`)
            .set('Authorization', `Bearer ${token}`);
    
        expect(res.statusCode).toBe(200);
        expect(res.body.userId).toBe(userId.toString());
        expect(res.body.items).toBeDefined();
        expect(res.body.items.length).toBe(1);
        expect(res.body.items[0].quantity).toBe(3);
    });

    it('should return 404 if cart not found', async () => {
        // Xóa hết cart để đảm bảo cart không tồn tại
        await Cart.deleteMany({});
    
        const res = await request(app)
            .get(`/api/cart/getAllCart/${userId}`)
            .set('Authorization', `Bearer ${token}`);
    
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Cart not found');
    });
    it('should return 401 if no token is provided', async () => {
        const res = await request(app)
            .get(`/api/cart/getAllCart/${userId}`); // Không set Authorization header
    
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Quyền bị từ chối, không có token');
    });
});
