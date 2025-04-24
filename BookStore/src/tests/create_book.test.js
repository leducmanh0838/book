import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index';
import User from '../models/user.model';
import Book from '../models/book.model';
import jwt from 'jsonwebtoken';

let merchantToken;
let merchantId;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Merchant - Create Book', () => {
    const bookData = {
        bookType: 'Hardcover',
        bookTitle: 'Test Book',
        author: 'John Doe',
        price: 150,
        publisher: 'XYZ Publisher',
        discountCode: 'DISCOUNT10',
        supplier: 'ABC Supplier',
        stockQuantity: 20,
        description: 'A good book',
        category: 'Fiction',
        subCategory: 'Novel',
        publicationDate: '2023-10-10',
        pageCount: 300,
        bookImage: 'image_url.jpg'
    };

    beforeEach(async () => {
        await User.deleteMany({});
        await Book.deleteMany({});

        const merchant = new User({
            name: 'Merchant A',
            email: 'merchant@example.com',
            password: 'Password123!',
            role: 'merchant',
            verified: true
        });
        await merchant.save();
        merchantId = merchant._id;
        merchantToken = jwt.sign({ userId: merchant._id, role: merchant.role }, process.env.JWT_SECRET || 'your_jwt_secret');
    });

    it('should create a book successfully', async () => {
        const bookData = {
            bookType: 'Hardcover',
            bookTitle: 'Test Book',
            author: 'John Doe',
            price: 150,
            publisher: 'XYZ Publisher',
            discountCode: 'DISCOUNT10',
            supplier: 'ABC Supplier',
            stockQuantity: 20,
            description: 'A good book',
            category: 'Fiction',
            subCategory: 'Novel',
            publicationDate: '2023-10-10',
            pageCount: 300,
            bookImage: 'image_url.jpg'
        };

        const res = await request(app)
            .post('/api/merchant/createBook')
            .set('Authorization', `Bearer ${merchantToken}`)
            .send(bookData);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.book.bookTitle).toBe('Test Book');
    });

    it('should return 403 if user is not a merchant', async () => {
        const user = new User({
            name: 'Normal User',
            email: 'user@example.com',
            password: 'Password123!',
            role: 'user',
            verified: true
        });
        await user.save();
        const userToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret');

        const res = await request(app)
            .post('/api/merchant/createBook')
            .set('Authorization', `Bearer ${userToken}`)
            .send(bookData);

        expect(res.statusCode).toBe(403);
        expect(res.body.message).toBe("Access denied, only merchant allowed");
    });

    it('should return 400 if bookTitle is missing', async () => {
        const res = await request(app)
            .post('/api/merchant/createBook')
            .set('Authorization', `Bearer ${merchantToken}`)
            .send({
                bookType: 'Hardcover',
                author: 'John Doe',
                price: 150,
                publisher: 'XYZ Publisher',
                discountCode: 'DISCOUNT10',
                supplier: 'ABC Supplier',
                stockQuantity: 20,
                description: 'A good book',
                category: 'Fiction',
                subCategory: 'Novel',
                publicationDate: '2023-10-10',
                pageCount: 300,
                bookImage: 'image_url.jpg'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Book validation failed: bookTitle: Path `bookTitle` is required.');
    });

    it('should return 401 if no token is provided', async () => {
        const res = await request(app)
            .post('/api/merchant/createBook')
            .send(bookData);

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Quyền bị từ chối, không có token');
    });
});
