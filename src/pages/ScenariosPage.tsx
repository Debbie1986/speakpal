import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { scenarios, categories } from '../data/scenarios';
import { ScenarioCategory } from '../types';

export default function ScenariosPage() {
  const [selectedCategory, setSelectedCategory] = useState<ScenarioCategory | 'all'>('all');

  const filteredScenarios = selectedCategory === 'all' 
    ? scenarios 
    : scenarios.filter(s => s.category === selectedCategory);

  const difficultyLabels = {
    beginner: { text: '初级', color: 'bg-green-100 text-green-700' },
    intermediate: { text: '中级', color: 'bg-amber-100 text-amber-700' },
    advanced: { text: '高级', color: 'bg-red-100 text-red-700' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pb-20">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            场景练习
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            选择一个场景，与AI老师进行针对性练习
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            全部场景
          </button>
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.value
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredScenarios.map(scenario => {
            const difficulty = difficultyLabels[scenario.difficulty];
            
            return (
              <Link
                key={scenario.id}
                to={`/practice/${scenario.id}`}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {scenario.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {scenario.titleZh}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${difficulty.color}`}>
                        {difficulty.text}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{scenario.title}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{scenario.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {scenario.keywords.slice(0, 3).map(keyword => (
                        <span key={keyword} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}
