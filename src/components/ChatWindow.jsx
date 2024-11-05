import React from 'react';
import ImageUpload from './ImageUpload';

function ChatWindow({ messages, isLoading, input, onInputChange, onSend, onClear, onImageUpload }) {
  
  // Fonction pour envoyer le message lorsque l'utilisateur appuie sur "Entrée"
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSend();
    }
  };

  return (
    <div className="chat-container">
      {/* En-tête du chat avec bouton de réinitialisation */}
      <div className="chat-header">
        <h2>Ton assistant animalier</h2>
        <button onClick={onClear}>Réinitialiser le chat</button>
      </div>

      {/* Zone d'affichage des messages */}
      <div className="messages">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.role === 'user' ? 'user' : 'assistant'}`}
          >
            {/* Affiche une image si elle est présente dans le message */}
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
        {/* Indicateur de chargement pendant que l'IA répond */}
        {isLoading && <div className="message assistant">Réfléchit...</div>}
      </div>

      {/* Zone d'entrée de texte et d'envoi d'image */}
      <div className="input-area">
        <ImageUpload onImageUpload={onImageUpload} />
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Posez une question sur vos animaux..."
        />
        <button onClick={onSend} disabled={isLoading}>
          Envoyer
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
