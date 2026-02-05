import React, { useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import './ImageUpload.css';

const ImageUpload = ({ currentImage, onImageChange, folder, userId, maxSizeMB = 5 }) => {
  const { t } = useLocalization();
  const [preview, setPreview] = useState(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (jpg, png, etc.)');
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image size must be less than ${maxSizeMB}MB`);
      return;
    }

    setError('');
    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Call parent component's handler with the file
      // Parent will handle the upload
      onImageChange(file);
      setUploading(false);
    } catch (err) {
      setError('Error processing image. Please try again.');
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError('');
    onImageChange(null);
    // Reset file input
    const fileInput = document.getElementById('image-upload-input');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="image-upload-container">
      <div className="image-upload-preview">
        {preview ? (
          <div className="image-preview-wrapper">
            <img src={preview} alt="Preview" className="image-preview" />
            {!uploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="remove-image-button"
                title="Remove image"
              >
                ×
              </button>
            )}
          </div>
        ) : (
          <div className="image-upload-placeholder">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p>No image selected</p>
          </div>
        )}
      </div>

      <div className="image-upload-controls">
        <label htmlFor="image-upload-input" className="image-upload-button">
          {uploading ? (
            <>⏳ Uploading...</>
          ) : preview ? (
            <>📷 Change Image</>
          ) : (
            <>📷 Select Image</>
          )}
        </label>
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          style={{ display: 'none' }}
        />
        {preview && (
          <span className="image-upload-hint">
            Click to change image
          </span>
        )}
      </div>

      {error && <div className="image-upload-error">{error}</div>}
      {uploading && (
        <div className="image-upload-progress">
          Processing image...
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
