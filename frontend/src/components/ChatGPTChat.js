// /frontend/src/components/ChatGPTChat.js
// /frontend/src/components/ChatGPTChat.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatGPTChat.css';

const ChatGPTChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialMessage = "안녕하세요 아래 창에 제품 관련 문의를 해주세요";
    typeMessage(initialMessage);
  }, []);

  const typeMessage = (message) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < message.length) {
        setMessages((prevMessages) => [{ sender: 'bot', text: message.slice(0, index + 1) }, ...prevMessages.slice(1)]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [userMessage, ...prevMessages]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/chat', { prompt: input });
      const botMessage = { sender: 'bot', text: response.data.generatedText };
      setMessages((prevMessages) => [botMessage, ...prevMessages]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { sender: 'bot', text: 'Failed to get a response. Please try again.' };
      setMessages((prevMessages) => [errorMessage, ...prevMessages]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        {loading && <div className="loading-indicator">Loading...</div>}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="궁금하신 상품을 물어 보세요..."
          className="chat-input"
        />
        <button onClick={handleSend} className="send-button">Send</button>
      </div>
    </div>
  );
};

export default ChatGPTChat;
