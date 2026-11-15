import { useEffect, useState } from 'react';
import { confirmFlareCached } from '../game/donki.js';
import { SPACE_WEATHER_LABEL } from '../data/nasaContent.js';

export const FETCHED_LABEL = 'REAL NASA · fetched from DONKI archive';

export function stormBadgeText(origin) {
  return origin === 'api' ? FETCHED_LABEL : SPACE_WEATHER_LABEL;
}

// Asks NASA in the background. The game never waits for it; until NASA answers
// (or if it never does) the result is { origin: 'stored' }.
export function useDonki(event) {
  const [answer, setAnswer] = useState({ id: null, result: null });

  useEffect(() => {
    let alive = true;
    if (event?.id) {
      confirmFlareCached(event).then((result) => {
        if (alive) setAnswer({ id: event.id, result });
      });
    }
    return () => {
      alive = false;
    };
  }, [event]);

  return answer.result && answer.id === event?.id ? answer.result : { origin: 'stored' };
}
