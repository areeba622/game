// Display name used in all kid-facing text: {commander} (CLAUDE.md 8.1).
// "Commander Nova", or just "Commander" when the player skipped (never "Commander Commander").
export function commanderName(state) {
  const nickname = (state?.nickname ?? '').trim();
  if (!nickname || nickname === 'Commander') return 'Commander';
  return `Commander ${nickname}`;
}
