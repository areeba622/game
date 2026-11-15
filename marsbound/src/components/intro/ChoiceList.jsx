import { useEffect, useRef } from 'react';

// The player's reply choices, one big button each. Focus lands on the first one.
export default function ChoiceList({ replies, onPick }) {
  const first = useRef(null);
  useEffect(() => {
    first.current?.focus();
  }, []);

  return (
    <div className="pi-act pi-ch" role="group" aria-label="Choose your reply">
      {replies.map((text, i) => (
        <button key={text} type="button" ref={i === 0 ? first : undefined} className="pi-btn dark wide" onClick={() => onPick(i)}>
          <span>
            <i className="pi-caret" />
            {text}
          </span>
        </button>
      ))}
    </div>
  );
}
