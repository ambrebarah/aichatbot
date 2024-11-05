import { useState } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import './App.css';

function App() {
  const [chats, setChats] = useState([{ id: 1, messages: [] }]);
  const [currentChat, setCurrentChat] = useState(1);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    const updatedChats = [...chats];
    const chatIndex = updatedChats.findIndex(chat => chat.id === currentChat);

    const userMessage = { role: 'user', content: input };
    updatedChats[chatIndex].messages.push(userMessage);
    setChats(updatedChats);
    setInput('');

    try {
      const response = await axios.post('http://localhost:3000/api/chat', {
        messages: updatedChats[chatIndex].messages
      });

      updatedChats[chatIndex].messages.push({
        role: 'assistant',
        content: response.data.message
      });

      setChats(updatedChats);
    } catch (error) {
      console.error('Error:', error);
    }

    setIsLoading(false);
  };

  const handleImageUpload = async (base64Image) => {
    setIsLoading(true);
    const updatedChats = [...chats];
    const chatIndex = updatedChats.findIndex(chat => chat.id === currentChat);

    const userMessage = {
      role: 'user',
      content: 'Peux-tu m`aider à identifier cette image?',
      image: base64Image
    };
    updatedChats[chatIndex].messages.push(userMessage);
    setChats(updatedChats);

    try {
      const response = await axios.post('http://localhost:3000/api/analyze-image', {
        image: base64Image
      });

      updatedChats[chatIndex].messages.push({
        role: 'assistant',
        content: response.data.message
      });

      setChats(updatedChats);
    } catch (error) {
      console.error('Error:', error);
    }

    setIsLoading(false);
  };

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      messages: []
    };
    setChats([...chats, newChat]);
    setCurrentChat(newChat.id);
  };

  const clearChat = () => {
    const updatedChats = chats.map(chat => 
      chat.id === currentChat ? { ...chat, messages: [] } : chat
    );
    setChats(updatedChats);
  };

  const deleteChat = (chatId) => {
    if (chats.length === 1) return;
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    setCurrentChat(updatedChats[0].id);
  };

  const currentMessages = chats.find(chat => chat.id === currentChat)?.messages || [];

  return (
    <div className="app-container">
      <Sidebar 
        chats={chats}
        currentChat={currentChat}
        onChatSelect={setCurrentChat}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
      />
      <ChatWindow 
        messages={currentMessages}
        isLoading={isLoading}
        input={input}
        onInputChange={setInput}
        onSend={handleSend}
        onClear={clearChat}
        onImageUpload={handleImageUpload}
      />
    </div>
  );
}

export default App;