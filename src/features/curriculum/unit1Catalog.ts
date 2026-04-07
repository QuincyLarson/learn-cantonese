import type { CurriculumBook, CurriculumUnitPlan } from './types';

export interface Unit1Book {
  id: string;
  title: string;
  summary: string;
  stageLabel: string;
  estimatedHours: number;
  status: CurriculumBook['status'];
}

type CrossBookCluster = {
  clusterId: string;
  stageLabel: string;
  titlePrefix: string;
  estimatedHours: number;
  focusItems: readonly {
    title: string;
    summary: string;
  }[];
  drillItems: readonly {
    title: string;
    summary: string;
  }[];
  builtIndexes?: readonly number[];
};

const chineseDigits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'] as const;

function toChineseNumber(value: number): string {
  if (value <= 0) {
    return '零';
  }

  if (value < 10) {
    return chineseDigits[value];
  }

  if (value === 10) {
    return '十';
  }

  if (value < 20) {
    return `十${chineseDigits[value % 10]}`;
  }

  if (value < 100) {
    const tens = Math.floor(value / 10);
    const ones = value % 10;
    return `${chineseDigits[tens]}十${ones === 0 ? '' : chineseDigits[ones]}`;
  }

  if (value === 100) {
    return '一百';
  }

  if (value < 110) {
    return `一百${toChineseNumber(value - 100)}`;
  }

  if (value < 120) {
    return `一百${toChineseNumber(value - 100)}`;
  }

  if (value === 120) {
    return '一百二十';
  }

  return String(value);
}

function buildCrossCluster(cluster: CrossBookCluster): Unit1Book[] {
  const builtIndexes = new Set(cluster.builtIndexes ?? []);
  const books: Unit1Book[] = [];
  let ordinal = 0;

  for (const focus of cluster.focusItems) {
    for (const drill of cluster.drillItems) {
      ordinal += 1;
      books.push({
        id: `${cluster.clusterId}-${String(ordinal).padStart(2, '0')}`,
        title: `${cluster.titlePrefix}${toChineseNumber(ordinal)}：${focus.title}${drill.title}`,
        summary: `${focus.summary}；${drill.summary}`,
        stageLabel: cluster.stageLabel,
        estimatedHours: cluster.estimatedHours,
      status: builtIndexes.has(ordinal) ? 'built' : 'planned',
    });
  }
  }

  return books;
}

const toneCluster = buildCrossCluster({
  clusterId: 'u1-tone',
  stageLabel: '聲調段',
  titlePrefix: '六聲',
  estimatedHours: 0.5,
  builtIndexes: [1],
  focusItems: [
    { title: '總覽', summary: '先把六聲整體輪廓看清楚。' },
    { title: '高平聲', summary: '固定最高最平嘅走勢。' },
    { title: '高升聲', summary: '由高位向上抬起。' },
    { title: '中平聲', summary: '保持中段平直唔飄走。' },
    { title: '低降聲', summary: '先落後再收住。' },
    { title: '低升聲', summary: '由低位慢慢推上去。' },
  ],
  drillItems: [
    { title: '單音對照', summary: '用同一個音節輪流換聲調。' },
    { title: '聲調辨音', summary: '先聽再判斷，唔靠猜。' },
    { title: '聲調打字', summary: '聽到就輸入，立刻穩住聲調數字。' },
    { title: '聲調跟讀', summary: '聽完就讀，跟住聲線走。' },
  ],
});

const initialCluster = buildCrossCluster({
  clusterId: 'u1-initial',
  stageLabel: '聲母段',
  titlePrefix: '聲母',
  estimatedHours: 0.4,
  builtIndexes: [1],
  focusItems: [
    { title: 'n / l', summary: '先保住鼻音同邊音唔混。' },
    { title: 'j / z', summary: '分清舌面音同舌尖音。' },
    { title: 'gw / kw', summary: '口形要保留 w 嘅收口。' },
    { title: 'ng / Ø', summary: '接受零聲母同鼻音起首。' },
    { title: 'b / p', summary: '分清送氣同唔送氣。' },
    { title: 'd / t', summary: '用氣流同閉合感去分。' },
    { title: 'g / k', summary: '先穩住舌根起首。' },
    { title: 'z / c', summary: '一個唔送氣，一個送氣。' },
    { title: 's / sy', summary: '保留舌位差異，唔好一路滑走。' },
    { title: 'f / w', summary: '唇形要分得清。' },
  ],
  drillItems: [
    { title: '聲母辨音', summary: '先聽再揀，專攻起首音。' },
    { title: '聲母打字', summary: '見到字即刻寫出正確粵拼。' },
  ],
});

const finalCluster = buildCrossCluster({
  clusterId: 'u1-final',
  stageLabel: '韻母段',
  titlePrefix: '韻母',
  estimatedHours: 0.4,
  builtIndexes: [1],
  focusItems: [
    { title: 'aa', summary: '把長開口音先拉開。' },
    { title: 'a', summary: '同 aa 分開，唔好吞細。' },
    { title: 'oe', summary: '保住圓唇同中間口形。' },
    { title: 'eoi', summary: '由圓口滑向高前元音。' },
    { title: 'yu', summary: '先圓唇再穩住。' },
    { title: 'ing', summary: '尾音要收得清。' },
    { title: 'ung', summary: '後鼻音收尾要乾淨。' },
    { title: 'ok', summary: '收口後再爆開。' },
    { title: 'aai', summary: '三段口形要順。' },
    { title: 'au', summary: '先開後收，唔好斷。' },
  ],
  drillItems: [
    { title: '韻母辨音', summary: '先分開近似口形。' },
    { title: '韻母打字', summary: '邊聽邊輸入韻母。' },
  ],
});

const minimalPairCluster = buildCrossCluster({
  clusterId: 'u1-pair',
  stageLabel: '最小對比段',
  titlePrefix: '最小對比',
  estimatedHours: 0.375,
  focusItems: [
    { title: 'si1 / si2', summary: '同音節只換聲調。' },
    { title: 'si2 / si5', summary: '升降差異要聽清。' },
    { title: 'si3 / si6', summary: '中平同低平唔好混。' },
    { title: 'ma1 / maa1', summary: '短長口形要分開。' },
    { title: 'zaa1 / caa1', summary: '送氣同唔送氣要拉開。' },
    { title: 'gaa1 / gaa2', summary: '一樣嘅韻母靠聲調區分。' },
    { title: 'gwok3 / gok3', summary: '保留 w 先唔會走樣。' },
    { title: 'ngo5 / o5', summary: '零聲母同鼻音起首要分。' },
  ],
  drillItems: [
    { title: '聽辨', summary: '先聽出差別，再睇字。' },
    { title: '看字辨音', summary: '見字要即刻聯想到正確讀法。' },
  ],
});

const typingLabCluster = buildCrossCluster({
  clusterId: 'u1-typing',
  stageLabel: '打字段',
  titlePrefix: '打字練習',
  estimatedHours: 0.5,
  builtIndexes: [1],
  focusItems: [
    { title: '單字輸入', summary: '一個字一個字咁打穩。' },
    { title: '雙字詞輸入', summary: '兩個字一齊輸入，保持節奏。' },
    { title: '短句輸入', summary: '把短句打完整，唔靠猜。' },
    { title: '聲調補位', summary: '漏咗聲調要即刻補返。' },
    { title: '錯字回修', summary: '打錯之後立即修正。' },
    { title: '連續輸入', summary: '保持速度同準確度同時向前。' },
    { title: '隨機抽卡', summary: '打亂順序，避免背題。' },
    { title: '回鍋輸入', summary: '答錯嘅卡要即刻重做。' },
  ],
  drillItems: [
    { title: '慢速', summary: '先放慢速度，把形寫正。' },
    { title: '正常', summary: '跟平常節奏完成整張卡。' },
  ],
});

const readAloudCluster = buildCrossCluster({
  clusterId: 'u1-read',
  stageLabel: '跟讀段',
  titlePrefix: '跟讀練習',
  estimatedHours: 0.5,
  focusItems: [
    { title: '單字跟讀', summary: '聽完一字即刻跟返。' },
    { title: '雙字詞跟讀', summary: '把兩字詞讀得連貫。' },
    { title: '短句跟讀', summary: '一句一句跟，保持語流。' },
    { title: '句尾語氣', summary: '跟埋助詞一齊讀。' },
    { title: '連讀節奏', summary: '讀到句與句之間唔生硬。' },
    { title: '回音對照', summary: '錄低再同目標音對比。' },
  ],
  drillItems: [
    { title: '慢速', summary: '慢慢讀，對準每個聲調。' },
    { title: '正常', summary: '用正常速度讀完整句。' },
  ],
});

const reviewCluster = buildCrossCluster({
  clusterId: 'u1-review',
  stageLabel: '綜合回鍋段',
  titlePrefix: '綜合回鍋',
  estimatedHours: 0.6667,
  focusItems: [
    { title: '聲調回鍋', summary: '回顧最容易滑走嘅聲調。' },
    { title: '聲母回鍋', summary: '重新校準容易混淆嘅起首音。' },
    { title: '韻母回鍋', summary: '回到最常出錯嘅尾音口形。' },
    { title: '最小對比回鍋', summary: '把近音再比一次。' },
    { title: '打字回鍋', summary: '把輸入速度同準確度一齊拉高。' },
    { title: '跟讀回鍋', summary: '把讀音、節奏同停頓再磨順。' },
  ],
  drillItems: [
    { title: '混合', summary: '混住來做，檢查整體穩定度。' },
    { title: '加速', summary: '逐步加快，逼近自然反應。' },
  ],
});

export const unit1Catalog: readonly Unit1Book[] = [
  ...toneCluster,
  ...initialCluster,
  ...finalCluster,
  ...minimalPairCluster,
  ...typingLabCluster,
  ...readAloudCluster,
  ...reviewCluster,
];

export const unit1CatalogSummary = {
  totalBooks: unit1Catalog.length,
  builtBooks: unit1Catalog.filter((book) => book.status === 'built').length,
  plannedBooks: unit1Catalog.filter((book) => book.status === 'planned').length,
  clusters: [
    { label: '聲調段', total: toneCluster.length },
    { label: '聲母段', total: initialCluster.length },
    { label: '韻母段', total: finalCluster.length },
    { label: '最小對比段', total: minimalPairCluster.length },
    { label: '打字段', total: typingLabCluster.length },
    { label: '跟讀段', total: readAloudCluster.length },
    { label: '綜合回鍋段', total: reviewCluster.length },
  ],
} satisfies {
  totalBooks: number;
  builtBooks: number;
  plannedBooks: number;
  clusters: readonly { label: string; total: number }[];
};

export const unit1Plan: CurriculumUnitPlan = {
  unitId: 'unit1',
  title: '單元 1：粵語發音同粵拼',
  totalPlannedBooks: 120,
  estimatedHoursLabel: '12+ 小時',
  books: unit1Catalog.map(({ id, title, summary, status }) => ({
    id,
    unitId: 'unit1',
    stageId:
      id.startsWith('u1-tone')
        ? 'stage-a'
        : id.startsWith('u1-initial')
          ? 'stage-a'
          : id.startsWith('u1-final')
            ? 'stage-b'
            : id.startsWith('u1-pair')
              ? 'stage-b'
              : id.startsWith('u1-typing')
                ? 'stage-c'
                : id.startsWith('u1-read')
                  ? 'stage-d'
                  : 'stage-e',
    clusterId: id.split('-').slice(0, 2).join('-'),
    title,
    summary,
    status,
  })),
};
