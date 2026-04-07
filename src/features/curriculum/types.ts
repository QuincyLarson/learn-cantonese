export type CurriculumUnitId = 'unit1' | 'unit2' | 'vocab';

export type CurriculumBookStatus = 'built' | 'planned';

export type CurriculumStageId = 'stage-a' | 'stage-b' | 'stage-c' | 'stage-d' | 'stage-e';

export type CurriculumBook = {
  id: string;
  unitId: CurriculumUnitId;
  stageId: CurriculumStageId;
  clusterId: string;
  title: string;
  summary: string;
  status: CurriculumBookStatus;
  route?: string;
  practiceRoute?: string;
};

export type CurriculumUnitPlan = {
  unitId: CurriculumUnitId;
  title: string;
  totalPlannedBooks: number;
  estimatedHoursLabel: string;
  books: readonly CurriculumBook[];
};

export type CurriculumStagePlan = {
  id: CurriculumStageId;
  title: string;
  summary: string;
};
