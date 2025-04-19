import express from 'express';
import {getBookById, getAllBooks, getCategory} from '../controllers/book.controler.js';
const router = express.Router();

router.get("/getBook/:bookId", getBookById);
router.get('/getAll', getAllBooks);
router.get('/getCategory', getCategory);

export default router;