import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InteractiveJyutping } from '@/components/InteractiveJyutping';
import { getAudioSource, primeSpeechVoices, speakText, stopSpeechPlayback } from '@/features/audio/audio';
import { findAudioAssetByText } from '@/features/learn/data';
import { recordVocabAttempt, useProgressState, useSettingsState } from '@/features/progress';
import { isTypingTarget } from '@/lib/dom';
import { getResumeRoute } from '@/lib/navigationState';
import { useScriptText } from '@/lib/script';
import { chooseNextVocabPrompt, getCardMasteryPercentage, projectVocabCardAfterAttempt, VOCAB_MASTERY_HEARTS } from '@/features/vocab/scheduler';
import { getVocabPrompts, type VocabPrompt } from '@/features/vocab/data';
import { getVocabTierLabel, isPromptInVocabTier } from '@/features/vocab/tiers';

type InputState = 'idle' | 'typing' | 'wrong' | 'correct' | 'revealed';

const SESSION_LENGTH = 10;

function createSessionSalt() {
  return Math.floor(Math.random() * 0x7fffffff);
}

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

export function PracticePage() {
  const navigate = useNavigate();
  const progress = useProgressState();
  const { scriptPreference, playbackSpeed, vocabTierStartRank } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [prompts, setPrompts] = useState<VocabPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [attemptIndex, setAttemptIndex] = useState(0);
  const [value, setValue] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [correctPendingAdvance, setCorrectPendingAdvance] = useState(false);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionSalt, setSessionSalt] = useState(createSessionSalt);

  const tierPrompts = useMemo(
    () => prompts.filter((prompt) => isPromptInVocabTier(prompt, vocabTierStartRank)),
    [prompts, vocabTierStartRank],
  );
  const selection = useMemo(
    () => chooseNextVocabPrompt(tierPrompts, progress.vocab, sessionSalt),
    [progress.vocab, sessionSalt, tierPrompts],
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
  const returnRoute = getResumeRoute();

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

  useEffect(() => {
    if (loading || loadFailed || !currentPrompt || correctPendingAdvance) {
      return;
    }

    inputRef.current?.focus();
  }, [correctPendingAdvance, currentPrompt, loadFailed, loading, revealed, attemptIndex]);

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
  }, [correctPendingAdvance, currentPrompt, revealed, selection.deckIndex, attemptIndex]);

  useEffect(() => {
    if (!currentPrompt || revealed || correctPendingAdvance || inputState !== 'correct') {
      return;
    }

    setCorrectPendingAdvance(true);
    setFlashMessage(getSuccessMessage(currentPrompt));
    playPromptAudio(currentPrompt);
  }, [correctPendingAdvance, currentPrompt, inputState, revealed, streak, attemptIndex]);

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
    if (speakText(spokenText, playbackSpeed, { rateMultiplier: 0.92 })) {
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
      speakText(spokenText, playbackSpeed, { rateMultiplier: 0.92 });
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
    const nextStreak = streak + 1;
    const nextCompleted = attemptIndex + 1;
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

    if (nextCompleted >= SESSION_LENGTH) {
      return text('今節完成 10 題');
    }

    return text('掌握度提升');
  }

  function handleReveal() {
    if (!currentPrompt) {
      return;
    }

    if (revealed || correctPendingAdvance) {
      playPromptAudio(currentPrompt);
      return;
    }

    setRevealed(true);
    setStreak(0);
    playPromptAudio(currentPrompt);
    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  function handleAdvance() {
    if (!currentPrompt || (!revealed && !correctPendingAdvance)) {
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

    const nextAttemptIndex = attemptIndex + 1;
    if (nextAttemptIndex >= SESSION_LENGTH) {
      setSessionComplete(true);
    } else {
      setAttemptIndex(nextAttemptIndex);
    }

    setValue('');
    setRevealed(false);
    setCorrectPendingAdvance(false);
    setFlashMessage(null);

    if (result === 'correct') {
      setStreak((current) => current + 1);
    } else {
      setStreak(0);
    }
  }

  function handleContinueSession() {
    setAttemptIndex(0);
    setValue('');
    setRevealed(false);
    setCorrectPendingAdvance(false);
    setFlashMessage(null);
    setStreak(0);
    setSessionComplete(false);
    setSessionSalt(createSessionSalt());
  }

  if (loading) {
    return (
      <div className="page-stack">
        <section className="practice-page">
          <div className="practice-page__complete">
            <p>{text('載入詞卡。')}</p>
          </div>
        </section>
      </div>
    );
  }

  if (loadFailed) {
    return (
      <div className="page-stack">
        <section className="practice-page">
          <div className="practice-page__complete">
            <p>{text('詞庫未能載入。')}</p>
          </div>
        </section>
      </div>
    );
  }

  if (!currentPrompt) {
    return (
      <div className="page-stack">
        <section className="practice-page">
          <div className="practice-page__complete">
            <h2>{text('呢一輪已經刷完。')}</h2>
            <div className="practice-page__actions">
              <button type="button" className="button button--primary" onClick={() => navigate(returnRoute)}>
                {text('返回課程')}
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="practice-page">
        <div className="practice-page__head">
          <h1>{text('練習')}</h1>
          <p>{text('每節十題，只出雙字詞同短語。')}</p>
        </div>

        {sessionComplete ? (
          <div className="practice-page__complete">
            <h2>{text('做得好，要唔要再做十題？')}</h2>
            <p>{text(`今節完成 ${SESSION_LENGTH} 題。`)}</p>
            <div className="practice-page__actions">
              <button type="button" className="button button--primary" onClick={handleContinueSession}>
                {text('再做十題')}
              </button>
              <button
                type="button"
                className="button button--secondary"
                onClick={() => navigate(returnRoute)}
              >
                {text('返回課程')}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="practice-page__stats" aria-live="polite">
              <span>{text(`連對 ${streak}`)}</span>
              <span>{text(`今節 ${attemptIndex + 1}/${SESSION_LENGTH}`)}</span>
            </div>

            <div className="practice-page__stats" aria-live="polite">
              <span>{text(`詞彙範圍 ${getVocabTierLabel(vocabTierStartRank)}`)}</span>
              <span>{text(`可練 ${tierPrompts.length} 題`)}</span>
            </div>

            <div className="practice-page__card">
              <div className="practice-page__prompt">{text(currentPrompt.text)}</div>
            </div>

            <label className="input-field practice-page__input">
              <span className="muted-text">{text('輸入粵拼')}</span>
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
                aria-label={text('輸入這一題的粵拼')}
                className={inputState === 'wrong' ? 'is-invalid' : inputState === 'correct' ? 'is-valid' : undefined}
              />
            </label>

            {revealed || correctPendingAdvance ? (
              <div className="practice-page__answer" role="status" aria-live="polite">
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

            <div className="practice-page__actions">
              <button type="button" className="button button--secondary" onClick={handleReveal}>
                {revealed || correctPendingAdvance ? text('重播 [?]') : text('睇答案 [?]')}
              </button>
              {revealed || correctPendingAdvance ? (
                <button type="button" className="button button--primary" onClick={handleAdvance}>
                  {text('下一題（回車）')}
                </button>
              ) : null}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
