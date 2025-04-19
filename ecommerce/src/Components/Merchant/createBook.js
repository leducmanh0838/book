import React, { useState } from 'react';
import axios from 'axios';

const CreateBook = () => {
    const [bookData, setBookData] = useState({
        bookType: '',
        bookTitle: '',
        price: '',
        publisher: '',
        discountCode: '',
        supplier: '',
        stockQuantity: '',
        description: '',
        category: '',
        subCategory: '',
        publicationDate: '',
        pageCount: '',
        bookImage: '', // Thêm trường cho URL hình ảnh
        author: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Lấy ID của merchant từ token hoặc state
        const merchantId = localStorage.getItem('merchantId'); // giả định bạn lưu merchantId trong localStorage
    
        const updatedBookData = {
            ...bookData,
            price: Number(bookData.price),
            stockQuantity: Number(bookData.stockQuantity),
            pageCount: Number(bookData.pageCount),
            publicationDate: bookData.publicationDate,
            merchantId: merchantId, // Thêm ID của merchant
        };
    
        try {
            const response = await axios.post('http://localhost:5000/api/merchant/createBook', updatedBookData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            alert(response.data.message);
            // Reset form after success
            setBookData({
                bookType: '',
                bookTitle: '',
                price: '',
                publisher: '',
                discountCode: '',
                supplier: '',
                stockQuantity: '',
                description: '',
                category: '',
                subCategory: '',
                publicationDate: '',
                pageCount: '',
                bookImage: '',
                author: '', 
            });
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong!');
        }
    };

    return (
        <div>
            <h2>Tạo sản phẩm</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} className='product-form'>
                <input
                    type="text"
                    name="bookType"
                    placeholder="Book Type"
                    value={bookData.bookType}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="bookTitle"
                    placeholder="Book Title"
                    value={bookData.bookTitle}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="author"
                    placeholder="Author"
                    value={bookData.author}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={bookData.price}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="publisher"
                    placeholder="Publisher"
                    value={bookData.publisher}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="discountCode"
                    placeholder="Discount Code"
                    value={bookData.discountCode}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="supplier"
                    placeholder="Supplier"
                    value={bookData.supplier}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="stockQuantity"
                    placeholder="Stock Quantity"
                    value={bookData.stockQuantity}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={bookData.description}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={bookData.category}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="subCategory"
                    placeholder="Sub Category"
                    value={bookData.subCategory}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="publicationDate"
                    placeholder="Publication Date (dd/MM/yyyy)"
                    value={bookData.publicationDate}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="pageCount"
                    placeholder="Page Count"
                    value={bookData.pageCount}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="bookImage"
                    placeholder="Book Image URL"
                    value={bookData.bookImage}
                    onChange={handleChange}
                    required
                />
                <button className='createBook' type="submit">Create Book</button>
            </form>
        </div>
    );
};

export default CreateBook;