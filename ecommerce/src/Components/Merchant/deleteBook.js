import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DeleteBook = ()=>{
    const [books, setBooks] = useState([]);
    const [error, setError] = useState('');

    // Hàm để lấy tất cả sách
    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/book/getAllBook', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setBooks(response.data.books);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch books.');
        }
    };

    // Hàm để xóa sách
    const handleDelete = async (bookId) => {
        console.log("Attempting to delete book with ID:", bookId);
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                const response = await axios.delete(`http://localhost:5000/api/book/deleteBook/${bookId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                alert(response.data.message);
                fetchBooks(); // Lấy lại danh sách sách sau khi xóa
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete book.');
            }
        }
    };

    useEffect(() => {
        fetchBooks(); // Gọi hàm fetchBooks khi component được mount
    }, []);

    return (
        <div className="update-book__container">
            <h4>Danh sách sản phẩm</h4>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table>
                <tbody>
                    {books.map((book) => (
                        <tr key={book._id}>
                            <td>{book.bookTitle}</td>
                            <td>
                                <button onClick={() => handleDelete(book._id)} className="update-book__button p-1">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default DeleteBook;