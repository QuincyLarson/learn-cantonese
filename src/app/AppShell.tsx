import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { CantoneseSentencesPage } from '@/features/cantoneseSentences';
import { GrammarPage } from '@/features/grammar/GrammarPage';
import { PronunciationPage } from '@/features/pronunciation/PronunciationPage';
import { SettingsPage } from '@/features/settings';
import { VocabPage } from '@/features/vocab/VocabPage';

export function AppShell() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/vocab" replace />} />
        <Route path="/pronunciation" element={<PronunciationPage />} />
        <Route path="/cantonese-sentences" element={<CantoneseSentencesPage />} />
        <Route path="/grammar" element={<GrammarPage />} />
        <Route path="/vocab" element={<VocabPage />} />
        <Route path="/learn" element={<Navigate to="/vocab" replace />} />
        <Route path="/learn/section/:sectionId" element={<Navigate to="/vocab" replace />} />
        <Route path="/learn/section/:sectionId/quiz" element={<Navigate to="/vocab" replace />} />
        <Route path="/learn/lesson/:lessonId" element={<Navigate to="/vocab" replace />} />
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
