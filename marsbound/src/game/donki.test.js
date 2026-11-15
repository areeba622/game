import { describe, it, expect, beforeEach, vi } from 'vitest';
import { confirmFlare, confirmFlareCached, _clearDonkiCache, DONKI_FLARE_URL } from './donki.js';

const EVENT = { id: 'e1', severity: 2, date: '2024-05-10', classType: 'M5.9', url: 'https://example.org' };
const FLARES = [
  { flrID: 'a', classType: 'M1.3', beginTime: '2024-05-10T00:10Z' },
  {
    flrID: 'b',
    classType: 'M5.9',
    beginTime: '2024-05-10T13:58Z',
    peakTime: '2024-05-10T14:11Z',
    endTime: '2024-05-10T14:20Z',
    sourceLocation: 'S16W40',
    activeRegionNum: 13664,
    instruments: [{ displayName: 'GOES-P: EXIS 1.0-8.0' }],
    link: 'https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/30680/-1',
  },
  { flrID: 'c', classType: 'X3.9', beginTime: '2024-05-10T08:00Z', peakTime: '2024-05-10T08:30Z' },
];
const okFetch = (data, calls) => async (url, opts) => {
  calls?.push([url, opts]);
  return { ok: true, json: async () => data };
};
const statusFetch = (status) => async () => ({ ok: false, status, json: async () => [] });
const STORED = { origin: 'stored' };

beforeEach(() => _clearDonkiCache());

describe('confirmFlare', () => {
  it('returns api details for the matching M5.9, not the X3.9', async () => {
    const r = await confirmFlare(EVENT, { fetchFn: okFetch(FLARES) });
    expect(r.origin).toBe('api');
    expect(r.details).toEqual({
      flrID: 'b',
      classType: 'M5.9',
      beginTime: '2024-05-10T13:58Z',
      peakTime: '2024-05-10T14:11Z',
      endTime: '2024-05-10T14:20Z',
      sourceLocation: 'S16W40',
      activeRegionNum: 13664,
      instrument: 'GOES-P: EXIS 1.0-8.0',
      link: 'https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/30680/-1',
    });
  });

  it('requests the exact one-day NASA url with no key', async () => {
    const calls = [];
    await confirmFlare(EVENT, { fetchFn: okFetch(FLARES, calls) });
    expect(calls).toHaveLength(1);
    expect(calls[0][0]).toBe(`${DONKI_FLARE_URL}?startDate=2024-05-10&endDate=2024-05-10`);
    expect(calls[0][0].startsWith('https://ccmc.gsfc.nasa.gov/DONKI/WS/get/FLR')).toBe(true);
    expect(calls[0][0]).not.toMatch(/api_key|DEMO_KEY/);
  });

  it('is stored when the class is not in the answer or the list is empty', async () => {
    expect(await confirmFlare({ ...EVENT, classType: 'M9.9' }, { fetchFn: okFetch(FLARES) })).toEqual(STORED);
    expect(await confirmFlare(EVENT, { fetchFn: okFetch([]) })).toEqual(STORED);
  });

  it.each([429, 500, 404])('is stored on HTTP %i', async (status) => {
    expect(await confirmFlare(EVENT, { fetchFn: statusFetch(status) })).toEqual(STORED);
  });

  it('is stored when fetch rejects (offline)', async () => {
    const fetchFn = async () => {
      throw new TypeError('Failed to fetch');
    };
    expect(await confirmFlare(EVENT, { fetchFn })).toEqual(STORED);
  });

  it('is stored for a non-array answer, null, or json() throwing', async () => {
    expect(await confirmFlare(EVENT, { fetchFn: okFetch({ a: 1 }) })).toEqual(STORED);
    expect(await confirmFlare(EVENT, { fetchFn: okFetch(null) })).toEqual(STORED);
    const bad = async () => ({
      ok: true,
      json: async () => {
        throw new SyntaxError('bad json');
      },
    });
    expect(await confirmFlare(EVENT, { fetchFn: bad })).toEqual(STORED);
  });

  it('times out a fetch that never answers', async () => {
    const hang = (url, { signal }) =>
      new Promise((resolve, reject) => {
        signal.addEventListener('abort', () => reject(new Error('aborted')));
      });
    const t0 = Date.now();
    const r = await confirmFlare(EVENT, { fetchFn: hang, timeoutMs: 30 });
    expect(r).toEqual(STORED);
    expect(Date.now() - t0).toBeLessThan(1000);
  });

  it('is stored for the same class on a different date', async () => {
    const other = [{ flrID: 'z', classType: 'M5.9', beginTime: '2024-05-09T13:58Z' }];
    expect(await confirmFlare(EVENT, { fetchFn: okFetch(other) })).toEqual(STORED);
  });

  it('is stored for a missing event, missing classType, or no fetch', async () => {
    const fetchFn = vi.fn();
    expect(await confirmFlare(undefined, { fetchFn })).toEqual(STORED);
    expect(await confirmFlare({ ...EVENT, classType: undefined }, { fetchFn })).toEqual(STORED);
    expect(await confirmFlare(EVENT, { fetchFn: null })).toEqual(STORED);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('drops unsafe links and uses null for missing fields', async () => {
    const data = [{ flrID: 'q', classType: 'M5.9', beginTime: '2024-05-10T13:58Z', link: 'javascript:alert(1)' }];
    const r = await confirmFlare(EVENT, { fetchFn: okFetch(data) });
    expect(r.origin).toBe('api');
    expect(r.details.link).toBeNull();
    expect(r.details.activeRegionNum).toBeNull();
    expect(r.details.instrument).toBeNull();
    expect(r.details.peakTime).toBeNull();
  });
});

describe('confirmFlareCached', () => {
  it('makes exactly one fetch for repeated calls with the same id', async () => {
    const fetchFn = vi.fn(okFetch(FLARES));
    const [a, b] = await Promise.all([
      confirmFlareCached(EVENT, { fetchFn }),
      confirmFlareCached(EVENT, { fetchFn }),
    ]);
    const c = await confirmFlareCached(EVENT, { fetchFn });
    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(a.origin).toBe('api');
    expect(b).toBe(a);
    expect(c).toBe(a);
  });
});
