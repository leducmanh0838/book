import React, { useState } from 'react';
import { Button } from "@mui/material";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import '../../css/searchBox.css';

const SearchBox = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchQuery.trim() === '') return;

        // Chuyển hướng đến ProductSeach với tham số truy vấn
        navigate(`/cat?query=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <div className='headerSearch ml-3'>
            <input
                type='text'
                placeholder='Search for books...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={handleSearch}><IoSearch /></Button>
        </div>
    );
};

export default SearchBox;
