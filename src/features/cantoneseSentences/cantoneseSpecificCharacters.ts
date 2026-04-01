export type CantoneseSpecificCharacterEntry = {
  id: string;
  canonical: string;
  variants: readonly string[];
  forms: readonly string[];
};

const HAN_TOKEN_PATTERN = /^[\p{Script=Han}々〆〇𠀀-𪛟]+$/u;

const rawCantoneseSpecificCharacterSeed = `
囈
翳
揞
奀
䟴
哽
罯
噏
悒
扤
掗
漚
吖
嗌
呃
鈪
啱
晏
鴨
餲
摳
拗
詏
屙
愛
壅
擁
蕹
閉
崩
凭
𢳂/𢴩
巴
湴
𠾴
爆
睥
柄
癟
肶
畀/俾
俾
潷
邊
邊
咇
飆/飇
標
菠
菠
噃
㩧
煲
簿
菢
伏
𩗴
砌
侵
譖
尋
襯
葺
柒/𨳍
抽
搽
扠
搓
拆
篸
巉
㔆
鏟/剷
罉
掁
擦
耖/摷
觘
巢
唓
車
扯
赤
春
嗤
黐
糍
撍
掅
埕
情
切
超
啋
灼
噱
暢
擢/戳/chok
寸/串
抵
第
抌
揼
沊
髧
揼
躉
墩
扽
墩
撜
戥
戥
溚
耷
揼
腯
咄
兜
兜
兜
竇
鬥
哣
竇
大
覘
擔
啖
嗒
鎝
沓
笪
撻
躂
嗲
嗲
地
哋
趯
掟
埞
堆
隊
對
啲
扚
的
點
掂
𠶧/掂
䠄
椗
定
屌
吊
剁
啄
篤
篤
厾
戙
嘟
嘟
瞓
忽
拂/發
番
忽/fake
揈/𢫕
拂
弗
戽
雞
雞
偈
髻
噉
咁
黚
撳
緊
梗
哽
佮
𥄫
蛤
㓤
趷
𨳊/鳩
嚿
家
㗎/咖
㗎/咖
㗎/咖
鎅/𠝹
梘
曱
鉸
嘅
擏
喼
喼
撟
哥
嗰
掆
弶
啹
蠱
攰
焗
攻
捐
闕
鬼
簋
桂
𥕏
滾
掘
啩
膼
摑
躀
刮
閪
喺
係
扻
冚
恨
亨
鏗
拫
恰
瞌
乞
睺/吼
蝦
蝦
吓
吓
揩
嚡
喊
慳
呷
姣
迆/迤/hea
餼
墟
芡
獻
㷫
捺
䁋
怯
呵
響
烘
降
曳
休
幼
廿
吔
踹
擪
嘢
膶
膉
奄/閹
掩
烟
躽
衒
掖
醃
鷂
郁/喐
蓉
瘀
冤
确
襟
襟
冚
扻
妗
骾
扱
溝
媾
卡
騎
企
企
佢
㨴
瓊
擎
巧
翹
繑
搉
蔃
昆
緄
纊
壞
捩
𡅏
嚟
厲
犖
簕
冧
冧
冧
撚/𨶙
掕
笠
甩
褸
嘍
罅
喇
哪
孻
瀨
賴
攋
瀨
瀨
勒
嘞
攬
檻
躝
唥
擸
䁽
邋
迾
撈
呢
脷
叻
舐/lem
𡃁
靚
擂
噒
論
鍊
拎
𨋢
纈
撩
鷯
撩
撩
囉
攞
咯
囉
𦧲
掠
落
狼
狼
晾
撈
佬
噜
轆
睩
碌
淥
窿
攣
捋
唔
咪
咪
咪
嘜
嘜
癦
文
炆/燜
抆
問
問
䁅
掹
掹
掹
𢛴
盟
乜
踎
孖
嫲
馬
埋
擘/掰
摱
摱
彎
蜢
貓
茅
咩
孭
渳
屘
溦
眯
未
搣
嚤
冇
梅
懵
矇
冧
諗
腍
淰
稔
冧
撚
納
納
嬲
膩
乸
嗱
揇
腩
赧
匿
搦/扐
棯
撚
挼
浪
燶
吟
扲
韌
岌
吽
掗
顏
餲
壓
兀
𩓥
戇
批
匹
抨/烹
烹
坺
炮
披
紕
擗
凭
樖
抱
蒲
噬
糝
擤
挲
嘥
晒
閂
散
潺
孱
渻
霎
烚/熠
潲/餿
睄
錫
聲
筍
筍
恤
屍
絲
豉
蝕
跣
騸
星
攝
嗍
喪
瀡
餸
處
損
𠽌
睇
𠱁
氹
氹
褪
騰
唞
呔
軚
燂
歎
錔
撻
靸
撻
撻
遢
頹
趯/tick
聽
砣/鉈
馱
劏
趟
溫
搵
韞/榲
屈
煀
核
搲
橫
搲
滒
喎
喎
喎
鑊
煨
仔
掣
制
枕
浸
執
質
質
騭
窒
揸
揸
渣
咋
鮓/蚱
拃
磧
責
䁪
盞
趲
踭
鬇
掙
掙
鈒
甴
棹
罩
啫
精
正
淨
樽
捽
卒
螆
癪
尖
摺
瀄
擳
照
𡁻
摷/趙
咗
裝
盅
舂
重
啜
`.trim();

function toId(canonical: string): string {
  const codepoints = Array.from(canonical)
    .map((character) => character.codePointAt(0)?.toString(16))
    .filter((value): value is string => Boolean(value))
    .join('-');

  return `cs-char-${codepoints}`;
}

function normalizeSeedEntries(seed: string): CantoneseSpecificCharacterEntry[] {
  const entries: CantoneseSpecificCharacterEntry[] = [];
  const formToEntryIndex = new Map<string, number>();

  for (const rawLine of seed.split('\n')) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    const forms = Array.from(
      new Set(
        line
          .split('/')
          .map((token) => token.trim())
          .filter((token) => HAN_TOKEN_PATTERN.test(token)),
      ),
    );

    if (forms.length === 0) {
      continue;
    }

    const matchedIndexes = Array.from(
      new Set(
        forms
          .map((form) => formToEntryIndex.get(form))
          .filter((value): value is number => value !== undefined),
      ),
    ).sort((left, right) => left - right);

    if (matchedIndexes.length === 0) {
      const canonical = forms[0];
      const entryIndex = entries.length;
      const entry: CantoneseSpecificCharacterEntry = {
        id: toId(canonical),
        canonical,
        variants: forms.slice(1),
        forms,
      };

      entries.push(entry);
      for (const form of forms) {
        formToEntryIndex.set(form, entryIndex);
      }
      continue;
    }

    const primaryIndex = matchedIndexes[0];
    const primaryEntry = entries[primaryIndex];
    const mergedForms = new Set(primaryEntry.forms);

    for (const form of forms) {
      mergedForms.add(form);
    }

    for (let offset = matchedIndexes.length - 1; offset >= 1; offset -= 1) {
      const mergedIndex = matchedIndexes[offset];
      const mergedEntry = entries[mergedIndex];
      for (const form of mergedEntry.forms) {
        mergedForms.add(form);
      }

      entries.splice(mergedIndex, 1);

      for (const [form, entryIndex] of formToEntryIndex.entries()) {
        if (entryIndex === mergedIndex) {
          formToEntryIndex.set(form, primaryIndex);
        } else if (entryIndex > mergedIndex) {
          formToEntryIndex.set(form, entryIndex - 1);
        }
      }
    }

    const orderedForms = [primaryEntry.canonical, ...Array.from(mergedForms).filter((form) => form !== primaryEntry.canonical)];
    const normalizedEntry: CantoneseSpecificCharacterEntry = {
      ...primaryEntry,
      variants: orderedForms.slice(1),
      forms: orderedForms,
    };

    entries[primaryIndex] = normalizedEntry;
    for (const form of orderedForms) {
      formToEntryIndex.set(form, primaryIndex);
    }
  }

  return entries;
}

export const cantoneseSpecificCharacterEntries = Object.freeze(
  normalizeSeedEntries(rawCantoneseSpecificCharacterSeed),
);

export const CANTONESE_SPECIFIC_CHARACTER_COUNT = cantoneseSpecificCharacterEntries.length;

export const CANTONESE_SPECIFIC_CHARACTER_FORM_COUNT = new Set(
  cantoneseSpecificCharacterEntries.flatMap((entry) => entry.forms),
).size;

const formLookup = cantoneseSpecificCharacterEntries.reduce<Record<string, CantoneseSpecificCharacterEntry>>(
  (result, entry) => {
    for (const form of entry.forms) {
      result[form] = entry;
    }

    return result;
  },
  {},
);

export function getCantoneseSpecificCharacterEntry(form: string): CantoneseSpecificCharacterEntry | undefined {
  return formLookup[form];
}

export function extractCantoneseSpecificCharacterCanonicals(text: string): string[] {
  const matches = new Set<string>();

  for (const character of Array.from(text)) {
    const entry = getCantoneseSpecificCharacterEntry(character);
    if (entry) {
      matches.add(entry.canonical);
    }
  }

  return Array.from(matches);
}
