import express from 'express';
import { createBook, getAllBooks, updateBook, deleteBook, searchBooks } from '../controllers/merchant.controller.js';
import {upload} from '../middleware/upload.middleware.js';
import { authenticateToken, authorizeRoles } from "../middleware/authentication.middleware.js";

const router = express.Router();

router.get('/getAllBook',authenticateToken, authorizeRoles('merchant'), getAllBooks);

router.get('/search',authenticateToken, authorizeRoles('merchant'), searchBooks);


router.post('/createBook', authenticateToken,authorizeRoles('merchant'), upload.single('bookImage'), createBook);
router.put('/updateBook/:bookId', authenticateToken,authorizeRoles('merchant'), upload.single('bookImage'), updateBook);
router.delete('/deleteBook/:bookId', authenticateToken,authorizeRoles('merchant'), deleteBook);

export default router;