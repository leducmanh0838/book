import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index'; // Đường dẫn đến ứng dụng Express của bạn
import User from '../models/user.model'; // Model User của bạn
import bcrypt from 'bcrypt';

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

describe('User Login', () => {
    beforeEach(async () => {
        // Xóa tất cả người dùng trước khi mỗi bài test chạy
        await User.deleteMany({});
    });

    // Tạo người dùng mẫu trước các kiểm thử
    beforeEach(async () => {
        const password = 'Password123!';
        const hashedPassword = await bcrypt.hash(password, 8);
        // const hashedPassword = await bcrypt.hash(password, 8);

        await User.create({
            email: 'test@example.com',
            password: hashedPassword,
            name: 'Test User',
        });
    });

    it('should log in successfully with valid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login') // Đường dẫn đến endpoint login của bạn
            .send({
                email: 'test@example.com',
                password: 'Password123!'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Logged in successfully");
        expect(response.body.user.email).toBe('test@example.com');
        expect(response.body.token).toBeDefined(); // Kiểm tra xem token có được trả về hay không
    });

    it('should return 400 for invalid email', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'invalid@example.com', // Email không tồn tại
                password: 'Password123!'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 400 for invalid password', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword' // Mật khẩu sai
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 400 for missing password', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com' // Chỉ gửi email, không gửi mật khẩu
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('All fields are required');
    });
    
    it('should return 400 for missing email', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                password: 'Password123!' // Chỉ gửi mật khẩu, không gửi email
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('All fields are required');
    });
});