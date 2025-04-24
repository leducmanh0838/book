import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index'
import User from '../models/user.model'; // Model User của bạn

beforeAll(async () => {
    // Kết nối đến MongoDB (có thể thay đổi URL phù hợp với cấu hình của bạn)
    await mongoose.connect('mongodb://localhost:27017/Test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    // Ngắt kết nối sau khi test xong
    await mongoose.connection.close();
});

describe('User Signup', () => {
    beforeEach(async () => {
        // Xóa tất cả người dùng trước khi mỗi bài test chạy
        await User.deleteMany({});
    });

    it('should create a user successfully', async () => {
        const response = await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'test@example.com',
                password: 'Password123!',
                name: 'Test User',
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("User created successfully. Please check your email for verification.");
    });

    it('should return error if user already exists', async () => {
        // Tạo người dùng đầu tiên
        await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'test@example.com',
                password: 'Password123!',
                name: 'Test User',
            });

        // Thử tạo người dùng với email đó lần nữa
        const response = await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'test@example.com',
                password: 'Password123!',
                name: 'Test User',
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("User already exists");
    });

    it('should return error if email is invalid', async () => {
        const response = await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'invalidemail.com', // Email không hợp lệ
                password: 'Password123!',
                name: 'Test User',
            });
    
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Invalid email format");
    });

    it('should return error if email are missing', async () => {
        const response = await request(app)
            .post('/api/auth/signup')
            .send({
                password: 'Password123!',
                name: 'Test User',
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("All fields are required");
    });

    it('should return error if name are missing', async () => {
        const response = await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'test@example.com',
                password: 'Password123!',
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("All fields are required");
    });

    it('should return error if password are missing', async () => {
        const response = await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'test@example.com',
                name: 'Test User',
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("All fields are required");
    });

    it('should return error if password is invalid', async () => {
        const response = await request(app)
            .post('/api/auth/signup')
            .send({
                email: 'test@example.com',
                password: 'short', // Mật khẩu không hợp lệ
                name: 'Test User',
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Password must be at least 6 characters long");
    });
});