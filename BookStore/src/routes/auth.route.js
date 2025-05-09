import express from "express";
import {  login, logout, signup, resetPassword, forgetPassword, verifyEmail } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.post("/verify-email", verifyEmail)

router.post("/forget-password", forgetPassword)

router.post("/reset-password", resetPassword)

export default router;