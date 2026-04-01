import type { CommonStructureEntry } from '@/content/types';

export const COMMON_STRUCTURE_COUNT = 10000;

let cachedEntries: CommonStructureEntry[] | null = null;

async function loadCommonStructures(): Promise<CommonStructureEntry[]> {
  if (cachedEntries) {
    return cachedEntries;
  }

  // Keep the 10k structure corpus in its own chunk so the initial app stays small.
  const module = await import('@/content/commonStructures');
  cachedEntries = module.getCommonStructureEntries();
  return cachedEntries;
}

export async function getCommonStructureEntries(): Promise<CommonStructureEntry[]> {
  return loadCommonStructures();
}

function normalizeJyutpingQuery(query: string) {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
}

export async function searchCommonStructuresByJyutpingPrefix(query: string, limit = 8): Promise<CommonStructureEntry[]> {
  const normalized = normalizeJyutpingQuery(query);

  if (!normalized) {
    return [];
  }

  const entries = await loadCommonStructures();
  return entries.filter((entry) => entry.jyutping.startsWith(normalized)).slice(0, limit);
}
