export type VocabCatalogStatus = 'built' | 'planned';

export interface VocabCatalogBook {
  id: string;
  title: string;
  summary: string;
  stageLabel: string;
  status: VocabCatalogStatus;
  order: number;
}

export interface VocabCatalogStage {
  id: string;
  label: string;
  summary: string;
  plannedBookCount: number;
  builtBookCount: number;
  bookIds: string[];
}

interface VocabCatalogPhaseBlueprint {
  label: string;
  summary: string;
}

interface VocabCatalogClusterBlueprint {
  id: string;
  label: string;
  summary: string;
}

interface VocabCatalogStageBlueprint {
  id: string;
  label: string;
  summary: string;
  clusters: readonly VocabCatalogClusterBlueprint[];
  phases: readonly VocabCatalogPhaseBlueprint[];
}

const stageBlueprints: readonly VocabCatalogStageBlueprint[] = [
  {
    id: 'unit-1-single-characters',
    label: '高頻單字',
    summary: '把最常用的單字聲音先釘穩。',
    clusters: [
      { id: 'nei-zi', label: '近指字', summary: '把近指字這一組的粵拼同聲調打穩。' },
      { id: 'jyu-zi', label: '遠指字', summary: '把遠指字這一組的粵拼同聲調打穩。' },
      { id: 'fau-ding-zi', label: '否定字', summary: '把否定字這一組的粵拼同聲調打穩。' },
      { id: 'wun-sing-zi', label: '完成字', summary: '把完成字這一組的粵拼同聲調打穩。' },
      { id: 'jan-cing-zi', label: '人稱字', summary: '把人稱字這一組的粵拼同聲調打穩。' },
      { id: 'wai-zing-zi', label: '位置字', summary: '把位置字這一組的粵拼同聲調打穩。' },
      { id: 'dung-zok-zi', label: '動作字', summary: '把動作字這一組的粵拼同聲調打穩。' },
      { id: 'zau-ci', label: '口語助詞', summary: '把口語助詞這一組的粵拼同聲調打穩。' },
    ],
    phases: [
      { label: '入門', summary: '先把最核心的字音釘住。' },
      { label: '對照', summary: '把最容易混淆的地方拉開。' },
      { label: '打字', summary: '直接用粵拼輸入。' },
      { label: '回鍋', summary: '把前面學過的內容重新打深。' },
      { label: '混合', summary: '混入舊內容測穩定度。' },
    ],
  },
  {
    id: 'unit-2-common-word-pairs',
    label: '常用詞組',
    summary: '把常見詞組換成自然粵語口語。',
    clusters: [
      { id: 'jan-cing-pei-doi', label: '人稱配對', summary: '把常見人稱配對直接打熟。' },
      { id: 'zi-dai-pei-doi', label: '指代配對', summary: '把指代配對的口語節奏打順。' },
      { id: 'dung-zok-pei-doi', label: '動作配對', summary: '把高頻動作配對變成自然口語。' },
      { id: 'jam-sik-pei-doi', label: '飲食配對', summary: '把飲食配對變成常用說法。' },
      { id: 'gaau-tung-pei-doi', label: '交通配對', summary: '把交通配對變成常用說法。' },
      { id: 'sang-woi-pei-doi', label: '生活配對', summary: '把生活配對變成常用說法。' },
      { id: 'xing-jung-pei-doi', label: '形容配對', summary: '把形容配對變成自然口語。' },
    ],
    phases: [
      { label: '入門', summary: '先把詞組整體記住。' },
      { label: '換口', summary: '把普通話直譯換成粵語順口說法。' },
      { label: '打字', summary: '直接用粵拼輸入詞組。' },
      { label: '回鍋', summary: '把前面學過的詞組重新打深。' },
      { label: '混合', summary: '混入舊詞組測穩定度。' },
    ],
  },
  {
    id: 'unit-3-short-sentence-typing',
    label: '短句打字',
    summary: '把詞組放進短句，直接練輸入。',
    clusters: [
      { id: 'wai-zing-keoi', label: '位置句', summary: '把位置短句一次打通。' },
      { id: 'si-gaan-keoi', label: '時間句', summary: '把時間短句一次打通。' },
      { id: 'fau-ding-keoi', label: '否定句', summary: '把否定短句一次打通。' },
      { id: 'wun-sing-keoi', label: '完成句', summary: '把完成短句一次打通。' },
      { id: 'man-daap-keoi', label: '問答句', summary: '把問答短句一次打通。' },
      { id: 'zau-jyu-keoi', label: '口語句', summary: '把常見口語短句一次打通。' },
    ],
    phases: [
      { label: '短句', summary: '先熟句子骨架。' },
      { label: '補位', summary: '把漏掉的字位補回來。' },
      { label: '打字', summary: '直接完整輸入整句。' },
      { label: '回鍋', summary: '把前面學過的句式重新打深。' },
      { label: '混合', summary: '混入舊句型測穩定度。' },
    ],
  },
  {
    id: 'unit-4-listening-review',
    label: '聽音回鍋',
    summary: '把耳朵訓練成能分辨近音和聲調。',
    clusters: [
      { id: 'gan-jam-bin-bit', label: '近音辨別', summary: '把近音差異先聽清。' },
      { id: 'sing-diu-dui-zhaaap', label: '聲調對照', summary: '把聲調對照先聽清。' },
      { id: 'ceoi-wai-jyu-hei', label: '句尾語氣', summary: '把句尾語氣先聽清。' },
      { id: 'zaap-zou-keoi', label: '節奏短句', summary: '把短句節奏先聽清。' },
      { id: 'faai-sok-ting-bit', label: '快速聽辨', summary: '把快速輸入中的差異先聽清。' },
    ],
    phases: [
      { label: '聽清', summary: '先抓住最明顯的差異。' },
      { label: '辨聲', summary: '再分開容易混的聲音。' },
      { label: '聽辨', summary: '用耳朵判斷正確讀法。' },
      { label: '回鍋', summary: '把前面聽過的內容重播再辨。' },
      { label: '混合', summary: '混入舊內容做聽辨。' },
    ],
  },
  {
    id: 'unit-5-speed-refinement',
    label: '速度提煉',
    summary: '把速度、穩定度和回鍋效率拉高。',
    clusters: [
      { id: 'lin-daap', label: '加速連打', summary: '把連續輸入速度提上去。' },
      { id: 'zung-bou', label: '重播校準', summary: '把播放和回聽節奏校準。' },
      { id: 'jat-ci-doi-wui', label: '一次到位', summary: '把答案一次打到位。' },
      { id: 'sok-dou', label: '速度循環', summary: '把快打和回鍋循環起來。' },
      { id: 'wun-ding-wui-gau', label: '穩定回鍋', summary: '把穩定度磨到更高。' },
    ],
    phases: [
      { label: '加速', summary: '先把節奏拉快。' },
      { label: '連打', summary: '再把連打穩住。' },
      { label: '重播', summary: '靠重播微調。' },
      { label: '回鍋', summary: '把失誤內容重新做熟。' },
      { label: '混合', summary: '混入舊內容測速度。' },
    ],
  },
  {
    id: 'unit-6-professional-usage',
    label: '工作口語',
    summary: '把練習搬去工作、服務同協作場景。',
    clusters: [
      { id: 'tung-san', label: '通訊', summary: '把工作訊息說得短而清楚。' },
      { id: 'wui-min', label: '會面', summary: '把見面安排說得自然順口。' },
      { id: 'aan-pai', label: '安排', summary: '把跟進和補充說得自然。' },
      { id: 'fuk-maau', label: '服務', summary: '把服務對話說得客氣自然。' },
      { id: 'gaau-sau', label: '交收', summary: '把交收和對接說得穩定清楚。' },
    ],
    phases: [
      { label: '訊息', summary: '先打工作訊息的短句。' },
      { label: '會面', summary: '再打見面和約時間的短句。' },
      { label: '跟進', summary: '再打跟進和補充的短句。' },
      { label: '服務', summary: '再打服務場景的短句。' },
      { label: '交收', summary: '再打交收場景的短句。' },
    ],
  },
  {
    id: 'unit-7-c1-c2-nuance',
    label: '高階語感',
    summary: '把語氣、留白同高階語感磨細。',
    clusters: [
      { id: 'jyu-hei-ceng-ci', label: '語氣層次', summary: '把語氣層次練得更細。' },
      { id: 'lau-baai-an-si', label: '留白暗示', summary: '把留白和暗示練得更細。' },
      { id: 'zyun-zek-wui-daap', label: '轉折回應', summary: '把轉折和回應練得更細。' },
      { id: 'mei-tai-hau-kam', label: '媒體口感', summary: '把媒體口感和語域感練得更細。' },
    ],
    phases: [
      { label: '語氣', summary: '先把語氣差異分清。' },
      { label: '留白', summary: '再把留白感分清。' },
      { label: '轉折', summary: '再把轉折感分清。' },
      { label: '媒體', summary: '再把媒體語感分清。' },
      { label: '語感', summary: '最後把整體語感打深。' },
    ],
  },
] as const;

const builtSeedBooks = new Set([
  'unit-1-single-characters-nei-zi-01',
  'unit-2-common-word-pairs-jan-cing-pei-doi-01',
  'unit-3-short-sentence-typing-wai-zing-keoi-01',
]);

function formatOrder(order: number): string {
  return String(order).padStart(2, '0');
}

function createBook(
  stage: VocabCatalogStageBlueprint,
  cluster: VocabCatalogClusterBlueprint,
  phase: VocabCatalogPhaseBlueprint,
  order: number,
  phaseIndex: number,
): VocabCatalogBook {
  const id = `${stage.id}-${cluster.id}-${formatOrder(phaseIndex + 1)}`;
  const title = `${cluster.label} ${formatOrder(phaseIndex + 1)}：${phase.label}`;
  const summary = `${cluster.summary} ${phase.summary}`;

  return {
    id,
    title,
    summary,
    stageLabel: stage.label,
    status: builtSeedBooks.has(id) ? 'built' : 'planned',
    order,
  };
}

let orderCounter = 1;

export const vocabCatalogBooks: VocabCatalogBook[] = stageBlueprints.flatMap((stage) =>
  stage.clusters.flatMap((cluster) =>
    stage.phases.map((phase, phaseIndex) => createBook(stage, cluster, phase, orderCounter++, phaseIndex)),
  ),
);

export const vocabCatalogStages: VocabCatalogStage[] = stageBlueprints.map((stage) => {
  const bookIds = vocabCatalogBooks
    .filter((book) => book.stageLabel === stage.label)
    .map((book) => book.id);

  return {
    id: stage.id,
    label: stage.label,
    summary: stage.summary,
    plannedBookCount: bookIds.length,
    builtBookCount: vocabCatalogBooks.filter((book) => book.stageLabel === stage.label && book.status === 'built').length,
    bookIds,
  };
});

export const vocabCatalogBookById = vocabCatalogBooks.reduce<Record<string, VocabCatalogBook>>((map, book) => {
  map[book.id] = book;
  return map;
}, {});

export const vocabCatalog = {
  totalBookCount: vocabCatalogBooks.length,
  builtBookCount: vocabCatalogBooks.filter((book) => book.status === 'built').length,
  plannedBookCount: vocabCatalogBooks.filter((book) => book.status === 'planned').length,
  stages: vocabCatalogStages,
  books: vocabCatalogBooks,
} as const;
