import { Panel, WidgetFrame } from '../ui.jsx';

// The Commander stamp. Nothing to tap, just Continue.
export default function Stamp({ ctx, onNext }) {
  return (
    <WidgetFrame done onNext={onNext}>
      <Panel cls="pi-stamp">{ctx.commander.toUpperCase()}</Panel>
      <p className="pi-mut pi-center-text">A new Commander for the Mars outpost!</p>
    </WidgetFrame>
  );
}
