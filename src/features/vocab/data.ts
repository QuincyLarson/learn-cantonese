import type { CommonCharacterEntry, CommonStructureEntry } from '@/content';
import { getCommonCharacterEntries } from '@/features/learn/commonCharacters';
import { getCommonStructureEntries } from '@/features/learn/commonStructures';

const PROMPT_MAX_LENGTH = 4;

type ColloquialStructureOverride = {
  text: string;
  simplified: string;
  jyutping: string;
};

const colloquialStructureOverrides: Record<string, ColloquialStructureOverride> = {
  '我們': { text: '我哋', simplified: '我哋', jyutping: 'ngo5 dei6' },
  '你們': { text: '你哋', simplified: '你哋', jyutping: 'nei5 dei6' },
  '他們': { text: '佢哋', simplified: '佢哋', jyutping: 'keoi5 dei6' },
  '她們': { text: '佢哋', simplified: '佢哋', jyutping: 'keoi5 dei6' },
  '它們': { text: '佢哋', simplified: '佢哋', jyutping: 'keoi5 dei6' },
  '今天': { text: '今日', simplified: '今日', jyutping: 'gam1 jat6' },
  '什麼': { text: '乜嘢', simplified: '乜嘢', jyutping: 'mat1 je5' },
  '沒有': { text: '冇', simplified: '冇', jyutping: 'mou5' },
  '這個': { text: '呢個', simplified: '呢个', jyutping: 'ni1 go3' },
  '這樣': { text: '咁樣', simplified: '咁样', jyutping: 'gam2 joeng2' },
  '這麼': { text: '咁', simplified: '咁', jyutping: 'gam2' },
  '這裡': { text: '呢度', simplified: '呢度', jyutping: 'ni1 dou6' },
  '這些': { text: '呢啲', simplified: '呢啲', jyutping: 'ni1 di1' },
  '那麼': { text: '咁', simplified: '咁', jyutping: 'gam2' },
  '那些': { text: '嗰啲', simplified: '嗰啲', jyutping: 'go2 di1' },
  '怎麼': { text: '點樣', simplified: '点样', jyutping: 'dim2 joeng2' },
  '現在': { text: '而家', simplified: '而家', jyutping: 'ji4 gaa1' },
  '一起': { text: '一齊', simplified: '一齐', jyutping: 'jat1 cai4' },
  '喜歡': { text: '鍾意', simplified: '钟意', jyutping: 'zung1 ji3' },
  '回家': { text: '返屋企', simplified: '返屋企', jyutping: 'faan1 uk1 kei2' },
  '還是': { text: '定係', simplified: '定系', jyutping: 'ding6 hai6' },
  '是不是': { text: '係唔係', simplified: '系唔系', jyutping: 'hai6 m4 hai6' },
};

const mandarinLikeStructurePatterns = [
  /們/u,
  /這/u,
  /那/u,
  /沒/u,
  /什麼/u,
  /怎麼/u,
  /現在/u,
  /一起/u,
  /喜歡/u,
  /回家/u,
  /還是/u,
  /今天/u,
];

const PROMPT_MIN_LENGTH = 2;

export type VocabPrompt = {
  id: string;
  rank: number;
  text: string;
  simplified: string;
  jyutping: string;
  characters: string[];
  focusCharacterId: string;
  focusCharacter: string;
  focusSimplified: string;
};

let cachedPrompts: VocabPrompt[] | null = null;

function normalizeJyutping(input: string) {
  return input.trim().toLowerCase().replace(/\s+/g, ' ');
}

function countPromptGlyphs(input: string) {
  return Array.from(input.replace(/\s+/g, '')).length;
}

function buildCharacterMap(characters: readonly CommonCharacterEntry[]) {
  const map = new Map<string, CommonCharacterEntry>();

  for (const character of characters) {
    map.set(character.character, character);
    map.set(character.simplified, character);
  }

  return map;
}

function getPreferredStructureDisplay(entry: CommonStructureEntry) {
  const override = colloquialStructureOverrides[entry.text];
  if (override) {
    return override;
  }

  if (mandarinLikeStructurePatterns.some((pattern) => pattern.test(entry.text))) {
    return null;
  }

  return {
    text: entry.text,
    simplified: entry.simplified,
    jyutping: normalizeJyutping(entry.jyutping),
  };
}

function buildRepresentativeStructures(
  characters: readonly CommonCharacterEntry[],
  structures: readonly CommonStructureEntry[],
) {
  const characterByGlyph = buildCharacterMap(characters);
  const representativeByCharacterId = new Map<string, Pick<VocabPrompt, 'text' | 'simplified' | 'jyutping' | 'characters'>>();

  for (const structure of structures) {
    const preferredDisplay = getPreferredStructureDisplay(structure);
    if (!preferredDisplay) {
      continue;
    }

    const sourceGlyphs = Array.from(structure.text.trim());
    const displayGlyphs = Array.from(preferredDisplay.text.trim());
    if (displayGlyphs.length < PROMPT_MIN_LENGTH || displayGlyphs.length > PROMPT_MAX_LENGTH) {
      continue;
    }

    const normalizedJyutping = normalizeJyutping(preferredDisplay.jyutping);
    if (!normalizedJyutping) {
      continue;
    }

    const tokens = normalizedJyutping.split(' ');
    if (tokens.length !== displayGlyphs.length) {
      continue;
    }

    const characterEntries = sourceGlyphs.map((glyph) => characterByGlyph.get(glyph));
    if (characterEntries.some((entry) => !entry)) {
      continue;
    }

    const displayCharacters = displayGlyphs;

    for (const entry of characterEntries) {
      if (!entry || representativeByCharacterId.has(entry.id)) {
        continue;
      }

      representativeByCharacterId.set(entry.id, {
        text: preferredDisplay.text,
        simplified: preferredDisplay.simplified,
        jyutping: normalizedJyutping,
        characters: displayCharacters,
      });
    }
  }

  return representativeByCharacterId;
}

export async function getVocabPrompts(): Promise<VocabPrompt[]> {
  if (cachedPrompts) {
    return cachedPrompts;
  }

  const [characters, structures] = await Promise.all([
    getCommonCharacterEntries(),
    getCommonStructureEntries(),
  ]);
  const representativeByCharacterId = buildRepresentativeStructures(characters, structures);

  cachedPrompts = characters
    .map((character) => {
      const representative = representativeByCharacterId.get(character.id);
      if (!representative || countPromptGlyphs(representative.text) < PROMPT_MIN_LENGTH) {
        return null;
      }

      return {
        id: `vocab:${character.id}`,
        rank: character.rank,
        text: representative.text,
        simplified: representative.simplified,
        jyutping: representative.jyutping,
        characters: representative.characters,
        focusCharacterId: character.id,
        focusCharacter: character.character,
        focusSimplified: character.simplified,
      };
    })
    .filter((prompt): prompt is VocabPrompt => Boolean(prompt));

  return cachedPrompts;
}
