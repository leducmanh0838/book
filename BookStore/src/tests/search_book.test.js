import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index'; // Đường dẫn đến ứng dụng Express của bạn
import Book from '../models/book.model'; // Model Book của bạn

beforeAll(async () => {
    // Kết nối đến MongoDB
    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    // Ngắt kết nối sau khi test xong
    await mongoose.connection.close();
});

describe('Search Book for User', () => {
    beforeEach(async () => {
        // Xóa tất cả sách trước khi mỗi bài test chạy
        await Book.deleteMany({});
    });

    // Tạo sách mẫu trước khi các kiểm thử
    beforeEach(async () => {
        await Book.create([
            {
                bookType: 'Novel',
                bookTitle: 'Harry Potter',
                price: 20,
                publisher: 'Bloomsbury',
                supplier: 'Amazon',
                stockQuantity: 10,
                bookImage: 'image_url_1',
                category: 'Fiction',
                pageCount: 500,
                merchantId: new mongoose.Types.ObjectId(), // Giả lập ID của Merchant
            },
            {
                bookType: 'Fantasy',
                bookTitle: 'The Hobbit',
                price: 15,
                publisher: 'HarperCollins',
                supplier: 'Barnes & Noble',
                stockQuantity: 8,
                bookImage: 'image_url_2',
                category: 'Fantasy',
                pageCount: 300,
                merchantId: new mongoose.Types.ObjectId(), // Giả lập ID của Merchant
            },
            {
                bookType: 'Historical',
                bookTitle: 'War and Peace',
                price: 25,
                publisher: 'Penguin',
                supplier: 'Book Depository',
                stockQuantity: 5,
                bookImage: 'image_url_3',
                category: 'History',
                pageCount: 1200,
                merchantId: new mongoose.Types.ObjectId(), // Giả lập ID của Merchant
            }
        ]);
    });

    it('should return books matching the search query', async () => {
        const response = await request(app)
            .get('/api/user/search') // Đường dẫn đến endpoint tìm kiếm
            .query({ query: 'Harry' }); // Truy vấn tìm kiếm

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1); // Chỉ nên có 1 sách
        expect(response.body[0].bookTitle).toBe('Harry Potter'); // Kiểm tra tiêu đề sách
    });

    it('should return an empty array if no books match the search query', async () => {
        const response = await request(app)
            .get('/api/user/search')
            .query({ query: 'NotExist' }); // Tìm kiếm không tồn tại

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0); // Không có sách nào
    });

    it('should be case insensitive in searches', async () => {
        const response = await request(app)
            .get('/api/user/search')
            .query({ query: 'the HOBBIT' }); // Tìm kiếm với chữ hoa

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1); // Chỉ nên có 1 sách
        expect(response.body[0].bookTitle).toBe('The Hobbit'); // Kiểm tra tiêu đề sách
    });

    // Bổ sung các test case:
    it('should return 400 for empty query', async () => {
        const response = await request(app)
            .get('/api/user/search')
            .query({ query: '' }); // Truy vấn rỗng

        expect(response.statusCode).toBe(400); // Kiểm tra mã lỗi
        expect(response.body.message).toBe('Query parameter is required');
    });

    it('should return books filtered by category', async () => {
        const response = await request(app)
            .get('/api/user/search')
            .query({ query: 'the', category: 'Fantasy' }); // Tìm kiếm theo thể loại

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1); // Chỉ nên có 1 sách
        expect(response.body[0].bookTitle).toBe('The Hobbit'); // Kiểm tra tiêu đề sách
    });
});
