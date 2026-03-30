import type { CommonCharacterEntry } from '@/content/types';

export const COMMON_CHARACTER_COUNT = 5000;

let cachedEntries: CommonCharacterEntry[] | null = null;
let cachedByGlyph: Record<string, CommonCharacterEntry> | null = null;

async function loadCommonCharacters(): Promise<CommonCharacterEntry[]> {
  if (cachedEntries) {
    return cachedEntries;
  }

  const module = await import('@/content/commonCharacters');
  cachedEntries = module.getCommonCharacterEntries();
  return cachedEntries;
}

function getByGlyph(entries: readonly CommonCharacterEntry[]) {
  if (cachedByGlyph) {
    return cachedByGlyph;
  }

  cachedByGlyph = entries.reduce<Record<string, CommonCharacterEntry>>((result, entry) => {
    result[entry.character] = entry;
    result[entry.simplified] = entry;
    return result;
  }, {});

  return cachedByGlyph;
}

export async function getCommonCharacterEntry(character: string): Promise<CommonCharacterEntry | undefined> {
  const entries = await loadCommonCharacters();
  return getByGlyph(entries)[character];
}

export async function searchCommonCharactersByJyutpingPrefix(query: string, limit = 8): Promise<CommonCharacterEntry[]> {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  const entries = await loadCommonCharacters();
  return entries.filter((entry) => (
    entry.jyutping.startsWith(normalized) ||
    entry.jyutpingCandidates.some((candidate) => candidate.startsWith(normalized))
  )).slice(0, limit);
}
