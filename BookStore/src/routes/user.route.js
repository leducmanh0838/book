import express from "express";
import {getUserProfile, updateProfile, searchBookForUser, getAllBook} from "../controllers/user.controller.js";
import { authenticateToken, authorizeRoles } from "../middleware/authentication.middleware.js";
import {getAllBooks} from '../controllers/merchant.controller.js';
const router = express.Router();

router.get("/getUserProfile/:id",authenticateToken,authorizeRoles('user', 'merchant', 'admin'), getUserProfile);
router.put("/updateProfile/:id",authenticateToken, authorizeRoles('user', 'merchant', 'admin'), updateProfile);

router.get('/getAllBook',authenticateToken, authorizeRoles('user'), getAllBooks);
router.get('/getbook', getAllBook);
router.get('/search', searchBookForUser);

export default router;