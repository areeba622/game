import { useEffect, useState } from 'react';

const STEP_MS = 28;

// Types the text out like a terminal. With reduced motion the full line is shown at once.
// The real text is always in the DOM for screen readers. Give it a `key` that changes with
// the text so the typing starts again for a new line.
export default function Typewriter({ text, className = '' }) {
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduced) return undefined;
    const id = window.setInterval(() => {
      setCount((n) => {
        if (n >= text.length) {
          window.clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [text, reduced]);

  const shown = reduced ? text : text.slice(0, count);
  const typing = shown.length < text.length;
  return (
    <p className={`${className}${typing ? ' is-typing' : ''}`.trim()}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </p>
  );
}
