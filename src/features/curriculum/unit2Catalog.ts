import type { CurriculumBook, CurriculumBookStatus, CurriculumStageId, CurriculumUnitPlan } from './types';

export type Unit2BookStatus = CurriculumBookStatus;

export type Unit2Book = CurriculumBook & {
  stageLabel: string;
};

export interface Unit2CatalogGroup {
  id: string;
  title: string;
  stageLabel: string;
  summary: string;
  books: readonly Unit2Book[];
}

interface GroupContext {
  label: string;
  summary: string;
}

interface GroupSpec {
  id: string;
  title: string;
  stageId: CurriculumStageId;
  stageLabel: string;
  summary: string;
  builtBook?: {
    title: string;
    summary: string;
  };
  totalBooks: number;
  topics: readonly string[];
  contexts: readonly GroupContext[];
}

const groupSpecs: readonly GroupSpec[] = [
  {
    id: 'pointing-questions',
    title: '指代同提問',
    stageId: 'stage-a',
    stageLabel: 'A1',
    summary: '先把最常撞牆的指代詞和疑問詞換成粵語口語。',
    builtBook: {
      title: '呢、嗰、啲、邊、乜、咩',
      summary: '先把近指、遠指、量感詞和疑問詞分開，唔好再逐字照搬普通話。',
    },
    totalBooks: 24,
    topics: ['呢', '嗰', '啲', '邊', '乜', '咩'],
    contexts: [
      { label: '單字識別', summary: '先認字形，再聽 Jyutping，分清每一個指代詞。' },
      { label: '短句定位', summary: '把指代詞放進短句，訓練眼耳同時定位。' },
      { label: '問答對比', summary: '用一問一答把最易混的用法拉開。' },
      { label: '回指接句', summary: '練前後文回指，唔好直譯成普通話句型。' },
    ],
  },
  {
    id: 'verb-shift',
    title: '動詞要換口',
    stageId: 'stage-a',
    stageLabel: 'A1',
    summary: '普通話常用動詞要換成更自然的粵語口語。',
    builtBook: {
      title: '喺、嚟、攞、睇、搵、諗',
      summary: '把常見動作先換成粵語慣用動詞，再慢慢拉到句子層面。',
    },
    totalBooks: 22,
    topics: ['喺', '嚟', '攞', '睇', '搵', '諗'],
    contexts: [
      { label: '動作入口', summary: '先把動作的入口音和常見搭配打順。' },
      { label: '短句回收', summary: '把單個動詞收回到短句裡反覆練熟。' },
      { label: '指令回應', summary: '用回應式句子練出真正的口語手感。' },
      { label: '日常替換', summary: '同普通話常見說法對照，建立自動替換。' },
    ],
  },
  {
    id: 'negation-completion',
    title: '否定完成同語氣',
    stageId: 'stage-a',
    stageLabel: 'A1',
    summary: '先練否定、完成和口語節奏的骨架。',
    builtBook: {
      title: '冇、咗、唔、未、先、啫',
      summary: '先把冇、咗、唔、未、先、啫分開，建立最基礎的口語骨架。',
    },
    totalBooks: 18,
    topics: ['冇', '咗', '唔', '未', '先', '啫'],
    contexts: [
      { label: '完成標記', summary: '把完成感和狀態改變放進短句裡。' },
      { label: '否定轉換', summary: '練最常見的唔、冇、未三種否定出口。' },
      { label: '語氣收尾', summary: '把句尾語氣練成自然收口，不要硬翻書面語。' },
    ],
  },
  {
    id: 'pronouns-and-evaluation',
    title: '人稱同評價',
    stageId: 'stage-a',
    stageLabel: 'A1',
    summary: '人稱、問句和評價要整句一起換口。',
    builtBook: {
      title: '佢、哋、係咪、靚、叻',
      summary: '先把代詞、問句和誇人評價放進同一組口語反應裡。',
    },
    totalBooks: 16,
    topics: ['佢', '哋', '係咪', '靚', '叻'],
    contexts: [
      { label: '人稱回應', summary: '用人稱代詞帶出自然問答，不要逐字硬對。' },
      { label: '評價句', summary: '把稱讚和判斷放進最常見的日常回應。' },
      { label: '確認句', summary: '用係咪、係唔係類句型建立確認感。' },
    ],
  },
  {
    id: 'spoken-particles',
    title: '香港口頭語',
    stageId: 'stage-b',
    stageLabel: 'A2',
    summary: '口頭語和句尾節奏是香港口語的主體感。',
    builtBook: {
      title: '咁、咪、囉、晒、郁、執',
      summary: '把香港人口裡真的會順口講的口頭語先練熟。',
    },
    totalBooks: 20,
    topics: ['咁', '咪', '囉', '晒', '郁', '執', '先'],
    contexts: [
      { label: '順口收尾', summary: '先把口語句尾的節奏收穩，不要說得太書面。' },
      { label: '動作推進', summary: '把動詞和口頭語一起推進，聽起來更像本地口語。' },
      { label: '態度語氣', summary: '把說話態度和節奏一起練出來。' },
    ],
  },
  {
    id: 'cha-chaan-teng',
    title: '茶餐廳同落單',
    stageId: 'stage-b',
    stageLabel: 'A2',
    summary: '先把餐廳黑話和服務口語講順。',
    builtBook: {
      title: '埋單、走冰、走青、搭檯、飛邊、加底',
      summary: '先把茶餐廳和點餐場景裡最常見的香港口語講熟。',
    },
    totalBooks: 18,
    topics: ['埋單', '走冰', '走青', '搭檯', '飛邊', '加底'],
    contexts: [
      { label: '點餐黑話', summary: '把點餐時最容易聽錯的說法先熟悉。' },
      { label: '服務回應', summary: '用短回應處理加單、改餐和結帳。' },
      { label: '座位安排', summary: '把搭檯、飛邊、加底這些高頻詞放進場景。' },
    ],
  },
  {
    id: 'daily-life-vocabulary',
    title: '生活名詞同動作',
    stageId: 'stage-b',
    stageLabel: 'A2',
    summary: '日常生活詞先換成香港人口裡真的會用的字。',
    builtBook: {
      title: '返屋企、返工、收工、雪櫃、𨋢、荷包',
      summary: '把日常生活最常說的名詞和動作先換成香港口語。',
    },
    totalBooks: 18,
    topics: ['返屋企', '返工', '收工', '雪櫃', '𨋢', '荷包', '遮'],
    contexts: [
      { label: '日常路線', summary: '把回家、上班、下班的口語說法先固定。' },
      { label: '物件詞', summary: '把家居、隨身物品和動作詞放在一起練。' },
      { label: '生活回收', summary: '從實景短句裡回收高頻詞和口語節奏。' },
    ],
  },
  {
    id: 'transport-lines',
    title: '交通同路線',
    stageId: 'stage-c',
    stageLabel: 'B1',
    summary: '把搭車、落車、轉車講得像本地人。',
    topics: ['搭車', '落車', '轉車', '月台'],
    contexts: [
      { label: '路線問答', summary: '練問路、轉線和確認站名。' },
      { label: '出入口', summary: '把閘口、月台、出口等說法放進場景。' },
      { label: '時間節奏', summary: '處理遲到、趕車和轉乘的常用出口。' },
    ],
    totalBooks: 12,
  },
  {
    id: 'office-talk',
    title: '辦公室口語',
    stageId: 'stage-c',
    stageLabel: 'B1',
    summary: '把協作、跟進和補漏講得自然。',
    topics: ['交帶', '跟進', '執漏', '改少少', '對返'],
    contexts: [
      { label: '同事溝通', summary: '用最常見的工作口語說清楚下一步。' },
      { label: '文件回覆', summary: '把簡短確認、補充和改動講順。' },
    ],
    totalBooks: 10,
  },
  {
    id: 'service-response',
    title: '服務同應對',
    stageId: 'stage-d',
    stageLabel: 'B2',
    summary: '把服務場景的客氣、緩衝和回應講穩。',
    topics: ['麻煩', '唔該晒', '搞掂', '跟單'],
    contexts: [
      { label: '回覆客人', summary: '練客氣回覆、補一句和接回問題。' },
      { label: '工作跟進', summary: '把跟進、處理和完成感講得自然。' },
    ],
    totalBooks: 8,
  },
  {
    id: 'higher-register-spoken',
    title: '高階口語',
    stageId: 'stage-d',
    stageLabel: 'B2',
    summary: '把較長討論裡的轉折、讓步和補充說順。',
    topics: ['其實', '不過', '起碼'],
    contexts: [
      { label: '觀點轉折', summary: '練說話轉彎和補充限制。' },
      { label: '語氣緩衝', summary: '把語氣變得更穩、更像自然談話。' },
    ],
    totalBooks: 6,
  },
  {
    id: 'media-register',
    title: '媒體同語域',
    stageId: 'stage-e',
    stageLabel: 'C1',
    summary: '把訪談、專欄和報道的語感抓住。',
    topics: ['訪談', '專欄', '報道', '評論'],
    contexts: [
      { label: '文字轉口語', summary: '把半書面語轉成自然口語理解。' },
    ],
    totalBooks: 4,
  },
  {
    id: 'c1-c2-nuance',
    title: 'C1 C2 細位',
    stageId: 'stage-e',
    stageLabel: 'C2',
    summary: '練反問、留白、鋪墊和婉轉批評。',
    topics: ['反問', '留白', '鋪墊', '婉轉批評'],
    contexts: [
      { label: '語氣細節', summary: '把高階語氣和言外之意練到穩。' },
    ],
    totalBooks: 4,
  },
];

function buildBooks(spec: GroupSpec): Unit2Book[] {
  const plannedTarget = spec.totalBooks - (spec.builtBook ? 1 : 0);
  const plannedCombos = spec.contexts.flatMap((context) =>
    spec.topics.map((topic) => ({
      topic,
      context,
    })),
  );

  const plannedBooks = plannedCombos.slice(0, plannedTarget).map((combo, index) => ({
    id: `${spec.id}-${String(index + 1).padStart(2, '0')}`,
    unitId: 'unit2' as const,
    stageId: spec.stageId,
    title: `${combo.topic}：${combo.context.label}`,
    summary: `${combo.context.summary}，把「${combo.topic}」放進口語句子裡反覆練熟。`,
    stageLabel: spec.stageLabel,
    status: 'planned' as const,
    clusterId: spec.id,
  }));

  const builtBooks = spec.builtBook
    ? [
      {
        id: `${spec.id}-00`,
        unitId: 'unit2' as const,
        stageId: spec.stageId,
        title: spec.builtBook.title,
        summary: spec.builtBook.summary,
        stageLabel: spec.stageLabel,
        status: 'built' as const,
        clusterId: spec.id,
        },
      ]
    : [];

  return [...builtBooks, ...plannedBooks];
}

export const unit2CatalogGroups: readonly Unit2CatalogGroup[] = groupSpecs.map((spec) => ({
  id: spec.id,
  title: spec.title,
  stageLabel: spec.stageLabel,
  summary: spec.summary,
  books: buildBooks(spec),
}));

export const unit2Catalog: readonly Unit2Book[] = unit2CatalogGroups.flatMap((group) => group.books);

export const unit2CatalogMeta = {
  totalBooks: unit2Catalog.length,
  builtBooks: unit2Catalog.filter((book) => book.status === 'built').length,
  plannedBooks: unit2Catalog.filter((book) => book.status === 'planned').length,
} as const;

export const unit2CatalogPlan: CurriculumUnitPlan = {
  unitId: 'unit2',
  title: '粵語語法同用法',
  totalPlannedBooks: unit2CatalogMeta.totalBooks,
  estimatedHoursLabel: '30 小時',
  books: unit2Catalog,
};
