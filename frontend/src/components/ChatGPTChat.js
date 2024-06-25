import React, { useState } from 'react';
import axios from 'axios';
import './ChatGPTChat.css';

const ChatGPTChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post('/api/chat', { prompt: input });
      const botMessage = { sender: 'bot', text: response.data.generatedText };
      setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { sender: 'bot', text: 'Failed to get a response. Please try again.' };
      setMessages((prevMessages) => [...prevMessages, userMessage, errorMessage]);
    }

    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type your message..."
        className="chat-input"
      />
      <button onClick={handleSend} className="send-button">Send</button>
    </div>
  );
};

export default ChatGPTChat;
