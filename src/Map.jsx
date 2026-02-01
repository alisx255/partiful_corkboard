import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Map.css';

const Map = ({ pins = [] }) => {
  const [selectedPinId, setSelectedPinId] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [zoomCenter, setZoomCenter] = useState({ x: 50, y: 50 });

  const selectedPin = useMemo(
    () => pins.find((pin) => pin.id === selectedPinId),
    [pins, selectedPinId]
  );

  const handlePinClick = useCallback(
    (e, pin) => {
      e.stopPropagation();

      if (selectedPinId === pin.id) {
        setSelectedPinId(null);
      } else {
        setZoomCenter({ x: pin.x, y: pin.y });
        setZoomLevel(1);
        setSelectedPinId(pin.id);
      }
    },
    [selectedPinId]
  );

  const handleClose = useCallback(() => {
    setSelectedPinId(null);
    setZoomLevel(0);
  }, []);

  const handleMapClick = useCallback(
    (e) => {
      if (
        e.target === e.currentTarget ||
        e.target.classList.contains('globe-image')
      ) {
        if (zoomLevel > 0) {
          setZoomLevel(0);
          setSelectedPinId(null);
        }
      }
    },
    [zoomLevel]
  );

  const mapTransformStyle = useMemo(
    () => ({
      transform: zoomLevel === 0 ? 'scale(1)' : 'scale(3)',
      transformOrigin: `${zoomCenter.x}% ${zoomCenter.y}%`,
    }),
    [zoomLevel, zoomCenter]
  );

  return (
    <div className="map-container">
      {/* Tape corners - outside wrapper so they're not clipped */}
      <div className="map-tape map-tape-tl"></div>
      <div className="map-tape map-tape-tr"></div>
      <div className="map-tape map-tape-bl"></div>
      <div className="map-tape map-tape-br"></div>

      <div className="globe-map-wrapper">
        <div
          className="globe-map"
          style={mapTransformStyle}
          onClick={handleMapClick}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/1200px-World_map_blank_without_borders.svg.png"
            alt="World Map"
            className="globe-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />

          <AnimatePresence>
            {pins.map((pin) => (
              <motion.div
                key={pin.id}
                className={`map-pin ${selectedPinId === pin.id ? 'selected' : ''}`}
                style={{
                  left: `${pin.x}%`,
                  top: `${pin.y}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.3 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={(e) => handlePinClick(e, pin)}
              >
                <div className="map-pin-head"></div>
                <div className="map-pin-shaft"></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {selectedPin && (
            <motion.div
              className="pin-preview-overlay"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {selectedPin.partyImage && (
                <div className="pin-preview-image-container">
                  <img
                    src={selectedPin.partyImage}
                    alt={selectedPin.partyName}
                    className="pin-preview-image"
                  />
                </div>
              )}
              <div className="pin-preview-content">
                <h4 className="pin-preview-title">{selectedPin.partyName}</h4>
                <div className="pin-preview-details">
                  <div className="event-item">
                    <span className="event-label">Date:</span>
                    <span className="event-value">{selectedPin.partyDate}</span>
                  </div>
                  <div className="event-item">
                    <span className="event-label">Location:</span>
                    <span className="event-value">
                      {selectedPin.partyLocation}
                    </span>
                  </div>
                </div>
                <p className="pin-preview-description">
                  {selectedPin.partyDescription}
                </p>
              </div>
              <button className="pin-preview-close" onClick={handleClose}>
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {zoomLevel === 0 && pins.length > 0 && (
          <div className="map-hint">Click a pin to explore</div>
        )}
      </div>
    </div>
  );
};

export default Map;
