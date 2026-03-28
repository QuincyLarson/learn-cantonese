import { Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { LandingPage } from '@/features/home/LandingPage';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { LearnMapPage } from '@/features/learn/LearnMapPage';
import { SectionPage } from '@/features/learn/SectionPage';
import { LessonPage } from '@/features/learn/LessonPage';
import { SectionQuizPage } from '@/features/learn/SectionQuizPage';
import { ArcadePage } from '@/features/arcade/ArcadePage';
import { SettingsPage } from '@/features/settings';

export function AppShell() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/learn" element={<LearnMapPage />} />
        <Route path="/learn/section/:sectionId" element={<SectionPage />} />
        <Route path="/learn/section/:sectionId/quiz" element={<SectionQuizPage />} />
        <Route path="/learn/lesson/:lessonId" element={<LessonPage />} />
        <Route path="/arcade" element={<ArcadePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="*"
          element={<PlaceholderPage title="找不到頁面" body="請從上方導覽返回。" />}
        />
      </Routes>
    </AppLayout>
  );
}
