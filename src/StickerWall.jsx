import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBadgePositions } from './hooks/useBadgePositions';
import StickyNote from './StickyNote';
import Photo from './Photo';
import Map from './Map';
import './StickerWall.css';

const StickerWall = ({ 
  badges = [], 
  stickyNotes = [], 
  photos = [],
  mapPins = [],
  theme = 'corkboard', 
  seed = 12345, 
  onStickyNoteUpdate, 
  onStickyNoteDelete,
  onBadgeUpdate,
  onBadgeDelete,
  onBadgeDecorationUpdate,
  onPhotoUpdate,
  onPhotoDelete,
  onPhotoEdit,
  onPhotoDecorationUpdate,
  onMapPinAdd,
  onMapPinDelete,
  placementMode = null,
  onPlacementClick
}) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [rightClickedId, setRightClickedId] = useState(null);
  const [highlightedBadgeId, setHighlightedBadgeId] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef(null);
  const overlayRefs = useRef({});
  const wallRef = useRef(null);

  const positions = useBadgePositions(badges, seed);
  
  // Calculate board height based on total items - make it more vertical
  const totalItems = badges.length + stickyNotes.length + photos.length;
  const boardHeight = Math.max(1500, totalItems * 400 + 300); // Increased height for more vertical layout

  // Sort badges by recency (most recent first) for z-index
  const sortedBadges = badges
    .map((badge, index) => ({ ...badge, originalIndex: index }))
    .sort((a, b) => (a.recency || a.originalIndex) - (b.recency || b.originalIndex));

  // Badges with effects (no automatic effects - only user-added decorations)
  const badgesWithEffects = useMemo(() => {
    return sortedBadges.map((badge) => {
      return {
        ...badge,
        hasTape: false, // No automatic tape effects
        hasDoodle: false, // No automatic doodle effects
      };
    });
  }, [sortedBadges]);

  // Track scroll for peeking effect
  useEffect(() => {
    const wallElement = containerRef.current?.querySelector('.sticker-wall');
    if (!wallElement) return;

    const handleScroll = () => {
      setScrollPosition(wallElement.scrollTop);
    };

    wallElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => wallElement.removeEventListener('scroll', handleScroll);
  }, []);


  // Handle badge click - show inline overlay
  const handleBadgeClick = useCallback((e, badgeId) => {
    e.stopPropagation();
    setSelectedId(selectedId === badgeId ? null : badgeId);
    setRightClickedId(null);
  }, [selectedId]);

  // Handle right-click - show decoration menu
  const handleBadgeRightClick = useCallback((e, badgeId) => {
    e.preventDefault();
    e.stopPropagation();
    // Only show menu, don't trigger highlighting
    setRightClickedId(rightClickedId === badgeId ? null : badgeId);
    setSelectedId(null);
    // Don't set highlightedBadgeId here - only from menu button
  }, [rightClickedId]);

  // Close overlays when clicking outside
  const handleContainerClick = useCallback((e) => {
    // Don't close if clicking on the menu
    if (e.target.closest('.badge-decoration-menu')) {
      return;
    }
    setSelectedId(null);
    setRightClickedId(null);
    // Don't clear highlightedBadgeId here - let user control it via menu
  }, []);

  // Get related badges (for right-click highlight)
  const getRelatedBadges = useCallback((badgeId) => {
    const badge = badges.find(b => {
      const id = b.id !== undefined ? b.id : badges.indexOf(b);
      return id === badgeId;
    });
    if (!badge || !badge.related) return new Set();
    
    // Convert related IDs to a Set for quick lookup
    return new Set(badge.related);
  }, [badges]);

  const relatedBadges = highlightedBadgeId ? getRelatedBadges(highlightedBadgeId) : new Set();

  const handleBoardClick = useCallback((e) => {
    // Don't close menu if clicking on it
    if (e.target.closest('.badge-decoration-menu')) {
      return;
    }
    
    // Don't handle clicks on child elements (badges, notes, etc.)
    if (e.target !== e.currentTarget && !e.target.classList.contains('sticker-wall')) {
      return;
    }
    
    if (placementMode && onPlacementClick) {
      // Get the sticker-wall element (the scrollable container)
      const wallElement = e.currentTarget.querySelector('.sticker-wall');
      if (wallElement) {
        const rect = wallElement.getBoundingClientRect();
        const scrollTop = wallElement.scrollTop;
        // Account for scroll position
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top + scrollTop;
        onPlacementClick(x, y);
      }
    } else {
      handleContainerClick(e);
    }
  }, [placementMode, onPlacementClick, handleContainerClick]);

  return (
    <div className={`sticker-wall-container theme-${theme} ${placementMode ? 'placement-mode' : ''}`} ref={containerRef} onClick={handleBoardClick}>
      <div className="sticker-wall-controls">
        <div className="instructions">
          <p>Hover: Lift | Click: Details | Right-click: Highlight related</p>
        </div>
      </div>

      <div
        className={`sticker-wall board-${theme}`}
        ref={wallRef}
        onClick={(e) => {
            // Only handle clicks directly on the board background (not on items)
            if (placementMode && onPlacementClick) {
              // Check if click is on an item
              if (e.target.closest('.sticker-badge, .sticky-note, .photo-strip')) {
                return;
              }
              
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              const scrollTop = e.currentTarget.scrollTop;
              // Calculate position accounting for scroll
              const x = e.clientX - rect.left - 50; // Subtract padding
              const y = e.clientY - rect.top + scrollTop - 50; // Subtract padding
              onPlacementClick(x, y);
            }
        }}
      >
        <div
          className="sticker-wall-content"
          style={{ 
            minHeight: `${boardHeight}px`,
            width: '100%',
            position: 'relative',
            overflow: 'visible',
          }}
        >
        {/* Map at the top */}
        <Map
          pins={mapPins}
          onPinAdd={onMapPinAdd}
          onPinDelete={onMapPinDelete}
        />

        {/* Sticky Notes - positioned inside the scaled board */}
        <AnimatePresence>
          {stickyNotes.map((note) => (
            <StickyNote
              key={note.id}
              id={note.id}
              text={note.text}
              x={note.x}
              y={note.y}
              rotation={note.rotation || 0}
              color={note.color || 'yellow'}
              onUpdate={onStickyNoteUpdate}
              onDelete={onStickyNoteDelete}
              onPositionUpdate={(id, offset) => {
                if (onStickyNoteUpdate) {
                  // offset is delta (change), not absolute position
                  onStickyNoteUpdate(id, note.text, {
                    x: note.x + offset.x,
                    y: note.y + offset.y,
                  });
                }
              }}
              placementMode={placementMode}
              onPlacementClick={onPlacementClick}
            />
          ))}
        </AnimatePresence>

        {/* Photos */}
        <AnimatePresence>
          {photos.map((photo) => (
            <Photo
              key={photo.id}
              id={photo.id}
              images={photo.images || (photo.image ? [photo.image] : [])}
              x={photo.x}
              y={photo.y}
              rotation={photo.rotation || 0}
              width={photo.width}
              height={photo.height}
              onUpdate={onPhotoUpdate}
              onDelete={onPhotoDelete}
              onEdit={onPhotoEdit}
              decoration={photo.decoration}
              onDecorationUpdate={onPhotoDecorationUpdate}
            />
          ))}
        </AnimatePresence>

        {badgesWithEffects.map((badge, sortedIndex) => {
          const originalIndex = badge.originalIndex;
          // Find position by badge ID to ensure correct mapping
          const badgeId = badge.id !== undefined ? badge.id : originalIndex;
          const pos = positions.find(p => p.id === badgeId) || positions[originalIndex];
          if (!pos) return null; // Skip if position not found
          const isHovered = hoveredId === badgeId;
          const isSelected = selectedId === badgeId;
          const isRightClicked = rightClickedId === badgeId;
          // Check if this badge is related to the highlighted badge
          const isRelated = highlightedBadgeId ? relatedBadges.has(badgeId) : false;
          const isDimmed = highlightedBadgeId && highlightedBadgeId !== badgeId && !isRelated;

          // Z-index based on recency (most recent = higher z-index)
          const zIndex = badgesWithEffects.length - sortedIndex;
          
          // Check if badge is outside viewport - hide it if scrolled past
          // Use a larger buffer to keep badges visible longer
          let isVisible = true;
          if (typeof window !== 'undefined') {
            const wallElement = containerRef.current?.querySelector('.sticker-wall');
            if (wallElement) {
              const scrollTop = wallElement.scrollTop || scrollPosition || 0;
              const viewportHeight = window.innerHeight;
              // Board is 2/3 width, so viewport width should reflect that
              const boardWidth = typeof window !== 'undefined' ? window.innerWidth * 0.6667 : 800;
              const viewportWidth = boardWidth;
              
              // Hide only if completely outside viewport (with large buffer to keep visible longer)
              const buffer = 200; // Increased buffer so badges stay visible longer
              const badgeSize = 225; // Badge size (1.5x larger)
              
              // Check if badge is completely outside viewport (accounting for badge size)
              isVisible = !(
                pos.x + badgeSize < -buffer || 
                pos.x > viewportWidth + buffer ||
                pos.y + badgeSize < scrollTop - buffer ||
                pos.y > scrollTop + viewportHeight + buffer
              );
            }
          }

          if (!isVisible) return null;

          return (
            <motion.div
              key={badgeId}
              data-badge-id={badgeId}
              className={`sticker-badge ${isHovered ? 'hovered' : ''} ${isSelected ? 'selected' : ''} ${highlightedBadgeId === badgeId ? 'right-clicked' : ''} ${isRelated ? 'related' : ''} ${isDimmed ? 'dimmed' : ''} ${badge.hasTape ? 'has-tape' : ''} ${badge.hasDoodle ? 'has-doodle' : ''} ${badge.image ? 'has-image' : ''} ${badge.decoration === 'pin' ? 'has-pin' : ''} ${badge.decoration === 'tape' ? 'has-tape-decoration' : ''} ${badge.decoration === 'magnet' ? 'has-magnet' : ''}`}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                zIndex: isHovered || isSelected ? 1000 : zIndex,
                rotate: pos.rotation,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: isDimmed ? 0.2 : 1,
              }}
              whileHover={{
                y: -10,
                scale: 1.1,
                zIndex: 1000,
                transition: { duration: 0.2 }
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onMouseEnter={() => setHoveredId(badgeId)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={(e) => {
                if (placementMode) {
                  e.stopPropagation();
                  // Don't place on existing badges
                  return;
                } else {
                  handleBadgeClick(e, badgeId);
                }
              }}
              onContextMenu={(e) => handleBadgeRightClick(e, badgeId)}
              drag={!placementMode}
              dragMomentum={false}
              dragElastic={0}
              dragConstraints={false}
              onDrag={(event, info) => {
                // Framer Motion drag gives deltas in screen pixels
                if (onBadgeUpdate) {
                  const boardWidth = typeof window !== 'undefined' ? window.innerWidth * 0.6667 : 800;
                  const maxX = boardWidth - 50 - 225;
                  const newX = Math.max(0, Math.min(maxX, pos.x));
                  const newY = Math.max(0, pos.y);
                  onBadgeUpdate(badgeId, {
                    x: newX,
                    y: newY,
                  });
                }
              }}
              onDragEnd={(event, info) => {
                // Final position update with bounds checking
                if (onBadgeUpdate) {
                  const boardWidth = typeof window !== 'undefined' ? window.innerWidth * 0.6667 : 800;
                  const maxX = boardWidth - 50 - 225;
                  const newX = Math.max(0, Math.min(maxX, pos.x));
                  const newY = Math.max(0, pos.y);
                  onBadgeUpdate(badgeId, {
                    x: newX,
                    y: newY,
                  });
                }
              }}
            >
              <button 
                className="badge-delete" 
                onClick={(e) => {
                  e.stopPropagation();
                  if (onBadgeDelete) {
                    onBadgeDelete(badgeId);
                  }
                }} 
                title="Delete badge"
              >
                ×
              </button>
              <div className="badge-content">
                {badge.image ? (
                  <img 
                    src={badge.image} 
                    alt={badge.label || badge.name || 'Badge'} 
                    className="badge-image"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.target.style.display = 'none';
                      const placeholder = e.target.parentElement.querySelector('.badge-placeholder');
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                  />
                ) : null}
                {(!badge.image || badge.label) && (
                  <div className="badge-placeholder" style={{ display: badge.image ? 'none' : 'flex' }}>
                    <span className="badge-placeholder-icon">📎</span>
                    <span className="badge-label">{badge.label || badge.name || 'Badge'}</span>
                  </div>
                )}
                {badge.emoji && <span className="badge-emoji">{badge.emoji}</span>}
                {badge.icon && <span className="badge-icon">{badge.icon}</span>}
              </div>

              {/* Decoration menu on right-click */}
              <AnimatePresence>
                {isRightClicked && (
                  <motion.div
                    className="badge-decoration-menu"
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className={`decoration-option ${badge.decoration === 'pin' ? 'active' : ''}`}
                      onClick={() => {
                        if (onBadgeDecorationUpdate) {
                          onBadgeDecorationUpdate(badgeId, badge.decoration === 'pin' ? null : 'pin');
                        }
                        setRightClickedId(null);
                      }}
                      title="Add pin"
                    >
                      📌 Pin
                    </button>
                    <button
                      className={`decoration-option ${badge.decoration === 'tape' ? 'active' : ''}`}
                      onClick={() => {
                        if (onBadgeDecorationUpdate) {
                          onBadgeDecorationUpdate(badgeId, badge.decoration === 'tape' ? null : 'tape');
                        }
                        setRightClickedId(null);
                      }}
                      title="Add tape"
                    >
                      📋 Tape
                    </button>
                    <button
                      className={`decoration-option ${badge.decoration === 'magnet' ? 'active' : ''}`}
                      onClick={() => {
                        if (onBadgeDecorationUpdate) {
                          onBadgeDecorationUpdate(badgeId, badge.decoration === 'magnet' ? null : 'magnet');
                        }
                        setRightClickedId(null);
                      }}
                      title="Add magnet"
                    >
                      🧲 Magnet
                    </button>
                    <div className="decoration-menu-divider"></div>
                    <button
                      className={`decoration-option ${highlightedBadgeId === badgeId ? 'active' : ''}`}
                      onClick={() => {
                        setHighlightedBadgeId(highlightedBadgeId === badgeId ? null : badgeId);
                        setRightClickedId(null);
                      }}
                      title="Highlight related badges"
                    >
                      🔗 Highlight Related
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Inline overlay for selected badge */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    ref={el => overlayRefs.current[badgeId] = el}
                    className="badge-overlay"
                    initial={{ opacity: 0, scale: 0.8, y: -10, x: '-50%' }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, scale: 0.8, y: -10, x: '-50%' }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="overlay-header">
                      {badge.image && (
                        <img src={badge.image} alt={badge.label || badge.name} className="overlay-image" />
                      )}
                      {badge.emoji && <span className="overlay-emoji">{badge.emoji}</span>}
                      <h3>{badge.title || badge.label || badge.name}</h3>
                    </div>
                    
                    {/* Event Information */}
                    {(badge.eventName || badge.eventDate || badge.eventLocation || badge.eventDescription) && (
                      <div className="overlay-event-info">
                        {badge.eventName && (
                          <div className="event-item">
                            <span className="event-label">Event:</span>
                            <span className="event-value">{badge.eventName}</span>
                          </div>
                        )}
                        {badge.eventDate && (
                          <div className="event-item">
                            <span className="event-label">Date:</span>
                            <span className="event-value">{badge.eventDate}</span>
                          </div>
                        )}
                        {badge.eventLocation && (
                          <div className="event-item">
                            <span className="event-label">Location:</span>
                            <span className="event-value">{badge.eventLocation}</span>
                          </div>
                        )}
                        {badge.eventDescription && (
                          <p className="overlay-description">{badge.eventDescription}</p>
                        )}
                      </div>
                    )}
                    
                    {/* Fallback to description if no event info */}
                    {!badge.eventName && badge.description && (
                      <p className="overlay-description">{badge.description}</p>
                    )}
                    
                    {/* Other details */}
                    {badge.details && (
                      <div className="overlay-details">
                        {Object.entries(badge.details).map(([key, value]) => (
                          <div key={key} className="detail-item">
                            <strong>{key}:</strong> {value}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
        </div>
      </div>

    </div>
  );
};

export default StickerWall;
