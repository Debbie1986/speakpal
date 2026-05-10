import { useState, useEffect } from 'react';
import { User, Settings, Award, Shield, Bell } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import TeacherAvatar from '../components/TeacherAvatar';
import { storage } from '../utils/storage';
import { teachers } from '../data/teachers';
import { User as UserType, TeacherType } from '../types';

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [settings, setSettings] = useState({
    voiceEnabled: true,
    speechRate: 1,
    notifications: true,
    dailyGoal: 15,
  });

  useEffect(() => {
    const userData = storage.getUser();
    setUser(userData);
    setSettings(userData.settings);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleSettingChange = (key: string, value: boolean | number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    storage.updateUser({ settings: newSettings });
  };

  const handleTeacherSelect = (teacherId: TeacherType) => {
    if (user.unlockedTeachers.includes(teacherId)) {
      storage.updateUser({ selectedTeacher: teacherId });
      setUser({ ...user, selectedTeacher: teacherId });
    }
  };

  const achievements = [
    { id: 'first-practice', name: '初学者', desc: '完成首次对话', unlocked: user.achievements.includes('first-practice') || user.totalPracticeMinutes > 0 },
    { id: 'week-streak', name: '连续7天', desc: '连续学习一周', unlocked: user.achievements.includes('week-streak') || user.streak >= 7 },
    { id: 'correction-master', name: '纠错达人', desc: '正确改错20次', unlocked: user.achievements.includes('correction-master') },
    { id: 'month-master', name: '口语达人', desc: '连续30天', unlocked: user.achievements.includes('month-master') || user.streak >= 30 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pb-20">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center py-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <div className="mt-2 inline-flex items-center gap-2 px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            <Award className="w-4 h-4" />
            等级 {user.level}
          </div>
          
          <div className="mt-4 max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>经验值</span>
              <span>{user.exp} / {user.level * 100}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                style={{ width: `${(user.exp / (user.level * 100)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl">👩‍🏫</span>
            选择老师
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {(Object.values(teachers) as typeof teachers[keyof typeof teachers][]).map(teacher => {
              const isUnlocked = user.unlockedTeachers.includes(teacher.id);
              const isSelected = user.selectedTeacher === teacher.id;
              
              return (
                <button
                  key={teacher.id}
                  onClick={() => handleTeacherSelect(teacher.id)}
                  disabled={!isUnlocked}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : isUnlocked
                      ? 'border-gray-200 hover:border-gray-300'
                      : 'border-gray-200 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${teacher.bgColor} flex items-center justify-center text-2xl ${!isUnlocked ? 'grayscale' : ''}`}>
                      {teacher.id === 'emma' ? '👩‍🏫' : teacher.id === 'james' ? '👨‍🏫' : teacher.id === 'lily' ? '👩‍💼' : '👨‍💻'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{teacher.name}</p>
                      <p className="text-xs text-gray-500">{teacher.nameZh}</p>
                      {!isUnlocked && (
                        <span className="text-xs text-orange-600">🔒 未解锁</span>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-600">{teacher.personality}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            设置
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">每日提醒</p>
                  <p className="text-xs text-gray-500">提醒你每天练习</p>
                </div>
              </div>
              <button
                onClick={() => handleSettingChange('notifications', !settings.notifications)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.notifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    settings.notifications ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🎤</span>
                <div>
                  <p className="font-medium text-gray-900">语音朗读</p>
                  <p className="text-xs text-gray-500">老师用语音回复</p>
                </div>
              </div>
              <button
                onClick={() => handleSettingChange('voiceEnabled', !settings.voiceEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.voiceEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    settings.voiceEnabled ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">⏱️</span>
                <div>
                  <p className="font-medium text-gray-900">每日目标</p>
                  <p className="text-xs text-gray-500">设定每天练习时间</p>
                </div>
              </div>
              <div className="flex gap-2">
                {[10, 15, 20, 30].map(mins => (
                  <button
                    key={mins}
                    onClick={() => handleSettingChange('dailyGoal', mins)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      settings.dailyGoal === mins
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {mins}分钟
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-600" />
            成就
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 ${
                  achievement.unlocked
                    ? 'border-amber-300 bg-amber-50'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{achievement.unlocked ? '🏆' : '🔒'}</span>
                  <span className="font-semibold text-gray-900">{achievement.name}</span>
                </div>
                <p className="text-xs text-gray-500">{achievement.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <BottomNav />
    </div>
  );
}
