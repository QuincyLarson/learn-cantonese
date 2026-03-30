import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  CommonCharacterEntry,
  CommonStructureEntry,
  DialogueStep,
  FillBlankStep,
  JyutpingInputStep,
  LessonStep,
  ReorderTilesStep,
  StepChoice,
} from '@/content';
import { AudioButton } from '@/features/audio/AudioButton';
import { GlossaryPopover } from '@/features/glossary/GlossaryPopover';
import { useSettingsState } from '@/features/progress';
import { useScriptText } from '@/lib/script';
import { getAudioAsset, getGlossaryEntries } from '@/features/learn/data';
import { searchCommonCharactersByJyutpingPrefix } from '@/features/learn/commonCharacters';
import { searchCommonStructuresByJyutpingPrefix } from '@/features/learn/commonStructures';
import { RepeatMachineCard } from '@/features/learn/RepeatMachineCard';

export type StepContinuePayload = {
  firstTryCorrect?: boolean;
  message?: string;
};

type LessonStepRendererProps = {
  lessonId: string;
  step: LessonStep;
  mode?: 'lesson' | 'quiz';
  busy?: boolean;
  onContinue: (payload?: StepContinuePayload) => void;
};

type StepFrameProps = {
  heading: string;
  children: ReactNode;
  glossaryIds?: readonly string[];
};

type ChoiceStepProps = {
  heading: string;
  choices: readonly StepChoice[];
  correctChoiceId: string;
  busy?: boolean;
  glossaryIds?: readonly string[];
  beforeChoices?: ReactNode;
  onResolve: (payload: StepContinuePayload) => void;
};

function StepFrame({ heading, children, glossaryIds }: StepFrameProps) {
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const glossaryEntries = useMemo(() => getGlossaryEntries(glossaryIds), [glossaryIds]);

  return (
    <section className="step-card">
      <header className="step-card__header">
        <h2>{text(heading)}</h2>
      </header>

      {glossaryEntries.length > 0 ? (
        <div className="glossary-strip" aria-label={text('詞彙提示')}>
          <div className="glossary-strip__items">
            {glossaryEntries.map((entry) => (
              <GlossaryPopover key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      ) : null}

      {children}
    </section>
  );
}

function ChoiceStep({
  heading,
  choices,
  correctChoiceId,
  busy = false,
  glossaryIds,
  beforeChoices,
  onResolve,
}: ChoiceStepProps) {
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hadWrongAttempt, setHadWrongAttempt] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleChoice = (choiceId: string) => {
    if (busy) {
      return;
    }

    setSelectedId(choiceId);

    if (choiceId === correctChoiceId) {
      setFeedback(null);
      onResolve({ firstTryCorrect: !hadWrongAttempt, message: '答對' });
      return;
    }

    setHadWrongAttempt(true);
    setFeedback(text('再試一次。'));
  };

  return (
    <StepFrame heading={heading} glossaryIds={glossaryIds}>
      {beforeChoices}

      <div className="choice-grid">
        {choices.map((choice) => {
          const isCorrect = choice.id === correctChoiceId;
          const isSelected = selectedId === choice.id;
          const className =
            isSelected && !busy
              ? isCorrect
                ? 'choice-button is-correct'
                : 'choice-button is-wrong'
              : busy && isCorrect
                ? 'choice-button is-correct'
                : 'choice-button';

          return (
            <button
              key={choice.id}
              type="button"
              className={className}
              onClick={() => handleChoice(choice.id)}
              disabled={busy}
            >
              <span>{text(choice.label)}</span>
              {choice.jyutping ? <span className="choice-button__meta">{choice.jyutping}</span> : null}
            </button>
          );
        })}
      </div>

      {feedback ? (
        <p className="feedback feedback--error" role="status" aria-live="polite">
          {feedback}
        </p>
      ) : null}
    </StepFrame>
  );
}

function renderTemplate(template: string, answer: string, text: (input: string) => string) {
  const [prefix, suffix] = template.split('___');
  return (
    <>
      {text(prefix ?? '')}
      <span className="fill-blank-shell__answer">{answer ? text(answer) : '＿'}</span>
      {text(suffix ?? '')}
    </>
  );
}

function FillBlankCard({
  step,
  busy,
  onResolve,
}: {
  step: FillBlankStep;
  busy?: boolean;
  onResolve: (payload: StepContinuePayload) => void;
}) {
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const [selectedWord, setSelectedWord] = useState('');
  const [hadWrongAttempt, setHadWrongAttempt] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleChoice = (word: string) => {
    if (busy) {
      return;
    }

    setSelectedWord(word);

    if (word === step.answer) {
      setFeedback(null);
      onResolve({ firstTryCorrect: !hadWrongAttempt, message: '答對' });
      return;
    }

    setHadWrongAttempt(true);
    setFeedback(text('再試一次。'));
  };

  return (
    <StepFrame heading={step.prompt} glossaryIds={step.glossaryIds}>
      <div className="fill-blank-shell">
        <p className="fill-blank-shell__template">
          {renderTemplate(step.template, selectedWord, text)}
        </p>
      </div>

      <div className="choice-grid">
        {step.wordBank.map((word) => {
          const isSelected = selectedWord === word;
          const className =
            isSelected && !busy
              ? word === step.answer
                ? 'choice-button is-correct'
                : 'choice-button is-wrong'
              : busy && word === step.answer
                ? 'choice-button is-correct'
                : 'choice-button';

          return (
            <button
              key={word}
              type="button"
              className={className}
              onClick={() => handleChoice(word)}
              disabled={busy}
            >
              {text(word)}
            </button>
          );
        })}
      </div>

      {feedback ? (
        <p className="feedback feedback--error" role="status" aria-live="polite">
          {feedback}
        </p>
      ) : null}
    </StepFrame>
  );
}

function ReorderTilesCard({
  step,
  busy,
  onResolve,
}: {
  step: ReorderTilesStep;
  busy?: boolean;
  onResolve: (payload: StepContinuePayload) => void;
}) {
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const resetTimeoutRef = useRef<number | null>(null);
  const [pickedTiles, setPickedTiles] = useState<string[]>([]);
  const [hadWrongAttempt, setHadWrongAttempt] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const remainingTiles = step.tiles.filter((tile) => !pickedTiles.includes(tile));

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const handlePick = (tile: string) => {
    if (busy || pickedTiles.includes(tile)) {
      return;
    }

    const nextPicked = [...pickedTiles, tile];
    setPickedTiles(nextPicked);

    if (nextPicked.length !== step.correctOrder.length) {
      return;
    }

    const isCorrect = nextPicked.join('|') === step.correctOrder.join('|');
    if (isCorrect) {
      setFeedback(null);
      onResolve({ firstTryCorrect: !hadWrongAttempt, message: '答對' });
      return;
    }

    setHadWrongAttempt(true);
    setFeedback(text('順序再試一次。'));
    resetTimeoutRef.current = window.setTimeout(() => {
      setPickedTiles([]);
    }, 450);
  };

  return (
    <StepFrame heading={step.prompt} glossaryIds={step.glossaryIds}>
      <div className="tile-tray">
        <div className="tile-tray__lane">
          <strong>{text('你的順序')}</strong>
          <div className="tile-tray__tiles tile-tray__tiles--answer" aria-live="polite">
            {pickedTiles.length > 0 ? (
              pickedTiles.map((tile, index) => (
                <button
                  key={`${tile}-${index}`}
                  type="button"
                  className="tile-button tile-button--active"
                  onClick={() => setPickedTiles((current) => current.filter((_, currentIndex) => currentIndex !== index))}
                  disabled={busy}
                >
                  {text(tile)}
                </button>
              ))
            ) : (
              <span className="tile-tray__placeholder">{text('按下面字卡排順。')}</span>
            )}
          </div>
        </div>

        <div className="tile-tray__lane">
          <strong>{text('可用字卡')}</strong>
          <div className="tile-tray__tiles">
            {remainingTiles.map((tile) => (
              <button
                key={tile}
                type="button"
                className="tile-button"
                onClick={() => handlePick(tile)}
                disabled={busy}
              >
                {text(tile)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {feedback ? (
        <p className="feedback feedback--error" role="status" aria-live="polite">
          {feedback}
        </p>
      ) : null}
    </StepFrame>
  );
}

function normalizeJyutpingInput(input: string) {
  return input.trim().toLowerCase().replace(/\s+/g, ' ');
}

const commonStructureKindLabel: Record<CommonStructureEntry['kind'], string> = {
  pair: '雙字詞',
  phrase: '常用詞組',
  idiom: '成語',
  yanyu: '熟語',
};

function JyutpingInputCard({
  step,
  busy,
  onResolve,
}: {
  step: JyutpingInputStep;
  busy?: boolean;
  onResolve: (payload: StepContinuePayload) => void;
}) {
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const [value, setValue] = useState('');
  const [hadWrongAttempt, setHadWrongAttempt] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [commonCharacterSuggestions, setCommonCharacterSuggestions] = useState<CommonCharacterEntry[]>([]);
  const [commonStructureSuggestions, setCommonStructureSuggestions] = useState<CommonStructureEntry[]>([]);

  const normalizedValue = normalizeJyutpingInput(value);
  const targetValue = normalizeJyutpingInput(step.targetTokens.join(' '));
  const activeToken = normalizedValue.split(' ').filter(Boolean).at(-1) ?? '';
  const exactSuggestions = step.suggestions.filter(
    (suggestion) => activeToken && normalizeJyutpingInput(suggestion.token) === activeToken,
  );
  const matchingPhrases = (step.phraseSuggestions ?? []).filter(
    (phrase) => normalizedValue && normalizeJyutpingInput(phrase.input) === normalizedValue,
  );
  const exactSuggestionKeys = exactSuggestions.map((suggestion) => `${suggestion.displayText}:${suggestion.jyutping}`).join('|');
  const curatedPhraseKeys = (step.phraseSuggestions ?? [])
    .map((phrase) => `${phrase.displayText}:${normalizeJyutpingInput(phrase.input)}`)
    .join('|');

  useEffect(() => {
    let active = true;

    if (!activeToken) {
      setCommonCharacterSuggestions([]);
      return () => {
        active = false;
      };
    }

    void searchCommonCharactersByJyutpingPrefix(activeToken, 12)
      .then((entries) => {
        if (!active) {
          return;
        }

        setCommonCharacterSuggestions(
          entries.filter((entry) => (
            !exactSuggestions.some((suggestion) => suggestion.displayText === entry.character && suggestion.jyutping === entry.jyutping)
          )),
        );
      })
      .catch(() => {
        if (active) {
          setCommonCharacterSuggestions([]);
        }
      });

    return () => {
      active = false;
    };
  }, [activeToken, exactSuggestionKeys]);

  useEffect(() => {
    let active = true;

    if (!normalizedValue) {
      setCommonStructureSuggestions([]);
      return () => {
        active = false;
      };
    }

    void searchCommonStructuresByJyutpingPrefix(normalizedValue, 10)
      .then((entries) => {
        if (!active) {
          return;
        }

        setCommonStructureSuggestions(
          entries.filter((entry) => (
            !exactSuggestions.some((suggestion) => suggestion.displayText === entry.text) &&
            !(step.phraseSuggestions ?? []).some((phrase) => phrase.displayText === entry.text)
          )),
        );
      })
      .catch(() => {
        if (active) {
          setCommonStructureSuggestions([]);
        }
      });

    return () => {
      active = false;
    };
  }, [normalizedValue, exactSuggestionKeys, curatedPhraseKeys, step.phraseSuggestions]);

  const handleSubmit = () => {
    if (busy) {
      return;
    }

    if (normalizedValue === targetValue) {
      setFeedback(null);
      onResolve({ firstTryCorrect: !hadWrongAttempt, message: '答對' });
      return;
    }

    setHadWrongAttempt(true);
    setFeedback(text('再試一次。'));
  };

  return (
    <StepFrame heading={step.prompt}>
      <label className="input-field">
        <span className="muted-text">{text('輸入粵拼')}</span>
        <input
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
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder={text(step.targetTokens.join(' '))}
          disabled={busy}
          aria-label={text('粵拼輸入')}
        />
      </label>

      {exactSuggestions.length > 0 ? (
        <div className="step-card__media">
          <span className="muted-text">{text('本課提示')}</span>
          <div className="suggestion-grid">
            {exactSuggestions.map((suggestion) => (
              <article key={`${suggestion.token}-${suggestion.displayText}`} className="surface-card">
                <strong>{text(suggestion.displayText)}</strong>
                <span className="muted-text">{suggestion.jyutping}</span>
                {suggestion.note ? <span className="muted-text">{text(suggestion.note)}</span> : null}
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {commonCharacterSuggestions.length > 0 ? (
        <div className="step-card__media">
          <span className="muted-text">{text('常用單字')}</span>
          <div className="suggestion-grid">
            {commonCharacterSuggestions.map((entry) => (
              <article key={entry.id} className="surface-card">
                <strong>{text(entry.character)}</strong>
                <span className="muted-text">{entry.jyutping}</span>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {commonStructureSuggestions.length > 0 ? (
        <div className="step-card__media">
          <span className="muted-text">{text('常用搭配')}</span>
          <div className="suggestion-grid">
            {commonStructureSuggestions.map((entry) => (
              <article key={entry.id} className="surface-card">
                <strong>{text(entry.text)}</strong>
                <span className="muted-text">{entry.jyutping}</span>
                <span className="muted-text">{text(commonStructureKindLabel[entry.kind])}</span>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {matchingPhrases.length > 0 ? (
        <div className="step-card__media">
          <span className="muted-text">{text('整句提示')}</span>
          <div className="suggestion-grid">
            {matchingPhrases.map((phrase) => (
              <article key={phrase.input} className="surface-card">
                <strong>{text(phrase.displayText)}</strong>
                <span className="muted-text">{normalizeJyutpingInput(phrase.input)}</span>
                {phrase.note ? <span className="muted-text">{text(phrase.note)}</span> : null}
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {feedback ? (
        <p className="feedback feedback--error" role="status" aria-live="polite">
          {feedback}
        </p>
      ) : null}

      <div className="step-card__footer">
        <button type="button" className="button button--primary" onClick={handleSubmit} disabled={busy || !normalizedValue}>
          {text('確定')}
        </button>
      </div>
    </StepFrame>
  );
}

function DialogueCard({
  step,
  busy,
  onResolve,
}: {
  step: DialogueStep;
  busy?: boolean;
  onResolve: (payload: StepContinuePayload) => void;
}) {
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const playableAudioIds = step.turns
    .map((turn) => getAudioAsset(turn.audioId)?.id)
    .filter((audioId): audioId is string => Boolean(audioId));
  const [heardAudioIds, setHeardAudioIds] = useState<string[]>([]);
  const totalAudio = playableAudioIds.length;
  const heardAll = totalAudio === 0 || playableAudioIds.every((audioId) => heardAudioIds.includes(audioId));

  return (
    <StepFrame heading={step.prompt} glossaryIds={step.glossaryIds}>
      <div className="dialogue-stack">
        {step.turns.map((turn, index) => {
          const asset = getAudioAsset(turn.audioId);

          return (
            <article key={`${turn.speakerId}-${index}`} className="dialogue-turn">
              <div>
                <strong>{text(turn.speakerLabel)}</strong>
                <p>{text(turn.text)}</p>
              </div>
              {asset ? (
                <AudioButton
                  asset={asset}
                  compact
                  label={text('播放句子')}
                  onPlay={() => {
                    setHeardAudioIds((current) => (current.includes(asset.id) ? current : [...current, asset.id]));
                  }}
                />
              ) : (
                <span className="audio-pill audio-pill--missing">{text('音訊未附上')}</span>
              )}
            </article>
          );
        })}
      </div>

      <div className="step-card__footer">
        <span className="muted-text">
          {totalAudio > 0 ? `${text('已聽')} ${heardAudioIds.length}/${totalAudio}` : text('這一步可以直接完成。')}
        </span>
        <button
          type="button"
          className="button button--primary"
          onClick={() => onResolve({ message: '完成' })}
          disabled={busy || !heardAll}
        >
          {text('完成本步')}
        </button>
      </div>
    </StepFrame>
  );
}

export function LessonStepRenderer({
  lessonId,
  step,
  mode = 'lesson',
  busy = false,
  onContinue,
}: LessonStepRendererProps) {
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);

  switch (step.kind) {
    case 'listenAndChoose':
      return (
        <ChoiceStep
          heading={step.prompt}
          choices={step.choices}
          correctChoiceId={step.correctChoiceId}
          glossaryIds={step.glossaryIds}
          busy={busy}
          beforeChoices={<AudioButton asset={getAudioAsset(step.audioId)} label={text('播放題目')} />}
          onResolve={onContinue}
        />
      );

    case 'chooseJyutping':
      return (
        <ChoiceStep
          heading={step.prompt}
          choices={step.choices}
          correctChoiceId={step.correctChoiceId}
          glossaryIds={step.glossaryIds}
          busy={busy}
          beforeChoices={<p className="prompt-display prompt-display--text">{text(step.targetText)}</p>}
          onResolve={onContinue}
        />
      );

    case 'chooseTone':
      return (
        <ChoiceStep
          heading={step.prompt}
          choices={step.choices.map((choice) => ({
            id: String(choice),
            label: ['零', '一', '二', '三', '四', '五', '六'][choice] + '聲',
          }))}
          correctChoiceId={String(step.correctTone)}
          busy={busy}
          beforeChoices={
            <div className="prompt-display-shell">
              <p className="prompt-display prompt-display--jyutping">{step.syllable}</p>
              {step.audioId ? <AudioButton asset={getAudioAsset(step.audioId)} label={text('播放音節')} compact /> : null}
            </div>
          }
          onResolve={onContinue}
        />
      );

    case 'reorderTiles':
      return <ReorderTilesCard step={step} busy={busy} onResolve={onContinue} />;

    case 'fillBlank':
      return <FillBlankCard step={step} busy={busy} onResolve={onContinue} />;

    case 'signageReading':
      return (
        <ChoiceStep
          heading={step.prompt}
          choices={step.choices}
          correctChoiceId={step.correctChoiceId}
          glossaryIds={step.glossaryIds}
          busy={busy}
          beforeChoices={<pre className="signage-card">{text(step.signText)}</pre>}
          onResolve={onContinue}
        />
      );

    case 'repeatMachine':
      return <RepeatMachineCard lessonId={lessonId} step={step} busy={busy} onContinue={() => onContinue({ message: '完成' })} />;

    case 'jyutpingInput':
      return <JyutpingInputCard step={step} busy={busy} onResolve={onContinue} />;

    case 'quizItem':
      return (
        <ChoiceStep
          heading={step.question}
          choices={step.choices}
          correctChoiceId={step.correctChoiceId}
          glossaryIds={step.glossaryIds}
          busy={busy}
          onResolve={(payload) => onContinue({ ...payload, message: mode === 'quiz' ? '答對' : payload.message })}
        />
      );

    case 'dialogue':
      return <DialogueCard step={step} busy={busy} onResolve={onContinue} />;

    case 'learnCard':
      return (
        <StepFrame heading={step.front.heading} glossaryIds={step.glossaryIds}>
          <p>{text(step.front.body)}</p>
          <div className="step-card__footer">
            <button type="button" className="button button--primary" onClick={() => onContinue({ message: '完成' })} disabled={busy}>
              {text('完成本步')}
            </button>
          </div>
        </StepFrame>
      );

    default:
      return null;
  }
}
