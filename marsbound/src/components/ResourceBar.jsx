import { statusLabel } from '../game/game.js';
import MeterBar from './MeterBar.jsx';
import { ICON_NAMES } from './icons/pixelMaps.js';

// Same props as before ({ label, icon, value }). Until kidText.js passes icon names, the icon
// is chosen from the label, so no emoji is ever drawn.
const LABEL_ICON = { Oxygen: 'oxygen', Water: 'water', Power: 'power', 'Crew Health': 'crew', Science: 'science' };

export default function ResourceBar({ label, icon, value }) {
  const { word } = statusLabel(value);
  const iconName = ICON_NAMES.includes(icon) ? icon : LABEL_ICON[label];
  return <MeterBar label={label} icon={iconName} value={value} word={word} />;
}
