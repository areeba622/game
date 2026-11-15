import Button from './Button.jsx';

// Static dialogue: a speaker tag, one to three short lines, and an optional Next button.
// No typewriter yet. `lines` is an array of strings (or pass children).
export default function DialogueBox({ speaker, lines = [], onNext, nextLabel = 'Next', children }) {
  return (
    <section className="mb-dialogue" aria-label={speaker ? `${speaker} says` : undefined}>
      {speaker && <span className="mb-dialogue__speaker">{speaker}</span>}
      {lines.map((line) => (
        <p key={line} className="mb-dialogue__text">
          {line}
        </p>
      ))}
      {children}
      {onNext && (
        <Button className="mb-dialogue__next" onClick={onNext}>
          {nextLabel}
        </Button>
      )}
    </section>
  );
}
