import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { InteractiveJyutping } from '@/components/InteractiveJyutping';
import { primeSpeechVoices, speakText, stopSpeechPlayback } from '@/features/audio/audio';
import { markLessonCompleted, useProgressState, useSettingsState } from '@/features/progress';
import { useScriptText } from '@/lib/script';
import { getLastLessonRoute } from '@/lib/navigationState';
import { cantoneseSentenceLessons } from '@/features/cantoneseSentences';
import {
  getPronunciationLessonById,
  getPronunciationLessonProgressId,
  pronunciationLessons,
  toneExamples,
} from './data';
import { ToneContourSvg } from './ToneContourSvg';

type InputState = 'idle' | 'typing' | 'wrong' | 'correct';

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

function getPronunciationResumeRoute() {
  const lastLessonRoute = getLastLessonRoute();
  if (lastLessonRoute?.startsWith('/pronunciation/lesson/')) {
    return lastLessonRoute;
  }

  return `/pronunciation/lesson/${pronunciationLessons[0]?.id ?? ''}`;
}

export function PronunciationPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const progress = useProgressState();
  const { scriptPreference, playbackSpeed } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [activeTone, setActiveTone] = useState<number>(1);
  const [value, setValue] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [typingFeedback, setTypingFeedback] = useState<string | null>(null);

  useEffect(() => {
    primeSpeechVoices();

    return () => {
      stopSpeechPlayback();
    };
  }, []);

  if (!lessonId) {
    return <Navigate to={getPronunciationResumeRoute()} replace />;
  }

  const lesson = getPronunciationLessonById(lessonId);
  if (!lesson) {
    return <Navigate to={getPronunciationResumeRoute()} replace />;
  }

  const lessonIndex = pronunciationLessons.findIndex((entry) => entry.id === lesson.id);
  const nextLesson = lessonIndex >= 0 && lessonIndex < pronunciationLessons.length - 1
    ? pronunciationLessons[lessonIndex + 1]
    : undefined;
  const nextRoute = nextLesson
    ? `/pronunciation/lesson/${nextLesson.id}`
    : cantoneseSentenceLessons[0]
      ? `/cantonese-sentences/lesson/${cantoneseSentenceLessons[0].id}`
      : '/curriculum';
  const completionId = getPronunciationLessonProgressId(lesson.id);
  const completed = progress.completedLessonIds.includes(completionId);
  const activeExample = useMemo(
    () => toneExamples.find((example) => example.tone === activeTone) ?? toneExamples[0],
    [activeTone],
  );
  const typingCard = lesson.labCards[0];
  const inputState = typingCard ? classifyJyutpingInput(value, typingCard.jyutping) : 'idle';
  const canAdvance = inputState === 'correct' || revealed;

  useEffect(() => {
    setValue('');
    setRevealed(false);
    setTypingFeedback(null);
  }, [lesson.id]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [lesson.id]);

  useEffect(() => {
    if (inputState !== 'correct' || revealed) {
      return;
    }

    setTypingFeedback(text('答啱。'));
    speakText(typingCard.text, playbackSpeed);
  }, [inputState, playbackSpeed, revealed, text, typingCard.text]);

  function handleTonePreview(tone: number) {
    const example = toneExamples.find((item) => item.tone === tone) ?? toneExamples[0];
    setActiveTone(example.tone);
    speakText(example.character, playbackSpeed);
  }

  function handleComplete() {
    if (!canAdvance) {
      return;
    }

    markLessonCompleted({ lessonId: completionId, revisited: completed });
    navigate(nextRoute);
  }

  function handleReveal() {
    if (!typingCard) {
      return;
    }

    speakText(typingCard.text, playbackSpeed);
    setRevealed(true);
    setTypingFeedback(text('答案已顯示。'));
  }

  return (
    <div className="chapter-page">
      <section className="chapter-page__section chapter-page__section--lead">
        <p className="curriculum-book-page__eyebrow">
          {text(`第 ${lesson.number} 課`)}
        </p>
        <div className="pronunciation-lesson-page__head">
          <div>
            <h1>{text(lesson.title)}</h1>
            <p>{text(lesson.summary)}</p>
          </div>
          {completed ? <span className="pronunciation-lesson-page__status">{text('已完成')}</span> : null}
        </div>
        <p className="chapter-page__note">{text(lesson.teacherNote)}</p>
      </section>

      {lesson.id === 'tone-anchor' ? (
        <section className="chapter-page__section">
          <h2>{text('六聲示範')}</h2>
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
            {text(`：${activeExample.character}`)}
          </p>
        </section>
      ) : null}

      <section className="chapter-page__section">
        <h2>{text('本課例字')}</h2>
        <div className="pronunciation-example-row" aria-label={text(`${lesson.title} 例字`)}>
          {lesson.examples.map((example) => (
            <div key={`${lesson.id}-${example.text}-${example.jyutping}`} className="pronunciation-example-chip">
              <strong>{text(example.text)}</strong>
              <InteractiveJyutping jyutping={example.jyutping} speechText={example.text} />
              <span>{text(example.note)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="chapter-page__section">
        <h2>{text('打一次粵拼先過關')}</h2>
        <div className="pronunciation-lab">
          <div className="pronunciation-lab__card">
            <div className="pronunciation-lab__prompt">{text(typingCard.text)}</div>
            <div className="pronunciation-lab__note">{text(typingCard.note)}</div>
          </div>
          <label className="input-field pronunciation-lab__input">
            <span className="muted-text">{text('輸入粵拼')}</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                if (!revealed) {
                  setTypingFeedback(null);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && canAdvance) {
                  event.preventDefault();
                  handleComplete();
                }
              }}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label={text('輸入本課檢查點的粵拼')}
              className={inputState === 'wrong' ? 'is-invalid' : inputState === 'correct' ? 'is-valid' : undefined}
            />
          </label>
          {revealed || inputState === 'correct' ? (
            <div className="pronunciation-lab__answer" role="status" aria-live="polite">
              <strong>{text('標準答案')}</strong>
              <span>
                <InteractiveJyutping jyutping={typingCard.jyutping} speechText={typingCard.text} />
              </span>
            </div>
          ) : null}
          {typingFeedback ? (
            <div className="vocab-feedback" role="status" aria-live="polite">
              {typingFeedback}
            </div>
          ) : null}
          <div className="chapter-page__actions">
            {!canAdvance ? (
              <button type="button" className="button button--secondary" onClick={handleReveal}>
                {text('睇答案')}
              </button>
            ) : null}
            <button type="button" className="button button--primary" onClick={handleComplete} disabled={!canAdvance}>
              {text('去下一課')}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
