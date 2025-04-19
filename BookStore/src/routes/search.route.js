import express from 'express';
import { getBooksBySupplier, getBooksByCategory, getBooksByPublisher, getBooksByType } from '../controllers/search.controller.js';

const router = express.Router();

router.get('/supplier/:supplierName', getBooksBySupplier);
router.get('/publisher/:publisherName', getBooksByPublisher);
router.get('/category/:categoryName', getBooksByCategory);
router.get('/type/:bookType', getBooksByType);

export default router;