import type { GlossaryEntry } from '@/content';
import { extractCantoneseSpecificCharacterCanonicals } from './cantoneseSpecificCharacters';

export type CantoneseSentenceSegment = {
  text: string;
  glossary?: GlossaryEntry;
};

export type CantoneseSentenceCard = {
  id: string;
  text: string;
  simplified: string;
  jyutping: string;
  segments: readonly CantoneseSentenceSegment[];
  focusCharacters: readonly string[];
};

export type CantoneseSentenceLesson = {
  id: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  title: string;
  summary: string;
  teacherNote: string;
  cardIds: readonly string[];
};

export type CantoneseSentenceRoadmapStage = {
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  title: string;
  summary: string;
  mandarinAdvantageNote: string;
  lessonIds: readonly string[];
  plannedTopics?: readonly {
    title: string;
    summary: string;
  }[];
};

const glossary = {
  nei1: {
    id: 'cs-g-nei1',
    headword: '呢',
    jyutping: 'ni1',
    mandarinGloss: '口語近指，相當於普通話的「這」。',
    note: '常見於 呢個、呢度、呢啲。',
  },
  go2: {
    id: 'cs-g-go2',
    headword: '嗰',
    jyutping: 'go2',
    mandarinGloss: '口語遠指，相當於普通話的「那」。',
    note: '常見於 嗰個、嗰邊、嗰啲。',
  },
  hai2: {
    id: 'cs-g-hai2',
    headword: '喺',
    jyutping: 'hai2',
    mandarinGloss: '放在名詞前表示位置，相當於普通話的「在」。',
  },
  mou5: {
    id: 'cs-g-mou5',
    headword: '冇',
    jyutping: 'mou5',
    mandarinGloss: '口語否定「沒有」。',
  },
  zo2: {
    id: 'cs-g-zo2',
    headword: '咗',
    jyutping: 'zo2',
    mandarinGloss: '句中常作完成標記，相當於普通話的「了」。',
  },
  dei6: {
    id: 'cs-g-dei6',
    headword: '哋',
    jyutping: 'dei6',
    mandarinGloss: '接在人稱代詞後面，表示複數，相當於普通話的「們」。',
  },
  keoi5: {
    id: 'cs-g-keoi5',
    headword: '佢',
    jyutping: 'keoi5',
    mandarinGloss: '第三人稱代詞，相當於普通話的「他／她／它」。',
  },
  ge3: {
    id: 'cs-g-ge3',
    headword: '嘅',
    jyutping: 'ge3',
    mandarinGloss: '口語常用結構詞，常見於修飾、判斷和名詞化位置。',
    note: '很多時候可對應普通話的「的」。',
  },
  di1: {
    id: 'cs-g-di1',
    headword: '啲',
    jyutping: 'di1',
    mandarinGloss: '口語常用量感詞，可表示「一些／那些東西」。',
  },
  me1: {
    id: 'cs-g-me1',
    headword: '咩',
    jyutping: 'me1',
    mandarinGloss: '句尾或疑問位常見，帶有「什麼／嗎」的口語功能。',
  },
  lai4: {
    id: 'cs-g-lai4',
    headword: '嚟',
    jyutping: 'lai4',
    mandarinGloss: '口語動詞，對應普通話的「來」。',
  },
  wo3: {
    id: 'cs-g-wo3',
    headword: '喎',
    jyutping: 'wo3',
    mandarinGloss: '句尾助詞，帶提醒、發現或輕微提示語氣。',
  },
  hai6mai6: {
    id: 'cs-g-hai6mai6',
    headword: '係咪',
    jyutping: 'hai6 mai6',
    mandarinGloss: '口語問句格式，相當於普通話的「是不是」。',
  },
  hai6: {
    id: 'cs-g-hai6',
    headword: '係',
    jyutping: 'hai6',
    mandarinGloss: '口語裡常作判斷動詞，相當於普通話的「是」。',
  },
  m4: {
    id: 'cs-g-m4',
    headword: '唔',
    jyutping: 'm4',
    mandarinGloss: '口語常用否定詞，相當於普通話的「不」。',
  },
  bei2: {
    id: 'cs-g-bei2',
    headword: '畀',
    jyutping: 'bei2',
    mandarinGloss: '口語動詞，可表示「給」；也常出現在受事或被動結構裡。',
  },
  lo2: {
    id: 'cs-g-lo2',
    headword: '攞',
    jyutping: 'lo2',
    mandarinGloss: '口語動詞，對應普通話的「拿」。',
  },
  tai2: {
    id: 'cs-g-tai2',
    headword: '睇',
    jyutping: 'tai2',
    mandarinGloss: '口語動詞，對應普通話的「看」。',
  },
  wan2: {
    id: 'cs-g-wan2',
    headword: '搵',
    jyutping: 'wan2',
    mandarinGloss: '口語動詞，常表示「找」。',
  },
  haa5: {
    id: 'cs-g-haa5',
    headword: '吓',
    jyutping: 'haa2 / haa5',
    mandarinGloss: '口語裡常接在動詞後，表示動作短一下，相當於普通話的「一下」。',
  },
  laa3: {
    id: 'cs-g-laa3',
    headword: '喇',
    jyutping: 'laa3',
    mandarinGloss: '句尾助詞，常帶提醒、轉折或狀態變化語氣。',
  },
  ngaam1: {
    id: 'cs-g-ngaam1',
    headword: '啱',
    jyutping: 'ngaam1',
    mandarinGloss: '口語常表示「對、合適、剛好」。',
  },
  gam2: {
    id: 'cs-g-gam2',
    headword: '咁',
    jyutping: 'gam2 / gam3',
    mandarinGloss: '口語常表示「這樣、那麼」。',
  },
  je5: {
    id: 'cs-g-je5',
    headword: '嘢',
    jyutping: 'je5',
    mandarinGloss: '口語常指事物，相當於普通話的「東西、事」。',
  },
  mat1: {
    id: 'cs-g-mat1',
    headword: '乜',
    jyutping: 'mat1',
    mandarinGloss: '口語疑問詞，常對應普通話的「什麼」。',
  },
  gaa3: {
    id: 'cs-g-gaa3',
    headword: '㗎',
    jyutping: 'gaa3',
    mandarinGloss: '句尾助詞，常用來補充說明、加強語氣。',
  },
  lo1: {
    id: 'cs-g-lo1',
    headword: '囉',
    jyutping: 'lo1',
    mandarinGloss: '句尾助詞，常帶順勢、理所當然或輕鬆收尾語氣。',
  },
  mai6: {
    id: 'cs-g-mai6',
    headword: '咪',
    jyutping: 'mai5 / mai6',
    mandarinGloss: '口語裡常帶「那就、就」的推進語氣，也可用來提醒。',
  },
  saai3: {
    id: 'cs-g-saai3',
    headword: '晒',
    jyutping: 'saai3',
    mandarinGloss: '口語補語，表示全部完成、全都如此。',
  },
  ze1: {
    id: 'cs-g-ze1',
    headword: '啫',
    jyutping: 'ze1',
    mandarinGloss: '句尾語氣詞，常表示「而已、只是這樣」。',
  },
  bin1: {
    id: 'cs-g-bin1',
    headword: '邊',
    jyutping: 'bin1',
    mandarinGloss: '疑問指向詞，常見於邊個、邊度、嗰邊。',
  },
  juk1: {
    id: 'cs-g-juk1',
    headword: '郁',
    jyutping: 'juk1',
    mandarinGloss: '口語動詞，表示移動、動一下。',
  },
  zap1: {
    id: 'cs-g-zap1',
    headword: '執',
    jyutping: 'zap1',
    mandarinGloss: '口語動詞，可表示收拾、整理、拾起。',
  },
  gan2: {
    id: 'cs-g-gan2',
    headword: '緊',
    jyutping: 'gan2',
    mandarinGloss: '接在動詞後表示動作正在進行，相當於普通話的「在」。',
  },
  zai2: {
    id: 'cs-g-zai2',
    headword: '仔',
    jyutping: 'zai2',
    mandarinGloss: '常接在名詞後，組成口語常用人物或小物稱呼。',
  },
  leng3: {
    id: 'cs-g-leng3',
    headword: '靚',
    jyutping: 'leng3',
    mandarinGloss: '口語形容詞，常表示「漂亮、好看」。',
  },
  lek1: {
    id: 'cs-g-lek1',
    headword: '叻',
    jyutping: 'lek1',
    mandarinGloss: '口語形容詞，表示「能幹、厲害」。',
  },
  nam2: {
    id: 'cs-g-nam2',
    headword: '諗',
    jyutping: 'nam2',
    mandarinGloss: '口語動詞，對應普通話的「想、思考」。',
  },
  maai4daan1: {
    id: 'cs-g-maai4daan1',
    headword: '埋單',
    jyutping: 'maai4 daan1',
    mandarinGloss: '在餐廳結帳時常用，意思是「買單、結帳」。',
  },
  zau2bing1: {
    id: 'cs-g-zau2bing1',
    headword: '走冰',
    jyutping: 'zau2 bing1',
    mandarinGloss: '點飲品時表示「不要冰」。',
  },
  zau2ceng1: {
    id: 'cs-g-zau2ceng1',
    headword: '走青',
    jyutping: 'zau2 ceng1',
    mandarinGloss: '點餐時表示「不要蔥或芫荽那類青配料」。',
  },
  fei1bin1: {
    id: 'cs-g-fei1bin1',
    headword: '飛邊',
    jyutping: 'fei1 bin1',
    mandarinGloss: '點三文治時常用，意思是「去邊、不留吐司邊」。',
  },
  haang4gaai1: {
    id: 'cs-g-haang4gaai1',
    headword: '行街',
    jyutping: 'haang4 gaai1',
    mandarinGloss: '在餐廳行話裡表示「外帶、帶走」。',
  },
  daap3toi2: {
    id: 'cs-g-daap3toi2',
    headword: '搭檯',
    jyutping: 'daap3 toi2',
    mandarinGloss: '在茶餐廳或小店裡與陌生人同桌。',
  },
  gaa1dai2: {
    id: 'cs-g-gaa1dai2',
    headword: '加底',
    jyutping: 'gaa1 dai2',
    mandarinGloss: '加飯或加麵底，表示主食分量加大。',
  },
  sou3gaai1: {
    id: 'cs-g-sou3gaai1',
    headword: '掃街',
    jyutping: 'sou3 gaai1',
    mandarinGloss: '一路行一路吃街頭小食，像是小吃版的「串店」。',
  },
  ceoi1seoi2: {
    id: 'cs-g-ceoi1seoi2',
    headword: '吹水',
    jyutping: 'ceoi1 seoi2',
    mandarinGloss: '輕鬆閒聊、聊天，也可帶一點吹噓意味。',
  },
  sing1le1: {
    id: 'cs-g-sing1le1',
    headword: '升呢',
    jyutping: 'sing1 le1',
    mandarinGloss: '口語常說「升級、進步到另一個層次」。',
  },
  leng3zai2Food: {
    id: 'cs-g-leng3zai2-food',
    headword: '靚仔',
    jyutping: 'leng3 zai2',
    mandarinGloss: '在茶餐廳黑話裡可指一碗白飯。',
    note: '跟平常「帥哥」的意思不同。',
  },
  leng3neoi2Food: {
    id: 'cs-g-leng3neoi2-food',
    headword: '靚女',
    jyutping: 'leng3 neoi2',
    mandarinGloss: '在茶餐廳黑話裡可指一碗粥。',
    note: '跟平常「美女」的意思不同。',
  },
  faan1uk1kei2: {
    id: 'cs-g-faan1uk1kei2',
    headword: '返屋企',
    jyutping: 'faan1 uk1 kei2',
    mandarinGloss: '日常口語常說「回家」。',
  },
  sau1gung1: {
    id: 'cs-g-sau1gung1',
    headword: '收工',
    jyutping: 'sau1 gung1',
    mandarinGloss: '日常口語常說「下班、工作結束」。',
  },
  faan1gung1: {
    id: 'cs-g-faan1gung1',
    headword: '返工',
    jyutping: 'faan1 gung1',
    mandarinGloss: '日常口語常說「上班」。',
  },
  so2si4: {
    id: 'cs-g-so2si4',
    headword: '鎖匙',
    jyutping: 'so2 si4',
    mandarinGloss: '日常口語常說「鑰匙」。',
  },
  ho4baau1: {
    id: 'cs-g-ho4baau1',
    headword: '荷包',
    jyutping: 'ho4 baau1',
    mandarinGloss: '口語常說「錢包」。',
  },
  syut3gwai6: {
    id: 'cs-g-syut3gwai6',
    headword: '雪櫃',
    jyutping: 'syut3 gwai6',
    mandarinGloss: '香港口語常說「冰箱」。',
  },
  lip1: {
    id: 'cs-g-lip1',
    headword: '𨋢',
    jyutping: 'lip1',
    mandarinGloss: '香港口語常說「電梯」。',
    note: '實際來源是英文 lift。',
  },
  gam6: {
    id: 'cs-g-gam6',
    headword: '撳',
    jyutping: 'gam6',
    mandarinGloss: '口語動詞，表示「按、按下」。',
  },
  lok6jyu5: {
    id: 'cs-g-lok6jyu5',
    headword: '落雨',
    jyutping: 'lok6 jyu5',
    mandarinGloss: '口語常說「下雨」。',
  },
  tau2: {
    id: 'cs-g-tau2',
    headword: '唞',
    jyutping: 'tau2',
    mandarinGloss: '口語動詞，表示「休息一下、喘口氣」。',
  },
  ze1Umbrella: {
    id: 'cs-g-ze1-umbrella',
    headword: '遮',
    jyutping: 'ze1',
    mandarinGloss: '口語裡可直接表示「傘」。',
  },
  mou5din6: {
    id: 'cs-g-mou5din6',
    headword: '冇電',
    jyutping: 'mou5 din6',
    mandarinGloss: '口語常說「沒電、沒電量」。',
  },
} as const satisfies Record<string, GlossaryEntry>;

const baseSentenceCards = [
  {
    id: 'cs-001-nei-go',
    text: '呢個位有人坐未？',
    simplified: '呢个位有人坐未？',
    jyutping: 'ni1 go3 wai2 jau5 jan4 co5 mei6',
    segments: [
      { text: '呢', glossary: glossary.nei1 },
      { text: '個位有人坐未？' },
    ],
  },
  {
    id: 'cs-002-hai2',
    text: '我喺門口等你。',
    simplified: '我喺门口等你。',
    jyutping: 'ngo5 hai2 mun4 hau2 dang2 nei5',
    segments: [
      { text: '我' },
      { text: '喺', glossary: glossary.hai2 },
      { text: '門口等你。' },
    ],
  },
  {
    id: 'cs-003-mou5',
    text: '我冇帶鎖匙。',
    simplified: '我冇带锁匙。',
    jyutping: 'ngo5 mou5 daai3 so2 si4',
    segments: [
      { text: '我' },
      { text: '冇', glossary: glossary.mou5 },
      { text: '帶鎖匙。' },
    ],
  },
  {
    id: 'cs-004-zo2',
    text: '你食咗飯未？',
    simplified: '你食咗饭未？',
    jyutping: 'nei5 sik6 zo2 faan6 mei6',
    segments: [
      { text: '你食' },
      { text: '咗', glossary: glossary.zo2 },
      { text: '飯未？' },
    ],
  },
  {
    id: 'cs-005-di1-me1',
    text: '你想飲啲咩？',
    simplified: '你想饮啲咩？',
    jyutping: 'nei5 soeng2 jam2 di1 me1',
    segments: [
      { text: '你想飲' },
      { text: '啲', glossary: glossary.di1 },
      { text: '咩', glossary: glossary.me1 },
      { text: '？' },
    ],
  },
  {
    id: 'cs-006-keoi5-dei6',
    text: '佢哋啱啱返嚟。',
    simplified: '佢哋啱啱返嚟。',
    jyutping: 'keoi5 dei6 ngaam1 ngaam1 faan1 lai4',
    segments: [
      { text: '佢', glossary: glossary.keoi5 },
      { text: '哋', glossary: glossary.dei6 },
      { text: '啱啱返' },
      { text: '嚟', glossary: glossary.lai4 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-007-ge3',
    text: '我想買嗰個黑色嘅。',
    simplified: '我想买嗰个黑色嘅。',
    jyutping: 'ngo5 soeng2 maai5 go2 go3 hak1 sik1 ge3',
    segments: [
      { text: '我想買' },
      { text: '嗰', glossary: glossary.go2 },
      { text: '個黑色' },
      { text: '嘅', glossary: glossary.ge3 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-008-hai6mai6',
    text: '佢係咪仲喺度？',
    simplified: '佢系咪仲喺度？',
    jyutping: 'keoi5 hai6 mai6 zung6 hai2 dou6',
    segments: [
      { text: '佢', glossary: glossary.keoi5 },
      { text: '係咪', glossary: glossary.hai6mai6 },
      { text: '仲' },
      { text: '喺', glossary: glossary.hai2 },
      { text: '度？' },
    ],
  },
  {
    id: 'cs-009-nei-di1',
    text: '呢啲要幾多錢？',
    simplified: '呢啲要几多钱？',
    jyutping: 'ni1 di1 jiu3 gei2 do1 cin2',
    segments: [
      { text: '呢', glossary: glossary.nei1 },
      { text: '啲', glossary: glossary.di1 },
      { text: '要幾多錢？' },
    ],
  },
  {
    id: 'cs-010-wo3',
    text: '你件衫幾靚喎。',
    simplified: '你件衫几靓喎。',
    jyutping: 'nei5 gin6 saam1 gei2 leng3 wo3',
    segments: [
      { text: '你件衫幾靚' },
      { text: '喎', glossary: glossary.wo3 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-011-ngo5-dei6',
    text: '我哋一陣先走。',
    simplified: '我哋一阵先走。',
    jyutping: 'ngo5 dei6 jat1 zan6 sin1 zau2',
    segments: [
      { text: '我' },
      { text: '哋', glossary: glossary.dei6 },
      { text: '一陣先走。' },
    ],
  },
  {
    id: 'cs-012-lei4',
    text: '可唔可以拎過嚟？',
    simplified: '可唔可以拎过嚟？',
    jyutping: 'ho2 m4 ho2 ji5 ling1 gwo3 lai4',
    segments: [
      { text: '可唔可以拎過' },
      { text: '嚟', glossary: glossary.lai4 },
      { text: '？' },
    ],
  },
  {
    id: 'cs-013-bei2-tai2',
    text: '畀我睇吓先。',
    simplified: '畀我睇吓先。',
    jyutping: 'bei2 ngo5 tai2 haa2 sin1',
    segments: [
      { text: '畀', glossary: glossary.bei2 },
      { text: '我' },
      { text: '睇', glossary: glossary.tai2 },
      { text: '吓', glossary: glossary.haa5 },
      { text: '先。' },
    ],
  },
  {
    id: 'cs-014-wan2',
    text: '你幫我搵吓。',
    simplified: '你帮我搵吓。',
    jyutping: 'nei5 bong1 ngo5 wan2 haa2',
    segments: [
      { text: '你幫我' },
      { text: '搵', glossary: glossary.wan2 },
      { text: '吓', glossary: glossary.haa5 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-015-lo2',
    text: '我想攞呢個。',
    simplified: '我想攞呢个。',
    jyutping: 'ngo5 soeng2 lo2 ni1 go3',
    segments: [
      { text: '我想' },
      { text: '攞', glossary: glossary.lo2 },
      { text: '呢', glossary: glossary.nei1 },
      { text: '個。' },
    ],
  },
  {
    id: 'cs-016-mou5-laa3',
    text: '呢度冇位喇。',
    simplified: '呢度冇位喇。',
    jyutping: 'ni1 dou6 mou5 wai2 laa3',
    segments: [
      { text: '呢', glossary: glossary.nei1 },
      { text: '度' },
      { text: '冇', glossary: glossary.mou5 },
      { text: '位' },
      { text: '喇', glossary: glossary.laa3 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-017-ngaam1',
    text: '你啱唔啱時間？',
    simplified: '你啱唔啱时间？',
    jyutping: 'nei5 ngaam1 m4 ngaam1 si4 gaan3',
    segments: [
      { text: '你' },
      { text: '啱', glossary: glossary.ngaam1 },
      { text: '唔', glossary: glossary.m4 },
      { text: '啱', glossary: glossary.ngaam1 },
      { text: '時間？' },
    ],
  },
  {
    id: 'cs-018-lei4',
    text: '可唔可以遲啲嚟？',
    simplified: '可唔可以迟啲嚟？',
    jyutping: 'ho2 m4 ho2 ji5 ci4 di1 lai4',
    segments: [
      { text: '可' },
      { text: '唔', glossary: glossary.m4 },
      { text: '可以遲' },
      { text: '啲', glossary: glossary.di1 },
      { text: '嚟', glossary: glossary.lai4 },
      { text: '？' },
    ],
  },
  {
    id: 'cs-019-bei2-zo2',
    text: '佢畀咗張單我。',
    simplified: '佢畀咗张单我。',
    jyutping: 'keoi5 bei2 zo2 zoeng1 daan1 ngo5',
    segments: [
      { text: '佢', glossary: glossary.keoi5 },
      { text: '畀', glossary: glossary.bei2 },
      { text: '咗', glossary: glossary.zo2 },
      { text: '張單我。' },
    ],
  },
  {
    id: 'cs-020-tai2-haa5',
    text: '你幫我睇吓先。',
    simplified: '你帮我睇吓先。',
    jyutping: 'nei5 bong1 ngo5 tai2 haa2 sin1',
    segments: [
      { text: '你幫我' },
      { text: '睇', glossary: glossary.tai2 },
      { text: '吓', glossary: glossary.haa5 },
      { text: '先。' },
    ],
  },
  {
    id: 'cs-021-mat1-je5',
    text: '你講乜嘢呀？',
    simplified: '你讲乜嘢呀？',
    jyutping: 'nei5 gong2 mat1 je5 aa3',
    segments: [
      { text: '你講' },
      { text: '乜', glossary: glossary.mat1 },
      { text: '嘢', glossary: glossary.je5 },
      { text: '呀？' },
    ],
  },
  {
    id: 'cs-022-je5-wo3',
    text: '呢啲嘢唔平喎。',
    simplified: '呢啲嘢唔平喎。',
    jyutping: 'ni1 di1 je5 m4 peng4 wo3',
    segments: [
      { text: '呢', glossary: glossary.nei1 },
      { text: '啲', glossary: glossary.di1 },
      { text: '嘢', glossary: glossary.je5 },
      { text: '唔', glossary: glossary.m4 },
      { text: '平' },
      { text: '喎', glossary: glossary.wo3 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-023-gam2',
    text: '咁都得？',
    simplified: '咁都得？',
    jyutping: 'gam2 dou1 dak1',
    segments: [
      { text: '咁', glossary: glossary.gam2 },
      { text: '都得？' },
    ],
  },
  {
    id: 'cs-024-gam2-gaa3',
    text: '唔係咁㗎。',
    simplified: '唔係咁㗎。',
    jyutping: 'm4 hai6 gam2 gaa3',
    segments: [
      { text: '唔', glossary: glossary.m4 },
      { text: '係' },
      { text: '咁', glossary: glossary.gam2 },
      { text: '㗎', glossary: glossary.gaa3 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-025-lo1',
    text: '咁我哋走囉。',
    simplified: '咁我哋走囉。',
    jyutping: 'gam2 ngo5 dei6 zau2 lo1',
    segments: [
      { text: '咁', glossary: glossary.gam2 },
      { text: '我' },
      { text: '哋', glossary: glossary.dei6 },
      { text: '走' },
      { text: '囉', glossary: glossary.lo1 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-026-mai6-lo1',
    text: '咁咪得囉。',
    simplified: '咁咪得囉。',
    jyutping: 'gam3 mai5 dak1 lo1',
    segments: [
      { text: '咁', glossary: glossary.gam2 },
      { text: '咪', glossary: glossary.mai6 },
      { text: '得' },
      { text: '囉', glossary: glossary.lo1 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-027-saai3',
    text: '我食晒喇。',
    simplified: '我食晒喇。',
    jyutping: 'ngo5 sik6 saai3 laa3',
    segments: [
      { text: '我食' },
      { text: '晒', glossary: glossary.saai3 },
      { text: '喇', glossary: glossary.laa3 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-028-ze1',
    text: '我想問吓啫。',
    simplified: '我想问吓啫。',
    jyutping: 'ngo5 soeng2 man6 haa2 ze1',
    segments: [
      { text: '我想問' },
      { text: '吓', glossary: glossary.haa5 },
      { text: '啫', glossary: glossary.ze1 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-029-mat1-lei4-gaa3',
    text: '呢個係乜嚟㗎？',
    simplified: '呢個係乜嚟㗎？',
    jyutping: 'ni1 go3 hai6 mat1 lai4 gaa3',
    segments: [
      { text: '呢', glossary: glossary.nei1 },
      { text: '個係' },
      { text: '乜', glossary: glossary.mat1 },
      { text: '嚟', glossary: glossary.lai4 },
      { text: '㗎', glossary: glossary.gaa3 },
      { text: '？' },
    ],
  },
  {
    id: 'cs-030-tai2-lo1',
    text: '你自己睇囉。',
    simplified: '你自己睇囉。',
    jyutping: 'nei5 zi6 gei2 tai2 lo1',
    segments: [
      { text: '你自己' },
      { text: '睇', glossary: glossary.tai2 },
      { text: '囉', glossary: glossary.lo1 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-031-keoi5-dei6-wo3',
    text: '佢哋冇嚟喎。',
    simplified: '佢哋冇嚟喎。',
    jyutping: 'keoi5 dei6 mou5 lai4 wo3',
    segments: [
      { text: '佢', glossary: glossary.keoi5 },
      { text: '哋', glossary: glossary.dei6 },
      { text: '冇', glossary: glossary.mou5 },
      { text: '嚟', glossary: glossary.lai4 },
      { text: '喎', glossary: glossary.wo3 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-032-mat1-gam2',
    text: '乜咁早呀？',
    simplified: '乜咁早呀？',
    jyutping: 'mat1 gam2 zou2 aa3',
    segments: [
      { text: '乜', glossary: glossary.mat1 },
      { text: '咁', glossary: glossary.gam2 },
      { text: '早呀？' },
    ],
  },
  {
    id: 'cs-033-di1',
    text: '可唔可以快啲？',
    simplified: '可唔可以快啲？',
    jyutping: 'ho2 m4 ho2 ji5 faai3 di1',
    segments: [
      { text: '可' },
      { text: '唔', glossary: glossary.m4 },
      { text: '可以快' },
      { text: '啲', glossary: glossary.di1 },
      { text: '？' },
    ],
  },
  {
    id: 'cs-034-bei2-di1',
    text: '你畀啲時間我。',
    simplified: '你畀啲时间我。',
    jyutping: 'nei5 bei2 di1 si4 gaan3 ngo5',
    segments: [
      { text: '你' },
      { text: '畀', glossary: glossary.bei2 },
      { text: '啲', glossary: glossary.di1 },
      { text: '時間我。' },
    ],
  },
  {
    id: 'cs-035-lo2-je5',
    text: '呢啲嘢你攞走。',
    simplified: '呢啲嘢你攞走。',
    jyutping: 'ni1 di1 je5 nei5 lo2 zau2',
    segments: [
      { text: '呢', glossary: glossary.nei1 },
      { text: '啲', glossary: glossary.di1 },
      { text: '嘢', glossary: glossary.je5 },
      { text: '你' },
      { text: '攞', glossary: glossary.lo2 },
      { text: '走。' },
    ],
  },
  {
    id: 'cs-036-hai2-bin1',
    text: '我喺邊度等你？',
    simplified: '我喺边度等你？',
    jyutping: 'ngo5 hai2 bin1 dou6 dang2 nei5',
    segments: [
      { text: '我' },
      { text: '喺', glossary: glossary.hai2 },
      { text: '邊', glossary: glossary.bin1 },
      { text: '度等你？' },
    ],
  },
  {
    id: 'cs-037-go2-bin1',
    text: '洗手間喺嗰邊。',
    simplified: '洗手间喺嗰边。',
    jyutping: 'sai2 sau2 gaan1 hai2 go2 bin1',
    segments: [
      { text: '洗手間' },
      { text: '喺', glossary: glossary.hai2 },
      { text: '嗰', glossary: glossary.go2 },
      { text: '邊', glossary: glossary.bin1 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-038-juk1',
    text: '你隻手唔好郁。',
    simplified: '你只手唔好郁。',
    jyutping: 'nei5 zek3 sau2 m4 hou2 juk1',
    segments: [
      { text: '你隻手' },
      { text: '唔', glossary: glossary.m4 },
      { text: '好' },
      { text: '郁', glossary: glossary.juk1 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-039-mou5-mat1',
    text: '我冇乜時間。',
    simplified: '我冇乜时间。',
    jyutping: 'ngo5 mou5 mat1 si4 gaan3',
    segments: [
      { text: '我' },
      { text: '冇', glossary: glossary.mou5 },
      { text: '乜', glossary: glossary.mat1 },
      { text: '時間。' },
    ],
  },
  {
    id: 'cs-040-zap1',
    text: '我執咗喇。',
    simplified: '我执咗喇。',
    jyutping: 'ngo5 zap1 zo2 laa3',
    segments: [
      { text: '我' },
      { text: '執', glossary: glossary.zap1 },
      { text: '咗', glossary: glossary.zo2 },
      { text: '喇', glossary: glossary.laa3 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-041-je5-hai2',
    text: '呢啲嘢放喺入面。',
    simplified: '呢啲嘢放喺入面。',
    jyutping: 'ni1 di1 je5 fong3 hai2 jap6 min6',
    segments: [
      { text: '呢', glossary: glossary.nei1 },
      { text: '啲', glossary: glossary.di1 },
      { text: '嘢', glossary: glossary.je5 },
      { text: '放' },
      { text: '喺', glossary: glossary.hai2 },
      { text: '入面。' },
    ],
  },
  {
    id: 'cs-042-hai6-ge3',
    text: '嗰個袋係你嘅？',
    simplified: '嗰个袋係你嘅？',
    jyutping: 'go2 go3 doi2 hai6 nei5 ge3',
    segments: [
      { text: '嗰', glossary: glossary.go2 },
      { text: '個袋' },
      { text: '係', glossary: glossary.hai6 },
      { text: '你' },
      { text: '嘅', glossary: glossary.ge3 },
      { text: '？' },
    ],
  },
  {
    id: 'cs-043-mou5-tai2',
    text: '我而家冇時間睇。',
    simplified: '我而家冇时间睇。',
    jyutping: 'ngo5 ji4 gaa1 mou5 si4 gaan3 tai2',
    segments: [
      { text: '我而家' },
      { text: '冇', glossary: glossary.mou5 },
      { text: '時間' },
      { text: '睇', glossary: glossary.tai2 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-044-zai2-leng3',
    text: '呢個女仔好靚。',
    simplified: '呢个女仔好靓。',
    jyutping: 'ni1 go3 neoi5 zai2 hou2 leng3',
    segments: [
      { text: '呢', glossary: glossary.nei1 },
      { text: '個女' },
      { text: '仔', glossary: glossary.zai2 },
      { text: '好' },
      { text: '靚', glossary: glossary.leng3 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-045-zai2-lek1',
    text: '佢個仔好叻。',
    simplified: '佢个仔好叻。',
    jyutping: 'keoi5 go3 zai2 hou2 lek1',
    segments: [
      { text: '佢', glossary: glossary.keoi5 },
      { text: '個' },
      { text: '仔', glossary: glossary.zai2 },
      { text: '好' },
      { text: '叻', glossary: glossary.lek1 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-046-dei6-gan2',
    text: '我哋等緊你。',
    simplified: '我哋等紧你。',
    jyutping: 'ngo5 dei6 dang2 gan2 nei5',
    segments: [
      { text: '我' },
      { text: '哋', glossary: glossary.dei6 },
      { text: '等' },
      { text: '緊', glossary: glossary.gan2 },
      { text: '你。' },
    ],
  },
  {
    id: 'cs-047-bei2-nam2',
    text: '畀我諗吓先。',
    simplified: '畀我谂吓先。',
    jyutping: 'bei2 ngo5 nam2 haa2 sin1',
    segments: [
      { text: '畀', glossary: glossary.bei2 },
      { text: '我' },
      { text: '諗', glossary: glossary.nam2 },
      { text: '吓', glossary: glossary.haa5 },
      { text: '先。' },
    ],
  },
  {
    id: 'cs-048-m4-hai6-ge3',
    text: '呢啲唔係畀你嘅。',
    simplified: '呢啲唔係畀你嘅。',
    jyutping: 'ni1 di1 m4 hai6 bei2 nei5 ge3',
    segments: [
      { text: '呢', glossary: glossary.nei1 },
      { text: '啲', glossary: glossary.di1 },
      { text: '唔', glossary: glossary.m4 },
      { text: '係', glossary: glossary.hai6 },
      { text: '畀', glossary: glossary.bei2 },
      { text: '你' },
      { text: '嘅', glossary: glossary.ge3 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-049-go2-bin1-mou5-wo3',
    text: '嗰邊冇人喎。',
    simplified: '嗰边冇人喎。',
    jyutping: 'go2 bin1 mou5 jan4 wo3',
    segments: [
      { text: '嗰', glossary: glossary.go2 },
      { text: '邊', glossary: glossary.bin1 },
      { text: '冇', glossary: glossary.mou5 },
      { text: '人' },
      { text: '喎', glossary: glossary.wo3 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-050-lo2-zo2-bei2',
    text: '我攞咗畀佢。',
    simplified: '我攞咗畀佢。',
    jyutping: 'ngo5 lo2 zo2 bei2 keoi5',
    segments: [
      { text: '我' },
      { text: '攞', glossary: glossary.lo2 },
      { text: '咗', glossary: glossary.zo2 },
      { text: '畀', glossary: glossary.bei2 },
      { text: '佢', glossary: glossary.keoi5 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-051-bin1-go3',
    text: '你想要邊個？',
    simplified: '你想要边个？',
    jyutping: 'nei5 soeng2 jiu3 bin1 go3',
    segments: [
      { text: '你想要' },
      { text: '邊', glossary: glossary.bin1 },
      { text: '個？' },
    ],
  },
  {
    id: 'cs-052-leng3-wo3',
    text: '你今日幾靚喎。',
    simplified: '你今日几靓喎。',
    jyutping: 'nei5 gam1 jat6 gei2 leng3 wo3',
    segments: [
      { text: '你今日幾' },
      { text: '靚', glossary: glossary.leng3 },
      { text: '喎', glossary: glossary.wo3 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-053-ze1-price',
    text: '呢個要幾多錢啫？',
    simplified: '呢个要几多钱啫？',
    jyutping: 'ni1 go3 jiu3 gei2 do1 cin2 ze1',
    segments: [
      { text: '呢', glossary: glossary.nei1 },
      { text: '個要幾多錢' },
      { text: '啫', glossary: glossary.ze1 },
      { text: '？' },
    ],
  },
  {
    id: 'cs-054-m4-hai2',
    text: '佢唔喺屋企。',
    simplified: '佢唔喺屋企。',
    jyutping: 'keoi5 m4 hai2 uk1 kei2',
    segments: [
      { text: '佢', glossary: glossary.keoi5 },
      { text: '唔', glossary: glossary.m4 },
      { text: '喺', glossary: glossary.hai2 },
      { text: '屋企。' },
    ],
  },
  {
    id: 'cs-055-me1-waa2',
    text: '你講咩話？',
    simplified: '你讲咩话？',
    jyutping: 'nei5 gong2 me1 waa2',
    segments: [
      { text: '你講' },
      { text: '咩', glossary: glossary.me1 },
      { text: '話？' },
    ],
  },
  {
    id: 'cs-056-maai4daan1',
    text: '唔該埋單。',
    simplified: '唔该埋单。',
    jyutping: 'm4 goi1 maai4 daan1',
    segments: [
      { text: '唔該' },
      { text: '埋單', glossary: glossary.maai4daan1 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-057-zau2bing1',
    text: '凍檸茶走冰唔該。',
    simplified: '冻柠茶走冰唔该。',
    jyutping: 'dung3 ning2 caa4 zau2 bing1 m4 goi1',
    segments: [
      { text: '凍檸茶' },
      { text: '走冰', glossary: glossary.zau2bing1 },
      { text: '唔該。' },
    ],
  },
  {
    id: 'cs-058-zau2ceng1',
    text: '米線走青唔該。',
    simplified: '米线走青唔该。',
    jyutping: 'mai5 sin3 zau2 ceng1 m4 goi1',
    segments: [
      { text: '米線' },
      { text: '走青', glossary: glossary.zau2ceng1 },
      { text: '唔該。' },
    ],
  },
  {
    id: 'cs-059-fei1bin1',
    text: '呢份三文治飛邊。',
    simplified: '呢份三文治飞边。',
    jyutping: 'ni1 fan6 saam1 man4 zi6 fei1 bin1',
    segments: [
      { text: '呢', glossary: glossary.nei1 },
      { text: '份三文治' },
      { text: '飛邊', glossary: glossary.fei1bin1 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-060-haang4gaai1',
    text: '牛腩麵行街唔該。',
    simplified: '牛腩面行街唔该。',
    jyutping: 'ngau4 naam5 min6 haang4 gaai1 m4 goi1',
    segments: [
      { text: '牛腩麵' },
      { text: '行街', glossary: glossary.haang4gaai1 },
      { text: '唔該。' },
    ],
  },
  {
    id: 'cs-061-daap3toi2',
    text: '今日要搭檯喇。',
    simplified: '今日要搭台喇。',
    jyutping: 'gam1 jat6 jiu3 daap3 toi2 laa3',
    segments: [
      { text: '今日要' },
      { text: '搭檯', glossary: glossary.daap3toi2 },
      { text: '喇', glossary: glossary.laa3 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-062-gaa1dai2',
    text: '呢碗麵加底唔該。',
    simplified: '呢碗面加底唔该。',
    jyutping: 'ni1 wun2 min6 gaa1 dai2 m4 goi1',
    segments: [
      { text: '呢', glossary: glossary.nei1 },
      { text: '碗麵' },
      { text: '加底', glossary: glossary.gaa1dai2 },
      { text: '唔該。' },
    ],
  },
  {
    id: 'cs-063-sou3gaai1',
    text: '今晚一齊去掃街。',
    simplified: '今晚一齐去扫街。',
    jyutping: 'gam1 maan5 jat1 cai4 heoi3 sou3 gaai1',
    segments: [
      { text: '今晚一齊去' },
      { text: '掃街', glossary: glossary.sou3gaai1 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-064-ceoi1seoi2',
    text: '食完先吹水。',
    simplified: '食完先吹水。',
    jyutping: 'sik6 jyun4 sin1 ceoi1 seoi2',
    segments: [
      { text: '食完先' },
      { text: '吹水', glossary: glossary.ceoi1seoi2 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-065-sing1le1',
    text: '你今次真係升呢喇。',
    simplified: '你今次真系升呢喇。',
    jyutping: 'nei5 gam1 ci3 zan1 hai6 sing1 le1 laa3',
    segments: [
      { text: '你今次真係' },
      { text: '升呢', glossary: glossary.sing1le1 },
      { text: '喇', glossary: glossary.laa3 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-066-leng3zai2-food',
    text: '一碗靚仔唔該。',
    simplified: '一碗靓仔唔该。',
    jyutping: 'jat1 wun2 leng3 zai2 m4 goi1',
    segments: [
      { text: '一碗' },
      { text: '靚仔', glossary: glossary.leng3zai2Food },
      { text: '唔該。' },
    ],
  },
  {
    id: 'cs-067-leng3neoi2-food',
    text: '一碗靚女唔該。',
    simplified: '一碗靓女唔该。',
    jyutping: 'jat1 wun2 leng3 neoi2 m4 goi1',
    segments: [
      { text: '一碗' },
      { text: '靚女', glossary: glossary.leng3neoi2Food },
      { text: '唔該。' },
    ],
  },
  {
    id: 'cs-068-faan1uk1kei2',
    text: '我返屋企先。',
    simplified: '我返屋企先。',
    jyutping: 'ngo5 faan1 uk1 kei2 sin1',
    segments: [
      { text: '我' },
      { text: '返屋企', glossary: glossary.faan1uk1kei2 },
      { text: '先。' },
    ],
  },
  {
    id: 'cs-069-sau1gung1',
    text: '我啱啱收工。',
    simplified: '我啱啱收工。',
    jyutping: 'ngo5 ngaam1 ngaam1 sau1 gung1',
    segments: [
      { text: '我啱啱' },
      { text: '收工', glossary: glossary.sau1gung1 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-070-faan1gung1',
    text: '我朝早要返工。',
    simplified: '我朝早要返工。',
    jyutping: 'ngo5 ziu1 zou2 jiu3 faan1 gung1',
    segments: [
      { text: '我朝早要' },
      { text: '返工', glossary: glossary.faan1gung1 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-071-so2si4',
    text: '把鎖匙喺邊？',
    simplified: '把锁匙喺边？',
    jyutping: 'baa2 so2 si4 hai2 bin1',
    segments: [
      { text: '把' },
      { text: '鎖匙', glossary: glossary.so2si4 },
      { text: '喺' },
      { text: '邊', glossary: glossary.bin1 },
      { text: '？' },
    ],
  },
  {
    id: 'cs-072-ho4baau1',
    text: '我個荷包唔見咗。',
    simplified: '我个荷包唔见咗。',
    jyutping: 'ngo5 go3 ho4 baau1 m4 gin3 zo2',
    segments: [
      { text: '我個' },
      { text: '荷包', glossary: glossary.ho4baau1 },
      { text: '唔見' },
      { text: '咗', glossary: glossary.zo2 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-073-syut3gwai6',
    text: '雪櫃入面有水。',
    simplified: '雪柜入面有水。',
    jyutping: 'syut3 gwai6 jap6 min6 jau5 seoi2',
    segments: [
      { text: '雪櫃', glossary: glossary.syut3gwai6 },
      { text: '入面有水。' },
    ],
  },
  {
    id: 'cs-074-lip1',
    text: '我哋搭𨋢上去。',
    simplified: '我哋搭𨋢上去。',
    jyutping: 'ngo5 dei6 daap3 lip1 soeng5 heoi3',
    segments: [
      { text: '我' },
      { text: '哋' },
      { text: '搭' },
      { text: '𨋢', glossary: glossary.lip1 },
      { text: '上去。' },
    ],
  },
  {
    id: 'cs-075-gam6-lip1',
    text: '你幫我撳𨋢。',
    simplified: '你帮我撳𨋢。',
    jyutping: 'nei5 bong1 ngo5 gam6 lip1',
    segments: [
      { text: '你幫我' },
      { text: '撳', glossary: glossary.gam6 },
      { text: '𨋢', glossary: glossary.lip1 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-076-lok6jyu5',
    text: '出面落雨喇。',
    simplified: '出面落雨喇。',
    jyutping: 'ceot1 min2 lok6 jyu5 laa3',
    segments: [
      { text: '出面' },
      { text: '落雨', glossary: glossary.lok6jyu5 },
      { text: '喇', glossary: glossary.laa3 },
      { text: '。' },
    ],
  },
  {
    id: 'cs-077-tau2',
    text: '我想唞一陣。',
    simplified: '我想唞一阵。',
    jyutping: 'ngo5 soeng2 tau2 jat1 zan6',
    segments: [
      { text: '我想' },
      { text: '唞', glossary: glossary.tau2 },
      { text: '一陣。' },
    ],
  },
  {
    id: 'cs-078-ze1-umbrella',
    text: '你記得帶遮。',
    simplified: '你记得带遮。',
    jyutping: 'nei5 gei3 dak1 daai3 ze1',
    segments: [
      { text: '你記得帶' },
      { text: '遮', glossary: glossary.ze1Umbrella },
      { text: '。' },
    ],
  },
  {
    id: 'cs-079-mou5din6',
    text: '部手機冇電喇。',
    simplified: '部手机冇电喇。',
    jyutping: 'bou6 sau2 gei1 mou5 din6 laa3',
    segments: [
      { text: '部手機' },
      { text: '冇電', glossary: glossary.mou5din6 },
      { text: '喇', glossary: glossary.laa3 },
      { text: '。' },
    ],
  },
] as const satisfies ReadonlyArray<Omit<CantoneseSentenceCard, 'focusCharacters'>>;

export const cantoneseSentenceCards: readonly CantoneseSentenceCard[] = baseSentenceCards.map((card) => ({
  ...card,
  focusCharacters: extractCantoneseSpecificCharacterCanonicals(card.text),
}));

export const CANTONESE_SENTENCE_CARD_COUNT = cantoneseSentenceCards.length;

export const cantoneseSentenceLessons = [
  {
    id: 'cs-lesson-pointing',
    level: 'A1',
    title: '指代同提問',
    summary: '呢、嗰、啲、邊、乜、咩',
    teacherNote: '普通話會直覺說「這、那、哪、什麼」；粵語口語通常要換成另一套字。',
    cardIds: [
      'cs-001-nei-go',
      'cs-005-di1-me1',
      'cs-009-nei-di1',
      'cs-021-mat1-je5',
      'cs-036-hai2-bin1',
      'cs-037-go2-bin1',
      'cs-041-je5-hai2',
      'cs-042-hai6-ge3',
      'cs-049-go2-bin1-mou5-wo3',
      'cs-051-bin1-go3',
      'cs-055-me1-waa2',
    ],
  },
  {
    id: 'cs-lesson-verb-swap',
    level: 'A1',
    title: '動詞要換口',
    summary: '喺、嚟、攞、睇、搵、諗',
    teacherNote: '普通話常說「在、來、拿、看、找、想」；粵語日常更自然的是 喺、嚟、攞、睇、搵、諗。',
    cardIds: [
      'cs-002-hai2',
      'cs-012-lei4',
      'cs-013-bei2-tai2',
      'cs-014-wan2',
      'cs-015-lo2',
      'cs-020-tai2-haa5',
      'cs-043-mou5-tai2',
      'cs-047-bei2-nam2',
      'cs-050-lo2-zo2-bei2',
      'cs-054-m4-hai2',
    ],
  },
  {
    id: 'cs-lesson-grammar-particles',
    level: 'A1',
    title: '否定完成同語氣',
    summary: '冇、咗、嘅、喇、㗎、喎、啫',
    teacherNote: '普通話學習者最容易把句尾語氣和完成標記說成書面語，這一組專門練口語骨架。',
    cardIds: [
      'cs-003-mou5',
      'cs-004-zo2',
      'cs-007-ge3',
      'cs-008-hai6mai6',
      'cs-016-mou5-laa3',
      'cs-018-lei4',
      'cs-019-bei2-zo2',
      'cs-024-gam2-gaa3',
      'cs-027-saai3',
      'cs-029-mat1-lei4-gaa3',
      'cs-031-keoi5-dei6-wo3',
      'cs-048-m4-hai6-ge3',
      'cs-053-ze1-price',
      'cs-065-sing1le1',
    ],
  },
  {
    id: 'cs-lesson-people-talk',
    level: 'A1',
    title: '人稱同評價',
    summary: '佢、哋、係咪、靚、叻',
    teacherNote: '跟普通話說人、誇人、問人時，粵語常會整句一起換口，不只是換一個字。',
    cardIds: [
      'cs-006-keoi5-dei6',
      'cs-010-wo3',
      'cs-011-ngo5-dei6',
      'cs-017-ngaam1',
      'cs-044-zai2-leng3',
      'cs-045-zai2-lek1',
      'cs-046-dei6-gan2',
      'cs-052-leng3-wo3',
    ],
  },
  {
    id: 'cs-lesson-hk-talk',
    level: 'A2',
    title: '香港口頭語',
    summary: '咁、咪、囉、晒、郁、執',
    teacherNote: '這一組不是硬翻普通話，而是先記住香港人口裡真的會怎樣順口說。',
    cardIds: [
      'cs-022-je5-wo3',
      'cs-023-gam2',
      'cs-025-lo1',
      'cs-026-mai6-lo1',
      'cs-028-ze1',
      'cs-030-tai2-lo1',
      'cs-032-mat1-gam2',
      'cs-033-di1',
      'cs-034-bei2-di1',
      'cs-035-lo2-je5',
      'cs-038-juk1',
      'cs-039-mou5-mat1',
      'cs-040-zap1',
      'cs-063-sou3gaai1',
      'cs-064-ceoi1seoi2',
    ],
  },
  {
    id: 'cs-lesson-cha-chaan-teng',
    level: 'A2',
    title: '茶餐廳同落單',
    summary: '埋單、走冰、走青、飛邊、行街、搭檯',
    teacherNote: '普通話照字面很難猜中茶餐廳黑話，這一組先把最實用的香港點餐口語練熟。',
    cardIds: [
      'cs-056-maai4daan1',
      'cs-057-zau2bing1',
      'cs-058-zau2ceng1',
      'cs-059-fei1bin1',
      'cs-060-haang4gaai1',
      'cs-061-daap3toi2',
      'cs-062-gaa1dai2',
      'cs-066-leng3zai2-food',
      'cs-067-leng3neoi2-food',
    ],
  },
  {
    id: 'cs-lesson-daily-swaps',
    level: 'A2',
    title: '生活名詞同動作',
    summary: '返屋企、返工、收工、雪櫃、𨋢、荷包',
    teacherNote: '這一組最像香港老師帶內地新同事熟悉日常口語：概念你都懂，但嘴巴要先換成香港日用詞。',
    cardIds: [
      'cs-068-faan1uk1kei2',
      'cs-069-sau1gung1',
      'cs-070-faan1gung1',
      'cs-071-so2si4',
      'cs-072-ho4baau1',
      'cs-073-syut3gwai6',
      'cs-074-lip1',
      'cs-075-gam6-lip1',
      'cs-076-lok6jyu5',
      'cs-077-tau2',
      'cs-078-ze1-umbrella',
      'cs-079-mou5din6',
    ],
  },
] as const satisfies ReadonlyArray<CantoneseSentenceLesson>;

export const cantoneseSentenceRoadmap = [
  {
    level: 'A1',
    title: '開口骨架',
    summary: '先把最常撞牆的口語骨架換對。',
    mandarinAdvantageNote: '你不需要從零學「意思」，只要先把普通話直譯最容易出錯的高頻口語換過來。',
    lessonIds: [
      'cs-lesson-pointing',
      'cs-lesson-verb-swap',
      'cs-lesson-grammar-particles',
      'cs-lesson-people-talk',
    ],
    plannedTopics: [
      { title: '時間同頻率', summary: '先、啱啱、仲、已經、一陣、成日。' },
    ],
  },
  {
    level: 'A2',
    title: '生活落地',
    summary: '香港日常生活、餐廳、交通同辦公室入口。',
    mandarinAdvantageNote: '到這一層，重點不在懂不懂字面，而在於能不能立刻換成香港人口裡真的會說的詞。',
    lessonIds: [
      'cs-lesson-hk-talk',
      'cs-lesson-cha-chaan-teng',
      'cs-lesson-daily-swaps',
    ],
    plannedTopics: [
      { title: '交通同路線', summary: '搭車、落車、轉車、月台、閘口。' },
      { title: '辦公室口語', summary: '交帶、跟進、執漏、改少少。' },
    ],
  },
  {
    level: 'B1',
    title: '工作同社交',
    summary: '把口語擴展到工作協作、服務場景、關係維護。',
    mandarinAdvantageNote: '你已經能聽懂大意，這一層開始要練的是順口輸出和場景準確度。',
    lessonIds: [],
    plannedTopics: [
      { title: '服務同投訴', summary: '麻煩、唔該晒、搞掂、跟單、催一催。' },
      { title: '同事溝通', summary: '交收、執漏、跟進、補返、對返。' },
      { title: '口語補語', summary: '晒、返、開、翻、埋、起身。' },
    ],
  },
  {
    level: 'B2',
    title: '論點同語氣',
    summary: '處理較長討論、觀點表達、語氣粒度。',
    mandarinAdvantageNote: '你讀得懂大部分內容，真正差距會落在語氣粒子的拿捏和說話態度是否像本地人。',
    lessonIds: [],
    plannedTopics: [
      { title: '語氣粒子連用', summary: '喎、啫、啦、囉、吖、嘛 的語用差異。' },
      { title: '媒體同時事口語', summary: '把書面理解轉成自然口頭反應。' },
      { title: '商務應對', summary: '客氣拒絕、緩衝、轉彎表達。' },
    ],
  },
  {
    level: 'C1',
    title: '高階輸入輸出',
    summary: '能自然處理長篇輸入、抽象觀點、語域切換。',
    mandarinAdvantageNote: '這裡不是多認字，而是把同一套漢字在香港口語、半書面、正式場合之間切換準確。',
    lessonIds: [],
    plannedTopics: [
      { title: '語域轉換', summary: '口語、半書面、正式報告怎樣換句式。' },
      { title: '抽象議題討論', summary: '立場、限制、推論、讓步、補充。' },
      { title: '近義詞辨析', summary: '同字不同口氣、同義不同場景。' },
    ],
  },
  {
    level: 'C2',
    title: '本地級語感',
    summary: '追求極高自然度、細緻語感、文化語用掌握。',
    mandarinAdvantageNote: '你不需要補大量基礎詞彙，真正的 C2 難點是隱含意思、節奏、幽默、言外之意和細微 register。',
    lessonIds: [],
    plannedTopics: [
      { title: '雜誌同專欄語感', summary: '從媒體、專欄、訪談裡吸收本地化表達。' },
      { title: '高階口語修辭', summary: '反問、留白、鋪墊、幽默、婉轉批評。' },
      { title: '成語熟語同流行話法', summary: '不是背字面，而是掌握何時說才自然。' },
    ],
  },
] as const satisfies ReadonlyArray<CantoneseSentenceRoadmapStage>;

const sentenceCardById = new Map<string, CantoneseSentenceCard>(cantoneseSentenceCards.map((card) => [card.id, card]));

const assignedLessonCardIds = new Set<string>(cantoneseSentenceLessons.flatMap((lesson) => [...lesson.cardIds]));
const unassignedSentenceCardIds = cantoneseSentenceCards
  .filter((card) => !assignedLessonCardIds.has(card.id))
  .map((card) => card.id);

if (unassignedSentenceCardIds.length > 0) {
  throw new Error(`Unassigned Cantonese sentence cards: ${unassignedSentenceCardIds.join(', ')}`);
}

export function getCantoneseSentenceLesson(id: string): CantoneseSentenceLesson | undefined {
  return cantoneseSentenceLessons.find((lesson) => lesson.id === id);
}

export function getCantoneseSentenceCardsForLesson(lessonId: string): CantoneseSentenceCard[] {
  const lesson = getCantoneseSentenceLesson(lessonId);
  if (!lesson) {
    return [];
  }

  return lesson.cardIds
    .map((cardId) => sentenceCardById.get(cardId))
    .filter((card): card is CantoneseSentenceCard => Boolean(card));
}

export const CANTONESE_SENTENCE_CHARACTER_COVERAGE = Array.from(
  new Set(cantoneseSentenceCards.flatMap((card) => card.focusCharacters)),
);

export const CANTONESE_SENTENCE_CHARACTER_COVERAGE_COUNT = CANTONESE_SENTENCE_CHARACTER_COVERAGE.length;

export function getCantoneseSentenceCoverageCount(completedSentenceIds: readonly string[]): number {
  const completedSet = new Set(completedSentenceIds);

  return new Set(
    cantoneseSentenceCards
      .filter((card) => completedSet.has(card.id))
      .flatMap((card) => card.focusCharacters),
  ).size;
}
