import React, { useRef } from 'react';

function ImageUpload({ onImageUpload }) {
  const fileInputRef = useRef();

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-upload">
      <button 
        onClick={() => fileInputRef.current.click()}
        className="upload-btn"
      >
        📷
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </div>
  );
}

export default ImageUpload;