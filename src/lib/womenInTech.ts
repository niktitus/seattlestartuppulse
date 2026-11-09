const ORGANIZERS = ['swell', 'rooftop', 'sheto', 'she to', 'women in tech', 'ada developers', 'women', 'female', 'girls who', 'latinas in tech', 'blackgirl', 'grace hopper', 'ghc'];
const KEYWORDS = /\b(women|woman|female|femme|she\/her|girls|ladies|latinas|womxn|her)\b/i;

export function isWomenInTechEvent(e: { title?: string; organizer?: string; description?: string }) {
  const org = (e.organizer || '').toLowerCase();
  if (ORGANIZERS.some((o) => org.includes(o))) return true;
  const title = (e.title || '').toLowerCase();
  if (ORGANIZERS.some((o) => title.includes(o))) return true;
  return KEYWORDS.test(`${e.title || ''} ${e.description || ''}`.replace(/\bher\b/gi, ''));
}
