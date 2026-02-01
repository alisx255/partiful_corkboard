import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './IDCard.css';

const IDCard = ({
  id,
  name,
  tagline,
  avatar,
  partiesAttended,
  partiesHosted,
  socialLinks = {},
  onDelete,
  onDecorationUpdate,
  decoration = null
}) => {
  const [rightClicked, setRightClicked] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(id);
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setRightClicked(!rightClicked);
  };

  const getInitial = (name) => name?.charAt(0).toUpperCase() || '?';
  const hasSocialLinks = socialLinks && (socialLinks.instagram || socialLinks.twitter || socialLinks.snapchat);

  return (
    <motion.div
      className={`id-card ${decoration ? `has-${decoration}` : ''}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onContextMenu={handleRightClick}
      onClick={(e) => !e.target.closest('.id-card-decoration-menu') && setRightClicked(false)}
    >
      {/* Left Section */}
      <div className="id-card-left">
        <div className="avatar-wrapper">
          <div className="avatar-gradient">
            {avatar ? (
              <img src={avatar} alt={name} className="avatar-image" />
            ) : (
              <span className="avatar-initial">{getInitial(name)}</span>
            )}
          </div>
        </div>
        <h3 className="profile-name">{name}</h3>
        <p className="profile-tagline">{tagline}</p>
      </div>

      {/* Divider */}
      <div className="id-card-divider"></div>

      {/* Right Section */}
      <div className="id-card-right">
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-value">{partiesAttended}</span>
            <span className="stat-label">Attended</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{partiesHosted}</span>
            <span className="stat-label">Hosted</span>
          </div>
        </div>

        {/* Social Links */}
        {hasSocialLinks && (
          <div className="social-links">
            {socialLinks.instagram && (
              <a
                href={`https://instagram.com/${socialLinks.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title="Instagram"
                onClick={(e) => e.stopPropagation()}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                  <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4z"/>
                  <circle cx="18.406" cy="5.594" r="1.44"/>
                </svg>
              </a>
            )}
            {socialLinks.twitter && (
              <a
                href={`https://twitter.com/${socialLinks.twitter.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title="Twitter"
                onClick={(e) => e.stopPropagation()}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            )}
            {socialLinks.snapchat && (
              <a
                href={`https://snapchat.com/add/${socialLinks.snapchat}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title="Snapchat"
                onClick={(e) => e.stopPropagation()}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.045 2.079c-.725-.047-1.529.168-2.303.628-.774.46-1.393 1.098-1.835 1.895-.442.797-.617 1.638-.515 2.505.102.867.441 1.653 1.003 2.335-.239.257-.535.459-.88.596-.345.137-.71.185-1.083.141-.373-.044-.722-.177-1.031-.392-.309-.215-.56-.495-.739-.829-.179-.334-.277-.704-.287-1.091-.01-.387.071-.764.231-1.115.16-.351.398-.656.699-.89.301-.234.652-.39 1.028-.455.376-.065.762-.037 1.125.082l.736-2.065c-.726-.259-1.504-.361-2.28-.301-.776.06-1.521.284-2.193.658-.672.374-1.254.889-1.702 1.508-.448.619-.751 1.328-.887 2.074-.136.746-.101 1.512.102 2.243.203.731.569 1.409 1.074 1.989.505.58 1.137 1.047 1.852 1.367.715.32 1.495.485 2.283.483.788-.002 1.567-.171 2.28-.495.713-.324 1.342-.795 1.843-1.378l.713.506c-.489.877-1.197 1.606-2.047 2.11-.85.504-1.814.764-2.793.753-.979-.011-1.937-.292-2.775-.814-.838-.522-1.529-1.267-1.999-2.157l-1.832 1.118c.684 1.12 1.638 2.047 2.771 2.696 1.133.649 2.405.996 3.703.996 1.298 0 2.57-.347 3.703-.996 1.133-.649 2.087-1.576 2.771-2.696.684-1.12 1.076-2.398 1.136-3.71.06-1.312-.22-2.62-.803-3.803l2.057-.736c.775 1.519 1.156 3.209 1.103 4.914-.053 1.705-.532 3.371-1.395 4.844-.863 1.473-2.079 2.703-3.543 3.582-1.464.879-3.128 1.379-4.832 1.449-1.704.07-3.402-.294-4.935-1.053-1.533-.759-2.85-1.885-3.831-3.276-.981-1.391-1.594-3.001-1.779-4.683-.185-1.682.063-3.384.723-4.945.66-1.561 1.71-2.931 3.055-3.979 1.345-1.048 2.938-1.736 4.618-1.999 1.68-.263 3.401-.092 4.991.507 1.59.599 3.001 1.605 4.095 2.92l-1.688 1.277c-.846-1.12-1.943-2.009-3.193-2.581-1.25-.572-2.617-.807-3.97-.676z"/>
                </svg>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Delete Button */}
      <button className="id-card-delete" onClick={handleDelete} title="Delete">
        ✕
      </button>

      {/* Decoration Menu */}
      <AnimatePresence>
        {rightClicked && (
          <motion.div
            className="id-card-decoration-menu"
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={`deco-btn ${decoration === 'pin' ? 'active' : ''}`}
              onClick={() => { onDecorationUpdate?.(id, decoration === 'pin' ? null : 'pin'); setRightClicked(false); }}
            >
              📌 Pin
            </button>
            <button
              className={`deco-btn ${decoration === 'tape' ? 'active' : ''}`}
              onClick={() => { onDecorationUpdate?.(id, decoration === 'tape' ? null : 'tape'); setRightClicked(false); }}
            >
              📋 Tape
            </button>
            <button
              className={`deco-btn ${decoration === 'magnet' ? 'active' : ''}`}
              onClick={() => { onDecorationUpdate?.(id, decoration === 'magnet' ? null : 'magnet'); setRightClicked(false); }}
            >
              🧲 Magnet
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default IDCard;
