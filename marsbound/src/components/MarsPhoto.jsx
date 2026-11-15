import Icon from './Icon.jsx';

// Real NASA Mars photo slot (CLAUDE.md section 9, Prompt 1B.3b).
// Drop the file at src/assets/mars-landing.jpg and it appears automatically.
// Until then a plain placeholder panel shows. Nothing breaks if the file is missing.
// Never invent a caption or credit: pass only the exact text from the NASA page.

const found = import.meta.glob('../assets/mars-landing.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});
const PHOTO_URL = Object.values(found)[0] ?? null;

export default function MarsPhoto({ alt, caption }) {
  if (!PHOTO_URL || !alt || !caption) {
    // TODO: real photo + exact caption/credit from the NASA page (Prompt 1B.3b).
    return (
      <div className="mars-photo mars-photo--placeholder" aria-hidden="true">
        {import.meta.env.DEV && <span className="mars-photo__dev-note">Mars photo goes here</span>}
      </div>
    );
  }

  return (
    <figure className="mars-photo">
      <img src={PHOTO_URL} alt={alt} />
      <figcaption className="mars-photo__caption">
        <span className="badge badge-real"><Icon name="globe" scale={1} /> REAL NASA</span> {caption}
      </figcaption>
    </figure>
  );
}
