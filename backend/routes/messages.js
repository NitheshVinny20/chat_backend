import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// GET all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("GET /api/messages error:", err.message);
    res.status(500).json({ error: err.message || "Failed to fetch messages" });
  }
});

// POST a new message
router.post("/", async (req, res) => {
  try {
    // Basic validation to provide clearer errors
    const { text, userId, userName } = req.body || {};
    if (!text || !String(text).trim()) {
      console.warn("POST /api/messages validation failed - body:", req.body);
      return res.status(400).json({ error: "`text` is required" });
    }

    const message = new Message({ text: String(text).trim(), userId, userName });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error("POST /api/messages error:", err && err.message ? err.message : err);
    res.status(400).json({ error: err.message || "Failed to create message" });
  }
});

// DELETE a message by ID
router.delete("/:id", async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ error: "Message not found" });
    res.json({ message: "Message deleted", deletedMessage: message });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

export default router;
