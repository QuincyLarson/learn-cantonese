import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { Converter } from 'opencc-js';

const require = createRequire(import.meta.url);
const hanzi = require('hanzi');
const ToJyutping = require('to-jyutping');

const TOTAL_CHARACTERS = 5000;
const toTraditional = Converter({ from: 'cn', to: 'tw' });
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '../src/content/commonCharacters.ts');

hanzi.start();

const entries = [];

for (let rank = 1; rank <= TOTAL_CHARACTERS; rank += 1) {
  const item = hanzi.getCharacterInFrequencyListByPosition(rank);

  if (!item?.character) {
    throw new Error(`Missing frequency entry at rank ${rank}`);
  }

  const simplified = item.character;
  const character = toTraditional(simplified);
  const candidates = ToJyutping.getJyutpingCandidates(simplified)?.[0]?.[1] ?? [];

  if (candidates.length === 0) {
    throw new Error(`Missing Jyutping for rank ${rank}: ${simplified}`);
  }

  entries.push({
    id: `cc-${rank}`,
    rank,
    character,
    simplified,
    jyutping: candidates[0],
    jyutpingCandidates: candidates,
  });
}

const lines = [
  'import type { CommonCharacterEntry } from "./types";',
  '',
  'const commonCharacterRows: ReadonlyArray<readonly [string, string, string, readonly string[]]> = [',
  ...entries.map((entry) => `  ${JSON.stringify([entry.character, entry.simplified, entry.jyutping, entry.jyutpingCandidates])},`),
  '];',
  '',
  'export function getCommonCharacterEntries(): CommonCharacterEntry[] {',
  '  return commonCharacterRows.map(([character, simplified, jyutping, jyutpingCandidates], index) => ({',
  '    id: `cc-${index + 1}`,',
  '    rank: index + 1,',
  '    character,',
  '    simplified,',
  '    jyutping,',
  '    jyutpingCandidates: [...jyutpingCandidates],',
  '  }));',
  '}',
  '',
];

await fs.writeFile(outputPath, `${lines.join('\n')}\n`, 'utf8');

console.log(`Wrote ${entries.length} common characters to ${outputPath}`);
