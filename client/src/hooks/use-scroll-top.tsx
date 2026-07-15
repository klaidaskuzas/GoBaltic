import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

/**
 * Custom hook to scroll to the top of the page when location changes
 */
export function useScrollTop() {
  const [location] = useLocation();
  const prevLocationRef = useRef<string>(location);

  useEffect(() => {
    // Skip the initial render
    if (prevLocationRef.current !== location) {
      window.scrollTo({
        top: 0,
        behavior: 'auto' // Using 'auto' instead of 'smooth' for instant scroll
      });
    }
    prevLocationRef.current = location;
  }, [location]);
}