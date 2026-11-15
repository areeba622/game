// Confirms one SAVED flare record with NASA's DONKI archive (no API key, browser-friendly).
// It is an ADDITION: the result only changes badge text and extra details. It never changes
// the storm size, the saved record or any game state, and it never throws (offline = 'stored').
// Traps:
//  1. One-day window (startDate = endDate = record date). Do NOT pick "the strongest flare":
//     match the flare whose classType EXACTLY equals the record's AND beginTime starts with its date.
//  2. Do NOT use api.nasa.gov with DEMO_KEY (rate-limited, HTTP 429).
//  3. Do NOT use kauai.ccmc.gsfc.nasa.gov or webtools.ccmc.gsfc.nasa.gov (they hang ~21 s).
//  4. The API result never changes the storm size, the record or any state.
//  5. In tests pass fetchFn: null (not undefined) to mean "no fetch": undefined uses globalThis.fetch.

export const DONKI_FLARE_URL = 'https://ccmc.gsfc.nasa.gov/DONKI/WS/get/FLR';

const STORED = { origin: 'stored' };

export async function confirmFlare(event, { fetchFn = globalThis.fetch, timeoutMs = 4000 } = {}) {
  if (!event || !event.date || !event.classType || typeof fetchFn !== 'function') {
    return { ...STORED };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const url = `${DONKI_FLARE_URL}?startDate=${event.date}&endDate=${event.date}`;
    const response = await fetchFn(url, { signal: controller.signal });
    if (!response || !response.ok) return { ...STORED };
    const data = await response.json();
    if (!Array.isArray(data)) return { ...STORED };
    const flare = data.find(
      (f) =>
        f &&
        f.classType === event.classType &&
        typeof f.beginTime === 'string' &&
        f.beginTime.startsWith(event.date),
    );
    if (!flare) return { ...STORED };
    const link = typeof flare.link === 'string' && flare.link.startsWith('https://') ? flare.link : null;
    return {
      origin: 'api',
      details: {
        flrID: flare.flrID ?? null,
        classType: flare.classType ?? null,
        beginTime: flare.beginTime ?? null,
        peakTime: flare.peakTime ?? null,
        endTime: flare.endTime ?? null,
        sourceLocation: flare.sourceLocation ?? null,
        activeRegionNum: flare.activeRegionNum ?? null,
        instrument: (Array.isArray(flare.instruments) ? flare.instruments[0]?.displayName : null) ?? null,
        link,
      },
    };
  } catch {
    return { ...STORED };
  } finally {
    clearTimeout(timer);
  }
}

const cache = new Map();

// One request per record id, shared by the storm card and the Debrief.
export function confirmFlareCached(event, options) {
  if (!event || !event.id) return confirmFlare(event, options);
  if (!cache.has(event.id)) cache.set(event.id, confirmFlare(event, options));
  return cache.get(event.id);
}

export function _clearDonkiCache() {
  cache.clear();
}
