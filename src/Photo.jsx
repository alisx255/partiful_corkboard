import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Photo.css';

const ALBUM_LINK = 'https://partifulalbumfeature.netlify.app/';

const Photo = ({
  id,
  images = [], // Array of image URLs
  x,
  y,
  rotation,
  width = 200,
  height = 200,
  editMode = true,
  onUpdate,
  onDelete,
  onEdit,
  decoration = null,
  onDecorationUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rightClicked, setRightClicked] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(id);
    }
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setRightClicked(!rightClicked);
  };

  // Calculate strip dimensions based on number of photos (vertical layout)
  // Ensure images is an array
  const imagesArray = Array.isArray(images) ? images : (images ? [images] : []);
  const photoCount = imagesArray.length > 0 ? imagesArray.length : 1;
  const borderWidth = 8; // Border width (matches CSS)
  const photoHeight = 120; // Fixed height per photo (smaller)
  const photoWidth = 100; // Fixed width per photo (smaller)
  const borderBetweenPhotos = 8; // Border between photos (same as outer border)
  // Total height = border + (photos * photoHeight) + (borders between photos) + border
  const stripHeight = (borderWidth * 2) + (photoCount * photoHeight) + ((photoCount - 1) * borderBetweenPhotos);
  // Total width = border + photoWidth + border
  const stripWidth = (borderWidth * 2) + photoWidth;

  return (
    <motion.div
      className={`photo-strip ${decoration === 'pin' ? 'has-pin' : ''} ${decoration === 'tape' ? 'has-tape-decoration' : ''} ${decoration === 'magnet' ? 'has-magnet' : ''}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${stripWidth}px`,
        height: `${stripHeight}px`,
        rotate: rotation,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      drag={editMode}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={false}
      onDrag={(event, info) => {
        // Framer Motion drag gives deltas in screen pixels
        if (onUpdate) {
          const boardWidth = typeof window !== 'undefined' ? window.innerWidth * 0.6667 : 800;
          const maxX = boardWidth - 50 - stripWidth;
          const newX = Math.max(0, Math.min(maxX, x));
          const newY = Math.max(0, y);
          onUpdate(id, {
            x: newX,
            y: newY,
          });
        }
      }}
      onDragEnd={(event, info) => {
        // Final position update with bounds checking
        if (onUpdate) {
          const boardWidth = typeof window !== 'undefined' ? window.innerWidth * 0.6667 : 800;
          const maxX = boardWidth - 50 - stripWidth;
          const newX = Math.max(0, Math.min(maxX, x));
          const newY = Math.max(0, y);
          onUpdate(id, {
            x: newX,
            y: newY,
          });
        }
      }}
      onContextMenu={editMode ? handleRightClick : undefined}
      onClick={(e) => {
        if (!editMode) {
          // View mode - open link in new tab
          e.stopPropagation();
          window.open(ALBUM_LINK, '_blank');
        } else if (!e.target.closest('.photo-decoration-menu')) {
          // Close menu when clicking outside
          setRightClicked(false);
        }
      }}
    >
      <div className="photo-strip-content">
        {imagesArray.length > 0 ? (
          imagesArray.map((image, index) => (
            <div 
              key={index} 
              className="photo-strip-item"
              style={{ height: `${photoHeight}px` }}
            >
              <img 
                src={image} 
                alt={`Photo ${index + 1}`} 
                className="photo-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="photo-placeholder">
                <span className="photo-placeholder-icon">📷</span>
              </div>
            </div>
          ))
        ) : (
          <div className="photo-strip-item" style={{ height: `${photoHeight}px` }}>
            <div className="photo-placeholder">
              <span className="photo-placeholder-icon">📷</span>
              <span className="photo-placeholder-text">Add Photos</span>
            </div>
          </div>
        )}
      </div>
      {editMode && (
        <button className="photo-delete" onClick={handleDelete} title="Delete photo strip">
          ×
        </button>
      )}
      {editMode && onEdit && (
        <button className="photo-edit" onClick={handleEdit} title="Edit photos">
          ✏️
        </button>
      )}
      
      {/* Decoration menu on right-click */}
      <AnimatePresence>
        {rightClicked && (
          <motion.div
            className="photo-decoration-menu"
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={`decoration-option ${decoration === 'pin' ? 'active' : ''}`}
              onClick={() => {
                if (onDecorationUpdate) {
                  onDecorationUpdate(id, decoration === 'pin' ? null : 'pin');
                }
                setRightClicked(false);
              }}
              title="Add pin"
            >
              📌 Pin
            </button>
            <button
              className={`decoration-option ${decoration === 'tape' ? 'active' : ''}`}
              onClick={() => {
                if (onDecorationUpdate) {
                  onDecorationUpdate(id, decoration === 'tape' ? null : 'tape');
                }
                setRightClicked(false);
              }}
              title="Add tape"
            >
              📋 Tape
            </button>
            <button
              className={`decoration-option ${decoration === 'magnet' ? 'active' : ''}`}
              onClick={() => {
                if (onDecorationUpdate) {
                  onDecorationUpdate(id, decoration === 'magnet' ? null : 'magnet');
                }
                setRightClicked(false);
              }}
              title="Add magnet"
            >
              🧲 Magnet
            </button>
            {onEdit && (
              <>
                <div className="decoration-menu-divider"></div>
                <button
                  className="decoration-option"
                  onClick={() => {
                    handleEdit({ stopPropagation: () => {} });
                    setRightClicked(false);
                  }}
                  title="Edit photos"
                >
                  ✏️ Edit Photos
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="photo-corner photo-corner-tl"></div>
      <div className="photo-corner photo-corner-tr"></div>
      <div className="photo-corner photo-corner-bl"></div>
      <div className="photo-corner photo-corner-br"></div>
    </motion.div>
  );
};

export default Photo;
