// // cart.test.js   
// import request from 'supertest';
// import mongoose from 'mongoose';
// import app from '../index'; // Đường dẫn đến ứng dụng Express của bạn
// import Book from '../models/book.model';
// import User from '../models/user.model'; // Model User của bạn
// import Cart from '../models/cart.model'; // Model Cart của bạn

// // Kết nối đến MongoDB
// beforeAll(async () => {
//     await mongoose.connect('mongodb://localhost:27017/Test', {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });
// });

// // Ngắt kết nối sau khi test xong
// afterAll(async () => {
//     await mongoose.connection.close();
// });

// // Giả lập người dùng (userId)
// const mockUserId = new mongoose.Types.ObjectId();

// describe('Cart functionality', () => {
//     beforeEach(async () => {
//         await Cart.deleteMany({});
//         await Book.deleteMany({});
//         await User.deleteMany({});
//     });

//     it('should add a book to the cart', async () => {
//         // Tạo một Merchant
//         const merchant = await User.create({
//             name: 'Merchant 1',
//             email: 'merchant1@example.com',
//             password: 'Admin@123'
//         });

//         // Tạo một Book
//         const book = await Book.create({
//             bookTitle: 'Example Book',
//             price: 20,
//             bookType: 'Novel',
//             publisher: 'Publisher 1',
//             supplier: 'Supplier 1',
//             stockQuantity: 10,
//             bookImage: 'image_url',
//             category: 'Fiction',
//             merchantId: merchant._id
//         });

//         // Gửi yêu cầu thêm sách vào giỏ hàng
//         const response = await request(app)
//             .post('/api/cart/add') // Đường dẫn đến endpoint thêm vào giỏ hàng
//             .set('Authorization', `Bearer ${mockUserId}`)
//             .send({
//                 bookId: book._id,
//                 quantity: 2
//             });

//         expect(response.statusCode).toBe(200);
//         expect(response.body.items.length).toBe(1);
//         expect(response.body.items[0].bookName).toBe('Example Book');
//         expect(response.body.items[0].quantity).toBe(2);
//     });

//     it('should return 404 if book not found', async () => {
//         const response = await request(app)
//             .post('/api/cart/add') // Đường dẫn đến endpoint thêm vào giỏ hàng
//             .set('Authorization', `Bearer ${mockUserId}`)
//             .send({ 
//                 bookId: new mongoose.Types.ObjectId(), // ID không tồn tại
//                 quantity: 2
//             });

//         expect(response.statusCode).toBe(404);
//         expect(response.body.message).toBe('Book not found');
//     });

//     it('should return 404 if merchant not found', async () => {
//         const book = await Book.create({
//             bookTitle: 'Example Book',
//             price: 20,
//             bookType: 'Novel',
//             publisher: 'Publisher 1',
//             supplier: 'Supplier 1',
//             stockQuantity: 10,
//             bookImage: 'image_url',
//             category: 'Fiction',
//             merchantId: new mongoose.Types.ObjectId() // Merchant không tồn tại
//         });

//         const response = await request(app)
//             .post('/api/cart/add') // Đường dẫn đến endpoint thêm vào giỏ hàng
//             .set('Authorization', `Bearer ${mockUserId}`)
//             .send({
//                 bookId: book._id,
//                 quantity: 2
//             });

//         expect(response.statusCode).toBe(404);
//         expect(response.body.message).toBe('Merchant not found');
//     });

//     it('should handle error when saving to cart', async () => {

//         jest.spyOn(Cart.prototype, 'save').mockImplementationOnce(() => {
//             throw new Error('Error saving cart');
//         });

//         // Tạo một Merchant
//         const merchant = await User.create({
//             name: 'Merchant 1',
//             email: 'merchant1@example.com'
//         });

//         // Tạo một Book
//         const book = await Book.create({
//             bookTitle: 'Example Book',
//             price: 20,
//             bookType: 'Novel',
//             publisher: 'Publisher 1',
//             supplier: 'Supplier 1',
//             stockQuantity: 10,
//             bookImage: 'image_url',
//             category: 'Fiction',
//             merchantId: merchant._id
//         });

//         const response = await request(app)
//             .post('/api/cart/add') // Đường dẫn đến endpoint thêm vào giỏ hàng
//             .set('Authorization', `Bearer ${mockUserId}`)
//             .send({
//                 bookId: book._id,
//                 quantity: 1
//             });

//         expect(response.statusCode).toBe(500);
//         expect(response.body.message).toBe("Internal Server Error");
//     });
// });