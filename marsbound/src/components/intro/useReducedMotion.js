import { useState } from 'react';

// True when the player asked for less motion. Read once.
export function useReducedMotion() {
  const [reduced] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  return reduced;
}
