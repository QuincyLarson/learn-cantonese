import type { CurriculumStagePlan } from './types';

export const curriculumStages: readonly CurriculumStagePlan[] = [
  {
    id: 'stage-a',
    title: 'Stage A',
    summary: '先做出第一批可完整使用的基礎課組。',
  },
  {
    id: 'stage-b',
    title: 'Stage B',
    summary: '擴到完整 A1–A2 起步量。',
  },
  {
    id: 'stage-c',
    title: 'Stage C',
    summary: '拉到可持續使用的工作級流利度範圍。',
  },
  {
    id: 'stage-d',
    title: 'Stage D',
    summary: '補齊高階口語、語域同本地使用密度。',
  },
  {
    id: 'stage-e',
    title: 'Stage E',
    summary: '完成 500 冊全課程目錄。',
  },
] as const;
