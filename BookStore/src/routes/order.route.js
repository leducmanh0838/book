import express from 'express';
import { createOrder, getOrder } from '../controllers/order.controller.js';
import { authenticateToken, authorizeRoles } from "../middleware/authentication.middleware.js";

const router = express.Router();

router.post('/createOrder',authenticateToken, authorizeRoles('user'), createOrder);
router.get('/:id',authenticateToken, authorizeRoles('user'), getOrder);

export default router;