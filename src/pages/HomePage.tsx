import { Link } from 'react-router-dom';
import { Play, Target, Clock, Flame, Zap } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import TeacherAvatar from '../components/TeacherAvatar';
import { storage } from '../utils/storage';
import { generateDailyTips } from '../services/conversationEngine';
import { useState, useEffect } from 'react';
import { User } from '../types';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [dailyTip, setDailyTip] = useState('');
  const [todayPractice, setTodayPractice] = useState(0);

  useEffect(() => {
    const userData = storage.getUser();
    setUser(userData);
    setDailyTip(generateDailyTips());
    
    const todayRecord = storage.getTodayRecord();
    setTodayPractice(todayRecord?.practiceMinutes || 0);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const progressPercent = Math.min((todayPractice / user.settings.dailyGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pb-20">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <section className="text-center py-8">
          <div className="mb-4">
            <TeacherAvatar teacherId={user.selectedTeacher} size="lg" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            你好, {user.name}! 👋
          </h2>
          <p className="text-gray-500">
            等级 {user.level} · 总经验 {user.exp}
          </p>
        </section>

        <section className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              今日目标
            </h3>
            <span className="text-sm text-gray-500">
              {todayPractice} / {user.settings.dailyGoal} 分钟
            </span>
          </div>
          
          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-orange-600">
                <Flame className="w-4 h-4" />
                <span className="font-medium">{user.streak}天</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>累计{user.totalPracticeMinutes}分钟</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <Link
            to="/practice"
            className="block bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Zap className="w-6 h-6" />
                  开始练习
                </h3>
                <p className="text-blue-100">与AI老师自由对话</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8" />
              </div>
            </div>
          </Link>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <Link
            to="/scenarios"
            className="bg-white rounded-2xl border border-gray-100 p-5 text-center hover:shadow-lg transition-all group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🎯</span>
            </div>
            <h4 className="font-semibold text-gray-900">场景练习</h4>
            <p className="text-sm text-gray-500 mt-1">10个真实场景</p>
          </Link>
          
          <Link
            to="/report"
            className="bg-white rounded-2xl border border-gray-100 p-5 text-center hover:shadow-lg transition-all group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📊</span>
            </div>
            <h4 className="font-semibold text-gray-900">学习报告</h4>
            <p className="text-sm text-gray-500 mt-1">查看进步曲线</p>
          </Link>
        </section>

        <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">每日小贴士</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{dailyTip}</p>
            </div>
          </div>
        </section>
      </main>
      
      <BottomNav />
    </div>
  );
}
