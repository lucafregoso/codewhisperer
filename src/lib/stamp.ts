/**
 * Stamp generativo: la "fotografia" di una testata senza immagini
 * (PRODUCT.md, "La tipografia è la nostra fotografia"). Da un seed
 * testuale (lo slug della storia) deriva
 * una griglia deterministica di segni tipografici — punto, tacca,
 * blocco — con una minoranza in colore segnale. Stesso slug → stesso
 * stamp, per sempre: il glifo è l'identità visiva della storia.
 */

export type StampMark = {
  col: number;
  row: number;
  kind: "dot" | "dash" | "block";
  signal: boolean;
};

function fnv1a(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function stampMarks(
  seed: string,
  cols: number,
  rows: number,
): StampMark[] {
  const rand = mulberry32(fnv1a(seed));
  const marks: StampMark[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const roll = rand();
      if (roll < 0.42) continue; // cella vuota: lo stamp respira
      const kindRoll = rand();
      const kind =
        kindRoll < 0.45 ? "dot" : kindRoll < 0.8 ? "dash" : "block";
      marks.push({ col, row, kind, signal: rand() < 0.18 });
    }
  }
  return marks;
}
