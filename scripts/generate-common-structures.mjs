import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { Converter } from 'opencc-js';

const require = createRequire(import.meta.url);
const hanzi = require('hanzi');
const ToJyutping = require('to-jyutping');
const data = require('hanzi/lib/data');

const TOTAL_CHARACTERS = 5000;
const TOTAL_STRUCTURES = 10000;
const KIND_TARGETS = {
  pair: 6500,
  phrase: 2500,
  idiom: 900,
  yanyu: 100,
};
const KIND_REFILL_ORDER = ['phrase', 'pair', 'idiom', 'yanyu'];
const CHINESE_PATTERN = /^[\p{Script=Han}，、！？：；「」『』（）《》〈〉·…—]+$/u;
const PUNCTUATION_PATTERN = /[，、！？：；「」『』（）《》〈〉·…—]/g;
const BLOCKED_DEFINITION_FRAGMENTS = [
  'surname',
  'variant of',
  'old variant',
  'archaic',
  'classical variant',
  'literary variant',
  'buddh',
  'dao',
  'christian',
  'islam',
  'god',
  'deity',
  'bible',
  'koran',
  'communist',
  'politic',
  'people\'s republic',
  'prc',
  'taiwan',
  'revolution',
  'dynasty',
  'emperor',
  'imperial',
  'kingdom',
  'warlord',
  'province',
  'county',
  'city',
  'district',
  'township',
  'village',
  'capital of',
  'capital city',
  'place name',
  'country in',
  'country on',
  'river in',
  'mountain in',
  'constellation',
  'zodiac',
  'novel by',
  'film',
  'movie',
  'tv series',
  'microblog',
  'micro-blog',
  'computing',
  'software',
  'website',
  'internet',
  'dice game',
  'video game',
  'porn',
  'prostitute',
  'brothel',
  'rape',
  'obscene',
  'vulgar',
  'slang',
  'taboo',
  'swear',
  'curse',
  'terror',
  'massacre',
  'murder',
  'bomb',
  'gun',
];

const toTraditional = Converter({ from: 'cn', to: 'tw' });
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '../src/content/commonStructures.ts');

hanzi.start();

function normalizeJyutping(text) {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

function compactText(text) {
  return text.replace(PUNCTUATION_PATTERN, '');
}

function buildTopCharacterSet() {
  const topCharacters = new Set();

  for (let rank = 1; rank <= TOTAL_CHARACTERS; rank += 1) {
    const item = hanzi.getCharacterInFrequencyListByPosition(rank);

    if (!item?.character) {
      throw new Error(`Missing frequency entry at rank ${rank}`);
    }

    topCharacters.add(item.character);
    topCharacters.add(toTraditional(item.character));
  }

  return topCharacters;
}

function buildWordFrequencyMap() {
  const frequencyMap = new Map();
  const lines = data.loadLeiden().split(/\r?\n/);

  for (const line of lines) {
    if (!line) {
      continue;
    }

    const splitIndex = line.lastIndexOf(',');
    if (splitIndex <= 0) {
      continue;
    }

    const word = line.slice(0, splitIndex);
    const frequency = Number(line.slice(splitIndex + 1));

    if (!Number.isFinite(frequency) || frequency <= 0) {
      continue;
    }

    const current = frequencyMap.get(word);
    if (!current || current < frequency) {
      frequencyMap.set(word, frequency);
    }
  }

  return frequencyMap;
}

function isSafeDefinition(definition) {
  const lowered = definition.toLowerCase();
  return !BLOCKED_DEFINITION_FRAGMENTS.some((fragment) => lowered.includes(fragment));
}

function classifyStructure(text, definition) {
  const compact = compactText(text);

  if (/[，、]/.test(text)) {
    return 'yanyu';
  }

  if (definition.includes('(idiom)')) {
    return compact.length >= 5 ? 'yanyu' : 'idiom';
  }

  if (compact.length === 2) {
    return 'pair';
  }

  if (compact.length >= 3 && compact.length <= 6) {
    return 'phrase';
  }

  return null;
}

const topCharacters = buildTopCharacterSet();
const wordFrequencyMap = buildWordFrequencyMap();
const bucketMap = {
  pair: new Map(),
  phrase: new Map(),
  idiom: new Map(),
  yanyu: new Map(),
};

for (const line of data.loadCCEDICT().split(/\r?\n/).slice(30)) {
  if (!line || line.startsWith('#')) {
    continue;
  }

  const openBracket = line.indexOf('[');
  const closeBracket = line.indexOf(']');
  const definitionStart = line.indexOf('/');
  const definitionEnd = line.lastIndexOf('/');

  if (openBracket <= 0 || closeBracket <= openBracket || definitionStart < 0 || definitionEnd <= definitionStart) {
    continue;
  }

  const [traditional, simplified] = line.slice(0, openBracket).trim().split(/\s+/);
  const pinyin = line.slice(openBracket + 1, closeBracket);
  const definition = line.slice(definitionStart + 1, definitionEnd);

  if (!traditional || !simplified || /[A-Z]/.test(pinyin)) {
    continue;
  }

  const text = toTraditional(simplified) || traditional;
  if (!CHINESE_PATTERN.test(text)) {
    continue;
  }

  const compact = compactText(text);
  if (compact.length < 2 || compact.length > 10) {
    continue;
  }

  if (![...compact].every((character) => topCharacters.has(character))) {
    continue;
  }

  if (!isSafeDefinition(definition)) {
    continue;
  }

  const kind = classifyStructure(text, definition);
  if (!kind) {
    continue;
  }

  const frequencyScore = Math.max(
    wordFrequencyMap.get(simplified) || 0,
    wordFrequencyMap.get(text) || 0,
    wordFrequencyMap.get(traditional) || 0,
  );

  if (frequencyScore <= 0) {
    continue;
  }

  const jyutping = normalizeJyutping(ToJyutping.getJyutpingText(text));
  if (!jyutping || jyutping.includes('undefined')) {
    continue;
  }

  const current = bucketMap[kind].get(text);
  if (!current || current.frequencyScore < frequencyScore) {
    bucketMap[kind].set(text, {
      text,
      simplified,
      jyutping,
      kind,
      frequencyScore,
    });
  }
}

const sortedBuckets = Object.fromEntries(
  Object.entries(bucketMap).map(([kind, bucket]) => [
    kind,
    [...bucket.values()].sort((left, right) => right.frequencyScore - left.frequencyScore || left.text.localeCompare(right.text, 'zh-Hant')),
  ]),
);

const selected = [];
const consumedByKind = {
  pair: 0,
  phrase: 0,
  idiom: 0,
  yanyu: 0,
};

for (const [kind, target] of Object.entries(KIND_TARGETS)) {
  const bucket = sortedBuckets[kind];
  const takeCount = Math.min(target, bucket.length);
  selected.push(...bucket.slice(0, takeCount));
  consumedByKind[kind] = takeCount;
}

while (selected.length < TOTAL_STRUCTURES) {
  let advanced = false;

  for (const kind of KIND_REFILL_ORDER) {
    const bucket = sortedBuckets[kind];
    const nextIndex = consumedByKind[kind];
    if (nextIndex >= bucket.length) {
      continue;
    }

    selected.push(bucket[nextIndex]);
    consumedByKind[kind] += 1;
    advanced = true;

    if (selected.length >= TOTAL_STRUCTURES) {
      break;
    }
  }

  if (!advanced) {
    break;
  }
}

if (selected.length !== TOTAL_STRUCTURES) {
  throw new Error(`Expected ${TOTAL_STRUCTURES} structures, received ${selected.length}`);
}

const lines = [
  'import type { CommonStructureEntry, CommonStructureKind } from "./types";',
  '',
  'const commonStructureRows: ReadonlyArray<readonly [string, string, string, CommonStructureKind, number]> = [',
  ...selected.map((entry) => `  ${JSON.stringify([entry.text, entry.simplified, entry.jyutping, entry.kind, entry.frequencyScore])},`),
  '];',
  '',
  'export function getCommonStructureEntries(): CommonStructureEntry[] {',
  '  return commonStructureRows.map(([text, simplified, jyutping, kind, frequencyScore], index) => ({',
  '    id: `cs-${index + 1}`,',
  '    rank: index + 1,',
  '    text,',
  '    simplified,',
  '    jyutping,',
  '    kind,',
  '    frequencyScore,',
  '  }));',
  '}',
  '',
];

await fs.writeFile(outputPath, `${lines.join('\n')}\n`, 'utf8');

console.log(`Wrote ${selected.length} common structures to ${outputPath}`);
