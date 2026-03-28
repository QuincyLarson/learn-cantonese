import { useMemo, useState } from 'react';
import type {
  ChooseJyutpingStep,
  ChooseToneStep,
  DialogueStep,
  FillBlankStep,
  JyutpingInputStep,
  LearnCardStep,
  LessonStep,
  ListenAndChooseStep,
  QuizItemStep,
  ReorderTilesStep,
  SignageReadingStep,
  StepChoice,
} from '@/content';
import { AudioButton } from '@/features/audio/AudioButton';
import { GlossaryPopover } from '@/features/glossary/GlossaryPopover';
import { getAudioAsset, getGlossaryEntries } from '@/features/learn/data';
import { RepeatMachineCard } from '@/features/learn/RepeatMachineCard';
import { useSettingsState } from '@/features/progress';
import { useScriptText } from '@/lib/script';

type LessonStepRendererProps = {
  lessonId: string;
  step: LessonStep;
  mode?: 'lesson' | 'quiz';
  onContinue: (isCorrect?: boolean) => void;
};

function GlossaryStrip({ glossaryIds }: { glossaryIds?: readonly string[] }) {
  const entries = getGlossaryEntries(glossaryIds);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="glossary-strip">
      <span className="eyebrow">Glossary</span>
      <div className="glossary-strip__items">
        {entries.map((entry) => (
          <GlossaryPopover key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}

function Feedback({
  isCorrect,
  explanation,
}: {
  isCorrect: boolean;
  explanation: string;
}) {
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);

  return (
    <div className={isCorrect ? 'feedback feedback--success' : 'feedback feedback--error'} aria-live="polite">
      <strong>{isCorrect ? text('答對了') : text('再看一次')}</strong>
      <p>{text(explanation)}</p>
    </div>
  );
}

function ChoiceButton({
  label,
  selected,
  correct,
  wrong,
  onClick,
}: {
  label: string;
  selected?: boolean;
  correct?: boolean;
  wrong?: boolean;
  onClick: () => void;
}) {
  let className = 'choice-button';
  if (selected) {
    className += ' is-selected';
  }
  if (correct) {
    className += ' is-correct';
  }
  if (wrong) {
    className += ' is-wrong';
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {label}
    </button>
  );
}

function ChoiceStep({
  title,
  eyebrow,
  prompt,
  choices,
  correctChoiceId,
  explanation,
  audioId,
  glossaryIds,
  onContinue,
  continueLabel,
}: {
  title: string;
  eyebrow: string;
  prompt: string;
  choices: readonly StepChoice[];
  correctChoiceId: string;
  explanation: string;
  audioId?: string;
  glossaryIds?: readonly string[];
  onContinue: (isCorrect: boolean) => void;
  continueLabel: string;
}) {
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const audio = useMemo(() => getAudioAsset(audioId), [audioId]);
  const isCorrect = selectedChoiceId === correctChoiceId;
  const answered = Boolean(selectedChoiceId);

  return (
    <section className="step-card">
      <header className="step-card__header">
        <p className="eyebrow">{text(eyebrow)}</p>
        <h2>{text(title)}</h2>
        <p>{text(prompt)}</p>
      </header>

      {audio ? (
        <div className="step-card__media">
          <AudioButton asset={audio} label={text('播放提示音')} />
        </div>
      ) : null}

      <div className="choice-grid" role="group" aria-label={text(prompt)}>
        {choices.map((choice) => (
          <ChoiceButton
            key={choice.id}
            label={text(choice.label)}
            selected={selectedChoiceId === choice.id}
            correct={answered && choice.id === correctChoiceId}
            wrong={selectedChoiceId === choice.id && selectedChoiceId !== correctChoiceId}
            onClick={() => setSelectedChoiceId(choice.id)}
          />
        ))}
      </div>

      {answered ? <Feedback isCorrect={isCorrect} explanation={explanation} /> : null}
      <GlossaryStrip glossaryIds={glossaryIds} />

      <footer className="step-card__footer">
        <button type="button" className="button button--primary" disabled={!answered} onClick={() => onContinue(isCorrect)}>
          {text(continueLabel)}
        </button>
      </footer>
    </section>
  );
}

function LearnCard({
  step,
  onContinue,
}: {
  step: LearnCardStep;
  onContinue: () => void;
}) {
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const audioAssets = (step.audioIds ?? [])
    .map((audioId) => getAudioAsset(audioId))
    .filter((asset): asset is NonNullable<typeof asset> => Boolean(asset));

  return (
    <section className="step-card">
      <header className="step-card__header">
        <p className="eyebrow">{text('Learn Card')}</p>
        <h2>{text(step.title)}</h2>
      </header>

      <div className="split-panel">
        <article className="surface-card">
          <span className="eyebrow">{text('正面')}</span>
          <h3>{text(step.front.heading)}</h3>
          <p>{text(step.front.body)}</p>
        </article>
        <article className="surface-card">
          <span className="eyebrow">{text('反面')}</span>
          <h3>{text(step.back.heading)}</h3>
          <p>{text(step.back.body)}</p>
          {step.back.bullets?.length ? (
            <ul className="detail-list">
              {step.back.bullets.map((bullet) => (
                <li key={bullet}>{text(bullet)}</li>
              ))}
            </ul>
          ) : null}
        </article>
      </div>

      {audioAssets.length ? (
        <div className="audio-stack">
          {audioAssets.map((asset) => (
            <AudioButton key={asset.id} asset={asset} label={text(`播放 ${asset.label}`)} />
          ))}
        </div>
      ) : null}

      <GlossaryStrip glossaryIds={step.glossaryIds} />

      <footer className="step-card__footer">
        <button type="button" className="button button--primary" onClick={onContinue}>
          {text('我看完了')}
        </button>
      </footer>
    </section>
  );
}

function ReorderTilesCard({
  step,
  onContinue,
}: {
  step: ReorderTilesStep;
  onContinue: (isCorrect: boolean) => void;
}) {
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const [answer, setAnswer] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const isCorrect = answer.join('|') === step.correctOrder.join('|');
  const remaining = step.tiles.filter((tile) => !answer.includes(tile));

  const handleCheck = () => {
    setChecked(true);
  };

  return (
    <section className="step-card">
      <header className="step-card__header">
        <p className="eyebrow">{text('Reorder')}</p>
        <h2>{text(step.title)}</h2>
        <p>{text(step.prompt)}</p>
      </header>

      <div className="tile-tray">
        <div className="tile-tray__lane">
          <span className="eyebrow">{text('你的答案')}</span>
          <div className="tile-tray__tiles">
            {answer.length ? (
              answer.map((tile) => (
                <button
                  key={`answer-${tile}`}
                  type="button"
                  className="tile-button tile-button--active"
                  onClick={() => setAnswer((current) => current.filter((entry) => entry !== tile))}
                >
                  {text(tile)}
                </button>
              ))
            ) : (
              <span className="muted-text">{text('按下方詞塊建立順序')}</span>
            )}
          </div>
        </div>

        <div className="tile-tray__lane">
          <span className="eyebrow">{text('可用詞塊')}</span>
          <div className="tile-tray__tiles">
            {remaining.map((tile) => (
              <button
                key={tile}
                type="button"
                className="tile-button"
                onClick={() => setAnswer((current) => [...current, tile])}
              >
                {text(tile)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {checked ? <Feedback isCorrect={isCorrect} explanation={step.explanation} /> : null}
      <GlossaryStrip glossaryIds={step.glossaryIds} />

      <footer className="step-card__footer">
        <button type="button" className="button button--secondary" onClick={() => setAnswer([])}>
          {text('清空')}
        </button>
        {!checked ? (
          <button type="button" className="button button--primary" disabled={answer.length !== step.correctOrder.length} onClick={handleCheck}>
            {text('檢查答案')}
          </button>
        ) : (
          <button type="button" className="button button--primary" onClick={() => onContinue(isCorrect)}>
            {text('下一步')}
          </button>
        )}
      </footer>
    </section>
  );
}

function FillBlankCard({
  step,
  onContinue,
}: {
  step: FillBlankStep;
  onContinue: (isCorrect: boolean) => void;
}) {
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const isCorrect = selectedWord === step.answer;

  return (
    <section className="step-card">
      <header className="step-card__header">
        <p className="eyebrow">{text('Fill Blank')}</p>
        <h2>{text(step.title)}</h2>
        <p>{text(step.prompt)}</p>
      </header>

      <div className="fill-blank-shell">
        <div className="surface-card fill-blank-shell__template">
          {text(step.template).replace('___', selectedWord ? text(selectedWord) : '_____')}
        </div>
        <div className="choice-grid">
          {step.wordBank.map((word) => (
            <ChoiceButton
              key={word}
              label={text(word)}
              selected={selectedWord === word}
              correct={checked && word === step.answer}
              wrong={checked && selectedWord === word && word !== step.answer}
              onClick={() => setSelectedWord(word)}
            />
          ))}
        </div>
      </div>

      {checked ? <Feedback isCorrect={isCorrect} explanation={step.explanation} /> : null}
      <GlossaryStrip glossaryIds={step.glossaryIds} />

      <footer className="step-card__footer">
        {!checked ? (
          <button type="button" className="button button--primary" disabled={!selectedWord} onClick={() => setChecked(true)}>
            {text('檢查答案')}
          </button>
        ) : (
          <button type="button" className="button button--primary" onClick={() => onContinue(isCorrect)}>
            {text('下一步')}
          </button>
        )}
      </footer>
    </section>
  );
}

function ChooseToneCard({
  step,
  onContinue,
}: {
  step: ChooseToneStep;
  onContinue: (isCorrect: boolean) => void;
}) {
  const choices = step.choices.map((choice) => ({
    id: String(choice),
    label: `${choice} 聲`,
  }));

  return (
    <ChoiceStep
      title={step.title}
      eyebrow="Choose Tone"
      prompt={`${step.prompt} ${step.syllable}`}
      choices={choices}
      correctChoiceId={String(step.correctTone)}
      explanation={step.explanation}
      audioId={step.audioId}
      continueLabel="下一步"
      onContinue={onContinue}
    />
  );
}

function JyutpingInputCard({
  step,
  onContinue,
}: {
  step: JyutpingInputStep;
  onContinue: (isCorrect: boolean) => void;
}) {
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);
  const normalized = value.trim().replace(/\s+/g, ' ');
  const target = step.targetTokens.join(' ');
  const isCorrect = normalized === target;
  const lastToken = normalized.split(' ').at(-1) ?? '';
  const tokenSuggestions = step.suggestions.filter((suggestion) => suggestion.token.startsWith(lastToken));
  const exactMatches = step.suggestions.filter((suggestion) => suggestion.token === lastToken);
  const phraseSuggestions = step.phraseSuggestions?.filter((suggestion) => suggestion.input.startsWith(normalized));

  return (
    <section className="step-card">
      <header className="step-card__header">
        <p className="eyebrow">{text('Jyutping Input')}</p>
        <h2>{text(step.title)}</h2>
        <p>{text(step.prompt)}</p>
      </header>

      <label className="input-field">
        <span className="eyebrow">{text('輸入 Jyutping')}</span>
        <input
          value={value}
          onChange={(event) => {
            setChecked(false);
            setValue(event.target.value);
          }}
          placeholder="nei5 hou2"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </label>

      <div className="suggestion-grid">
        <article className="surface-card">
          <span className="eyebrow">{text('音節建議')}</span>
          <ul className="detail-list">
            {(tokenSuggestions.length ? tokenSuggestions : step.suggestions.slice(0, 4)).map((suggestion) => (
              <li key={`${suggestion.token}-${suggestion.displayText}`}>
                <strong>{suggestion.token}</strong> {text(suggestion.displayText)}
              </li>
            ))}
          </ul>
        </article>
        <article className="surface-card">
          <span className="eyebrow">{text('完整匹配')}</span>
          <ul className="detail-list">
            {(exactMatches.length ? exactMatches : step.suggestions.slice(0, 2)).map((suggestion) => (
              <li key={`match-${suggestion.token}-${suggestion.displayText}`}>
                <strong>{text(suggestion.displayText)}</strong> {suggestion.jyutping}
              </li>
            ))}
          </ul>
        </article>
      </div>

      {phraseSuggestions?.length ? (
        <div className="surface-card">
          <span className="eyebrow">{text('片語提示')}</span>
          <ul className="detail-list">
            {phraseSuggestions.map((suggestion) => (
              <li key={suggestion.input}>
                <strong>{suggestion.input}</strong> {text(suggestion.displayText)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {checked ? <Feedback isCorrect={isCorrect} explanation={step.explanation} /> : null}

      <footer className="step-card__footer">
        {!checked ? (
          <button type="button" className="button button--primary" disabled={!normalized} onClick={() => setChecked(true)}>
            {text('檢查輸入')}
          </button>
        ) : (
          <button type="button" className="button button--primary" onClick={() => onContinue(isCorrect)}>
            {text('下一步')}
          </button>
        )}
      </footer>
    </section>
  );
}

function DialogueCard({
  step,
  onContinue,
}: {
  step: DialogueStep;
  onContinue: () => void;
}) {
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);

  return (
    <section className="step-card">
      <header className="step-card__header">
        <p className="eyebrow">{text('Dialogue')}</p>
        <h2>{text(step.title)}</h2>
        <p>{text(step.prompt)}</p>
      </header>

      <div className="dialogue-stack">
        {step.turns.map((turn) => (
          <article key={`${turn.speakerId}-${turn.text}`} className="dialogue-turn">
            <div>
              <span className="eyebrow">{text(turn.speakerLabel)}</span>
              <p>{text(turn.text)}</p>
            </div>
            <AudioButton asset={getAudioAsset(turn.audioId)} compact label={text(`播放 ${turn.speakerLabel}`)} />
          </article>
        ))}
      </div>

      <div className="surface-card">
        <span className="eyebrow">{text('總結')}</span>
        <p>{text(step.summary)}</p>
      </div>
      <GlossaryStrip glossaryIds={step.glossaryIds} />

      <footer className="step-card__footer">
        <button type="button" className="button button--primary" onClick={onContinue}>
          {text('繼續')}
        </button>
      </footer>
    </section>
  );
}

function SignageCard({
  step,
  onContinue,
}: {
  step: SignageReadingStep;
  onContinue: (isCorrect: boolean) => void;
}) {
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);

  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const answered = Boolean(selectedChoiceId);
  const isCorrect = selectedChoiceId === step.correctChoiceId;

  return (
    <section className="step-card">
      <header className="step-card__header">
        <p className="eyebrow">{text('Signage')}</p>
        <h2>{text(step.title)}</h2>
        <p>{text(step.prompt)}</p>
      </header>

      <div className="signage-card">
        {text(step.signText).split('\n').map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>

      <div className="choice-grid">
        {step.choices.map((choice) => (
          <ChoiceButton
            key={choice.id}
            label={text(choice.label)}
            selected={selectedChoiceId === choice.id}
            correct={answered && choice.id === step.correctChoiceId}
            wrong={selectedChoiceId === choice.id && selectedChoiceId !== step.correctChoiceId}
            onClick={() => setSelectedChoiceId(choice.id)}
          />
        ))}
      </div>

      {answered ? <Feedback isCorrect={isCorrect} explanation={step.explanation} /> : null}
      <GlossaryStrip glossaryIds={step.glossaryIds} />

      <footer className="step-card__footer">
        <button type="button" className="button button--primary" disabled={!answered} onClick={() => onContinue(isCorrect)}>
          {text('下一步')}
        </button>
      </footer>
    </section>
  );
}

export function LessonStepRenderer({
  lessonId,
  step,
  mode = 'lesson',
  onContinue,
}: LessonStepRendererProps) {
  const continueLabel = mode === 'quiz' ? '下一題' : '下一步';

  switch (step.kind) {
    case 'learnCard':
      return <LearnCard step={step} onContinue={() => onContinue()} />;
    case 'listenAndChoose':
      return (
        <ChoiceStep
          title={step.title}
          eyebrow="Listen & Choose"
          prompt={step.prompt}
          choices={step.choices}
          correctChoiceId={step.correctChoiceId}
          explanation={step.explanation}
          audioId={step.audioId}
          glossaryIds={step.glossaryIds}
          continueLabel={continueLabel}
          onContinue={onContinue}
        />
      );
    case 'chooseJyutping':
      return (
        <ChoiceStep
          title={step.title}
          eyebrow="Choose Jyutping"
          prompt={`${step.prompt} ${step.targetText}`}
          choices={step.choices}
          correctChoiceId={step.correctChoiceId}
          explanation={step.explanation}
          glossaryIds={step.glossaryIds}
          continueLabel={continueLabel}
          onContinue={onContinue}
        />
      );
    case 'chooseTone':
      return <ChooseToneCard step={step} onContinue={onContinue} />;
    case 'reorderTiles':
      return <ReorderTilesCard step={step} onContinue={onContinue} />;
    case 'fillBlank':
      return <FillBlankCard step={step} onContinue={onContinue} />;
    case 'signageReading':
      return <SignageCard step={step} onContinue={onContinue} />;
    case 'repeatMachine':
      return <RepeatMachineCard lessonId={lessonId} step={step} onContinue={() => onContinue()} />;
    case 'jyutpingInput':
      return <JyutpingInputCard step={step} onContinue={onContinue} />;
    case 'quizItem':
      return (
        <ChoiceStep
          title={step.title}
          eyebrow="Quiz"
          prompt={step.question}
          choices={step.choices}
          correctChoiceId={step.correctChoiceId}
          explanation={step.explanation}
          glossaryIds={step.glossaryIds}
          continueLabel={continueLabel}
          onContinue={onContinue}
        />
      );
    case 'dialogue':
      return <DialogueCard step={step} onContinue={() => onContinue()} />;
    default:
      return null;
  }
}
