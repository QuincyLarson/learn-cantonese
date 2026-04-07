import { Link } from 'react-router-dom';
import { cantoneseSentenceLessons } from '@/features/cantoneseSentences';
import { useProgressState, useSettingsState } from '@/features/progress';
import { useScriptText } from '@/lib/script';
import { curriculumBookTotals, getBuiltBooks, getPlannedBooks, getStageBreakdown, unit1CurriculumPlan, unit2CurriculumPlan, vocabCurriculumPlan } from './catalog';

function hasStartedChapterTwo(sentenceStats: Record<string, { correctCount?: number } | undefined>): boolean {
  return Object.values(sentenceStats).some((stat) => (stat?.correctCount ?? 0) > 0);
}

function getLessonProgress(
  lessonCardIds: readonly string[],
  sentenceStats: Record<string, { masteryLevel?: number; correctCount?: number } | undefined>,
) {
  let seenCount = 0;
  let masteredCount = 0;

  for (const cardId of lessonCardIds) {
    const stat = sentenceStats[cardId];
    if (!stat || (stat.correctCount ?? 0) === 0) {
      continue;
    }

    seenCount += 1;
    if ((stat.masteryLevel ?? 0) >= 3) {
      masteredCount += 1;
    }
  }

  return {
    seenCount,
    masteredCount,
    totalCount: lessonCardIds.length,
  };
}

function getStageLabel(stageId: string): string {
  switch (stageId) {
    case 'stage-a':
      return 'Stage A';
    case 'stage-b':
      return 'Stage B';
    case 'stage-c':
      return 'Stage C';
    case 'stage-d':
      return 'Stage D';
    case 'stage-e':
      return 'Stage E';
    default:
      return stageId;
  }
}

export function CurriculumPage() {
  const progress = useProgressState();
  const { scriptPreference } = useSettingsState();
  const text = useScriptText(scriptPreference);

  const chapterTwoStarted = hasStartedChapterTwo(progress.cantoneseSentenceDrill.sentenceStats);
  const endlessStarted = progress.vocab.totalAttempts > 0;

  const lessonProgress = cantoneseSentenceLessons.map((lesson) => ({
    lesson,
    progress: getLessonProgress(lesson.cardIds, progress.cantoneseSentenceDrill.sentenceStats),
  }));

  const suggestedLesson =
    lessonProgress.find(({ progress: itemProgress }) => itemProgress.seenCount > 0 && itemProgress.masteredCount < itemProgress.totalCount) ??
    lessonProgress.find(({ progress: itemProgress }) => itemProgress.seenCount === 0) ??
    lessonProgress[0];

  const unit1BuiltBooks = getBuiltBooks(unit1CurriculumPlan);
  const unit2BuiltBooks = getBuiltBooks(unit2CurriculumPlan);
  const vocabBuiltBooks = getBuiltBooks(vocabCurriculumPlan);

  const unit1StageBreakdown = getStageBreakdown(unit1CurriculumPlan);
  const unit2StageBreakdown = getStageBreakdown(unit2CurriculumPlan);
  const vocabStageBreakdown = getStageBreakdown(vocabCurriculumPlan);

  return (
    <div className="linear-curriculum linear-curriculum--stacked">
      <section className="linear-curriculum__intro">
        <h1>{text('普通話學粵語')}</h1>
        <p>
          {text(
            '你本身已經識普通話同漢字，所以課程唔會兜去重教字義。先校準粵語發音同粵拼，再集中改正常見嘅普通話式用字同句法，之後就靠大量練習一路推到高階自然度。',
          )}
        </p>
        <p className="linear-curriculum__meta">
          {text(`目前已做 ${curriculumBookTotals.builtBooks} / ${curriculumBookTotals.totalPlannedBooks} 冊`)}
        </p>
      </section>

      <section className="unit-card" aria-labelledby="unit-1-title">
        <div className="unit-card__index" aria-hidden="true">
          1
        </div>
        <div className="unit-card__body">
          <div className="unit-card__head">
            <h2 id="unit-1-title">{text(unit1CurriculumPlan.title)}</h2>
            <div className="unit-card__meta">
              <p className="unit-card__hours">{text(unit1CurriculumPlan.estimatedHoursLabel)}</p>
              <p className="unit-card__count">{text(`已做 ${unit1BuiltBooks.length} / 規劃 ${unit1CurriculumPlan.totalPlannedBooks} 冊`)}</p>
            </div>
          </div>
          <ol className="unit-card__subsections" aria-label={text('單元 1 已上線課組')}>
            {unit1BuiltBooks.map((book, index) => (
              <li key={book.id} className="unit-card__subsection">
                <span className="unit-card__step">{String(index + 1).padStart(2, '0')}</span>
                <div className="unit-card__copy">
                  <h3>
                    {book.route ? (
                      <Link className="unit-card__link" to={book.route}>
                        {text(book.title)}
                      </Link>
                    ) : (
                      text(book.title)
                    )}
                  </h3>
                  <p>{text(book.summary)}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="unit-card__footer">
            <p className="unit-card__pipeline">
              {text(`後續排期：${unit1StageBreakdown.map((stage) => `${getStageLabel(stage.stageId)} ${stage.totalBooks} 冊`).join(' · ')}`)}
            </p>
            <p className="unit-card__pipeline">
              {text(`尚有 ${getPlannedBooks(unit1CurriculumPlan).length} 冊未開工。`)}
            </p>
          </div>
          <div className="unit-card__actions">
            <Link className="button button--primary" to={unit1BuiltBooks[0]?.route ?? '/pronunciation'}>
              {text('開始單元 1')}
            </Link>
          </div>
        </div>
      </section>

      <section className="unit-card" aria-labelledby="unit-2-title">
        <div className="unit-card__index" aria-hidden="true">
          2
        </div>
        <div className="unit-card__body">
          <div className="unit-card__head">
            <h2 id="unit-2-title">{text(unit2CurriculumPlan.title)}</h2>
            <div className="unit-card__meta">
              <p className="unit-card__hours">{text(unit2CurriculumPlan.estimatedHoursLabel)}</p>
              <p className="unit-card__count">{text(`已做 ${unit2BuiltBooks.length} / 規劃 ${unit2CurriculumPlan.totalPlannedBooks} 冊`)}</p>
            </div>
          </div>
          <ol className="unit-card__subsections" aria-label={text('單元 2 已上線課組')}>
            {unit2BuiltBooks.map((book, index) => (
              <li key={book.id} className="unit-card__subsection">
                <span className="unit-card__step">{String(index + 1).padStart(2, '0')}</span>
                <div className="unit-card__copy">
                  <h3>
                    {book.route ? (
                      <Link className="unit-card__link" to={book.route}>
                        {text(book.title)}
                      </Link>
                    ) : (
                      text(book.title)
                    )}
                  </h3>
                  <p>{text(book.summary)}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="unit-card__footer">
            <p className="unit-card__pipeline">
              {text(`後續排期：${unit2StageBreakdown.map((stage) => `${getStageLabel(stage.stageId)} ${stage.totalBooks} 冊`).join(' · ')}`)}
            </p>
            <p className="unit-card__pipeline">
              {text(`尚有 ${getPlannedBooks(unit2CurriculumPlan).length} 冊未開工。`)}
            </p>
          </div>
          <div className="unit-card__actions">
            <Link
              className="button button--primary"
              to={
                unit2BuiltBooks[0]?.route ??
                (suggestedLesson ? `/cantonese-sentences/lesson/${suggestedLesson.lesson.id}` : '/cantonese-sentences')
              }
            >
              {chapterTwoStarted ? text('繼續單元 2') : text('開始單元 2')}
            </Link>
          </div>
        </div>
      </section>

      <section className="unit-card" aria-labelledby="unit-vocab-title">
        <div className="unit-card__index unit-card__index--infinity" aria-hidden="true">
          ∞
        </div>
        <div className="unit-card__body">
          <div className="unit-card__head">
            <h2 id="unit-vocab-title">{text(vocabCurriculumPlan.title)}</h2>
            <div className="unit-card__meta">
              <p className="unit-card__hours">{text(vocabCurriculumPlan.estimatedHoursLabel)}</p>
              <p className="unit-card__count">{text(`已做 ${vocabBuiltBooks.length} / 規劃 ${vocabCurriculumPlan.totalPlannedBooks} 冊`)}</p>
            </div>
          </div>
          <ol className="unit-card__subsections" aria-label={text('詞彙練習已上線課組')}>
            {vocabBuiltBooks.map((book, index) => (
              <li key={book.id} className="unit-card__subsection">
                <span className="unit-card__step">{String(index + 1).padStart(2, '0')}</span>
                <div className="unit-card__copy">
                  <h3>
                    {book.route ? (
                      <Link className="unit-card__link" to={book.route}>
                        {text(book.title)}
                      </Link>
                    ) : (
                      text(book.title)
                    )}
                  </h3>
                  <p>{text(book.summary)}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="unit-card__footer">
            <p className="unit-card__pipeline">
              {text(`後續排期：${vocabStageBreakdown.map((stage) => `${getStageLabel(stage.stageId)} ${stage.totalBooks} 冊`).join(' · ')}`)}
            </p>
            <p className="unit-card__pipeline">
              {text(`尚有 ${getPlannedBooks(vocabCurriculumPlan).length} 冊未開工。`)}
            </p>
          </div>
          <div className="unit-card__actions">
            <Link className="button button--primary" to={vocabBuiltBooks[0]?.route ?? '/vocab'}>
              {endlessStarted ? text('繼續詞彙練習') : text('開始詞彙練習')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
