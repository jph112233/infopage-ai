export interface InfographicData {
  title: string;
  tagline: string;
  summary: string;
  primaryStat: {
    value: string;
    label: string;
  };
  secondaryStats: Array<{
    value: string;
    label: string;
  }>;
  chartTitle: string;
  chartType: 'bar' | 'pie';
  chartData: Array<{
    name: string;
    value: number;
  }>;
  keyTakeaways: string[];
  quote: {
    text: string;
    author: string;
  };
  topics: string[];
}

export enum AppState {
  UPLOAD = 'UPLOAD',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR',
  SETTINGS = 'SETTINGS',
}

export type ColorTheme = 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate' | 'corporate';

export type InfographicType = 'informational' | 'selling' | 'project_wrapup';

export interface AppSettings {
  theme: ColorTheme;
  model: string;
  prompts: Record<InfographicType, string>;
}