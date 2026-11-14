// Picks one real flare record for this playthrough.

export function pickStorm(events) {
  const i = Math.floor(Math.random() * events.length);
  return events[i];
}
