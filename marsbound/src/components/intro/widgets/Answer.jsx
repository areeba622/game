import { useEffect, useRef } from 'react';
import { Ico } from '../PixelKit.jsx';
import { Btn, Panel } from '../ui.jsx';

// The incoming call. One big button answers it.
export default function Answer({ ctx, onNext }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <Panel cls="pi-w">
      <div className="pi-center-text">
        <div className="pi-pulse" aria-hidden="true">
          <i />
          <i />
          <Ico n="dish" s={10} />
        </div>
        <h2 className="pi-h2">INCOMING TRANSMISSION...</h2>
        <p className="pi-mut pi-gap">Mission Control is calling {ctx.nick}.</p>
        <Btn cls="big" onClick={onNext} ref={ref}>
          Answer call
        </Btn>
      </div>
    </Panel>
  );
}
