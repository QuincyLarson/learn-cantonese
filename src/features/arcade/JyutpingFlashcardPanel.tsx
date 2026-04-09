import { useEffect, useMemo, useRef, useState } from 'react';
import { InteractiveJyutping } from '@/components/InteractiveJyutping';
import type { ArcadeActivity, CommonCharacterEntry } from '@/content';
import { getCommonCharacterEntries } from '@/features/learn/commonCharacters';
import { recordArcadeSession, useProgressState, useSettingsState } from '@/features/progress';
import { useScriptText } from '@/lib/script';

const FLASHCARD_POOL_LIMIT = 1200;

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function normalizeJyutping(input: string) {
  return input.trim().toLowerCase().replace(/\s+/g, ' ');
}

function isFlashcardCandidate(entry: CommonCharacterEntry) {
  return (
    entry.character.length === 1 &&
    /^[a-z]+[1-6]$/i.test(entry.jyutping) &&
    entry.jyutpingCandidates.length === 1
  );
}

type JyutpingFlashcardPanelProps = {
  activity: ArcadeActivity;
};

export function JyutpingFlashcardPanel({ activity }: JyutpingFlashcardPanelProps) {
  const progress = useProgressState();
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const advanceRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [pool, setPool] = useState<CommonCharacterEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [deck, setDeck] = useState<CommonCharacterEntry[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [revealedAnswer, setRevealedAnswer] = useState<string | null>(null);
  const [advancing, setAdvancing] = useState(false);
  const [finished, setFinished] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestLocalStreak, setBestLocalStreak] = useState(0);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  const deckSize = activity.deckSize ?? 20;
  const stats = progress.arcadeStats.games[activity.id];

  useEffect(() => {
    return () => {
      if (advanceRef.current !== null) {
        window.clearTimeout(advanceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadFailed(false);

    void getCommonCharacterEntries()
      .then((entries) => {
        if (!active) {
          return;
        }

        const nextPool = entries.filter(isFlashcardCandidate).slice(0, FLASHCARD_POOL_LIMIT);
        setPool(nextPool);
        setLoading(false);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setPool([]);
        setLoadFailed(true);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const resetSession = useMemo(() => (
    () => {
      if (advanceRef.current !== null) {
        window.clearTimeout(advanceRef.current);
      }

      const nextDeck = shuffle(pool).slice(0, deckSize);
      setDeck(nextDeck);
      setCardIndex(0);
      setValue('');
      setFeedback(null);
      setRevealedAnswer(null);
      setAdvancing(false);
      setFinished(false);
      setCorrect(0);
      setIncorrect(0);
      setCurrentStreak(0);
      setBestLocalStreak(0);
      setFlashMessage(null);
    }
  ), [deckSize, pool]);

  useEffect(() => {
    if (pool.length > 0) {
      resetSession();
    }
  }, [pool, resetSession]);

  useEffect(() => {
    if (finished || advancing) {
      return;
    }

    inputRef.current?.focus();
  }, [advancing, cardIndex, finished]);

  useEffect(() => {
    if (!finished) {
      return;
    }

    const answered = correct + incorrect;
    const score = answered ? Math.round((correct / answered) * 100) : 0;
    recordArcadeSession({
      gameId: activity.id,
      score,
      correct,
      incorrect,
      streak: bestLocalStreak,
      won: score >= 80,
    });
  }, [activity.id, bestLocalStreak, correct, finished, incorrect]);

  const currentCard = deck[cardIndex];

  const scheduleAdvance = (message: string, delay: number, beforeAdvance?: () => void) => {
    if (!currentCard || advancing) {
      return;
    }

    beforeAdvance?.();
    setAdvancing(true);
    setFlashMessage(message);
    advanceRef.current = window.setTimeout(() => {
      const isLastCard = cardIndex >= deck.length - 1;

      setValue('');
      setFeedback(null);
      setRevealedAnswer(null);
      setAdvancing(false);
      setFlashMessage(null);

      if (isLastCard) {
        setFinished(true);
        return;
      }

      setCardIndex((current) => current + 1);
    }, delay);
  };

  const handleSubmit = () => {
    if (!currentCard || advancing) {
      return;
    }

    if (normalizeJyutping(value) === normalizeJyutping(currentCard.jyutping)) {
      scheduleAdvance('答對', 850, () => {
        setCorrect((current) => current + 1);
        setCurrentStreak((current) => {
          const next = current + 1;
          setBestLocalStreak((best) => Math.max(best, next));
          return next;
        });
      });
      return;
    }

    setFeedback(text('再試一次，記得帶聲調數字。'));
  };

  const handleDontKnow = () => {
    if (!currentCard || advancing) {
      return;
    }

    scheduleAdvance('睇答案', 1200, () => {
      setIncorrect((current) => current + 1);
      setCurrentStreak(0);
      setRevealedAnswer(currentCard.jyutping);
    });
  };

  if (loading) {
    return (
      <section className="arcade-panel">
        <header className="arcade-panel__header arcade-panel__header--stack">
          <div>
            <h1>{text(activity.title)}</h1>
            <p>{text('載入常用字閃卡。')}</p>
          </div>
        </header>
      </section>
    );
  }

  if (loadFailed || !currentCard) {
    return (
      <section className="arcade-panel">
        <header className="arcade-panel__header arcade-panel__header--stack">
          <div>
            <h1>{text(activity.title)}</h1>
            <p>{text('字庫未能載入。')}</p>
          </div>
        </header>
      </section>
    );
  }

  if (finished) {
    const answered = correct + incorrect;
    const score = answered ? Math.round((correct / answered) * 100) : 0;

    return (
      <section className="arcade-panel arcade-panel--result">
        <header className="arcade-panel__header arcade-panel__header--stack">
          <div>
            <h1>{text(activity.title)}</h1>
            <p>{text('一輪完成。')}</p>
          </div>
        </header>

        <div className="arcade-panel__stats arcade-panel__stats--result">
          <span className="progress-pill">{text('答對')} {correct}</span>
          <span className="progress-pill">{text('唔識')} {incorrect}</span>
          <span className="progress-pill">{text('得分')} {score}%</span>
          <span className="progress-pill">{text('本輪最高連勝')} {bestLocalStreak}</span>
          <span className="progress-pill">{text('歷史最高分')} {stats?.bestScore ?? 0}%</span>
        </div>

        <div className="arcade-panel__footer">
          <button type="button" className="button button--primary" onClick={resetSession}>
            {text('再來一輪')}
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="arcade-page">
      {flashMessage ? (
        <div className="floating-signal" role="status" aria-live="polite">
          {text(flashMessage)}
        </div>
      ) : null}

      <section className="arcade-panel">
        <header className="arcade-panel__header">
          <div>
            <h1>{text(activity.title)}</h1>
            <p>{text(activity.summary)}</p>
          </div>

          <div className="arcade-panel__stats">
            <span className="progress-pill">{cardIndex + 1}/{deck.length}</span>
            <span className="progress-pill">{text('連勝')} {currentStreak}</span>
            <span className="progress-pill">{text('唔識')} {incorrect}</span>
          </div>
        </header>

        <div className="flashcard-card">
          <span className="flashcard-card__hint">{text('輸入帶調號的粵拼')}</span>
          <div className="flashcard-card__character" aria-live="polite">
            {text(currentCard.character)}
          </div>

          {revealedAnswer ? (
            <div className="flashcard-card__answer">
              <strong>{text('答案')}</strong>
              <span>
                <InteractiveJyutping jyutping={currentCard.jyutping} speechText={currentCard.character} />
              </span>
            </div>
          ) : null}

          <label className="input-field">
            <span className="muted-text">{text('粵拼')}</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                if (feedback) {
                  setFeedback(null);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={text('例如 nei5')}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              disabled={advancing}
              aria-label={text('輸入粵拼')}
            />
          </label>

          {feedback ? (
            <p className="feedback feedback--error" role="status" aria-live="polite">
              {feedback}
            </p>
          ) : null}

          <div className="flashcard-card__actions">
            <button
              type="button"
              className="button button--primary"
              onClick={handleSubmit}
              disabled={advancing || !normalizeJyutping(value)}
            >
              {text('確定')}
            </button>
            <button type="button" className="button button--secondary" onClick={handleDontKnow} disabled={advancing}>
              {text('唔識')}
            </button>
          </div>
        </div>

        <footer className="arcade-panel__footer">
          <span>{text('答對')} {correct}</span>
          <span>{text('唔識')} {incorrect}</span>
          <span>{text('歷史最高')} {stats?.bestScore ?? 0}%</span>
        </footer>
      </section>
    </div>
  );
}
