import type { CSSProperties, ChangeEvent } from 'react';
import { useState } from 'react';
import {
  exportAppStateJson,
  importAppStateJson,
  resetAppState,
  setExperimentalFlag,
  setPlaybackSpeed,
  setScriptPreference,
  setThemePreference,
  useAppState,
} from '../progress';
import type { AppState } from '../progress';
import { PlaybackSpeedToggle, ScriptPreferenceToggle, ThemePreferenceToggle } from './PreferenceControls';
import { SettingsOnboardingCallout } from './SettingsOnboardingCallout';
import { useScriptText } from '@/lib/script';

const pageStyle: CSSProperties = {
  display: 'grid',
  gap: '1.25rem',
  padding: 'clamp(1rem, 2vw, 2rem)',
  color: 'var(--settings-text, #101827)',
};

const shellStyle: CSSProperties = {
  display: 'grid',
  gap: '1rem',
  maxWidth: '72rem',
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
  gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))',
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

function formatPercent(value: number): string {
  return `${value.toFixed(0)}%`;
}

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

function statSummary(appState: AppState): Array<{ label: string; value: string }> {
  const { progress } = appState;
  const quizEntries = Object.values(progress.quizScores);
  const gamesPlayed = Object.values(progress.arcadeStats.games).reduce((sum, game) => sum + game.plays, 0);
  const successfulQuizzes = quizEntries.filter((entry) => entry.passed).length;
  const averageQuizScore = quizEntries.length
    ? Math.round(quizEntries.reduce((sum, entry) => sum + entry.lastScore, 0) / quizEntries.length)
    : 0;
  const reviewLaterCount = progress.reviewLaterIds.length;

  return [
    { label: '已完成課數', value: String(progress.completedLessonIds.length) },
    { label: '待複習項目', value: String(reviewLaterCount) },
    { label: '測驗通過', value: `${successfulQuizzes}/${quizEntries.length}` },
    { label: '測驗平均分', value: formatPercent(averageQuizScore) },
    { label: '街機遊玩', value: String(gamesPlayed) },
    { label: '最佳連勝', value: String(progress.arcadeStats.bestStreak) },
  ];
}

export function SettingsPage(): JSX.Element {
  const appState = useAppState();
  const text = useScriptText(appState.settings.scriptPreference);
  const [importText, setImportText] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stats = statSummary(appState);

  function handleExportClick(): void {
    downloadJson('standard-cantonese-progress.json', exportAppStateJson(appState));
    setStatusMessage(text('進度已匯出。'));
    setErrorMessage(null);
  }

  function handleImportClick(): void {
    if (!tryImportAppState(importText)) {
      setErrorMessage(text('匯入失敗：JSON 格式不正確。'));
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
          setErrorMessage(text('檔案無法讀取為有效的進度 JSON。'));
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
    if (typeof window !== 'undefined' && !window.confirm(text('確定要重設所有進度嗎？這會清除完成課程、測驗分數與本機設定。'))) {
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
              {text('這裡管理字體、外觀、播放速度，以及本機儲存的學習進度。')}
            </p>
          </div>
          <SettingsOnboardingCallout />
        </header>

        <section style={cardStyle} aria-labelledby="appearance-title">
          <div style={sectionStyle}>
            <h2 id="appearance-title" style={{ margin: 0 }}>
              {text('外觀')}
            </h2>
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

        <section style={cardStyle} aria-labelledby="progress-title">
          <div style={sectionStyle}>
            <h2 id="progress-title" style={{ margin: 0 }}>
              {text('進度概覽')}
            </h2>
            <div style={statGridStyle}>
              {stats.map((stat) => (
                <article key={stat.label} style={statStyle}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--settings-muted, #586070)' }}>{text(stat.label)}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem' }}>{stat.value}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section style={cardStyle} aria-labelledby="data-title">
          <div style={sectionStyle}>
            <h2 id="data-title" style={{ margin: 0 }}>
              {text('資料匯入與匯出')}
            </h2>
            <p style={{ margin: 0, color: 'var(--settings-muted, #586070)' }}>
              {text('匯出的 JSON 會包含完成課程、測驗分數、複習標記、街機統計與設定。')}
            </p>
            <div style={actionRowStyle}>
              <button type="button" className="button button--secondary" onClick={handleExportClick}>
                {text('匯出 JSON')}
              </button>
              <label style={{ display: 'grid', gap: '0.375rem' }}>
                <span>{text('匯入 JSON 檔案')}</span>
                <input type="file" accept="application/json,.json" onChange={handleFileChange} />
              </label>
            </div>
            <label style={{ display: 'grid', gap: '0.5rem' }}>
              <span>{text('貼上 JSON 內容')}</span>
              <textarea
                value={importText}
                onChange={(event) => setImportText(event.target.value)}
                style={inputStyle}
                placeholder={text('貼上先前匯出的 JSON，然後按「匯入貼上內容」。')}
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

        <section style={cardStyle} aria-labelledby="experimental-title">
          <div style={sectionStyle}>
            <h2 id="experimental-title" style={{ margin: 0 }}>
              {text('實驗性功能')}
            </h2>
            <label style={{ display: 'grid', gap: '0.5rem' }}>
              <span>{text('發音評分預留開關')}</span>
              <button
                type="button"
                className="button button--secondary"
                aria-pressed={Boolean(appState.progress.experimentalFlags.pronunciationScoringPreview)}
                onClick={() =>
                  setExperimentalFlag(
                    'pronunciationScoringPreview',
                    !appState.progress.experimentalFlags.pronunciationScoringPreview
                  )
                }
              >
                {appState.progress.experimentalFlags.pronunciationScoringPreview ? text('已啟用') : text('未啟用')}
              </button>
            </label>
            <p style={{ margin: 0, color: 'var(--settings-muted, #586070)' }}>
              {text('這個開關只供未來試驗使用，不會影響課程通關。')}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
