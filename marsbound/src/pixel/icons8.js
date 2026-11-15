// Small 8 x 8 pixel icons for the HUD (meters and status). Letters are keys into ICON8_COLORS.
// Status icons use different silhouettes so colour is never the only signal.

export const ICON8_COLORS = {
  w: '#fff0e0',
  c: '#4fd1e8',
  B: '#3b7be0',
  y: '#ffd23f',
  r: '#e8404f',
  g: '#7bbf4a',
  k: '#0d0603',
};

export const ICON8 = {
  o: ['..cccc..', '.cwwccc.', 'cwcccccc', 'cwcccccc', 'cccccccc', 'cccccccc', '.cccccc.', '..cccc..'],
  w: ['...BB...', '...BB...', '..BBBB..', '.BBwBBB.', '.BBwBBB.', '.BBBBBB.', '..BBBB..', '........'],
  p: ['....yyy.', '...yyy..', '..yyy...', '.yyyyyy.', '...yyy..', '..yyy...', '..yy....', '.y......'],
  c: ['.rr..rr.', 'rrrrrrrr', 'rrrrrrrr', 'rrrrrrrr', '.rrrrrr.', '..rrrr..', '...rr...', '........'],
  s: ['..wwww..', '...ww...', '...ww...', '..gggg..', '.gggggg.', 'gggggggg', 'gggggggg', '.gggggg.'],
  ok: ['........', '......g.', '.....gg.', 'g...gg..', 'gg.gg...', '.ggg....', '..g.....', '........'],
  low: ['...yy...', '..yyyy..', '..ykky..', '.yykkyy.', '.yykkyy.', 'yyyyyyyy', 'yyykkyyy', 'yyyyyyyy'],
  danger: ['r......r', '.r....r.', '..r..r..', '...rr...', '...rr...', '..r..r..', '.r....r.', 'r......r'],
};

// Game meter key (O W P C S) to icon name.
export const METER_ICON8 = { O: 'o', W: 'w', P: 'p', C: 'c', S: 's' };

// statusLabel().word from src/game to icon name and tone. Display only.
export const STATUS_LOOK = {
  Healthy: { icon: 'ok', tone: 'ok' },
  OK: { icon: 'ok', tone: 'ok' },
  Low: { icon: 'low', tone: 'low' },
  Critical: { icon: 'danger', tone: 'danger' },
  Empty: { icon: 'danger', tone: 'danger' },
};
