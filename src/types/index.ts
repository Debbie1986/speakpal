export type TeacherType = 'emma' | 'james' | 'lily' | 'david';
export type CorrectionType = 'grammar' | 'vocabulary' | 'pronunciation' | 'tense' | 'style';
export type ScenarioCategory = 'daily' | 'travel' | 'business' | 'social' | 'exam';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Teacher {
  id: TeacherType;
  name: string;
  nameZh: string;
  personality: string;
  specialty: string;
  suitableFor: string;
  color: string;
  bgColor: string;
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
  correction?: Correction;
}

export interface Correction {
  original: string;
  corrected: string;
  type: CorrectionType;
  explanation: string;
}

export interface Scenario {
  id: string;
  title: string;
  titleZh: string;
  description: string;
  category: ScenarioCategory;
  difficulty: Difficulty;
  icon: string;
  prompts: string[];
  introMessages: string[];
  keywords: string[];
}

export interface User {
  id: string;
  name: string;
  level: number;
  exp: number;
  streak: number;
  totalPracticeMinutes: number;
  selectedTeacher: TeacherType;
  unlockedTeachers: TeacherType[];
  achievements: string[];
  settings: UserSettings;
  createdAt: string;
}

export interface UserSettings {
  voiceEnabled: boolean;
  speechRate: number;
  notifications: boolean;
  dailyGoal: number;
}

export interface LearningRecord {
  date: string;
  practiceMinutes: number;
  speakingCount: number;
  errorStats: Record<CorrectionType, number>;
  scenariosPracticed: string[];
}

export interface DailyReport {
  date: string;
  practiceMinutes: number;
  speakingCount: number;
  errorStats: Record<CorrectionType, number>;
  suggestions: string[];
  highlights: string[];
}
