# Sticker Wall Profile UI

An interactive React component that displays a "sticker wall" profile UI with rich mouse interactions, built with Framer Motion and @use-gesture/react.

## Features

- **Customizable Board Themes**: Choose from corkboard, locker, or notebook cover backgrounds
- **Placeholder Badges**: Badges display as placeholders until images are uploaded
- **Sticky Notes**: Add editable sticky notes with text (double-click to edit)
- **Hover Interaction**: Badges lift up and scale with deepened shadow when hovered (Framer Motion)
- **Click Interaction**: Clicking a badge shows a small inline overlay with detailed information
- **Right-Click Interaction**: Right-clicking a badge dims others and highlights related badges
- **Zoom Interaction**: Ctrl + mouse wheel to zoom out into a density field visualization
- **Masonry Layout**: Badges positioned in a deterministic masonry layout with slight rotation (+/- 3 degrees)
- **Overlapping Badges**: Badges overlap slightly with z-index based on recency (most recent on top)
- **Deterministic Positioning**: Pseudo-random seed ensures consistent badge positions
- **Vertical Scrolling**: Board is scrollable vertically to accommodate all content

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build

```bash
npm run build
```

## Usage

```jsx
import StickerWall from './StickerWall';

const badges = [
  {
    id: 1,
    image: '/path/to/badge-image.png', // Optional - shows placeholder if not provided
    label: 'Design',
    title: 'Design Expert',
    recency: 0, // Most recent
    related: [18], // Related to badge with id 18
    description: 'Passionate about creating beautiful user experiences',
    details: { 'Years': '5+', 'Specialty': 'UI/UX' }
  },
  // ... more badges
];

const stickyNotes = [
  {
    id: 1,
    text: 'Penn Am Welcome Night\n10/22',
    x: 800,
    y: 100,
    rotation: -2,
    color: 'yellow'
  }
];

<StickerWall 
  badges={badges} 
  stickyNotes={stickyNotes}
  theme="corkboard" // 'corkboard', 'locker', or 'notebook'
  seed={12345}
  onStickyNoteUpdate={(id, text) => console.log('Updated:', id, text)}
  onStickyNoteDelete={(id) => console.log('Deleted:', id)}
/>
```

## Badge Data Structure

Each badge object should have:
- `id` (optional): Unique identifier
- `image` (optional): URL to badge image (if not provided, shows placeholder)
- `emoji` or `icon` (optional): Visual representation (fallback)
- `label` or `name`: Short label displayed on badge
- `recency` (optional): Number indicating recency (lower = more recent, used for z-index)
- `related` (optional): Array of badge IDs that are related (for right-click highlight)
- `title` (optional): Title shown in overlay
- `description` (optional): Description shown in overlay
- `details` (optional): Object with key-value pairs shown in overlay

## Sticky Note Data Structure

Each sticky note object should have:
- `id`: Unique identifier
- `text`: Text content of the note
- `x`: X position in pixels
- `y`: Y position in pixels
- `rotation` (optional): Rotation in degrees (default: 0)
- `color` (optional): Color variant - 'yellow', 'pink', 'blue', 'green', 'orange' (default: 'yellow')

## Interactions

- **Hover**: Move mouse over a badge to see it lift and scale with deepened shadow
- **Click**: Click a badge to see detailed information in an inline overlay
- **Right-Click**: Right-click a badge to dim others and highlight related badges
- **Zoom**: Hold Ctrl and use mouse wheel to zoom out into density view (scroll down to zoom out)
- **Reset Zoom**: Click the "Reset" button in the controls
- **Sticky Notes**: Double-click a sticky note to edit its text, click the × button to delete
- **Theme Selector**: Use the dropdown in the top-right to change board themes

## Technologies

- React 18
- Vite
- Framer Motion (for hover and click animations)
- @use-gesture/react (for drag and zoom interactions)
- CSS3 with animations and transitions

