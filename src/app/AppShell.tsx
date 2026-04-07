import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { CantoneseSentencesOverviewPage, CantoneseSentencesPage } from '@/features/cantoneseSentences';
import { CurriculumBookPage, CurriculumPage } from '@/features/curriculum';
import { PronunciationPage } from '@/features/pronunciation/PronunciationPage';
import { SettingsPage } from '@/features/settings';
import { VocabPage } from '@/features/vocab/VocabPage';

function ScrollToTopOnRouteChange() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.history.scrollRestoration = 'manual';
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [location.pathname]);

  return null;
}

export function AppShell() {
  return (
    <AppLayout>
      <ScrollToTopOnRouteChange />
      <Routes>
        <Route path="/" element={<Navigate to="/curriculum" replace />} />
        <Route path="/curriculum" element={<CurriculumPage />} />
        <Route path="/curriculum/book/:bookId" element={<CurriculumBookPage />} />
        <Route path="/pronunciation" element={<PronunciationPage />} />
        <Route path="/cantonese-sentences" element={<CantoneseSentencesOverviewPage />} />
        <Route path="/cantonese-sentences/lesson/:lessonId" element={<CantoneseSentencesPage />} />
        <Route path="/grammar" element={<Navigate to="/cantonese-sentences" replace />} />
        <Route path="/vocab" element={<VocabPage />} />
        <Route path="/learn" element={<Navigate to="/curriculum" replace />} />
        <Route path="/learn/section/:sectionId" element={<Navigate to="/curriculum" replace />} />
        <Route path="/learn/section/:sectionId/quiz" element={<Navigate to="/curriculum" replace />} />
        <Route path="/learn/lesson/:lessonId" element={<Navigate to="/curriculum" replace />} />
        <Route path="/arcade" element={<Navigate to="/vocab" replace />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="*"
          element={<PlaceholderPage title="找不到頁面" body="請從上方導覽返回。" />}
        />
      </Routes>
    </AppLayout>
  );
}
