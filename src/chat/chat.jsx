import { useState, useEffect, useRef } from "react";
import "../style/app.css";

function Chat({ user }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // API base URL (set VITE_API_URL in .env or Vercel):
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // fetch messages
  useEffect(() => {
    if (!user) return;

    const fetchMessages = () => {
      fetch(`${API_BASE}/api/messages`)
        .then(res => res.json())
        .then(data => setMessages(data));
    };

    fetchMessages(); // auto refresh
    const interval = setInterval(fetchMessages, 1000);

    return () => clearInterval(interval);
  }, [user]);


  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // send message
  const sendMessage = async () => {
    if (!message.trim() || !user) return;

    try {
      const res = await fetch(`${API_BASE}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: message,
          userId: user.uid,
          userName: user.displayName 
        }),
      });
      if (!res.ok) {
        // try to read server-provided error message
        let errBody = null;
        try { errBody = await res.json(); } catch (e) { /* ignore */ }
        const serverMsg = errBody && errBody.error ? errBody.error : `${res.status} ${res.statusText}`;
        throw new Error(serverMsg);
      }

      const newMessage = await res.json();
      setMessages([...messages, newMessage]);
      setMessage("");
    } catch (err) {
      console.error("Send message failed:", err);
      alert(`Failed to send: ${err.message}`);
    }
  };

  // delete message
  const deleteMessage = async (id) => {
    const res = await fetch(`${API_BASE}/api/messages/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMessages(messages.filter(m => m._id !== id));
    } else {
      alert("Failed to delete message");
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((m) => (
          <div key={m._id} className="message-item">
            <p>{m.text}</p>
            <button onClick={() => deleteMessage(m._id)}>Delete</button>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div><br></br>

      <div className="input-group">
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
