import { Link, NavLink } from 'react-router-dom';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { ToggleGroup } from '@/components/ToggleGroup';
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

  const navItems = useMemo(
    () => [
      { to: '/learn', label: text('學習') },
      { to: '/arcade', label: text('Arcade') },
      { to: '/settings', label: text('設定') },
    ],
    [text],
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar__inner">
          <Link to="/" className="brandmark" aria-label={text('返回首頁')}>
            <span className="brandmark__eyebrow">Standard Cantonese</span>
            <span className="brandmark__title">{text('普通話使用者標準粵語')}</span>
          </Link>

          <nav className="topnav" aria-label={text('主導覽')}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'navlink is-active' : 'navlink')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="topbar__controls">
            <ToggleGroup
              ariaLabel={text('字體腳本切換')}
              options={[
                { label: '繁', value: 'traditional' },
                { label: '简', value: 'simplified' },
              ]}
              value={scriptPreference}
              onChange={setScriptPreference}
            />
            <ToggleGroup
              ariaLabel={text('明暗模式切換')}
              options={[
                { label: text('亮'), value: 'light' },
                { label: text('暗'), value: 'dark' },
              ]}
              value={resolvedTheme}
              onChange={setThemePreference}
            />
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
