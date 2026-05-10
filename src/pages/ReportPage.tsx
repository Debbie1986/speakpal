import { useState, useEffect } from 'react';
import { BarChart3, Calendar, TrendingUp, Target } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { storage } from '../utils/storage';
import { generateSuggestions } from '../services/correctionEngine';
import { LearningRecord, CorrectionType } from '../types';

export default function ReportPage() {
  const [records, setRecords] = useState<LearningRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<LearningRecord | null>(null);

  useEffect(() => {
    const allRecords = storage.getRecords();
    const sortedRecords = allRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setRecords(sortedRecords);
    
    if (sortedRecords.length > 0) {
      setSelectedRecord(sortedRecords[0]);
    }
  }, []);

  const user = storage.getUser();
  
  const totalMinutes = records.reduce((sum, r) => sum + r.practiceMinutes, 0);
  const totalSpeaking = records.reduce((sum, r) => sum + r.speakingCount, 0);
  const avgErrorsPerDay = records.length > 0 
    ? Math.round(records.reduce((sum, r) => {
        return sum + Object.values(r.errorStats).reduce((s, v) => s + v, 0);
      }, 0) / records.length)
    : 0;

  const getSuggestions = () => {
    if (!selectedRecord) return [];
    return generateSuggestions(selectedRecord.errorStats);
  };

  const suggestions = getSuggestions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pb-20">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            学习报告
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            追踪你的学习进度，见证每一次进步
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalMinutes}</p>
            <p className="text-xs text-gray-500">总练习(分钟)</p>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalSpeaking}</p>
            <p className="text-xs text-gray-500">总开口次数</p>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">🔥</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{user.streak}</p>
            <p className="text-xs text-gray-500">连续学习</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">最近学习记录</h3>
          </div>
          
          {records.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>还没有学习记录</p>
              <p className="text-sm mt-1">开始练习后这里会显示你的学习数据</p>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {records.slice(0, 7).map(record => (
                  <button
                    key={record.date}
                    onClick={() => setSelectedRecord(record)}
                    className={`px-3 py-2 rounded-xl text-xs whitespace-nowrap transition-all ${
                      selectedRecord?.date === record.date
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <p className="font-medium">
                      {new Date(record.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xs opacity-80">{record.practiceMinutes}分钟</p>
                  </button>
                ))}
              </div>

              {selectedRecord && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-2xl font-bold text-gray-900">{selectedRecord.practiceMinutes}</p>
                      <p className="text-xs text-gray-500">练习分钟</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-2xl font-bold text-gray-900">{selectedRecord.speakingCount}</p>
                      <p className="text-xs text-gray-500">开口次数</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {Object.values(selectedRecord.errorStats).reduce((s, v) => s + v, 0)}
                      </p>
                      <p className="text-xs text-gray-500">错误次数</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">错误类型分布</h4>
                    <div className="space-y-2">
                      {(Object.entries(selectedRecord.errorStats) as [CorrectionType, number][])
                        .filter(([, count]) => count > 0)
                        .map(([type, count]) => (
                          <div key={type} className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 w-16">
                              {type === 'grammar' ? '语法' : 
                               type === 'vocabulary' ? '词汇' :
                               type === 'pronunciation' ? '发音' :
                               type === 'tense' ? '时态' : '表达'}
                            </span>
                            <div className="flex-1 bg-gray-100 rounded-full h-2">
                              <div 
                                className="bg-blue-500 rounded-full h-2 transition-all"
                                style={{ width: `${Math.min(count * 10, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-8">{count}</span>
                          </div>
                        ))}
                      {Object.values(selectedRecord.errorStats).every(v => v === 0) && (
                        <p className="text-sm text-green-600">🎉 太棒了！今天没有错误！</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-2xl border border-blue-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-xl">💡</span>
              Emma 的建议
            </h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <p key={index} className="text-sm text-gray-700 leading-relaxed">
                  {suggestion}
                </p>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <BottomNav />
    </div>
  );
}
