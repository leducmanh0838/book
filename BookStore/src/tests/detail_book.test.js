import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index';
import Book from '../models/book.model';

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

describe('GET /api/book/getBook/:bookId - getBookById', () => {
  beforeEach(async () => {
    await Book.deleteMany({});

    const book = new Book({
      bookType: 'Paperback',
      bookTitle: 'Sample Book',
      author: 'Jane Doe',
      price: 100,
      publisher: 'Test Publisher',
      discountCode: 'SAVE20',
      supplier: 'Test Supplier',
      stockQuantity: 10,
      description: 'Test description',
      category: 'Education',
      subCategory: 'Programming',
      publicationDate: '2022-01-01',
      pageCount: 250,
      bookImage: 'image_url.jpg',
      merchantId: new mongoose.Types.ObjectId(),
    });

    const savedBook = await book.save();
    bookId = savedBook._id;
  });

  it('should return book when bookId is valid', async () => {
    const res = await request(app).get(`/api/book/getBook/${bookId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.bookTitle).toBe('Sample Book');
  });

  it('should return 404 if book not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/book/getBook/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Book not found');
  });

  it('should return 500 if bookId is invalid', async () => {
    const res = await request(app).get('/api/book/getBook/invalid_id');
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Error fetching book data');
  });
});
