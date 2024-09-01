"use client";

import React, { useEffect, useState } from "react";
import { webSocketService } from "@/app/services/web-socket-service";

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [socket, setSocket] = useState<any>(null);

  console.log("SOCKET: ", socket);

  useEffect(() => {
    const socketInstance = webSocketService.connect("http://localhost:9000");
    setSocket(socketInstance);

    // Listen for messages
    socketInstance.on("message", (message: string) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      webSocketService.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() !== "") {
      webSocketService.sendMessage("sendMessage", input);
      setInput("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chat Room</h1>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        style={{ width: "80%", padding: "10px" }}
      />
      <button onClick={sendMessage} style={{ padding: "10px" }}>
        Send
      </button>
    </div>
  );
};

export default ChatComponent;
