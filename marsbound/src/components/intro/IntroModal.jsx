import { useEffect, useRef } from 'react';
import { Panel } from './ui.jsx';

// A pop-up. Focus moves in when it opens and returns to the button that opened it.
// Tab stays inside. Escape calls onClose (when given).
export default function IntroModal({ label, onClose, children, extra }) {
  const box = useRef(null);

  useEffect(() => {
    const opener = document.activeElement;
    box.current?.querySelector('button')?.focus();
    return () => opener?.focus?.();
  }, []);

  function onKeyDown(e) {
    if (e.key === 'Escape' && onClose) {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = [...box.current.querySelectorAll('button:not([disabled])')];
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="pi-ov">
      {extra}
      <div ref={box} role="dialog" aria-modal="true" aria-label={label} onKeyDown={onKeyDown} className="pi-modal-wrap">
        <Panel cls="pi-modal">{children}</Panel>
      </div>
    </div>
  );
}
