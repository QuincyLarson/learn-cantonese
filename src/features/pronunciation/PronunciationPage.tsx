import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { InteractiveJyutping, JyutpingAwareText } from '@/components/InteractiveJyutping';
import { primeSpeechVoices, speakText, stopSpeechPlayback } from '@/features/audio/audio';
import { useSettingsState } from '@/features/progress';
import { useScriptText } from '@/lib/script';
import { ToneContourSvg } from './ToneContourSvg';

const toneExamples = [
  { tone: 1, jyutping: 'si1', character: '詩', note: '高平' },
  { tone: 2, jyutping: 'si2', character: '史', note: '高升' },
  { tone: 3, jyutping: 'si3', character: '試', note: '中平' },
  { tone: 4, jyutping: 'si4', character: '時', note: '低降' },
  { tone: 5, jyutping: 'si5', character: '市', note: '低升' },
  { tone: 6, jyutping: 'si6', character: '是', note: '低平' },
] as const;

const initialsDifferentFromPinyin = ['z', 'c', 'j', 'gw', 'kw', 'ng'] as const;
const finalsDifferentFromPinyin = ['aa', 'oe', 'eoi', 'yu', 'oek', 'oeng'] as const;

export function PronunciationPage() {
  const { scriptPreference, playbackSpeed } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const [activeTone, setActiveTone] = useState<number>(1);

  useEffect(() => {
    primeSpeechVoices();

    return () => {
      stopSpeechPlayback();
    };
  }, []);

  const activeExample = useMemo(
    () => toneExamples.find((example) => example.tone === activeTone) ?? toneExamples[0],
    [activeTone],
  );

  function handleTonePreview(tone: number) {
    const example = toneExamples.find((item) => item.tone === tone) ?? toneExamples[0];
    setActiveTone(example.tone);
    speakText(example.character, playbackSpeed);
  }

  return (
    <div className="chapter-page">
      <section className="chapter-page__section chapter-page__section--lead">
        <h1>{text('第 1 章 粵拼同發音')}</h1>
        <p>
          {text(
            '呢一章唔講背句子，先只做一件事：用粵拼把廣東話嘅聲母、韻母同聲調釘穩。你已經識漢字，所以我哋直接由聲音系統入手，唔畀你靠其他拼音系統兜路。',
          )}
        </p>
      </section>

      <section className="chapter-page__section">
        <h2>{text('先固定一個聲母同一個韻母，淨學六聲')}</h2>
        <p>
          <JyutpingAwareText
            text={text(
              '先用 s + i 呢一組，連續聽、睇、讀 si1 到 si6。聲調一開始分得清，之後記字音先唔會一齊歪。按下面任何一個例字，就會播音，同時圖上會亮返嗰條聲調線。',
            )}
            resolveSpeechText={(jyutping) => toneExamples.find((example) => example.jyutping === jyutping)?.character}
          />
        </p>

        <div className="tone-trainer">
          <ToneContourSvg activeTone={activeTone} />
          <div className="tone-trainer__controls" role="group" aria-label={text('六聲例字')}>
            {toneExamples.map((example) => (
              <button
                key={example.tone}
                type="button"
                className={example.tone === activeTone ? 'tone-button is-active' : 'tone-button'}
                onClick={() => handleTonePreview(example.tone)}
              >
                <span className="tone-button__character">{text(example.character)}</span>
                <span className="tone-button__jyutping">{example.jyutping}</span>
                <span className="tone-button__note">{text(example.note)}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="chapter-page__note">
          {text('而家揀緊 ')}
          <InteractiveJyutping jyutping={activeExample.jyutping} speechText={activeExample.character} />
          {text(`：${activeExample.character}。先固定一組音，再把六個聲調聽清楚。`)}
        </p>
      </section>

      <section className="chapter-page__section">
        <h2>{text('只處理同普通話拼音唔一樣嘅位')}</h2>
        <p>
          {text(
            '其餘同普通話接近嘅聲母同韻母先唔浪費時間拆開講。呢一章只搶最易把普通話讀法帶入粵語嗰幾組，先建立正確框架，之後再擴到所有常用字。',
          )}
        </p>

        <div className="pronunciation-difference">
          <div>
            <h3>{text('先學呢幾個聲母')}</h3>
            <p className="pronunciation-chip-row">
              {initialsDifferentFromPinyin.map((initial) => (
                <span key={initial} className="jp-chip">
                  {initial}
                </span>
              ))}
            </p>
          </div>

          <div>
            <h3>{text('先學呢幾個韻母')}</h3>
            <p className="pronunciation-chip-row">
              {finalsDifferentFromPinyin.map((final) => (
                <span key={final} className="jp-chip">
                  {final}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      <section className="chapter-page__section">
        <h2>{text('每學完一組，就做發音 lab')}</h2>
        <p>
          {text(
            '完成每一組聲母、韻母或者聲調之後，馬上做兩種 lab。第一種係見字打粵拼，證明你真係記得到音點寫；第二種係跟住讀出聲，再聽返自己同標準音對比，盡早修正聲母、韻母同聲調。',
          )}
        </p>
        <p>
          {text(
            '自動評估廣東話發音嘅技術係有，但喺純靜態網站上未夠穩陣，尤其係要可靠分清聲母、韻母同聲調。現階段會以錄音、重播、自評為主，將來再加可選嘅網上評分，而且唔會拎嚟卡課程進度。',
          )}
        </p>

        <div className="chapter-page__actions">
          <Link className="button button--primary" to="/vocab">
            {text('去做粵拼打字 lab')}
          </Link>
          <Link className="button button--secondary" to="/cantonese-sentences">
            {text('睇第 2 章')}
          </Link>
        </div>
      </section>
    </div>
  );
}
