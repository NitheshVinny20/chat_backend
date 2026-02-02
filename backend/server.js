import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import messageRoutes from "./routes/messages.js";

dotenv.config();

const app = express();

// Allow localhost for dev, or use CLIENT_URL for production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : allowedOrigins,
  credentials: true
}));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✓ MongoDB connected"))
  .catch(err => {
    console.error("✗ MongoDB connection failed:", err.message);
    process.exit(1);
  });

app.use("/api/messages", messageRoutes);

// Health check (useful for Render and quick smoke tests)
app.get("/", (req, res) => {
  res.send("OK");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
