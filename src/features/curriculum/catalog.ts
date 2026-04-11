import { unit1Plan } from './unit1Catalog';
import { unit2CatalogPlan } from './unit2Catalog';
import type { CurriculumBook, CurriculumStageId, CurriculumUnitPlan } from './types';
import { vocabCatalog, vocabCatalogStages } from './vocabCatalog';

const NEXT_BOOK_PROMOTION_COUNT = 300;

const unit2BuiltRouteByClusterId: Record<string, string> = {
  'pointing-questions': '/cantonese-sentences/lesson/cs-lesson-pointing',
  'verb-shift': '/cantonese-sentences/lesson/cs-lesson-verb-swap',
  'negation-completion': '/cantonese-sentences/lesson/cs-lesson-grammar-particles',
  'pronouns-and-evaluation': '/cantonese-sentences/lesson/cs-lesson-people-talk',
  'spoken-particles': '/cantonese-sentences/lesson/cs-lesson-hk-talk',
  'cha-chaan-teng': '/cantonese-sentences/lesson/cs-lesson-cha-chaan-teng',
  'daily-life-vocabulary': '/cantonese-sentences/lesson/cs-lesson-daily-swaps',
};

const vocabStageToCurriculumStage: Record<string, CurriculumStageId> = {
  'unit-1-single-characters': 'stage-a',
  'unit-2-common-word-pairs': 'stage-a',
  'unit-3-short-sentence-typing': 'stage-b',
  'unit-4-listening-review': 'stage-c',
  'unit-5-speed-refinement': 'stage-c',
  'unit-6-professional-usage': 'stage-d',
  'unit-7-c1-c2-nuance': 'stage-e',
};

function promotePlanBooks(plan: CurriculumUnitPlan, additionalBuiltCount: number): CurriculumUnitPlan {
  let remainingPromotions = additionalBuiltCount;

  return {
    ...plan,
    books: plan.books.map((book) => {
      if (book.status === 'built') {
        return book;
      }

      if (remainingPromotions <= 0) {
        return book;
      }

      remainingPromotions -= 1;
      return {
        ...book,
        status: 'built',
      };
    }),
  };
}

function withBookRoutes(
  plan: CurriculumUnitPlan,
  resolver: (book: CurriculumBook) => string | undefined,
): CurriculumUnitPlan {
  return {
    ...plan,
    books: plan.books.map((book) => ({
      ...book,
      route: book.status === 'built' ? `/curriculum/book/${book.id}` : undefined,
      practiceRoute: resolver(book),
    })),
  } as CurriculumUnitPlan;
}

const baseUnit1Plan: CurriculumUnitPlan = {
  ...unit1Plan,
  books: unit1Plan.books.map((book) => ({
    ...book,
  })),
};

const baseUnit2Plan: CurriculumUnitPlan = {
  ...unit2CatalogPlan,
  title: '單元 2：粵語語法同用法',
  books: unit2CatalogPlan.books.map((book) => ({
    ...book,
  })),
};

const baseVocabPlan: CurriculumUnitPlan = {
  unitId: 'vocab',
  title: '詞彙練習',
  totalPlannedBooks: vocabCatalog.totalBookCount,
  estimatedHoursLabel: '100+ 小時',
  books: vocabCatalog.books.map((book) => ({
    id: book.id,
    unitId: 'vocab',
    stageId: vocabStageToCurriculumStage[vocabCatalogStages.find((stage) => stage.label === book.stageLabel)?.id ?? 'unit-7-c1-c2-nuance'],
    clusterId: book.id.split('-').slice(0, 4).join('-'),
    title: book.title,
    summary: book.summary,
    status: book.status,
  })),
};

const unit1AdditionalPromotions = baseUnit1Plan.books.filter((book) => book.status === 'planned').length;
const unit2AdditionalPromotions = baseUnit2Plan.books.filter((book) => book.status === 'planned').length;
const vocabAdditionalPromotions = Math.max(
  0,
  NEXT_BOOK_PROMOTION_COUNT - unit1AdditionalPromotions - unit2AdditionalPromotions,
);

export const unit1CurriculumPlan = withBookRoutes(
  promotePlanBooks(baseUnit1Plan, unit1AdditionalPromotions),
  () => '/pronunciation',
);

export const unit2CurriculumPlan = withBookRoutes(
  promotePlanBooks(baseUnit2Plan, unit2AdditionalPromotions),
  (book) => unit2BuiltRouteByClusterId[book.clusterId] ?? '/cantonese-sentences',
);

export const vocabCurriculumPlan = withBookRoutes(
  promotePlanBooks(baseVocabPlan, vocabAdditionalPromotions),
  () => '/practice',
);

export const curriculumUnitPlans: readonly CurriculumUnitPlan[] = [
  unit1CurriculumPlan,
  unit2CurriculumPlan,
  vocabCurriculumPlan,
];

export const curriculumBooks: readonly CurriculumBook[] = curriculumUnitPlans.flatMap((plan) => plan.books);
export const builtCurriculumBooks: readonly CurriculumBook[] = curriculumBooks.filter((book) => book.status === 'built');

export const curriculumBookTotals = {
  totalPlannedBooks: curriculumUnitPlans.reduce((total, plan) => total + plan.totalPlannedBooks, 0),
  builtBooks: curriculumUnitPlans.reduce((total, plan) => total + plan.books.filter((book) => book.status === 'built').length, 0),
};

export function getBuiltBooks(plan: CurriculumUnitPlan): CurriculumBook[] {
  return plan.books.filter((book) => book.status === 'built');
}

export function getPlannedBooks(plan: CurriculumUnitPlan): CurriculumBook[] {
  return plan.books.filter((book) => book.status === 'planned');
}

export function getStageBreakdown(plan: CurriculumUnitPlan): Array<{
  stageId: CurriculumStageId;
  totalBooks: number;
  builtBooks: number;
}> {
  const map = new Map<CurriculumStageId, { totalBooks: number; builtBooks: number }>();

  for (const book of plan.books) {
    const current = map.get(book.stageId) ?? { totalBooks: 0, builtBooks: 0 };
    current.totalBooks += 1;
    if (book.status === 'built') {
      current.builtBooks += 1;
    }
    map.set(book.stageId, current);
  }

  return [...map.entries()].map(([stageId, counts]) => ({
    stageId,
    totalBooks: counts.totalBooks,
    builtBooks: counts.builtBooks,
  }));
}

const curriculumBookById = new Map<string, CurriculumBook>(
  curriculumBooks.map((book) => [book.id, book] as const),
);

export function getCurriculumBookById(bookId: string): CurriculumBook | undefined {
  return curriculumBookById.get(bookId);
}

export function getCurriculumUnitById(unitId: CurriculumBook['unitId']): CurriculumUnitPlan | undefined {
  return curriculumUnitPlans.find((plan) => plan.unitId === unitId);
}

export function getCurriculumBookPosition(bookId: string): { index: number; total: number } | undefined {
  const index = curriculumBooks.findIndex((item) => item.id === bookId);
  if (index < 0) {
    return undefined;
  }

  return {
    index: index + 1,
    total: curriculumBooks.length,
  };
}

export function getAdjacentCurriculumBooks(bookId: string): {
  previousBook?: CurriculumBook;
  nextBook?: CurriculumBook;
} {
  const index = builtCurriculumBooks.findIndex((item) => item.id === bookId);

  return {
    previousBook: index > 0 ? builtCurriculumBooks[index - 1] : undefined,
    nextBook: index >= 0 && index < builtCurriculumBooks.length - 1 ? builtCurriculumBooks[index + 1] : undefined,
  };
}
