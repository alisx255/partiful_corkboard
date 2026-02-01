import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import './StickyNote.css';

const StickyNote = ({ id, text, x, y, rotation, color = 'yellow', onUpdate, onDelete, onPositionUpdate, placementMode, onPlacementClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState(text || '');
  const [showEditButton, setShowEditButton] = useState(false);
  const noteRef = useRef(null);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // Sync noteText with text prop when it changes
  useEffect(() => {
    setNoteText(text || '');
  }, [text]);

  // Close edit button when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (noteRef.current && !noteRef.current.contains(event.target)) {
        setShowEditButton(false);
      }
    };

    if (showEditButton) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showEditButton]);

  const handleBlur = () => {
    setIsEditing(false);
    if (onUpdate) {
      onUpdate(id, noteText);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setNoteText(text || '');
      setIsEditing(false);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowEditButton(false);
    setIsEditing(true);
  };

  const handleRightClick = (e) => {
    if (!placementMode && !isEditing) {
      e.preventDefault();
      e.stopPropagation();
      setShowEditButton(true);
    }
  };

  const handleClick = (e) => {
    if (placementMode && onPlacementClick) {
      e.stopPropagation();
      onPlacementClick(x, y);
    } else {
      // Hide edit button on click outside
      setShowEditButton(false);
    }
  };

  return (
    <motion.div
      ref={noteRef}
      className={`sticky-note sticky-note-${color}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        rotate: rotation,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ 
        y: -5,
        rotate: rotation, // Keep rotation static
        transition: { duration: 0.2 }
      }}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >
      {/* Drag handle - top portion only */}
      <motion.div
        className="sticky-note-drag-handle"
        drag={!placementMode && !isEditing}
        dragMomentum={false}
        dragElastic={0}
        dragConstraints={false}
        dragPropagation={false}
        style={{ x: dragX, y: dragY }}
        onDrag={(event, info) => {
          // Reset drag handle position immediately
          dragX.set(0);
          dragY.set(0);
          
          // Framer Motion drag gives deltas in screen pixels
          // Update parent position, not this element's position
          if (onPositionUpdate) {
            const boardWidth = typeof window !== 'undefined' ? window.innerWidth * 0.6667 : 800;
            const maxX = boardWidth - 50 - 170;
            const newX = Math.max(0, Math.min(maxX, x + info.delta.x));
            const newY = Math.max(0, y + info.delta.y);
            onPositionUpdate(id, {
              x: newX - x,
              y: newY - y,
            });
          }
        }}
        onDragEnd={(event, info) => {
          // Reset drag handle position
          dragX.set(0);
          dragY.set(0);
          
          // Final position update with bounds checking
          if (onPositionUpdate) {
            const boardWidth = typeof window !== 'undefined' ? window.innerWidth * 0.6667 : 800;
            const maxX = boardWidth - 50 - 170;
            const newX = Math.max(0, Math.min(maxX, x));
            const newY = Math.max(0, y);
            onPositionUpdate(id, {
              x: newX - x,
              y: newY - y,
            });
          }
        }}
      />

      {isEditing ? (
        <textarea
          className="sticky-note-textarea"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          placeholder="Type your note..."
        />
      ) : (
        <>
          <button className="sticky-note-delete" onClick={handleDelete} title="Delete note">
            ×
          </button>
          <AnimatePresence>
            {showEditButton && (
              <motion.button
                className="sticky-note-edit"
                onClick={handleEdit}
                title="Edit note"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                ✏️
              </motion.button>
            )}
          </AnimatePresence>
          <div className="sticky-note-content">
            {noteText || <span className="sticky-note-placeholder">Right-click to edit</span>}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default StickyNote;

