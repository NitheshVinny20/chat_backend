import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// GET all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "check connection" });
  }
});

// POST a new message
router.post("/", async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error("POST /api/messages error:", err.message);
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
