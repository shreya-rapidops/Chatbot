import React, { useState, useEffect, useRef } from "react";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    return JSON.parse(localStorage.getItem("chatHistory")) || [];
  });

  const chatRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    fetch("https://5000-solid-space-umbrella-jj7wrxw7gpq4c5vxr-3000.app.github.dev/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: input })
    })
    
    
      .then((res) => res.json())
      .then((data) => {
        const reply = data.reply || "No response.";
        const botMsg = { text: reply, sender: "bot" };
        setMessages((prev) => [...prev, botMsg]);
        speak(reply);
      })
      .catch(() =>
        setMessages((prev) => [...prev, { text: "Error connecting to assistant", sender: "bot" }])
      );
  };

  const handleVoice = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const voiceInput = event.results[0][0].transcript;
      setInput(voiceInput);
      setTimeout(() => handleSend(), 500);
    };

    recognition.onerror = () => {
      alert("Voice recognition error.");
    };
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="chat-container">
      <h2>🤖 AI Assistant</h2>
      <div className="chat-box" ref={chatRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-group">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
        />
        <button onClick={handleVoice}>🎤</button>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
