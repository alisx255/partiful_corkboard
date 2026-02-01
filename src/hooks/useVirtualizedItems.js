import { useMemo } from 'react';

/**
 * Virtualizes items for performance - only renders items visible in viewport
 */
export function useVirtualizedItems(items, containerRef, itemHeight = 350, padding = 100) {
  return useMemo(() => {
    if (!containerRef.current) return { visibleItems: items, startIndex: 0, endIndex: items.length };

    const container = containerRef.current.querySelector('.sticker-wall');
    if (!container) return { visibleItems: items, startIndex: 0, endIndex: items.length };

    const scrollTop = container.scrollTop || 0;
    const viewportHeight = container.clientHeight || window.innerHeight;
    
    // Calculate visible range with padding
    const startIndex = Math.max(0, Math.floor((scrollTop - padding) / itemHeight));
    const endIndex = Math.min(items.length, Math.ceil((scrollTop + viewportHeight + padding) / itemHeight));
    
    // Get visible items
    const visibleItems = items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      virtualIndex: startIndex + index,
    }));

    return {
      visibleItems,
      startIndex,
      endIndex,
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight,
    };
  }, [items, containerRef, itemHeight, padding]);
}

