import React from 'react';

function Sidebar({ chats, currentChat, onChatSelect, onNewChat, onDeleteChat }) {
  return (
    <div className="sidebar">
      <button onClick={onNewChat}>Nouveau chat</button>
      {chats.map(chat => (
        <div 
          key={chat.id} 
          className={`chat-tab ${currentChat === chat.id ? 'active' : ''}`}
          onClick={() => onChatSelect(chat.id)}
        >
          message {chat.id}
          {chats.length > 1 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className="delete-btn"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Sidebar