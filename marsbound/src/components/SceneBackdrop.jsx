// CSS-only atmosphere behind a screen. variant: 'title' | 'dashboard' | 'summary'.
// `contained` keeps it inside a relatively positioned box (used by the style guide).
export default function SceneBackdrop({ variant = 'title', contained = false }) {
  const classes = `mb-scene mb-scene--${variant}${contained ? ' mb-scene--contained' : ''}`;
  return <div className={classes} aria-hidden="true" />;
}
