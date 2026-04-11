import { Link, NavLink } from 'react-router-dom';
import { ReactNode, useEffect, useState } from 'react';
import { HeaderSwitch } from '@/components/HeaderSwitch';
import { isTypingTarget } from '@/lib/dom';
import { useScriptText } from '@/lib/script';
import {
  setScriptPreference,
  setThemePreference,
  useSettingsState,
} from '@/features/progress';

type AppLayoutProps = {
  children: ReactNode;
};

type ThemeMode = 'light' | 'dark';

export function AppLayout({ children }: AppLayoutProps) {
  const { scriptPreference, themePreference } = useSettingsState();
  const [systemTheme, setSystemTheme] = useState<ThemeMode>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  );
  const text = useScriptText(scriptPreference);
  const resolvedTheme = themePreference === 'system' ? systemTheme : themePreference;

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => {
      setSystemTheme(media.matches ? 'dark' : 'light');
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    document.documentElement.lang = scriptPreference === 'traditional' ? 'zh-Hant' : 'zh-Hans';
  }, [scriptPreference]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) {
        return;
      }

      const backQuotePressed = event.key === '`' || event.code === 'Backquote';
      if (backQuotePressed || (event.altKey && event.key.toLowerCase() === 's')) {
        event.preventDefault();
        setScriptPreference(scriptPreference === 'traditional' ? 'simplified' : 'traditional');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [scriptPreference]);

  const toggleScriptPreference = () => {
    setScriptPreference(scriptPreference === 'traditional' ? 'simplified' : 'traditional');
  };

  const toggleTheme = () => {
    setThemePreference(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar__inner">
          <Link to="/curriculum" className="brandmark" aria-label={text('返回首頁')}>
            <span className="brandmark__title">{text('普通話學粵語')}</span>
          </Link>

          <div className="topbar__controls">
            <NavLink
              to="/practice"
              className={({ isActive }) => (isActive ? 'navlink navlink--utility is-active' : 'navlink navlink--utility')}
            >
              {text('練習')}
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) => (isActive ? 'navlink navlink--utility is-active' : 'navlink navlink--utility')}
            >
              {text('設定')}
            </NavLink>
            <div className="topbar__switches" role="group" aria-label={text('顯示設定')}>
              <HeaderSwitch
                ariaLabel={text('切換繁簡')}
                offLabel={text('繁')}
                onLabel={text('简')}
                checked={scriptPreference === 'simplified'}
                onToggle={toggleScriptPreference}
              />
              <HeaderSwitch
                ariaLabel={text('切換明暗')}
                offLabel={text('亮')}
                onLabel={text('暗')}
                checked={resolvedTheme === 'dark'}
                onToggle={toggleTheme}
              />
            </div>
          </div>
        </div>
      </header>

      <a className="skip-link" href="#main-content">
        {text('跳到主要內容')}
      </a>
      <main id="main-content" className="app-main">
        {children}
      </main>
    </div>
  );
}
