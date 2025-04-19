import express from 'express';
import {createPromotion,getAllPromotions ,updatePromotion,deletePromotion} from '../controllers/promotion.controller.js';
import { authenticateToken, authorizeRoles } from "../middleware/authentication.middleware.js";

const router = express.Router();

router.use(authenticateToken);

// merchant promotion
router.post('/createPromotion',authenticateToken, authorizeRoles('merchant'), createPromotion);
router.get('/getAllPromotions',authenticateToken, authorizeRoles('merchant'), getAllPromotions); 
router.put('/updatePromotion/:promotionId',authenticateToken, authorizeRoles('merchant'), updatePromotion);
router.delete('/deletePromotion/:promotionId',authenticateToken, authorizeRoles('merchant'), deletePromotion);

export default router;