import { useEffect, useRef, useState } from 'react';
import type { ArcadeActivity } from '@/content';
import { AudioButton } from '@/features/audio/AudioButton';
import { getAudioAsset } from '@/features/learn/data';
import { recordArcadeSession, useProgressState, useSettingsState } from '@/features/progress';
import { useScriptText } from '@/lib/script';

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

type ToneSprintPanelProps = {
  activity: ArcadeActivity;
};

export function ToneSprintPanel({ activity }: ToneSprintPanelProps) {
  const progress = useProgressState();
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const timerRef = useRef<number | null>(null);
  const roundAdvanceRef = useRef<number | null>(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [bestLocalStreak, setBestLocalStreak] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
      if (roundAdvanceRef.current !== null) {
        window.clearTimeout(roundAdvanceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setRoundIndex(0);
    setSecondsLeft(60);
    setCorrect(0);
    setIncorrect(0);
    setBestLocalStreak(0);
    setCurrentStreak(0);
    setSelected(null);
    setChoices([]);
    setFinished(false);
    setFlashMessage(null);
  }, [activity.id]);

  useEffect(() => {
    if (finished) {
      return;
    }

    timerRef.current = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          if (timerRef.current !== null) {
            window.clearInterval(timerRef.current);
          }
          if (roundAdvanceRef.current !== null) {
            window.clearTimeout(roundAdvanceRef.current);
          }
          setFinished(true);
          setFlashMessage(null);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [finished]);

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

  const prompt = activity.warmupPrompts[roundIndex % activity.warmupPrompts.length];

  useEffect(() => {
    if (!prompt) {
      setChoices([]);
      return;
    }

    setChoices(shuffle([prompt.correctAnswer, ...prompt.wrongAnswers]));
  }, [prompt, roundIndex]);

  const answered = selected !== null;
  const stats = progress.arcadeStats.games[activity.id];

  const resetSession = () => {
    if (roundAdvanceRef.current !== null) {
      window.clearTimeout(roundAdvanceRef.current);
    }
    setRoundIndex(0);
    setSecondsLeft(60);
    setCorrect(0);
    setIncorrect(0);
    setBestLocalStreak(0);
    setCurrentStreak(0);
    setSelected(null);
    setFlashMessage(null);
    setFinished(false);
  };

  if (!prompt) {
    return null;
  }

  if (finished) {
    const answeredCount = correct + incorrect;
    const score = answeredCount ? Math.round((correct / answeredCount) * 100) : 0;

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
          <span className="progress-pill">{text('答錯')} {incorrect}</span>
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
            <span className="progress-pill">{secondsLeft} {text('秒')}</span>
            <span className="progress-pill">{text('連勝')} {currentStreak}</span>
            <span className="progress-pill">{text('最高')} {bestLocalStreak}</span>
          </div>
        </header>

        <div className="arcade-panel__body">
          <div className="arcade-panel__prompt">
            <AudioButton asset={getAudioAsset(prompt.audioId)} label={text('播放')} compact />
            <strong>{text(prompt.prompt)}</strong>
          </div>

          <div className="choice-grid choice-grid--compact">
            {choices.map((choice) => {
              const correctChoice = choice === prompt.correctAnswer;
              const selectedChoice = selected === choice;
              const className =
                selectedChoice
                  ? correctChoice
                    ? 'choice-button is-correct'
                    : 'choice-button is-wrong'
                  : answered && correctChoice
                    ? 'choice-button is-correct'
                    : 'choice-button';

              return (
                <button
                  key={choice}
                  type="button"
                  className={className}
                  onClick={() => {
                    if (answered) {
                      return;
                    }

                    setSelected(choice);

                    if (correctChoice) {
                      setCorrect((current) => current + 1);
                      setCurrentStreak((current) => {
                        const next = current + 1;
                        setBestLocalStreak((best) => Math.max(best, next));
                        return next;
                      });
                      setFlashMessage('答對');
                    } else {
                      setIncorrect((current) => current + 1);
                      setCurrentStreak(0);
                      setFlashMessage('再試下一題');
                    }

                    roundAdvanceRef.current = window.setTimeout(() => {
                      setSelected(null);
                      setFlashMessage(null);
                      setRoundIndex((current) => current + 1);
                    }, 650);
                  }}
                >
                  {text(choice)}
                </button>
              );
            })}
          </div>
        </div>

        <footer className="arcade-panel__footer">
          <span>{text('答對')} {correct}</span>
          <span>{text('答錯')} {incorrect}</span>
          <span>{text('歷史最高')} {stats?.bestScore ?? 0}%</span>
        </footer>
      </section>
    </div>
  );
}
