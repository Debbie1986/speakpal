import { User, LearningRecord, TeacherType } from '../types';
import { teachers } from '../data/teachers';

const STORAGE_KEYS = {
  USER: 'speakpal_user',
  RECORDS: 'speakpal_records',
  SETTINGS: 'speakpal_settings',
} as const;

const createDefaultUser = (): User => ({
  id: 'user_' + Date.now(),
  name: '学习者',
  level: 1,
  exp: 0,
  streak: 0,
  totalPracticeMinutes: 0,
  selectedTeacher: 'emma',
  unlockedTeachers: ['emma'],
  achievements: [],
  settings: {
    voiceEnabled: true,
    speechRate: 1,
    notifications: true,
    dailyGoal: 15,
  },
  createdAt: new Date().toISOString(),
});

export const storage = {
  getUser: (): User => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (data) {
        return JSON.parse(data) as User;
      }
    } catch {
      // ignore
    }
    const defaultUser = createDefaultUser();
    storage.setUser(defaultUser);
    return defaultUser;
  },

  setUser: (user: User): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('保存用户数据失败:', error);
    }
  },

  updateUser: (updates: Partial<User>): User => {
    const user = storage.getUser();
    const updatedUser = { ...user, ...updates };
    storage.setUser(updatedUser);
    return updatedUser;
  },

  addExp: (amount: number): User => {
    const user = storage.getUser();
    let newExp = user.exp + amount;
    let newLevel = user.level;
    
    while (newExp >= newLevel * 100) {
      newExp -= newLevel * 100;
      newLevel++;
    }
    
    return storage.updateUser({ exp: newExp, level: newLevel });
  },

  getRecords: (): LearningRecord[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
      return data ? JSON.parse(data) as LearningRecord[] : [];
    } catch {
      return [];
    }
  },

  saveRecord: (record: LearningRecord): void => {
    try {
      const records = storage.getRecords();
      const existingIndex = records.findIndex((r) => r.date === record.date);
      
      if (existingIndex >= 0) {
        records[existingIndex] = record;
      } else {
        records.push(record);
      }
      
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    } catch (error) {
      console.error('保存学习记录失败:', error);
    }
  },

  getTodayRecord: (): LearningRecord | null => {
    const today = new Date().toISOString().split('T')[0];
    const records = storage.getRecords();
    return records.find((r) => r.date === today) || null;
  },

  updateStreak: (): void => {
    const user = storage.getUser();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const records = storage.getRecords();
    
    const practicedToday = records.some((r) => r.date === today);
    const practicedYesterday = records.some((r) => r.date === yesterday);
    
    if (practicedToday) {
      if (practicedYesterday || user.streak === 0) {
        storage.updateUser({ streak: user.streak + 1 });
      }
    }
  },

  unlockTeacher: (teacherId: TeacherType): boolean => {
    const user = storage.getUser();
    if (!user.unlockedTeachers.includes(teacherId)) {
      const updated = storage.updateUser({
        unlockedTeachers: [...user.unlockedTeachers, teacherId],
      });
      return true;
    }
    return false;
  },

  addAchievement: (achievementId: string): boolean => {
    const user = storage.getUser();
    if (!user.achievements.includes(achievementId)) {
      storage.updateUser({
        achievements: [...user.achievements, achievementId],
      });
      return true;
    }
    return false;
  },
};

export default storage;
