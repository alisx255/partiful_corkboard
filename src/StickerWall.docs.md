# StickerWall Component API

## Props

```typescript
interface StickerWallProps {
  badges: Badge[];
  seed?: number; // Default: 12345
}

interface Badge {
  id?: number | string; // Unique identifier
  emoji?: string; // Emoji icon
  icon?: string; // Alternative icon
  label?: string; // Short label
  name?: string; // Alternative label
  title?: string; // Title shown in overlay
  description?: string; // Description shown in overlay
  details?: Record<string, string | number>; // Key-value pairs for overlay
  recency?: number; // Lower = more recent (affects z-index)
  related?: (number | string)[]; // Array of related badge IDs
}
```

## Features

### Positioning
- **Deterministic**: Uses pseudo-random seed for consistent positioning
- **Masonry Layout**: Grid-based with organic offsets
- **Rotation**: Random rotation within +/- 3 degrees
- **Overlap**: Badges overlap by 20px for organic feel
- **Z-Index**: Based on recency (most recent on top)

### Interactions

1. **Hover** (Framer Motion)
   - Badge lifts up (translateY: -10px)
   - Scales to 1.1x
   - Shadow deepens
   - Z-index increases to 1000

2. **Click** (Framer Motion)
   - Shows inline overlay below badge
   - Overlay animates in with scale and fade
   - Click again or outside to close

3. **Right-Click**
   - Dims all other badges (opacity: 0.2, grayscale)
   - Highlights clicked badge (gold border, yellow background)
   - Highlights related badges (green border, light green background)
   - Right-click again to reset

4. **Zoom** (@use-gesture/react)
   - Hold Ctrl + mouse wheel
   - Zoom range: 0.1x to 1x
   - Below 0.3x: Density view (badges become small circles)
   - Pinch gesture supported on touch devices

## Usage Example

```jsx
import StickerWall from './StickerWall';

const badges = [
  {
    id: 1,
    emoji: '🎨',
    label: 'Design',
    title: 'Design Expert',
    recency: 0, // Most recent
    related: [18], // Related to badge with id 18
    description: 'Passionate about creating beautiful user experiences',
    details: { 'Years': '5+', 'Specialty': 'UI/UX' }
  },
  // ... more badges
];

<StickerWall badges={badges} seed={12345} />
```

## Styling

The component uses CSS classes that can be customized:
- `.sticker-wall-container` - Main container
- `.sticker-badge` - Individual badge
- `.sticker-badge.hovered` - Hovered state
- `.sticker-badge.selected` - Selected (clicked) state
- `.sticker-badge.right-clicked` - Right-clicked badge
- `.sticker-badge.related` - Related badge
- `.sticker-badge.dimmed` - Dimmed badge
- `.badge-overlay` - Inline overlay
- `.density-view` - Density view mode


