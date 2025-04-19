import express from "express";
import cookieParser from "cookie-parser";
import dotenv  from "dotenv";
import { connectDB } from "./dbConnect/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.route.js";
import bookRoutes from "./routes/book.route.js";
import promotionRoutes from "./routes/promotion.route.js";
import cartRoutes from "./routes/cart.route.js";
import merchantRoutes from "./routes/merchant.route.js";
import cors from "cors";
import searchRoutes from './routes/book.route.js';
import orderRoutes from "./routes/order.route.js";
import getRoutes from "./routes/search.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use('/api/book', bookRoutes);
app.use("/api/promotion", promotionRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/merchant", merchantRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/order", orderRoutes);
app.use("/api", getRoutes);

app.listen(PORT, () =>{
    console.log("HELLO");
    connectDB();
    console.log("Server is running on port: ", PORT)
})

export default app;