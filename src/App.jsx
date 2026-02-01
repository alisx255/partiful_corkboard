import { useState, useCallback } from 'react';
import StickerWall from './StickerWall';
import AddMenu from './AddMenu';
import PhotoEditor from './PhotoEditor';
import './App.css';

// Start with empty badges - user can add their own
const sampleBadges = [];

// Start with empty sticky notes - user can add their own
const initialStickyNotes = [];

function App() {
  const [badges, setBadges] = useState(sampleBadges);
  const [theme, setTheme] = useState('corkboard');
  const [stickyNotes, setStickyNotes] = useState(initialStickyNotes);
  const [photos, setPhotos] = useState([]);
  const [mapPins, setMapPins] = useState([]);
  const [placementMode, setPlacementMode] = useState(null); // 'badge', 'stickyNote', 'photo', or null
  const [nextId, setNextId] = useState(1000); // Start high to avoid conflicts
  const [photoEditorOpen, setPhotoEditorOpen] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [photoCount, setPhotoCount] = useState(1);
  const [photoPlacementPos, setPhotoPlacementPos] = useState({ x: undefined, y: undefined });

  const handleStickyNoteUpdate = useCallback((id, text, position) => {
    setStickyNotes(prev => 
      prev.map(note => {
        if (note.id === id) {
          return { ...note, text, ...(position && { x: position.x, y: position.y }) };
        }
        return note;
      })
    );
  }, []);

  const handleStickyNoteDelete = useCallback((id) => {
    setStickyNotes(prev => prev.filter(note => note.id !== id));
  }, []);

  const handleBadgeUpdate = useCallback((id, position) => {
    setBadges(prev => 
      prev.map((badge, index) => {
        const badgeId = badge.id !== undefined ? badge.id : index;
        if (badgeId === id) {
          // Update position in the badge data
          return { ...badge, x: position.x, y: position.y };
        }
        return badge;
      })
    );
  }, []);

  const handleBadgeDelete = useCallback((id) => {
    setBadges(prev => prev.filter((badge, index) => {
      const badgeId = badge.id !== undefined ? badge.id : index;
      return badgeId !== id;
    }));
  }, []);

  const handleBadgeDecorationUpdate = useCallback((id, decoration) => {
    setBadges(prev => 
      prev.map((badge, index) => {
        const badgeId = badge.id !== undefined ? badge.id : index;
        if (badgeId === id) {
          return { ...badge, decoration };
        }
        return badge;
      })
    );
  }, []);

  const handlePhotoUpdate = useCallback((id, position) => {
    setPhotos(prev => 
      prev.map(photo => 
        photo.id === id ? { ...photo, ...position } : photo
      )
    );
  }, []);

  const handlePhotoDelete = useCallback((id) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  }, []);

  const handlePhotoDecorationUpdate = useCallback((id, decoration) => {
    setPhotos(prev => 
      prev.map(photo => {
        if (photo.id === id) {
          return { ...photo, decoration };
        }
        return photo;
      })
    );
  }, []);

  const handleMapPinAdd = useCallback((x, y) => {
    const newPin = {
      id: nextId,
      x,
      y,
    };
    setMapPins(prev => [...prev, newPin]);
    setNextId(prev => prev + 1);
  }, [nextId]);

  const handleMapPinDelete = useCallback((id) => {
    setMapPins(prev => prev.filter(pin => pin.id !== id));
  }, []);

  const handlePhotoEdit = useCallback((id) => {
    const photo = photos.find(p => p.id === id);
    if (photo) {
      setEditingPhotoId(id);
      setPhotoCount(photo.images?.length || 1);
      setPhotoEditorOpen(true);
    }
  }, [photos]);

  const handlePhotoSave = useCallback((images) => {
    if (editingPhotoId) {
      // Update existing photo strip
      setPhotos(prev => 
        prev.map(photo => 
          photo.id === editingPhotoId 
            ? { ...photo, images }
            : photo
        )
      );
      setEditingPhotoId(null);
    } else {
      // Create new photo strip - use placement click position if available
      let newX, newY;
      
      if (photoPlacementPos.x !== undefined && photoPlacementPos.y !== undefined && 
          photoPlacementPos.x > 0 && photoPlacementPos.y > 0) {
        newX = photoPlacementPos.x;
        newY = photoPlacementPos.y;
      } else {
        const allItems = [...badges, ...stickyNotes, ...photos];
        const maxY = allItems.length > 0 
          ? Math.max(...allItems.map(item => (item.y || 0))) 
          : 100;
        newY = maxY + 350;
        const boardWidth = window.innerWidth * 0.6667;
        // Calculate strip width: border (8px * 2) + photo width (100px) = 116px
        const stripWidth = 116;
        newX = boardWidth / 2 - stripWidth / 2;
      }

      const newPhoto = {
        id: nextId,
        images,
        x: newX,
        y: newY,
        rotation: (Math.random() - 0.5) * 8, // Random rotation +/- 4 degrees
        width: 200,
        height: 200,
      };
      setPhotos(prev => [...prev, newPhoto]);
      setNextId(prev => prev + 1);
    }
    setPhotoEditorOpen(false);
    setPlacementMode(null);
    setPhotoPlacementPos({ x: undefined, y: undefined });
  }, [editingPhotoId, badges, stickyNotes, photos, nextId, photoPlacementPos]);

  const handlePlacementClick = useCallback((x, y) => {
    if (!placementMode) return;
    
    // Prevent multiple calls by checking if we're already processing
    const currentMode = placementMode;
    setPlacementMode(null); // Clear mode immediately to prevent double-clicks

    if (currentMode === 'badge') {
      // Show file input for badge image
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        let imageUrl = null;
        
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            imageUrl = event.target.result;
            
            // Use clicked position or calculate based on existing items
            let newX, newY;
            
            if (x !== undefined && y !== undefined && x > 0 && y > 0) {
              // Use clicked position
              newX = x;
              newY = y;
            } else {
              // Calculate vertical position based on existing badges
              const allItems = [...badges, ...stickyNotes, ...photos];
              const maxY = allItems.length > 0 
                ? Math.max(...allItems.map(item => (item.y || 0))) 
                : 100;
              newY = maxY + 350; // Space for next item
              const boardWidth = window.innerWidth * 0.6667;
              newX = boardWidth / 2 - 112.5; // Center on board (badge is 225px wide)
            }
            
            const newBadge = {
              id: nextId,
              label: 'Event',
              title: 'Event',
              recency: 0,
              x: newX,
              y: newY,
              image: imageUrl,
              rotation: (Math.random() - 0.5) * 8, // Random rotation +/- 4 degrees
              // Event information (can be edited later)
              eventName: null,
              eventDate: null,
              eventLocation: null,
              eventDescription: null,
            };
            setBadges(prev => [...prev, newBadge]);
            setNextId(prev => prev + 1);
          };
          reader.readAsDataURL(file);
        } else {
          // No file selected, create badge without image
          let newX, newY;
          
          if (x !== undefined && y !== undefined && x > 0 && y > 0) {
            newX = x;
            newY = y;
          } else {
            const allItems = [...badges, ...stickyNotes, ...photos];
            const maxY = allItems.length > 0 
              ? Math.max(...allItems.map(item => (item.y || 0))) 
              : 100;
            newY = maxY + 350;
            newX = window.innerWidth / 2 - 60;
          }
          
          const newBadge = {
            id: nextId,
            label: 'Event',
            title: 'Event',
            recency: 0,
            x: newX,
            y: newY,
            rotation: (Math.random() - 0.5) * 8, // Random rotation +/- 4 degrees
            // Event information (can be edited later)
            eventName: null,
            eventDate: null,
            eventLocation: null,
            eventDescription: null,
          };
          setBadges(prev => [...prev, newBadge]);
          setNextId(prev => prev + 1);
        }
      };
      input.click();
    } else if (currentMode === 'stickyNote') {
      // Use clicked position or calculate based on existing items
      let newX, newY;
      
      if (x !== undefined && y !== undefined && x > 0 && y > 0) {
        newX = x;
        newY = y;
      } else {
        const allItems = [...badges, ...stickyNotes, ...photos];
        const maxY = allItems.length > 0 
          ? Math.max(...allItems.map(item => (item.y || 0))) 
          : 100;
        newY = maxY + 350;
        const boardWidth = window.innerWidth * 0.6667;
        newX = boardWidth / 2 - 85; // Center on board (sticky note is 170px wide)
      }
      
      const newNote = {
        id: nextId,
        text: 'New Note',
        x: newX,
        y: newY,
        rotation: (Math.random() - 0.5) * 8, // Random rotation +/- 4 degrees
        color: 'yellow',
      };
      setStickyNotes(prev => [...prev, newNote]);
      setNextId(prev => prev + 1);
    } else if (currentMode === 'photo') {
      // For photos, show photo editor dialog
      setEditingPhotoId(null);
      setPhotoCount(1);
      setPhotoPlacementPos({ x, y });
      setPhotoEditorOpen(true);
    }
  }, [placementMode, nextId, badges, stickyNotes, photos]);

  const handleAddBadge = useCallback(() => {
    setPlacementMode('badge');
  }, []);

  const handleAddStickyNote = useCallback(() => {
    setPlacementMode('stickyNote');
  }, []);

  const handleAddPhoto = useCallback(() => {
    setPlacementMode('photo');
  }, []);

  const handlePhotoEditorClose = useCallback(() => {
    setPhotoEditorOpen(false);
    setEditingPhotoId(null);
    setPlacementMode(null);
  }, []);

  return (
    <div className="App">
      <div className="theme-selector">
        <label>Board Theme: </label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="corkboard">Corkboard</option>
          <option value="locker">Locker</option>
          <option value="notebook">Notebook</option>
        </select>
        {placementMode && (
          <span className="placement-mode-indicator">
            Click on board to place {placementMode === 'badge' ? 'badge' : placementMode === 'stickyNote' ? 'sticky note' : 'photo'}
          </span>
        )}
      </div>
      <StickerWall 
        badges={badges} 
        stickyNotes={stickyNotes}
        photos={photos}
        mapPins={mapPins}
        theme={theme}
        onStickyNoteUpdate={handleStickyNoteUpdate}
        onStickyNoteDelete={handleStickyNoteDelete}
        onBadgeUpdate={handleBadgeUpdate}
        onBadgeDelete={handleBadgeDelete}
        onBadgeDecorationUpdate={handleBadgeDecorationUpdate}
        onPhotoUpdate={handlePhotoUpdate}
        onPhotoDelete={handlePhotoDelete}
        onPhotoEdit={handlePhotoEdit}
        onPhotoDecorationUpdate={handlePhotoDecorationUpdate}
        onMapPinAdd={handleMapPinAdd}
        onMapPinDelete={handleMapPinDelete}
        placementMode={placementMode}
        onPlacementClick={handlePlacementClick}
      />
      <AddMenu
        onAddBadge={handleAddBadge}
        onAddStickyNote={handleAddStickyNote}
        onAddPhoto={handleAddPhoto}
        isOpen={true}
      />
      <PhotoEditor
        isOpen={photoEditorOpen}
        onClose={handlePhotoEditorClose}
        photoCount={photoCount}
        existingImages={editingPhotoId ? photos.find(p => p.id === editingPhotoId)?.images : []}
        onSave={handlePhotoSave}
      />
    </div>
  );
}

export default App;

