import { Link } from 'react-router-dom';
import { SettingsOnboardingCallout } from '@/features/settings';
import { getLessons } from '@/features/learn/data';
import { useProgressState, useSettingsState } from '@/features/progress';
import { useScriptText } from '@/lib/script';

export function LandingPage() {
  const { scriptPreference } = useSettingsState();
  const progress = useProgressState();
  const text = useScriptText(scriptPreference);
  const totalLessons = getLessons().length;

  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow">{text('A1 Starter Slice')}</p>
          <h1>{text('先把耳朵打開，再把句子說順。')}</h1>
          <p className="hero__lede">
            {text('這是一條面向普通話使用者的標準粵語起步路線。先學會聽、先學會分辨，再把最常用的生存句和高頻功能詞帶進真實場景。')}
          </p>
          <div className="hero__actions">
            <Link className="button button--primary" to="/learn">
              {text('進入學習路線')}
            </Link>
            <Link className="button button--secondary" to="/settings">
              {text('先看設定')}
            </Link>
          </div>
          <div className="landing-stats">
            <div className="surface-card">
              <span className="eyebrow">{text('已完成課數')}</span>
              <strong>{progress.completedLessonIds.length}</strong>
            </div>
            <div className="surface-card">
              <span className="eyebrow">{text('A1 起步課')}</span>
              <strong>{totalLessons}</strong>
            </div>
            <div className="surface-card">
              <span className="eyebrow">{text('稍後複習')}</span>
              <strong>{progress.reviewLaterIds.length}</strong>
            </div>
          </div>
        </div>

        <div className="hero__panel">
          <div className="spotlight-card">
            <p className="spotlight-card__label">{text('First Build Includes')}</p>
            <ul className="spotlight-list">
              <li>{text('Start Here 上手導覽')}</li>
              <li>{text('Sound Lab 1 聲調與最小對比')}</li>
              <li>{text('Meet & Greet 打招呼與問路')}</li>
              <li>{text('A1 Checkpoint 小測與 Arcade')}</li>
            </ul>
          </div>
        </div>
      </section>

      <SettingsOnboardingCallout />

      <section className="feature-grid" aria-label="核心能力">
        <article className="feature-card">
          <h2>{text('聽力先行')}</h2>
          <p>{text('每一步控制在 30 到 60 秒，先聽懂高頻詞、句型和語氣，再做選擇題、重組題與跟讀。')}</p>
        </article>
        <article className="feature-card">
          <h2>{text('字形可切換')}</h2>
          <p>{text('內容以繁體編寫，整站可切到簡體。第一次進站會提示你去看導覽列的切換開關。')}</p>
        </article>
        <article className="feature-card">
          <h2>{text('本地進度')}</h2>
          <p>{text('不需要帳號，學習進度、收藏待複習項與播放速度都只存在你的瀏覽器裡。')}</p>
        </article>
      </section>
    </div>
  );
}
