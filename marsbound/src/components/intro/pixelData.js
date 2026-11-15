// Pixel data for the Intro: palette, icon grids, astronaut grids, suit colours, status looks.

export const PAL = {
  c: '#4fd6ff', C: '#1fa5e0', h: '#d6f6ff', B: '#3a8bff', b: '#1f56b8', Y: '#ffd23f', y: '#d99a1c',
  R: '#ff4a45', r: '#b02a2a', G: '#6bd44a', g: '#3e8f2a', W: '#ffffff', w: '#b8bcc9', x: '#7c8196',
  O: '#ff8a3d', o: '#c4562a', K: '#c98f64', D: '#2a1d1a', P: '#a050ff', N: '#2d3f8a', T: '#d9b48a',
  E: '#101018', L: '#8a4a2a',
};

const recolor = (grid, from, to) => grid.map((row) => row.split(from).join(to));

export const ICONS = {
  O: ['..cccc..', '.chhccC.', 'chcccccC', 'ccccccCC', 'ccccccCC', 'cccccCCC', '.cCCCCC.', '..CCCC..'],
  W: ['...BB...', '...BB...', '..BBBB..', '.BhBBBb.', 'BBhBBBBb', 'BBBBBBBb', '.BBBBBb.', '..bbbb..'],
  P: ['....YY..', '...YY...', '..YY....', '.YYYYYy.', '...YYy..', '..YYy...', '.YYy....', '.Yy.....'],
  C: ['.RR..RR.', 'RhRRRRRr', 'RRRRRRRr', 'RRRRRRRr', '.RRRRRr.', '..RRRr..', '...Rr...', '........'],
  S: ['..wwww..', '...ww...', '...ww...', '..GGGG..', '.GGhGGg.', 'GGGGGGGg', 'GGGGGGgg', '.gggggg.'],
  check: ['........', '......GG', '.....GG.', 'G...GG..', 'GG.GG...', '.GGG....', '..G.....', '........'],
  warn: ['...YY...', '..YYYY..', '..YEEY..', '.YYEEYY.', '.YYEEYY.', 'YYYYYYYY', 'YYYEEYYY', 'YYYYYYYY'],
  x: ['RR....RR', '.RR..RR.', '..RRRR..', '...RR...', '..RRRR..', '.RR..RR.', 'RR....RR', '........'],
  sun: ['O..OO..O', '.O.OO.O.', '..YYYY..', 'OOYYYYOO', 'OOYYYYOO', '..YYYY..', '.O.OO.O.', 'O..OO..O'],
  moon: ['..WWW...', '.WWw....', 'WWw.....', 'WWw.....', 'WWw.....', 'WWWw....', '.WWWWWW.', '..WWWW..'],
  cloud: ['..wwww..', '.wwwwww.', 'wwwwwwww', 'wwwYYwww', '.wwYYww.', '...YY...', '..YY....', '..Y.....'],
  leaf: ['......GG', '....GGGg', '..GGGGGg', '.GGGGGg.', '.GGGGg..', '.GGg....', 'Lg......', 'L.......'],
  dish: ['T.....B.', 'TT...BB.', '.TT..B..', '..TTT...', '...T....', '...T....', '..TTT...', '.TTTTT..'],
  shield: ['cccccccc', 'chcccccC', 'chcccccC', 'cccccccC', '.ccccCC.', '..cccC..', '...cC...', '........'],
  tool: ['..ww.ww.', '.ww..ww.', '.www.w..', '..www...', '...www..', '..ww.ww.', '.ww...w.', '.w......'],
  cross: ['..RRRR..', '..RWWR..', 'RRRWWRRR', 'RWWWWWWR', 'RWWWWWWR', 'RRRWWRRR', '..RWWR..', '..RRRR..'],
  rock: ['........', '...ww...', '..wxww..', '.wwwwxw.', 'wwxwwwww', 'wwwwwxww', 'xxxxxxxx', '........'],
  list: ['..wwww..', '.WWWWWW.', '.WxxxxW.', '.WWWWWW.', '.WxxxxW.', '.WWWWWW.', '.WxxWWW.', '.WWWWWW.'],
  bulb: ['..YYYY..', '.YYhYYy.', '.YYYYYy.', '.YYYYYy.', '..YYYy..', '...ww...', '...ww...', '....w...'],
  star: ['...YY...', '...YY...', 'YYYYYYYY', '.YYYYYY.', '..YYYY..', '.YYY.YY.', '.YY...YY', '........'],
};
ICONS.checky = recolor(ICONS.check, 'G', 'Y');
ICONS.warno = recolor(ICONS.warn, 'Y', 'O');
ICONS.warnr = recolor(ICONS.warn, 'Y', 'R');
ICONS.xg = recolor(ICONS.x, 'R', 'w');

// Astronauts
export const ASTRO = [
  '....wwww....', '...WWWWWW...', '..WWBBBBWw..', '..WBBHHBBw..', '..WBBBBBBw..', '..WWBBBBWw..', '...WWWWWw...',
  '.A.WWSSWw.A.', '.AWWWSSWwwA.', '.AWWWWWWwwA.', '.AWWWWWWww..', '..WWWWWWww..', '...WW..ww...', '...WW..ww...',
  '..SSS..SSs..', '..SSS..SSs..',
];
export const SUITS = {
  mira: ['#ff5a7a', '#c43a58'],
  kai: ['#ffc83d', '#c9962a'],
  zuri: ['#4fd98a', '#2e9a5c'],
  leo: ['#5aa8ff', '#3a70c4'],
  you: ['#ff8a3d', '#c4562a'],
};
export const astroPal = (k) => ({
  W: '#f4f4f8', w: '#c4c8d6', A: '#8d93a8', B: '#1f3a8a', H: '#7fc4ff', S: SUITS[k][0], s: SUITS[k][1],
});
// Mission Control: a person at a console, drawn small.
export const MCG = [
  '....DDDDDDDD....', '...DDDDDDDDDD...', '..WDDDDDDDDDDW..', '..WDDKKKKKKDDW..', '.WWDKKKKKKKKDWW.',
  '.WWDKKEKKEKKDWW.', '.WWDKKKKKKKKDWW.', '.WW.KKKKKKKK.WW.', '.WW..KKrrKK..WW.', '.WW...KKKK...WW.',
  '....NNNKKNNN....', '...NNNNNNNNNN...', '..NNNNNOONNNNN..', '..NNNNNOONNNNN..',
];

// Meter names as the game uses them.
export const METER_NAME = { O: 'Oxygen', W: 'Water', P: 'Power', C: 'Crew Health', S: 'Science' };

// statusLabel() gives the word. The pictures and colours here are the pixel versions of it:
// a different shape for each word, so colour is never the only signal.
const LOOKS = {
  Healthy: { icon: 'check', color: '#7ed34a' },
  OK: { icon: 'checky', color: '#f6d94a' },
  Low: { icon: 'warno', color: '#ff9a3d' },
  Critical: { icon: 'warnr', color: '#ff7a6e' },
  Empty: { icon: 'xg', color: '#aab3c5' },
};
export const statusLook = (word) => LOOKS[word] ?? LOOKS.OK;

export const PALS = Object.fromEntries(Object.keys(SUITS).map((k) => [k, astroPal(k)]));
