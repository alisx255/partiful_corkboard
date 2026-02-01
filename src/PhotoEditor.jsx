import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PhotoEditor.css';

const PhotoEditor = ({ isOpen, onClose, photoCount, onSave, existingImages = [] }) => {
  const [selectedCount, setSelectedCount] = useState(photoCount || 1);
  const [images, setImages] = useState(existingImages || []);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedCount(photoCount || 1);
      setImages(existingImages || []);
      setImageFiles([]);
    }
  }, [isOpen, photoCount, existingImages]);

  const handleCountSelect = (count) => {
    setSelectedCount(count);
    // Trim images array if reducing count
    if (images.length > count) {
      setImages(images.slice(0, count));
      setImageFiles(imageFiles.slice(0, count));
    } else {
      // Add empty slots if increasing count
      const newImages = [...images];
      const newImageFiles = [...imageFiles];
      while (newImages.length < count) {
        newImages.push(null);
        newImageFiles.push(null);
      }
      setImages(newImages);
      setImageFiles(newImageFiles);
    }
  };

  const handleImageSelect = (index, file) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const newImages = [...images];
      const newImageFiles = [...imageFiles];
      newImages[index] = event.target.result;
      newImageFiles[index] = file;
      setImages(newImages);
      setImageFiles(newImageFiles);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    const newImageFiles = [...imageFiles];
    newImages[index] = null;
    newImageFiles[index] = null;
    setImages(newImages);
    setImageFiles(newImageFiles);
  };

  const handleSave = () => {
    // Filter out null images
    const validImages = images.filter(img => img !== null);
    if (validImages.length > 0) {
      onSave(validImages);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="photo-editor"
          className="photo-editor-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
        <motion.div
          className="photo-editor-dialog"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>{existingImages.length > 0 ? 'Edit Photo Strip' : 'Create Photo Strip'}</h2>
          
          <div className="photo-count-selector">
            <label>Number of photos:</label>
            <div className="count-buttons">
              {[1, 2, 3, 4].map(count => (
                <button
                  key={count}
                  className={`count-button ${selectedCount === count ? 'active' : ''}`}
                  onClick={() => handleCountSelect(count)}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div className="photo-upload-grid">
            {Array.from({ length: selectedCount }).map((_, index) => (
              <div key={index} className="photo-upload-slot">
                {images[index] && images[index] !== null ? (
                  <div className="photo-preview">
                    <img src={images[index]} alt={`Photo ${index + 1}`} />
                    <button
                      className="remove-photo"
                      onClick={() => handleRemoveImage(index)}
                      title="Remove photo"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="photo-upload-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleImageSelect(index, file);
                        e.target.value = ''; // Reset input
                      }}
                      style={{ display: 'none' }}
                    />
                    <span className="upload-icon">📷</span>
                    <span className="upload-text">Add Photo {index + 1}</span>
                  </label>
                )}
              </div>
            ))}
          </div>

          <div className="photo-editor-actions">
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button
              className="save-button"
              onClick={handleSave}
              disabled={images.filter(img => img !== null).length === 0}
            >
              {existingImages.length > 0 ? 'Update' : 'Create'}
            </button>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PhotoEditor;

