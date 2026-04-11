import type { CSSProperties, ChangeEvent } from 'react';
import { useMemo, useState } from 'react';
import {
  exportAppStateJson,
  importAppStateJson,
  resetAppState,
  setPlaybackSpeed,
  setScriptPreference,
  setThemePreference,
  setVocabTierStartRank,
  useAppState,
} from '../progress';
import type { AppState } from '../progress';
import { PlaybackSpeedToggle, ScriptPreferenceToggle, ThemePreferenceToggle } from './PreferenceControls';
import { SettingsOnboardingCallout } from './SettingsOnboardingCallout';
import { useScriptText } from '@/lib/script';
import { countDueVocabCards } from '@/features/vocab/scheduler';
import { getVocabTierLabel, getVocabTierOptions } from '@/features/vocab/tiers';
import { getPronunciationLessonProgressId, pronunciationLessons } from '@/features/pronunciation/data';
import { cantoneseSentenceLessons } from '@/features/cantoneseSentences';

const pageStyle: CSSProperties = {
  display: 'grid',
  gap: '1.25rem',
  padding: 'clamp(1rem, 2vw, 2rem)',
  color: 'var(--settings-text, #101827)',
};

const shellStyle: CSSProperties = {
  display: 'grid',
  gap: '1rem',
  maxWidth: '56rem',
  width: '100%',
  margin: '0 auto',
};

const cardStyle: CSSProperties = {
  border: '1px solid var(--settings-border, #d6d8de)',
  borderRadius: '1rem',
  padding: '1rem',
  background: 'var(--settings-surface, #ffffff)',
  display: 'grid',
  gap: '1rem',
};

const sectionStyle: CSSProperties = {
  display: 'grid',
  gap: '0.875rem',
};

const statGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))',
  gap: '0.75rem',
};

const statStyle: CSSProperties = {
  border: '1px solid var(--settings-border, #d6d8de)',
  borderRadius: '0.875rem',
  padding: '0.875rem',
  background: 'var(--settings-soft-surface, #f8fafc)',
};

const inputStyle: CSSProperties = {
  minHeight: '10rem',
  width: '100%',
  borderRadius: '0.875rem',
  border: '1px solid var(--settings-border, #d6d8de)',
  padding: '0.875rem',
  font: 'inherit',
  resize: 'vertical',
};

const actionRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
};

const selectStyle: CSSProperties = {
  minHeight: '2.75rem',
  borderRadius: '0.875rem',
  border: '1px solid var(--settings-border, #d6d8de)',
  padding: '0.6rem 0.8rem',
  font: 'inherit',
  background: 'var(--settings-surface, #ffffff)',
  color: 'inherit',
};

function downloadJson(filename: string, json: string): void {
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function tryImportAppState(input: string): boolean {
  try {
    importAppStateJson(input);
    return true;
  } catch {
    return false;
  }
}

function countCompletedSentenceLessons(
  sentenceStats: Record<string, { masteryLevel?: number; correctCount?: number } | undefined>,
): number {
  return cantoneseSentenceLessons.filter((lesson) =>
    lesson.cardIds.every((cardId) => {
      const stat = sentenceStats[cardId];
      return Boolean(stat) && (stat?.masteryLevel ?? 0) >= 3;
    }),
  ).length;
}

function statSummary(appState: AppState): Array<{ label: string; value: string }> {
  const pronunciationCompleted = pronunciationLessons.filter((lesson) =>
    appState.progress.completedLessonIds.includes(getPronunciationLessonProgressId(lesson.id)),
  ).length;
  const grammarCompleted = countCompletedSentenceLessons(appState.progress.cantoneseSentenceDrill.sentenceStats);
  const dueReviews = countDueVocabCards(appState.progress.vocab);

  return [
    { label: '發音課程', value: `${pronunciationCompleted}/${pronunciationLessons.length}` },
    { label: '語法用法', value: `${grammarCompleted}/${cantoneseSentenceLessons.length}` },
    { label: '詞彙已做', value: `${appState.progress.vocab.totalAttempts}` },
    { label: '待回鍋', value: `${dueReviews}` },
  ];
}

export function SettingsPage(): JSX.Element {
  const appState = useAppState();
  const text = useScriptText(appState.settings.scriptPreference);
  const [importText, setImportText] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const stats = statSummary(appState);
  const vocabTierOptions = useMemo(() => getVocabTierOptions(), []);

  function handleExportClick(): void {
    downloadJson('粵語課程進度.json', exportAppStateJson(appState));
    setStatusMessage(text('進度已匯出。'));
    setErrorMessage(null);
  }

  function handleImportClick(): void {
    if (!tryImportAppState(importText)) {
      setErrorMessage(text('匯入失敗：進度檔格式不正確。'));
      setStatusMessage(null);
      return;
    }

    setStatusMessage(text('進度已匯入。'));
    setErrorMessage(null);
    setImportText('');
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    file
      .text()
      .then((fileText) => {
        if (!tryImportAppState(fileText)) {
          setErrorMessage(text('檔案無法讀取為有效的進度檔。'));
          setStatusMessage(null);
          return;
        }

        setStatusMessage(text('檔案匯入完成。'));
        setErrorMessage(null);
        setImportText('');
      })
      .catch(() => {
        setErrorMessage(text('檔案讀取失敗。'));
        setStatusMessage(null);
      });

    event.target.value = '';
  }

  function handleResetClick(): void {
    if (typeof window !== 'undefined' && !window.confirm(text('確定要重設所有進度嗎？這會清除詞彙進度、發音進度與本機設定。'))) {
      return;
    }

    resetAppState();
    setStatusMessage(text('已重設為預設狀態。'));
    setErrorMessage(null);
  }

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <header style={cardStyle}>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <h1 style={{ margin: 0 }}>{text('設定')}</h1>
            <p style={{ margin: 0, color: 'var(--settings-muted, #586070)' }}>
              {text('調整顯示、播放速度同詞彙範圍，亦可以管理本機進度。')}
            </p>
          </div>
          <SettingsOnboardingCallout />
        </header>

        <section style={cardStyle} aria-labelledby="progress-title">
          <div style={sectionStyle}>
            <h2 id="progress-title" style={{ margin: 0 }}>
              {text('重點進度')}
            </h2>
            <div style={statGridStyle}>
              {stats.map((stat) => (
                <article key={stat.label} style={statStyle}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--settings-muted, #586070)' }}>{text(stat.label)}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem' }}>{text(stat.value)}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section style={cardStyle} aria-labelledby="study-title">
          <div style={sectionStyle}>
            <h2 id="study-title" style={{ margin: 0 }}>
              {text('學習設定')}
            </h2>
            <label style={{ display: 'grid', gap: '0.5rem' }}>
              <span style={{ fontWeight: 600 }}>{text('詞彙範圍')}</span>
              <span style={{ color: 'var(--settings-muted, #586070)' }}>
                {text(`而家練緊：${getVocabTierLabel(appState.settings.vocabTierStartRank)}`)}
              </span>
              <select
                value={String(appState.settings.vocabTierStartRank)}
                onChange={(event) => setVocabTierStartRank(Number(event.target.value))}
                style={selectStyle}
                aria-label={text('選擇詞彙範圍')}
              >
                {vocabTierOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {text(option.label)}
                  </option>
                ))}
              </select>
            </label>
            <ThemePreferenceToggle
              value={appState.settings.themePreference}
              onChange={setThemePreference}
            />
            <ScriptPreferenceToggle
              value={appState.settings.scriptPreference}
              onChange={setScriptPreference}
            />
            <PlaybackSpeedToggle
              value={appState.settings.playbackSpeed}
              onChange={setPlaybackSpeed}
            />
          </div>
        </section>

        <section style={cardStyle} aria-labelledby="data-title">
          <div style={sectionStyle}>
            <h2 id="data-title" style={{ margin: 0 }}>
              {text('進度檔')}
            </h2>
            <div style={actionRowStyle}>
              <button type="button" className="button button--secondary" onClick={handleExportClick}>
                {text('匯出進度檔')}
              </button>
              <label style={{ display: 'grid', gap: '0.375rem' }}>
                <span>{text('匯入進度檔')}</span>
                <input type="file" accept="application/json,.json" onChange={handleFileChange} />
              </label>
            </div>
            <label style={{ display: 'grid', gap: '0.5rem' }}>
              <span>{text('貼上進度內容')}</span>
              <textarea
                value={importText}
                onChange={(event) => setImportText(event.target.value)}
                style={inputStyle}
                placeholder={text('貼上先前匯出的進度內容，然後按「匯入貼上內容」。')}
              />
            </label>
            <div style={actionRowStyle}>
              <button type="button" className="button button--primary" onClick={handleImportClick}>
                {text('匯入貼上內容')}
              </button>
              <button type="button" className="button button--secondary" onClick={handleResetClick}>
                {text('重設進度')}
              </button>
            </div>
            {statusMessage ? <p role="status" style={{ margin: 0, color: '#0f766e' }}>{text(statusMessage)}</p> : null}
            {errorMessage ? <p role="alert" style={{ margin: 0, color: '#b91c1c' }}>{text(errorMessage)}</p> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
