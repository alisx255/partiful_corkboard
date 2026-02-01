import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AddMenu.css';

const AddMenu = ({ onAddBadge, onAddStickyNote, onAddPhoto, isOpen, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddBadge = () => {
    onAddBadge();
    setIsExpanded(false);
  };

  const handleAddStickyNote = () => {
    onAddStickyNote();
    setIsExpanded(false);
  };

  const handleAddPhoto = () => {
    onAddPhoto();
    setIsExpanded(false);
  };

  return (
    <div className="add-menu-container">
      <motion.button
        className="add-menu-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="add-icon">+</span>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="add-menu-options"
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              className="add-menu-option"
              onClick={handleAddBadge}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="option-icon">🏷️</span>
              <span className="option-label">Badge</span>
            </motion.button>
            <motion.button
              className="add-menu-option"
              onClick={handleAddStickyNote}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="option-icon">📝</span>
              <span className="option-label">Sticky Note</span>
            </motion.button>
            <motion.button
              className="add-menu-option"
              onClick={handleAddPhoto}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="option-icon">📷</span>
              <span className="option-label">Photo</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddMenu;

