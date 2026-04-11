import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { InteractiveJyutping } from '@/components/InteractiveJyutping';
import { getAudioSource, primeSpeechVoices, speakText, stopSpeechPlayback } from '@/features/audio/audio';
import { GlossaryPopover } from '@/features/glossary/GlossaryPopover';
import { findAudioAssetByText } from '@/features/learn/data';
import { recordCantoneseSentenceCompletion, resetCantoneseSentenceLesson, useProgressState, useSettingsState } from '@/features/progress';
import { isTypingTarget } from '@/lib/dom';
import { useScriptText } from '@/lib/script';
import { cantoneseSentenceLessons, getCantoneseSentenceCardsForLesson, getCantoneseSentenceLesson } from './data';
import { projectSentenceCardAfterCompletion, selectNextSentenceCard } from './scheduler';

type InputState = 'idle' | 'typing' | 'correct' | 'wrong';

function classifyJyutpingInput(input: string, answer: string): InputState {
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

export function CantoneseSentencesPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const progress = useProgressState();
  const { scriptPreference, playbackSpeed } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [value, setValue] = useState('');
  const [correctPendingAdvance, setCorrectPendingAdvance] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showJyutping, setShowJyutping] = useState(true);
  const lesson = lessonId ? getCantoneseSentenceLesson(lessonId) : undefined;
  const lessonCards = useMemo(
    () => (lesson ? getCantoneseSentenceCardsForLesson(lesson.id) : []),
    [lesson],
  );

  const selection = useMemo(() => {
    const nextSelection = selectNextSentenceCard(progress.cantoneseSentenceDrill, lessonCards);
    return {
      card: nextSelection?.card ?? null,
      index: nextSelection?.index,
      reason: nextSelection?.reason,
    };
  }, [lessonCards, progress.cantoneseSentenceDrill]);

  const currentCard = selection.card;
  const inputState = currentCard ? classifyJyutpingInput(value, currentCard.jyutping) : 'idle';
  const masteredSentenceCount = useMemo(() => {
    if (!lesson) {
      return 0;
    }

    return lesson.cardIds.filter((cardId) => (
      progress.cantoneseSentenceDrill.sentenceStats[cardId]?.masteryLevel >= 3
    )).length;
  }, [lesson, progress.cantoneseSentenceDrill.sentenceStats]);
  const dueSentenceCount = useMemo(
    () => lessonCards.filter((card) => {
      const stat = progress.cantoneseSentenceDrill.sentenceStats[card.id];
      return stat && stat.masteryLevel > 0 && stat.masteryLevel < 3 && stat.dueTurn <= progress.cantoneseSentenceDrill.reviewTurn;
    }).length,
    [lessonCards, progress.cantoneseSentenceDrill.reviewTurn, progress.cantoneseSentenceDrill.sentenceStats],
  );

  if (!lesson) {
    return <Navigate to="/cantonese-sentences" replace />;
  }

  const lessonIndex = cantoneseSentenceLessons.findIndex((entry) => entry.id === lesson.id);
  const nextLesson = lessonIndex >= 0 && lessonIndex < cantoneseSentenceLessons.length - 1
    ? cantoneseSentenceLessons[lessonIndex + 1]
    : undefined;

  useEffect(() => {
    primeSpeechVoices();

    return () => {
      stopSentencePlayback();
    };
  }, []);

  useEffect(() => {
    if (!currentCard || correctPendingAdvance) {
      return;
    }

    inputRef.current?.focus();
  }, [correctPendingAdvance, currentCard]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (event.key === '!') {
        event.preventDefault();
        setShowJyutping((current) => !current);
        return;
      }

      if (event.key === '?' && correctPendingAdvance && currentCard) {
        event.preventDefault();
        playSentenceAudio(currentCard.text, currentCard.simplified);
        return;
      }

      if (event.key === 'Enter' && correctPendingAdvance) {
        if (isTypingTarget(event.target)) {
          return;
        }

        event.preventDefault();
        handleAdvance();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [correctPendingAdvance, currentCard, selection.index, playbackSpeed]);

  useEffect(() => {
    if (!currentCard || correctPendingAdvance || inputState !== 'correct') {
      return;
    }

    const previewProgress = projectSentenceCardAfterCompletion(
      progress.cantoneseSentenceDrill.sentenceStats[currentCard.id],
      progress.cantoneseSentenceDrill.reviewTurn + 1,
      new Date().toISOString(),
    );

    setCorrectPendingAdvance(true);
    setFeedback(
      previewProgress.masteryLevel >= 3
        ? text('呢句已經練熟')
        : text(`呢句掌握 ${previewProgress.masteryLevel}/3`),
    );
    playSentenceAudio(currentCard.text, currentCard.simplified);
  }, [correctPendingAdvance, currentCard, inputState, progress.cantoneseSentenceDrill.reviewTurn, progress.cantoneseSentenceDrill.sentenceStats, text]);

  function stopSentencePlayback() {
    const currentAudio = audioRef.current;
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      audioRef.current = null;
    }

    stopSpeechPlayback();
  }

  function playSentenceAudio(sentence: string, simplified: string) {
    if (speakText(sentence, playbackSpeed)) {
      return;
    }

    const asset =
      findAudioAssetByText(sentence) ??
      findAudioAssetByText(simplified);
    if (!asset) {
      return;
    }

    stopSentencePlayback();
    const nextAudio = new Audio(getAudioSource(asset, playbackSpeed));
    nextAudio.preload = 'auto';
    audioRef.current = nextAudio;
    nextAudio.addEventListener(
      'ended',
      () => {
        if (audioRef.current === nextAudio) {
          audioRef.current = null;
        }
      },
      { once: true },
    );
    void nextAudio.play().catch(() => {});
  }

  function handleAdvance() {
    if (!currentCard || selection.index === undefined) {
      return;
    }

    stopSentencePlayback();
    recordCantoneseSentenceCompletion({
      sentenceId: currentCard.id,
      selectedSentenceIndex: selection.index,
    });
    setValue('');
    setCorrectPendingAdvance(false);
    setFeedback(null);
  }

  if (!currentCard) {
    return (
      <div className="page-stack">
        <section className="sentence-stage">
          <div className="vocab-empty">
            <p>{text('呢一組粵字短句已經全部練熟。')}</p>
            <div className="sentence-actions">
              <button
                type="button"
                className="button button--primary"
                onClick={() => {
                  resetCantoneseSentenceLesson(lesson.cardIds);
                  setValue('');
                  setCorrectPendingAdvance(false);
                  setFeedback(null);
                }}
              >
                {text('再練本課')}
              </button>
              <button
                type="button"
                className="button button--secondary"
                onClick={() => navigate(nextLesson ? `/cantonese-sentences/lesson/${nextLesson.id}` : '/curriculum')}
              >
                {text('去下一課')}
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="sentence-stage">
        <div className="sentence-card">
          <div className="sentence-lesson-head">
            <h1>{text(lesson.title)}</h1>
            <p>{text(lesson.summary)}</p>
            <p>{text(lesson.teacherNote)}</p>
          </div>

          <div className="sentence-meta" aria-live="polite">
            <span>{selection.reason === 'review' ? text('複習句') : text('新句')}</span>
            <span>{text(`已熟 ${masteredSentenceCount}/${lesson.cardIds.length}`)}</span>
            {dueSentenceCount > 0 ? <span>{text(`待複習 ${dueSentenceCount}`)}</span> : null}
          </div>

          <div className="sentence-line" aria-live="polite">
            {currentCard.segments.map((segment, index) => (
              <span key={`${currentCard.id}-segment-${index}`} className="sentence-line__segment">
                {text(segment.text)}
                {segment.glossary ? (
                  <GlossaryPopover
                    entry={segment.glossary}
                    triggerLabel="?"
                    ariaLabel={text(`${segment.glossary.headword} 說明`)}
                    buttonClassName="glossary-chip__button glossary-chip__button--hint"
                  />
                ) : null}
              </span>
            ))}
          </div>

          {showJyutping ? (
            <div className="sentence-jyutping">
              <InteractiveJyutping jyutping={currentCard.jyutping} speechText={currentCard.text} />
            </div>
          ) : null}

          <div className="input-field sentence-input">
            <input
              ref={inputRef}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === '!') {
                  event.preventDefault();
                  setShowJyutping((current) => !current);
                  return;
                }

                if (event.key === 'Enter' && correctPendingAdvance) {
                  event.preventDefault();
                  handleAdvance();
                }
              }}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              disabled={correctPendingAdvance}
              aria-label={text('輸入整句粵拼')}
              className={inputState === 'wrong' ? 'is-invalid' : inputState === 'correct' ? 'is-valid' : undefined}
            />
          </div>

          {feedback ? (
            <div className="vocab-feedback" role="status" aria-live="polite">
              {feedback}
            </div>
          ) : null}

          <div className="sentence-actions">
            <button
              type="button"
              className="button button--secondary"
              onClick={() => setShowJyutping((current) => !current)}
              aria-pressed={showJyutping}
            >
              {showJyutping ? text('隱藏粵拼 [!]') : text('顯示粵拼 [!]')}
            </button>
            {correctPendingAdvance ? (
              <>
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={() => playSentenceAudio(currentCard.text, currentCard.simplified)}
                >
                  {text('重播 [?]')}
                </button>
                <button
                  type="button"
                  className="button button--primary"
                  onClick={handleAdvance}
                >
                  {text('下一句（回車）')}
                </button>
              </>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
