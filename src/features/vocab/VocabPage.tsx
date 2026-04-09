import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { InteractiveJyutping } from '@/components/InteractiveJyutping';
import { getAudioSource, primeSpeechVoices, speakText, stopSpeechPlayback } from '@/features/audio/audio';
import { findAudioAssetByText } from '@/features/learn/data';
import { recordVocabAttempt, useProgressState, useSettingsState } from '@/features/progress';
import { isTypingTarget } from '@/lib/dom';
import { useScriptText } from '@/lib/script';
import { getVocabPrompts, type VocabPrompt } from './data';
import { chooseNextVocabPrompt, getCardMasteryPercentage, projectVocabCardAfterAttempt, VOCAB_MASTERY_HEARTS } from './scheduler';

type InputState = 'idle' | 'typing' | 'correct' | 'wrong' | 'revealed';

function classifyJyutpingInput(input: string, answer: string): Exclude<InputState, 'revealed'> {
  const normalizedInput = input.trim().toLowerCase();
  const answerTokens = answer.trim().toLowerCase().split(/\s+/).filter(Boolean);

  if (!normalizedInput) {
    return 'idle';
  }

  let inputIndex = 0;

  for (let tokenIndex = 0; tokenIndex < answerTokens.length; tokenIndex += 1) {
    while (normalizedInput[inputIndex] === ' ') {
      inputIndex += 1;
    }

    const token = answerTokens[tokenIndex];

    for (let charIndex = 0; charIndex < token.length; charIndex += 1) {
      if (inputIndex >= normalizedInput.length) {
        return 'typing';
      }

      const nextCharacter = normalizedInput[inputIndex];
      if (nextCharacter === ' ' || nextCharacter !== token[charIndex]) {
        return 'wrong';
      }

      inputIndex += 1;
    }

    if (inputIndex >= normalizedInput.length) {
      return tokenIndex === answerTokens.length - 1 ? 'correct' : 'typing';
    }
  }

  while (inputIndex < normalizedInput.length) {
    if (normalizedInput[inputIndex] !== ' ') {
      return 'wrong';
    }

    inputIndex += 1;
  }

  return 'correct';
}

export function VocabPage() {
  const progress = useProgressState();
  const { scriptPreference, playbackSpeed } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [prompts, setPrompts] = useState<VocabPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [value, setValue] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [correctPendingAdvance, setCorrectPendingAdvance] = useState(false);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [sessionCompletedCount, setSessionCompletedCount] = useState(0);

  useEffect(() => {
    primeSpeechVoices();

    return () => {
      stopPromptPlayback();
    };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadFailed(false);

    void getVocabPrompts()
      .then((nextPrompts) => {
        if (!active) {
          return;
        }

        setPrompts(nextPrompts);
        setLoading(false);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setPrompts([]);
        setLoadFailed(true);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const selection = useMemo(
    () => chooseNextVocabPrompt(prompts, progress.vocab),
    [progress.vocab, prompts],
  );
  const currentPrompt = selection.prompt;
  const inputState: InputState =
    revealed
      ? 'revealed'
      : currentPrompt
        ? classifyJyutpingInput(value, currentPrompt.jyutping)
        : 'idle';
  const inputPlaceholder = progress.vocab.totalAttempts < 3 ? 'nei5 hou2' : undefined;
  const currentCardProgress = currentPrompt ? progress.vocab.cardStats[currentPrompt.id] : undefined;
  const previewResult = revealed ? 'revealed' : correctPendingAdvance ? 'correct' : null;
  const previewCardProgress =
    currentPrompt && previewResult
      ? projectVocabCardAfterAttempt(currentCardProgress, previewResult, progress.vocab.reviewTurn + 1)
      : currentCardProgress;
  const masteryLevel = previewCardProgress?.masteryLevel ?? 0;
  const masteryPercentage = getCardMasteryPercentage(previewCardProgress);

  function stopPromptPlayback() {
    const currentAudio = audioRef.current;
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      audioRef.current = null;
    }

    stopSpeechPlayback();
  }

  function playPromptAudio(prompt: VocabPrompt) {
    const spokenText = prompt.text.trim() || prompt.focusCharacter.trim();
    if (speakText(spokenText, playbackSpeed)) {
      return;
    }

    const asset =
      findAudioAssetByText(prompt.text) ??
      findAudioAssetByText(prompt.simplified) ??
      findAudioAssetByText(prompt.focusCharacter) ??
      findAudioAssetByText(prompt.focusSimplified);

    if (!asset) {
      return;
    }

    stopPromptPlayback();

    const nextAudio = new Audio(getAudioSource(asset, playbackSpeed));
    nextAudio.preload = 'auto';
    audioRef.current = nextAudio;
    let usedSpeechFallback = false;
    const handleSpeechFallback = () => {
      if (usedSpeechFallback) {
        return;
      }

      usedSpeechFallback = true;
      if (audioRef.current === nextAudio) {
        audioRef.current = null;
      }
      speakText(spokenText, playbackSpeed);
    };

    nextAudio.addEventListener(
      'ended',
      () => {
        if (audioRef.current === nextAudio) {
          audioRef.current = null;
        }
      },
      { once: true },
    );
    nextAudio.addEventListener('error', handleSpeechFallback, { once: true });
    void nextAudio.play().catch(() => {
      handleSpeechFallback();
    });
  }

  function getSuccessMessage(prompt: VocabPrompt) {
    const nextStreak = currentStreak + 1;
    const nextSessionCompleted = sessionCompletedCount + 1;
    const projectedCardProgress = projectVocabCardAfterAttempt(
      progress.vocab.cardStats[prompt.id],
      'correct',
      progress.vocab.reviewTurn + 1,
    );
    const nextMasteryPercentage = getCardMasteryPercentage(projectedCardProgress);

    if (nextMasteryPercentage >= 100) {
      return `「${prompt.text}」100% 掌握`;
    }

    if (nextStreak >= 3) {
      return `連對 ${nextStreak} 題`;
    }

    if (nextMasteryPercentage > 0) {
      return text('掌握度提升');
    }

    return `今輪完成 ${nextSessionCompleted} 題`;
  }

  const handleReveal = () => {
    if (correctPendingAdvance || !currentPrompt) {
      return;
    }

    setCurrentStreak(0);
    setRevealed(true);
    playPromptAudio(currentPrompt);
    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleAdvance = () => {
    if (!currentPrompt) {
      return;
    }

    stopPromptPlayback();
    const result = revealed ? 'revealed' : 'correct';
    recordVocabAttempt({
      cardId: currentPrompt.id,
      characterIds: [currentPrompt.focusCharacterId],
      result,
      selectedDeckIndex: selection.deckIndex,
    });
    setValue('');
    setRevealed(false);
    setCorrectPendingAdvance(false);
    setFlashMessage(null);

    if (result === 'correct') {
      setCurrentStreak((current) => current + 1);
      setSessionCompletedCount((current) => current + 1);
    } else {
      setCurrentStreak(0);
    }
  };

  useEffect(() => {
    if (loading || loadFailed || !currentPrompt || correctPendingAdvance) {
      return;
    }

    inputRef.current?.focus();
  }, [correctPendingAdvance, currentPrompt, loadFailed, loading, revealed]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (isTypingTarget(event.target)) {
        return;
      }

      const questionMarkPressed = event.key === '?' || (event.key === '/' && event.shiftKey);
      if (questionMarkPressed && currentPrompt) {
        event.preventDefault();

        if (revealed || correctPendingAdvance) {
          playPromptAudio(currentPrompt);
          return;
        }

        handleReveal();
        return;
      }

      if (event.key === 'Enter' && (revealed || correctPendingAdvance)) {
        event.preventDefault();
        handleAdvance();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [correctPendingAdvance, currentPrompt, revealed, selection.deckIndex]);

  useEffect(() => {
    if (!currentPrompt || revealed || correctPendingAdvance || inputState !== 'correct') {
      return;
    }

    setCorrectPendingAdvance(true);
    setFlashMessage(getSuccessMessage(currentPrompt));
    playPromptAudio(currentPrompt);
  }, [
    correctPendingAdvance,
    currentPrompt,
    currentStreak,
    inputState,
    revealed,
    sessionCompletedCount,
  ]);

  if (loading) {
    return (
      <div className="page-stack">
        <section className="vocab-stage">
          <div className="vocab-empty">
            <p>{text('載入詞卡。')}</p>
          </div>
        </section>
      </div>
    );
  }

  if (loadFailed) {
    return (
      <div className="page-stack">
        <section className="vocab-stage">
          <div className="vocab-empty">
            <p>{text('詞庫未能載入。')}</p>
          </div>
        </section>
      </div>
    );
  }

  if (!currentPrompt) {
    return (
      <div className="page-stack">
        <section className="vocab-stage">
          <div className="vocab-empty">
            <p>{text('呢一輪已經刷完。')}</p>
            <Link className="button button--primary" to="/settings">
              {text('睇統計')}
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="vocab-stage">
        <div className="vocab-card vocab-card--minimal">
          <div className="vocab-card__phrase" aria-live="polite">
            {text(currentPrompt.text)}
          </div>

          <div className="input-field vocab-card__input">
            <input
              ref={inputRef}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === '?' || (event.key === '/' && event.shiftKey)) {
                  event.preventDefault();
                  if (revealed || correctPendingAdvance) {
                    playPromptAudio(currentPrompt);
                    return;
                  }

                  handleReveal();
                  return;
                }

                if (event.key === 'Enter' && (revealed || correctPendingAdvance)) {
                  event.preventDefault();
                  handleAdvance();
                }
              }}
              placeholder={inputPlaceholder}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              disabled={correctPendingAdvance}
              aria-label={text('輸入整句粵拼')}
              className={inputState === 'wrong' ? 'is-invalid' : inputState === 'correct' ? 'is-valid' : undefined}
            />
          </div>

          {revealed || correctPendingAdvance ? (
            <div className="vocab-answer" role="status" aria-live="polite">
              <strong>{text('讀音')}</strong>
              <span>
                <InteractiveJyutping jyutping={currentPrompt.jyutping} speechText={currentPrompt.text} />
              </span>
            </div>
          ) : null}

          {flashMessage ? (
            <div className="vocab-feedback" role="status" aria-live="polite">
              {text(flashMessage)}
            </div>
          ) : null}

          {previewResult ? (
            <div className="vocab-mastery" aria-label={text(`掌握度 ${masteryPercentage}%`)}>
              <div className="vocab-mastery__label">
                {text('掌握度')}
              </div>
              <div className="vocab-mastery__hearts" aria-hidden="true">
                {Array.from({ length: VOCAB_MASTERY_HEARTS }, (_, index) => (
                  <span
                    key={`${currentPrompt.id}-heart-${index}`}
                    className={index < masteryLevel ? 'vocab-heart is-filled' : 'vocab-heart'}
                  >
                    {index < masteryLevel ? '♥' : '♡'}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="vocab-panel__actions">
            {revealed ? (
              <>
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={() => playPromptAudio(currentPrompt)}
                >
                  {text('重播（?）')}
                </button>
                <button
                  type="button"
                  className="button button--primary"
                  onClick={handleAdvance}
                >
                  {text('下一題（回車）')}
                </button>
              </>
            ) : correctPendingAdvance ? (
              <>
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={() => playPromptAudio(currentPrompt)}
                >
                  {text('重播（?）')}
                </button>
                <button
                  type="button"
                  className="button button--primary"
                  onClick={handleAdvance}
                >
                  {text('下一題（回車）')}
                </button>
              </>
            ) : (
              <button
                type="button"
                className="button button--secondary"
                onClick={handleReveal}
              >
                {text('唔識（?）')}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
