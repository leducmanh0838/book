import React, { useState } from 'react';
import axios from 'axios';

const UpdateBook = ()=>{
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [error, setError] = useState('');
    
    // Hàm tìm kiếm sách
    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/book/search?query=${query}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setBooks(response.data.books);
            setError(''); // Reset error
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to search books.');
        }
    };

    // Hàm cập nhật sách
    const handleUpdate = async () => {
        if (!selectedBook) return;

        try {
            const response = await axios.put(`http://localhost:5000/api/book/updateBook/${selectedBook._id}`, selectedBook, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            alert(response.data.message);
            setSelectedBook(null); // Reset selected book
            handleSearch(); // Lấy lại danh sách sách sau khi cập nhật
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update book.');
        }
    };

    const handleEdit = (book) => {
        setSelectedBook(book);
    };

    const handleCloseUpdate = () => {
        setSelectedBook(null);
    };

    const handleEnterKey = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div>
            <h3 className="update-book__header">Cập nhập sách</h3>
            <h4 className="update-book__header">Tìm kiếm sách</h4>
            <div className="update-book__container">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleEnterKey}
                placeholder="Nhập tên, loại, tác giả..."
                className="update-book__input"
            />
            <button onClick={handleSearch} className="update-book__button">Tìm kiếm</button>
            {error && <p className="update-book__error">{error}</p>}
            <ul className="update-book__list">
                {books.map(book => (
                    <li key={book._id} className="update-book__list-item">
                        <h4>{book.bookTitle} - {book.bookType}</h4>
                        <button onClick={() => handleEdit(book)} className="update-book__edit-button">Chỉnh sửa</button>
                    </li>
                ))}
            </ul>

            {selectedBook && (
                <div>
                <h5>Cập Nhật Thông Tin Sách</h5>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input
                    type="text"
                    name="bookTitle"
                    value={selectedBook.bookTitle || ''}
                    onChange={(e) => setSelectedBook({ ...selectedBook, bookTitle: e.target.value })}
                    placeholder="Tên sách"
                />
                <input
                    type="text"
                    name="bookType"
                    value={selectedBook.bookType || ''}
                    onChange={(e) => setSelectedBook({ ...selectedBook, bookType: e.target.value })}
                    placeholder="Loại sách"
                />
                <input
                    type="text"
                    name="author"
                    value={selectedBook.author || ''}
                    onChange={(e) => setSelectedBook({ ...selectedBook, author: e.target.value })}
                    placeholder="Nhà xuất bản"
                />
                <input
                    type="number"
                    name="price"
                    value={selectedBook.price || ''}
                    onChange={(e) => setSelectedBook({ ...selectedBook, price: e.target.value })}
                    placeholder="Giá"
                />
                <input
                    type="text"
                    name="publisher"
                    value={selectedBook.publisher || ''}
                    onChange={(e) => setSelectedBook({ ...selectedBook, publisher: e.target.value })}
                    placeholder="Nhà xuất bản"
                />
                <input
                    type="text"
                    name="discountCode"
                    value={selectedBook.discountCode || ''}
                    onChange={(e) => setSelectedBook({ ...selectedBook, discountCode: e.target.value })}
                    placeholder="Mã giảm giá"
                />
                <input
                    type="text"
                    name="supplier"
                    value={selectedBook.supplier || ''}
                    onChange={(e) => setSelectedBook({ ...selectedBook, discountCode: e.target.value })}
                    placeholder="Nhà cung cấp"
                />
                <input
                    type="number"
                    name="stockQuantity"
                    value={selectedBook.stockQuantity || ''}
                    onChange={(e) => setSelectedBook({ ...selectedBook, stockQuantity: e.target.value })}
                    placeholder="Số lượng"
                />
                <textarea
                    name="description"
                    value={selectedBook.description || ''}
                    onChange={(e) => setSelectedBook({ ...selectedBook, description: e.target.value })}
                    placeholder="Mô tả"
                />
                <input
                    type="text"
                    name="category"
                    value={selectedBook.category || ''}
                    onChange={(e) => setSelectedBook({ ...selectedBook, category: e.target.value })}
                    placeholder="Danh mục"
                />
                <input
                    type="text"
                    name="subCategory"
                    value={selectedBook.subCategory || ''}
                    onChange={(e) => setSelectedBook({ ...selectedBook, subCategory: e.target.value })}
                    placeholder="Danh mục con"
                />
                <input
                    type="text"
                    name="publicationDate"
                    value={selectedBook.publicationDate || ''}
                    onChange={(e) => setSelectedBook({ ...selectedBook, publicationDate: e.target.value })}
                    placeholder="Ngày xuất bản (dd/MM/yyyy)"
                />
                <input
                    type="number"
                    name="pageCount"
                    value={selectedBook.pageCount || ''}
                    onChange={(e) => setSelectedBook({ ...selectedBook, pageCount: e.target.value })}
                    placeholder="Số trang"
                />
                <input
                    type="text"
                    name="bookImageUrl"
                    value={selectedBook.bookImage || ''}
                    onChange={(e) => setSelectedBook({ ...selectedBook, bookImage: e.target.value })}
                    placeholder="URL ảnh sách"
                />
                    {/* Thêm các trường khác tương ứng nếu cần */}
                    <button onClick={handleUpdate} className="update-book__button">Cập nhật</button>
                    <button onClick={handleCloseUpdate} className=" update-book__button">Đóng</button>
                </div>
            )}
            </div>

        </div>
    );
};
export default UpdateBook;