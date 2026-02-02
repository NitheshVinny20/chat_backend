import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import messageRoutes from "./routes/messages.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/api/messages", messageRoutes);

// Health check (useful for Render and quick smoke tests)
app.get("/", (req, res) => {
  res.send("OK");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
