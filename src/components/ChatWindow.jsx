import React from 'react';
import ImageUpload from './ImageUpload';

function ChatWindow({ messages, isLoading, input, onInputChange, onSend, onClear, onImageUpload }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSend();
    }
  };
  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Ton assistant animalier</h2>
        <button onClick={onClear}>Réinitialiser le chat</button>
      </div>
      <div className="messages">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.role === 'user' ? 'user' : 'assistant'}`}
          >
            {message.image && (
              <img 
                src={message.image} 
                alt="Uploaded pet"
                className="message-image"
              />
            )}
            {message.content}
          </div>
        ))}
        {isLoading && <div className="message assistant">Réfléchi...</div>}
      </div>
      <div className="input-area">
        <ImageUpload onImageUpload={onImageUpload} />
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about your pets..."
        />
        <button onClick={onSend} disabled={isLoading}>
          Envoyer
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;