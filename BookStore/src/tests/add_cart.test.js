// npx jest --runInBand tests/*
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
    await mongoose.connect(process.env.MONGO_URL, {
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

    it('should add a book to the cart successfully', async () => {
        const res = await request(app)
            .post('/api/cart/add')
            .set('Authorization', `Bearer ${token}`)
            .send({
                bookId: bookId.toString(),
                quantity: 2
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.items).toBeDefined();
        expect(res.body.items.length).toBe(1);
        expect(res.body.items[0].bookName).toBe('Book A');
        expect(res.body.items[0].quantity).toBe(2);
    });

    it('should return error when book is not found', async () => {
        // Tạo một ObjectId giả không tồn tại
        const invalidBookId = new mongoose.Types.ObjectId(); 
    
        const res = await request(app)
            .post('/api/cart/add')
            .set('Authorization', `Bearer ${token}`)
            .send({
                bookId: invalidBookId.toString(), // ID không tồn tại
                quantity: 1
            });
    
        expect(res.statusCode).toBe(404); // Kiểm tra mã lỗi
        expect(res.body.message).toBe('Book not found'); // Kiểm tra thông báo lỗi
    });

    it('should return error if bookId is not provided', async () => {
        const res = await request(app)
            .post('/api/cart/add')
            .set('Authorization', `Bearer ${token}`)
            .send({
                quantity: 1 // Không có bookId
            });
    
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Book not found');
    });
    
    it('should return error if book is already in the cart', async () => {
        const quantity = 1;
    
        // Thêm sách đầu tiên vào giỏ hàng
        const res1 = await request(app)
            .post('/api/cart/add')
            .set('Authorization', `Bearer ${token}`)
            .send({
                bookId: bookId.toString(),
                quantity: quantity
            });
    
        // Kiểm tra giỏ hàng sau khi thêm lần đầu
        expect(res1.statusCode).toBe(200);
    
        // Thêm lại sách cùng một lần nữa
        const res2 = await request(app)
            .post('/api/cart/add')
            .set('Authorization', `Bearer ${token}`)
            .send({
                bookId: bookId.toString(),
                quantity: quantity
            });
    
        // Kiểm tra xem có trả về lỗi không được thêm sách
        expect(res2.statusCode).toBe(200);
        expect(res2.body.items).toBeDefined();
        expect(res2.body.items.length).toBe(1);
        expect(res2.body.items[0].bookName).toBe('Book A');
        expect(res2.body.items[0].quantity).toBe(2);
    });

    it('should return error if quantity is less than 1', async () => {
        const res = await request(app)
            .post('/api/cart/add')
            .set('Authorization', `Bearer ${token}`)
            .send({
                bookId: bookId.toString(), // Thay thế bằng ID sách hợp lệ
                quantity: -1 // Số lượng âm
            });
    
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Quantity must be greater than 0');
    });

    it('should return 401 if no token is provided', async () => {
        const res = await request(app)
            .post('/api/cart/add')
            .send({
                bookId: bookId.toString(), // Thay thế bằng ID sách hợp lệ
                quantity: -1 // Số lượng âm
            });
    
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Quyền bị từ chối, không có token');
    });
});