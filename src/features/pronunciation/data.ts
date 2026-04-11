export type PronunciationExample = {
  text: string;
  jyutping: string;
  note: string;
};

export type PronunciationLabCard = {
  text: string;
  jyutping: string;
  note: string;
};

export type PronunciationLesson = {
  id: string;
  number: number;
  title: string;
  summary: string;
  teacherNote: string;
  examples: readonly PronunciationExample[];
  labCards: readonly PronunciationLabCard[];
};

export const toneExamples = [
  { tone: 1, jyutping: 'si1', character: '詩', note: '高平' },
  { tone: 2, jyutping: 'si2', character: '史', note: '高升' },
  { tone: 3, jyutping: 'si3', character: '試', note: '中平' },
  { tone: 4, jyutping: 'si4', character: '時', note: '低降' },
  { tone: 5, jyutping: 'si5', character: '市', note: '低升' },
  { tone: 6, jyutping: 'si6', character: '是', note: '低平' },
] as const;

export const initialsDifferentFromPinyin = ['z', 'c', 'j', 'gw', 'kw', 'ng'] as const;
export const finalsDifferentFromPinyin = ['aa', 'oe', 'eoi', 'yu', 'oek', 'oeng'] as const;

export const pronunciationLessons: readonly PronunciationLesson[] = [
  {
    id: 'tone-anchor',
    number: 1,
    title: '六聲定錨',
    summary: '先用同一個音節把六聲聽穩、睇穩、打穩。',
    teacherNote: '普通話使用者最易一開始把聲調當成附屬資訊。呢課要先把聲調變成主角。',
    examples: [
      { text: '詩', jyutping: 'si1', note: '固定最高最平' },
      { text: '史', jyutping: 'si2', note: '由高位升上去' },
      { text: '試', jyutping: 'si3', note: '中間平住唔郁' },
      { text: '時', jyutping: 'si4', note: '由低位再落' },
      { text: '市', jyutping: 'si5', note: '由低位慢慢升' },
      { text: '是', jyutping: 'si6', note: '低位平住' },
    ],
    labCards: [
      { text: '詩', jyutping: 'si1', note: '先固定高平' },
      { text: '史', jyutping: 'si2', note: '只換聲調唔換聲母韻母' },
      { text: '市', jyutping: 'si5', note: '低升最易滑走' },
      { text: '是', jyutping: 'si6', note: '低平唔好讀高' },
    ],
  },
  {
    id: 'n-l',
    number: 2,
    title: 'n 同 l 分開',
    summary: '先守住廣東話最容易被普通話帶歪的鼻音和邊音。',
    teacherNote: '香港人一聽就聽得出你有冇把 n / l 分清。呢課要早啲拉正。',
    examples: [
      { text: '你', jyutping: 'nei5', note: '鼻音起首' },
      { text: '李', jyutping: 'lei5', note: '邊音起首' },
      { text: '男', jyutping: 'naam4', note: 'n 要保留鼻音感' },
      { text: '藍', jyutping: 'laam4', note: 'l 唔好收成 n' },
    ],
    labCards: [
      { text: '你', jyutping: 'nei5', note: '見到高頻字即刻分 n / l' },
      { text: '李', jyutping: 'lei5', note: '只換起首音' },
      { text: '男', jyutping: 'naam4', note: '鼻音起首配 aa 韻母' },
      { text: '藍', jyutping: 'laam4', note: '邊音起首配 aa 韻母' },
    ],
  },
  {
    id: 'z-c-s',
    number: 3,
    title: 'z c s 重新定位',
    summary: '唔好用普通話 zh ch sh 去套，先當係另一套聲母。',
    teacherNote: '好多普通話母語者會自動把 z c s 讀到太捲舌或者太接近普通話。呢課要重置。',
    examples: [
      { text: '早', jyutping: 'zou2', note: 'z 唔送氣' },
      { text: '草', jyutping: 'cou2', note: 'c 要送氣' },
      { text: '掃', jyutping: 'sou3', note: 's 保持平直' },
      { text: '字', jyutping: 'zi6', note: '高頻口語字' },
    ],
    labCards: [
      { text: '早', jyutping: 'zou2', note: '先穩 z' },
      { text: '草', jyutping: 'cou2', note: 'c 要送氣' },
      { text: '掃', jyutping: 'sou3', note: 's 唔好捲舌' },
      { text: '字', jyutping: 'zi6', note: '用高頻字固定 z' },
    ],
  },
  {
    id: 'j',
    number: 4,
    title: 'j 唔係普通話 j',
    summary: '把 j 當成另一個音，先用高頻字固定住。',
    teacherNote: '一見到 j，好多人會自動借普通話習慣。呢課要直接建立新連結。',
    examples: [
      { text: '要', jyutping: 'jiu3', note: '高頻口語字' },
      { text: '有', jyutping: 'jau5', note: '最常用之一' },
      { text: '意', jyutping: 'ji3', note: '同普通話觀感差好遠' },
      { text: '月', jyutping: 'jyut6', note: 'j 加 yu 韻母' },
    ],
    labCards: [
      { text: '要', jyutping: 'jiu3', note: '見字就記 j' },
      { text: '有', jyutping: 'jau5', note: '最應該早記的 j' },
      { text: '意', jyutping: 'ji3', note: '保持短而直' },
      { text: '月', jyutping: 'jyut6', note: 'j 同 yu 一齊練' },
    ],
  },
  {
    id: 'gw-kw',
    number: 5,
    title: 'gw 同 kw 要保留 w',
    summary: '唔好把 gw / kw 收窄成 g / k。',
    teacherNote: '普通話冇完全一樣的對應，最易把個 w 吞走。呢課要先保住口形。',
    examples: [
      { text: '廣', jyutping: 'gwong2', note: '廣東的廣' },
      { text: '國', jyutping: 'gwok3', note: '高頻入聲字' },
      { text: '瓜', jyutping: 'gwaa1', note: '先聽到 w' },
      { text: '跨', jyutping: 'kwaa1', note: 'kw 送氣更清楚' },
    ],
    labCards: [
      { text: '廣', jyutping: 'gwong2', note: '最實用的一組' },
      { text: '國', jyutping: 'gwok3', note: 'w 唔好掉' },
      { text: '瓜', jyutping: 'gwaa1', note: '先保住 gw' },
      { text: '跨', jyutping: 'kwaa1', note: 'kw 要送氣' },
    ],
  },
  {
    id: 'ng-zero',
    number: 6,
    title: 'ng 同零聲母',
    summary: '接受有啲字真係用 ng 起首，有啲字就真係冇聲母。',
    teacherNote: '普通話使用者最常直接把 ng 省掉，或者亂補一個起首音。呢課要拆開。',
    examples: [
      { text: '我', jyutping: 'ngo5', note: 'ng 起首最要練' },
      { text: '牛', jyutping: 'ngau4', note: '保持鼻音起首' },
      { text: '愛', jyutping: 'oi3', note: '呢個係零聲母' },
      { text: '安', jyutping: 'on1', note: '唔好硬塞 ng' },
    ],
    labCards: [
      { text: '我', jyutping: 'ngo5', note: '最高頻 ng 起首' },
      { text: '牛', jyutping: 'ngau4', note: '保住鼻音' },
      { text: '愛', jyutping: 'oi3', note: '直接由韻母開始' },
      { text: '安', jyutping: 'on1', note: '零聲母另一組' },
    ],
  },
  {
    id: 'aa-a',
    number: 7,
    title: 'aa 同 a 分開',
    summary: '長開口同短開口先分穩，之後先唔會字字都一樣。',
    teacherNote: 'Mandarin learner 常常把 aa 壓短，或者把 a 拉長。呢課要靠高頻字先分開口形。',
    examples: [
      { text: '家', jyutping: 'gaa1', note: 'aa 拉開' },
      { text: '假', jyutping: 'gaa2', note: '同一韻母只換聲調' },
      { text: '今', jyutping: 'gam1', note: 'a 要短' },
      { text: '十', jyutping: 'sap6', note: '短 a 加 stop 尾' },
    ],
    labCards: [
      { text: '家', jyutping: 'gaa1', note: 'aa 要夠開' },
      { text: '假', jyutping: 'gaa2', note: '同韻母換聲調' },
      { text: '今', jyutping: 'gam1', note: 'a 唔好拉長' },
      { text: '十', jyutping: 'sap6', note: '短 a 配 p 尾' },
    ],
  },
  {
    id: 'oe-eoi-yu',
    number: 8,
    title: 'oe eoi yu 先練口形',
    summary: '呢幾個韻母同普通話視覺上最似、實際上最易錯。',
    teacherNote: '學呢幾個韻母時，最重要唔係背理論，而係用口形和高頻字固定聽感。',
    examples: [
      { text: '靴', jyutping: 'hoe1', note: '先練 oe' },
      { text: '去', jyutping: 'heoi3', note: '最常用 eoi' },
      { text: '水', jyutping: 'seoi2', note: '另一個高頻 eoi' },
      { text: '書', jyutping: 'syu1', note: 'yu 要圓唇' },
    ],
    labCards: [
      { text: '去', jyutping: 'heoi3', note: 'eoi 高頻必練' },
      { text: '水', jyutping: 'seoi2', note: '另一個 eoi' },
      { text: '書', jyutping: 'syu1', note: 'yu 要穩' },
      { text: '月', jyutping: 'jyut6', note: 'j 加 yu 韻母' },
    ],
  },
  {
    id: 'stop-finals',
    number: 9,
    title: '入聲尾 p t k',
    summary: '句尾要快收、快停，唔好拖成普通話節奏。',
    teacherNote: '入聲唔係再加一個完整母音，而係收得乾淨。呢課先用高頻字記節奏。',
    examples: [
      { text: '十', jyutping: 'sap6', note: 'p 尾' },
      { text: '不', jyutping: 'bat1', note: 't 尾' },
      { text: '國', jyutping: 'gwok3', note: 'k 尾' },
      { text: '熱', jyutping: 'jit6', note: '高頻 t 尾' },
    ],
    labCards: [
      { text: '十', jyutping: 'sap6', note: '先練 p 尾' },
      { text: '不', jyutping: 'bat1', note: '再練 t 尾' },
      { text: '國', jyutping: 'gwok3', note: '保住 gw 同 k 尾' },
      { text: '熱', jyutping: 'jit6', note: '高頻 t 尾字' },
    ],
  },
  {
    id: 'tone-pairs',
    number: 10,
    title: '聲調最小對比',
    summary: '開始把同一個音節的不同聲調直接拉開。',
    teacherNote: '到呢度唔再淨係記單字，而係逼自己見到同一個形都要即刻想到不同聲調。',
    examples: [
      { text: '詩', jyutping: 'si1', note: '高平' },
      { text: '史', jyutping: 'si2', note: '高升' },
      { text: '市', jyutping: 'si5', note: '低升' },
      { text: '是', jyutping: 'si6', note: '低平' },
    ],
    labCards: [
      { text: '詩', jyutping: 'si1', note: '同一音節只換聲調' },
      { text: '史', jyutping: 'si2', note: '只換數字' },
      { text: '市', jyutping: 'si5', note: '對比 si2' },
      { text: '是', jyutping: 'si6', note: '對比 si3 / si5' },
    ],
  },
  {
    id: 'mixed-review',
    number: 11,
    title: '混合打字複習',
    summary: '把前面已學的聲母、韻母、聲調混在一起做。',
    teacherNote: '真正會出錯唔係單獨規則，而係規則一混埋就自動滑返去普通話。呢課開始處理呢個問題。',
    examples: [
      { text: '我', jyutping: 'ngo5', note: 'ng 起首' },
      { text: '廣', jyutping: 'gwong2', note: 'gw 同 oeng' },
      { text: '你', jyutping: 'nei5', note: 'n 起首' },
      { text: '去', jyutping: 'heoi3', note: 'eoi 韻母' },
    ],
    labCards: [
      { text: '我', jyutping: 'ngo5', note: 'ng 起首' },
      { text: '廣', jyutping: 'gwong2', note: 'gw 音節' },
      { text: '你', jyutping: 'nei5', note: 'n / l 要分清' },
      { text: '去', jyutping: 'heoi3', note: 'eoi 韻母' },
    ],
  },
  {
    id: 'sentence-entry',
    number: 12,
    title: '由字過渡到短句',
    summary: '開始準備進入第 2 章，把發音穩定帶到真正句子裡。',
    teacherNote: '呢課唔係教新語法，而係確保一入句子你都仲可以守住粵拼、守住聲調。',
    examples: [
      { text: '你好', jyutping: 'nei5 hou2', note: '最基本雙字詞' },
      { text: '我喺度', jyutping: 'ngo5 hai2 dou6', note: '句子節奏開始出現' },
      { text: '佢去咗', jyutping: 'keoi5 heoi3 zo2', note: '高頻口語句' },
      { text: '而家返工', jyutping: 'ji4 gaa1 faan1 gung1', note: '常見生活短句' },
    ],
    labCards: [
      { text: '你好', jyutping: 'nei5 hou2', note: '雙字詞要連住打' },
      { text: '我喺度', jyutping: 'ngo5 hai2 dou6', note: '高頻短句' },
      { text: '佢去咗', jyutping: 'keoi5 heoi3 zo2', note: '句內保持聲調' },
      { text: '而家返工', jyutping: 'ji4 gaa1 faan1 gung1', note: '準備進入第 2 章' },
    ],
  },
] as const;

export function getPronunciationLessonById(lessonId: string): PronunciationLesson | undefined {
  return pronunciationLessons.find((lesson) => lesson.id === lessonId);
}

export function getPronunciationLessonProgressId(lessonId: string): string {
  return `pronunciation:${lessonId}`;
}
