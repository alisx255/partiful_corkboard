import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Map.css';

const Map = ({ 
  pins = [], 
  onPinAdd,
  onPinDelete
}) => {
  const [isPlacingPin, setIsPlacingPin] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });

  const handleMapMouseMove = (e) => {
    if (!isPlacingPin) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update preview position
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      setPreviewPosition({ x, y });
    }
  };

  const handleMapClick = (e) => {
    if (!isPlacingPin || !onPinAdd) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Only add pin if click is within map bounds
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      onPinAdd(x, y);
      setIsPlacingPin(false);
      setPreviewPosition({ x: 0, y: 0 });
    }
  };

  const handlePinClick = (e, pinId) => {
    e.stopPropagation();
    if (onPinDelete) {
      onPinDelete(pinId);
    }
  };

  return (
    <div className="map-container">
      <div className="map-controls">
        <button 
          className={`map-add-pin-btn ${isPlacingPin ? 'active' : ''}`}
          onClick={() => setIsPlacingPin(!isPlacingPin)}
          title={isPlacingPin ? 'Cancel pin placement' : 'Add pin to map'}
        >
          📍 {isPlacingPin ? 'Cancel' : 'Add Pin'}
        </button>
      </div>
      <div 
        className="us-map"
        onClick={handleMapClick}
        onMouseMove={handleMapMouseMove}
        style={{ cursor: isPlacingPin ? 'crosshair' : 'default' }}
      >
        {/* U.S. Map Image */}
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Map_of_USA_with_state_names.svg/1200px-Map_of_USA_with_state_names.svg.png"
          alt="United States Map"
          className="map-image"
          onError={(e) => {
            // Fallback: hide image and show SVG
            e.target.style.display = 'none';
            const svg = e.target.nextElementSibling;
            if (svg) svg.style.display = 'block';
          }}
        />
        {/* Fallback SVG if image fails to load */}
        <svg 
          viewBox="0 0 959 593" 
          className="map-svg-fallback"
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none', display: 'none' }}
        >
          {/* Simplified but recognizable U.S. Map outline */}
          <g fill="#f0f8ff" stroke="#4a90e2" strokeWidth="2">
            {/* Mainland USA */}
            <path d="M 100 150 L 200 140 L 300 145 L 400 142 L 500 148 L 600 144 L 700 147 L 800 143 L 880 150 L 900 180 L 920 220 L 910 280 L 890 340 L 860 400 L 820 450 L 780 480 L 730 500 L 680 510 L 630 515 L 580 520 L 530 518 L 480 512 L 430 505 L 380 495 L 330 485 L 280 470 L 230 450 L 180 420 L 130 380 L 90 330 L 70 280 L 80 230 L 90 180 Z" />
            {/* Florida peninsula */}
            <path d="M 680 510 L 700 530 L 720 550 L 740 570 L 750 580 L 745 590 L 730 585 L 710 575 L 690 560 L 670 540 Z" />
            {/* California */}
            <path d="M 100 150 L 80 200 L 60 280 L 50 350 L 55 420 L 70 470 L 100 500 L 140 510 L 180 505 L 220 490 L 250 470 L 240 420 L 220 360 L 200 300 L 180 240 L 160 190 Z" />
            {/* Texas */}
            <path d="M 430 400 L 500 395 L 580 405 L 650 420 L 700 440 L 730 460 L 750 480 L 740 500 L 710 495 L 670 485 L 620 475 L 570 465 L 520 455 L 470 445 L 420 435 Z" />
            {/* Northeast */}
            <path d="M 800 143 L 820 150 L 840 160 L 860 170 L 870 180 L 865 190 L 850 185 L 830 175 L 810 165 Z" />
          </g>
        </svg>
        
        {/* Preview pin that follows cursor */}
        {isPlacingPin && previewPosition.x > 0 && previewPosition.y > 0 && (
          <div
            className="map-pin map-pin-preview"
            style={{
              left: `${previewPosition.x}px`,
              top: `${previewPosition.y}px`,
            }}
          >
            <div className="map-pin-head"></div>
            <div className="map-pin-shaft"></div>
          </div>
        )}

        {/* Map pins */}
        <AnimatePresence>
          {pins.map((pin) => (
            <motion.div
              key={pin.id}
              className="map-pin"
              style={{
                left: `${pin.x}px`,
                top: `${pin.y}px`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.2 }}
              onClick={(e) => handlePinClick(e, pin.id)}
            >
              <div className="map-pin-head"></div>
              <div className="map-pin-shaft"></div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isPlacingPin && (
          <div className="map-placement-hint">
            Click on the map to place a pin
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;

