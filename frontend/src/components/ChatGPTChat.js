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
    typeMessage(initialMessage, true);
  }, []);

  const typeMessage = (message, instant = false) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < message.length) {
        setMessages((prevMessages) => [{ sender: 'bot', text: message.slice(0, index + 1) }, ...prevMessages.slice(1)]);
        index++;
      } else {
        clearInterval(interval);
        if (!instant) setLoading(false);
      }
    }, instant ? 0 : Math.min(5000 / message.length, 100));
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [userMessage, ...prevMessages]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/chat', { prompt: input });
      const botMessageFull = response.data.generatedText;
      
      // 전체 메시지 바로 출력
      setMessages((prevMessages) => [{ sender: 'bot', text: botMessageFull }, ...prevMessages]);

      // 타자 효과 적용
      typeMessage(botMessageFull, false);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { sender: 'bot', text: 'Failed to get a response. Please try again.' };
      setMessages((prevMessages) => [errorMessage, ...prevMessages]);
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.sender === 'bot' ? <div dangerouslySetInnerHTML={{ __html: message.text }} /> : <div>{message.text}</div>}
          </div>
        ))}
        {loading && <div className="loading-indicator">Loading...</div>}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
          placeholder="궁금하신 내용을 물어 보세요..."
          className="chat-input"
          disabled={loading}
        />
        <button onClick={handleSend} className="send-button" disabled={loading}>Send</button>
      </div>
      <div>
        <a href='/Goods'>상품검색 하기</a>
      </div>
    </div>
  );
};

export default ChatGPTChat;
