import { useMemo } from 'react';
import { createPseudoRandom } from './usePseudoRandom';

/**
 * Generates deterministic badge positions with masonry layout
 * Badges overlap slightly and have random rotation within +/- 4 degrees
 */
export function useBadgePositions(badges, seed = 12345) {
  return useMemo(() => {
    const prng = createPseudoRandom(seed);
    const positions = [];
    
    // Vertical layout: items spread vertically with organic horizontal placement
    // Aim for ~3 items visible on screen at once (screen height ~800px, so ~250-300px spacing)
    const verticalSpacing = 350; // Space between items vertically
    // Board is now 2/3 width, so adjust horizontal range accordingly
    const boardWidth = typeof window !== 'undefined' ? window.innerWidth * 0.6667 : 800;
    const horizontalRange = boardWidth * 0.6; // Width range for horizontal placement (60% of board width)
    const screenWidth = boardWidth;
    const centerX = screenWidth / 2;

    badges.forEach((badge, index) => {
      const badgeId = badge.id !== undefined ? badge.id : index;
      
      // If badge already has x and y coordinates (manually placed), use those
      if (badge.x !== undefined && badge.y !== undefined) {
        positions.push({
          id: badgeId,
          x: badge.x,
          y: badge.y,
          rotation: badge.rotation !== undefined ? badge.rotation : (Math.random() - 0.5) * 8, // Use stored rotation or random
          recency: badge.recency !== undefined ? badge.recency : index,
          originalIndex: index,
        });
        return;
      }

      // Vertical positioning - each item gets its own row
      const baseY = 100 + (index * verticalSpacing);
      
      // Horizontal positioning - random within range, but avoid edges
      // Use multiple random values for more organic distribution
      const random1 = prng.random();
      const random2 = prng.random();
      const random3 = prng.random();
      
      // Create organic horizontal distribution (not uniform, more clustered)
      const horizontalOffset = (random1 - 0.5) * horizontalRange + 
                               (random2 - 0.5) * 100 + 
                               (random3 - 0.5) * 50;
      
      const baseX = centerX + horizontalOffset - 112.5; // Center the badge (225px wide / 2)
      
      // Add some vertical variation for more organic feel
      const verticalOffset = prng.randomBetween(-30, 30);
      
      // Use stored rotation if available, otherwise generate random rotation
      const rotation = badge.rotation !== undefined ? badge.rotation : (Math.random() - 0.5) * 8;
      
      positions.push({
        id: badgeId,
        x: Math.max(50, Math.min(screenWidth - 275, baseX)), // Keep within bounds (225px badge + 50px padding)
        y: baseY + verticalOffset,
        rotation,
        recency: badge.recency !== undefined ? badge.recency : index, // Lower index = more recent
        originalIndex: index,
      });
    });

    return positions;
  }, [badges, seed]);
}

