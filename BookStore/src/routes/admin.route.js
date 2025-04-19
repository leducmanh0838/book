import express from "express";
import { createMerchant, updateMerchant, deleteMerchant, getMerchant, getAllMerchants } from "../controllers/admin.controller.js";
import { createUser, getAllUsers, getUser, updateUser, deleteUser } from "../controllers/admin.controller.js";
import { authenticateToken, authorizeRoles } from "../middleware/authentication.middleware.js";

const router = express.Router();

// Merchant routes
router.post("/createMerchants", authenticateToken, authorizeRoles('admin'), createMerchant);
router.put("/updateMerchants/:id", authenticateToken, authorizeRoles('admin'), updateMerchant);
router.delete("/deleteMerchants/:id", authenticateToken, authorizeRoles('admin'), deleteMerchant);
router.get("/getAllMerchants", authenticateToken, authorizeRoles('admin'), getAllMerchants);
router.get("/getMerchants/:id", authenticateToken, authorizeRoles('admin'), getMerchant);

// User routes
router.post("/createUsers", authenticateToken, authorizeRoles('admin'), createUser);
router.get("/getAllUsers", authenticateToken, authorizeRoles('admin'), getAllUsers);
router.get("/getUsers", authenticateToken, authorizeRoles('admin'), getUser);
router.put("/updateUsers/:id", authenticateToken, authorizeRoles('admin'), updateUser);
router.delete("/deleteUsers/:id", authenticateToken, authorizeRoles('admin'), deleteUser);

export default router; 