import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index'; // Đường dẫn đến ứng dụng Express của bạn
import Book from '../models/book.model'; // Model Book của bạn

beforeAll(async () => {
    // Kết nối đến MongoDB
    await mongoose.connect('mongodb://localhost:27017/Test', {
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

    it('should return a 404 if no books are found', async () => {
        // Xóa tất cả sách để gây ra lỗi
        await Book.deleteMany({});

        const response = await request(app)
            .get('/api/user/search')
            .query({ query: 'Anything' });

        expect(response.statusCode).toBe(404); // Kiểm tra mã trạng thái 404
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Không tìm thấy sách nào."); // Thông báo không tìm thấy
    });

    // it('should return 500 on error fetching books', async () => {
    //     jest.spyOn(Book, 'find').mockImplementationOnce(() => { throw new Error('Database error') }); // Giả lập lỗi

    //     const response = await request(app)
    //         .get('/api/user/search')
    //         .query({ query: 'Harry' });

    //     expect(response.statusCode).toBe(500); // Kiểm tra mã trạng thái 500
    //     expect(response.body.message).toBe("Đã xảy ra lỗi trong quá trình tìm kiếm."); // Thông báo lỗi
    // });

    it('should be case insensitive in searches', async () => {
        const response = await request(app)
            .get('/api/user/search')
            .query({ query: 'the HOBBIT' }); // Tìm kiếm với chữ hoa

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1); // Chỉ nên có 1 sách
        expect(response.body[0].bookTitle).toBe('The Hobbit'); // Kiểm tra tiêu đề sách
    });
});