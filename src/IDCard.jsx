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
  mutualParties = [],
  mutualFriends = [],
  onDelete,
  onDecorationUpdate,
  decoration = null
}) => {
  const [rightClicked, setRightClicked] = useState(false);
  const [activePopup, setActivePopup] = useState(null); // 'attended' or 'hosted'

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(id);
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setRightClicked(!rightClicked);
  };

  const handleStatClick = (e, type) => {
    e.stopPropagation();
    setActivePopup(activePopup === type ? null : type);
    setRightClicked(false);
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  const getInitial = (name) => name?.charAt(0).toUpperCase() || '?';
  const hasSocialLinks = socialLinks && (socialLinks.instagram || socialLinks.twitter || socialLinks.snapchat);

  return (
    <motion.div
      className={`id-card ${decoration ? `has-${decoration}` : ''}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{
        y: -6,
        transition: { duration: 0.2 }
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onContextMenu={handleRightClick}
      onClick={(e) => {
        if (!e.target.closest('.id-card-decoration-menu') && !e.target.closest('.stat-popup')) {
          setRightClicked(false);
          setActivePopup(null);
        }
      }}
    >
      {/* Left side - Photo */}
      <div className="id-card-photo-section">
        <div className="photo-frame">
          {avatar ? (
            <img src={avatar} alt={name} className="avatar-image" />
          ) : (
            <span className="avatar-initial">{getInitial(name)}</span>
          )}
        </div>
      </div>

      {/* Center - Main Info */}
      <div className="id-card-main">
        <div className="id-card-header">
          <span className="header-label">PARTY PASS</span>
        </div>
        <div className="id-card-details">
          <h2 className="profile-name">{name}</h2>
          <p className="profile-tagline">"{tagline}"</p>
        </div>
      </div>

      {/* Right side - Stats & Social */}
      <div className="id-card-sidebar">
        <div className="stats-grid">
          <div
            className={`stat-item clickable ${activePopup === 'attended' ? 'active' : ''}`}
            onClick={(e) => handleStatClick(e, 'attended')}
          >
            <span className="stat-value">{partiesAttended}</span>
            <span className="stat-label">Attended</span>
          </div>
          <div
            className={`stat-item clickable ${activePopup === 'hosted' ? 'active' : ''}`}
            onClick={(e) => handleStatClick(e, 'hosted')}
          >
            <span className="stat-value">{partiesHosted}</span>
            <span className="stat-label">Hosted</span>
          </div>
        </div>

        {/* Mutual Parties Popup */}
        <AnimatePresence>
          {activePopup === 'attended' && (
            <motion.div
              className="stat-popup"
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="popup-header">
                <h4>Mutual Parties</h4>
                <button className="popup-close" onClick={closePopup}>×</button>
              </div>
              <div className="popup-content">
                {mutualParties.length > 0 ? (
                  <ul className="mutual-list">
                    {mutualParties.map((party, idx) => (
                      <li key={idx} className="mutual-item party-item">
                        {party.image && <img src={party.image} alt={party.name} className="mutual-image" />}
                        <div className="mutual-info">
                          <span className="mutual-name">{party.name}</span>
                          <span className="mutual-detail">{party.date}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="popup-empty">No mutual parties yet</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mutual Friends Popup */}
        <AnimatePresence>
          {activePopup === 'hosted' && (
            <motion.div
              className="stat-popup"
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="popup-header">
                <h4>Mutual Friends</h4>
                <button className="popup-close" onClick={closePopup}>×</button>
              </div>
              <div className="popup-content">
                {mutualFriends.length > 0 ? (
                  <ul className="mutual-list">
                    {mutualFriends.map((friend, idx) => (
                      <li key={idx} className="mutual-item friend-item">
                        {friend.avatar && <img src={friend.avatar} alt={friend.name} className="mutual-avatar" />}
                        <div className="mutual-info">
                          <span className="mutual-name">{friend.name}</span>
                          {friend.mutualCount && (
                            <span className="mutual-detail">{friend.mutualCount} mutual parties</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="popup-empty">No mutual friends yet</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {hasSocialLinks && (
          <div className="social-links">
            {socialLinks.instagram && (
              <a
                href={`https://instagram.com/${socialLinks.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title={socialLinks.instagram}
                onClick={(e) => e.stopPropagation()}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
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
                title={socialLinks.twitter}
                onClick={(e) => e.stopPropagation()}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
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
                title={socialLinks.snapchat}
                onClick={(e) => e.stopPropagation()}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.206 1c.638.016 3.154.212 4.566 2.618.912 1.553 1.066 3.727 1.066 4.357 0 .089-.005.175-.007.261.096.026.2.042.313.042.258 0 .527-.074.748-.178.157-.074.355-.152.592-.152.198 0 .398.051.571.152.287.166.458.437.458.724 0 .557-.613.95-1.217 1.212-.089.039-.175.074-.252.107-.391.166-.673.286-.785.543-.066.149-.052.317.041.512.015.032.034.066.055.103.611 1.09 1.384 2.014 2.295 2.748.407.327.866.609 1.367.839.179.083.359.151.527.204.361.114.589.372.589.673 0 .213-.114.479-.475.693-.521.31-1.286.486-2.267.519-.036.05-.073.146-.112.245-.05.125-.107.27-.194.398-.093.14-.218.257-.39.322-.253.096-.521.118-.797.14-.206.016-.42.034-.642.08-.241.05-.467.141-.704.238-.401.163-.857.347-1.505.347-.039 0-.079-.002-.12-.005-.037.003-.075.005-.114.005-.648 0-1.104-.184-1.505-.347-.237-.097-.463-.188-.704-.238-.222-.046-.436-.064-.642-.08-.276-.022-.544-.044-.797-.14-.172-.065-.297-.182-.39-.322-.087-.128-.144-.273-.194-.398-.039-.099-.076-.195-.112-.245-.981-.033-1.746-.209-2.267-.519-.361-.214-.475-.48-.475-.693 0-.301.228-.559.589-.673.168-.053.348-.121.527-.204.501-.23.96-.512 1.367-.839.911-.734 1.684-1.658 2.295-2.748.021-.037.04-.071.055-.103.093-.195.107-.363.041-.512-.112-.257-.394-.377-.785-.543-.077-.033-.163-.068-.252-.107-.604-.262-1.217-.655-1.217-1.212 0-.287.171-.558.458-.724.173-.101.373-.152.571-.152.237 0 .435.078.592.152.221.104.49.178.748.178.113 0 .217-.016.313-.042-.002-.086-.007-.172-.007-.261 0-.63.154-2.804 1.066-4.357C9.04 1.212 11.556 1.016 12.194 1h.012z"/>
                </svg>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Delete Button */}
      <button className="id-card-delete" onClick={handleDelete} title="Delete">
        ×
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
