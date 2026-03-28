import { useEffect, useState } from 'react';
import { AudioButton } from '@/features/audio/AudioButton';
import { getArcadeActivities, getAudioAsset } from '@/features/learn/data';
import {
  recordArcadeSession,
  useProgressState,
  useSettingsState,
} from '@/features/progress';
import { useScriptText } from '@/lib/script';

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function ArcadePage() {
  const activity = getArcadeActivities()[0];
  const progress = useProgressState();
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const [roundIndex, setRoundIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [bestLocalStreak, setBestLocalStreak] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setFinished(true);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [finished]);

  useEffect(() => {
    if (!finished || !activity) {
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
  }, [activity, bestLocalStreak, correct, finished, incorrect]);

  const prompt = activity ? activity.warmupPrompts[roundIndex % activity.warmupPrompts.length] : undefined;

  useEffect(() => {
    if (!prompt) {
      setChoices([]);
      return;
    }

    setChoices(shuffle([prompt.correctAnswer, ...prompt.wrongAnswers]));
  }, [prompt, roundIndex]);

  if (!activity || !prompt) {
    return null;
  }

  const answered = selected !== null;
  const stats = progress.arcadeStats.games[activity.id];

  if (finished) {
    const answeredCount = correct + incorrect;
    const score = answeredCount ? Math.round((correct / answeredCount) * 100) : 0;

    return (
      <section className="completion-card">
        <p className="eyebrow">{text('Arcade Result')}</p>
        <h1>{text(activity.title)}</h1>
        <p>
          {text('這次答對')} {correct} / {answeredCount}。
          {text('得分')} {score}%。
        </p>
        <div className="lesson-chip-row">
          <span className="lesson-chip">{text('本次最佳連勝')} {bestLocalStreak}</span>
          <span className="lesson-chip">{text('歷史最高分')} {stats?.bestScore ?? 0}%</span>
        </div>
        <button
          type="button"
          className="button button--primary"
          onClick={() => {
            setRoundIndex(0);
            setSecondsLeft(60);
            setCorrect(0);
            setIncorrect(0);
            setBestLocalStreak(0);
            setCurrentStreak(0);
            setSelected(null);
            setFinished(false);
          }}
        >
          {text('再玩一輪')}
        </button>
      </section>
    );
  }

  return (
    <div className="page-stack">
      <section className="page-intro">
        <p className="eyebrow">{text('Arcade')}</p>
        <h1>{text(activity.title)}</h1>
        <p>{text(activity.summary)}</p>
      </section>

      <section className="arcade-shell">
        <aside className="surface-card arcade-stats">
          <div>
            <span className="eyebrow">{text('剩餘時間')}</span>
            <strong>{secondsLeft}s</strong>
          </div>
          <div>
            <span className="eyebrow">{text('當前連勝')}</span>
            <strong>{currentStreak}</strong>
          </div>
          <div>
            <span className="eyebrow">{text('本次最高連勝')}</span>
            <strong>{bestLocalStreak}</strong>
          </div>
        </aside>

        <section className="step-card arcade-round">
          <header className="step-card__header">
            <p className="eyebrow">{text('Tone Sprint')}</p>
            <h2>{text(prompt.prompt)}</h2>
            <p>{text(activity.sessionGoal)}</p>
          </header>

          <AudioButton asset={getAudioAsset(prompt.audioId)} label={text('播放題目音訊')} />

          <div className="choice-grid">
            {choices.map((choice) => {
              const correctChoice = choice === prompt.correctAnswer;
              const selectedChoice = selected === choice;
              return (
                <button
                  key={choice}
                  type="button"
                  className={
                    selectedChoice
                      ? correctChoice
                        ? 'choice-button is-correct'
                        : 'choice-button is-wrong'
                      : answered && correctChoice
                        ? 'choice-button is-correct'
                        : 'choice-button'
                  }
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
                      return;
                    }

                    setIncorrect((current) => current + 1);
                    setCurrentStreak(0);
                  }}
                >
                  {text(choice)}
                </button>
              );
            })}
          </div>

          {answered ? (
            <footer className="step-card__footer">
              <button
                type="button"
                className="button button--primary"
                onClick={() => {
                  setSelected(null);
                  setRoundIndex((current) => current + 1);
                }}
              >
                {text('下一題')}
              </button>
            </footer>
          ) : null}
        </section>
      </section>
    </div>
  );
}
