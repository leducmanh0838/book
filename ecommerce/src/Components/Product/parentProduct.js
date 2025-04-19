import React, { useEffect } from 'react';
import ProductItem from './productItem';
import { useParams } from 'react-router-dom';

const ParentComponent = () => {
    const { id: bookId } = useParams(); 

    useEffect(() => {
        console.log('ParentComponent is rendered');
        console.log('Received bookId in ParentComponent:', bookId); 
    }, [bookId]);

    return (
      <div>
        <ProductItem bookId={bookId} /> 
      </div>
    );
};

export default ParentComponent;
