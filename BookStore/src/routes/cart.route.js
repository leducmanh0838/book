import express from "express";
import { authenticateToken, authorizeRoles } from "../middleware/authentication.middleware.js";
import {addToCart, updateCartItem, removeItemFromCart, getAllCart} from '../controllers/cart.controller.js';

const router = express.Router();

router.post('/add', authenticateToken, authorizeRoles('user'), addToCart);
router.get('/getAllCart/:userId', authenticateToken, authorizeRoles('user'), getAllCart);
router.put('/update', authenticateToken, authorizeRoles('user'), updateCartItem);
router.delete('/remove', authenticateToken, authorizeRoles('user'), removeItemFromCart);

export default router;