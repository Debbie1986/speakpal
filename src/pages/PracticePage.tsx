import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import TeacherAvatar from '../components/TeacherAvatar';
import MessageBubble from '../components/MessageBubble';
import InputArea from '../components/InputArea';
import { storage } from '../utils/storage';
import { processUserMessage, generateScenarioIntro, calculateExpGain } from '../services/conversationEngine';
import { getScenarioById } from '../data/scenarios';
import { Message, TeacherType, CorrectionType, LearningRecord } from '../types';

export default function PracticePage() {
  const navigate = useNavigate();
  const { scenarioId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [teacherId, setTeacherId] = useState<TeacherType>('emma');
  const [isLoading, setIsLoading] = useState(true);
  const [speakingCount, setSpeakingCount] = useState(0);
  const [correctionsFixed, setCorrectionsFixed] = useState(0);
  const [errorStats, setErrorStats] = useState<Record<CorrectionType, number>>({
    grammar: 0,
    vocabulary: 0,
    pronunciation: 0,
    tense: 0,
    style: 0,
  });
  const [startTime] = useState(Date.now());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = storage.getUser();
    setTeacherId(user.selectedTeacher);
    
    const scenario = scenarioId ? getScenarioById(scenarioId) : null;
    
    if (scenario) {
      const introMessages = generateScenarioIntro(scenario, user.selectedTeacher);
      setMessages(introMessages);
    } else {
      const greeting = getFreeChatGreeting(user.selectedTeacher);
      setMessages([greeting]);
    }
    
    setIsLoading(false);
  }, [scenarioId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getFreeChatGreeting = (teacher: TeacherType): Message => {
    const greetings: Record<TeacherType, string> = {
      emma: "Hello! I'm so happy to see you today! What would you like to talk about? We could practice everyday conversations, or I could help you with something specific. 😊",
      james: "Good day. I'm ready to assist you with your English practice. What topic would you like to explore today?",
      lily: "Hey! Ready for some fun English practice? Just tell me anything - we can chat about movies, food, travel... whatever you like! 🎉",
      david: "Hi there! Let's have an awesome English session! What's on your mind today? I'm all ears! 💪",
    };
    
    return {
      id: '1',
      role: 'ai',
      content: greetings[teacher],
      timestamp: Date.now(),
    };
  };

  const handleSendMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setSpeakingCount((prev) => prev + 1);

    const scenario = scenarioId ? getScenarioById(scenarioId) : null;
    const aiResponse = processUserMessage(
      text,
      scenario,
      teacherId,
      messages.length,
      false
    );

    setTimeout(() => {
      setMessages((prev) => [...prev, aiResponse]);
      
      if (aiResponse.correction) {
        setCorrectionsFixed((prev) => prev + 1);
        setErrorStats((prev) => ({
          ...prev,
          [aiResponse.correction!.type]: prev[aiResponse.correction!.type] + 1,
        }));
      }
    }, 800);
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      const durationMinutes = Math.floor((Date.now() - startTime) / 60000);
      if (durationMinutes > 0) {
        const today = new Date().toISOString().split('T')[0];
        const record: LearningRecord = {
          date: today,
          practiceMinutes: durationMinutes,
          speakingCount,
          errorStats,
          scenariosPracticed: scenarioId ? [scenarioId] : ['free-chat'],
        };
        storage.saveRecord(record);
        
        const user = storage.getUser();
        storage.updateUser({
          totalPracticeMinutes: user.totalPracticeMinutes + durationMinutes,
        });
        
        const expGain = calculateExpGain(speakingCount, correctionsFixed, durationMinutes * 60000);
        storage.addExp(expGain);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [speakingCount, correctionsFixed, errorStats, startTime, scenarioId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const scenario = scenarioId ? getScenarioById(scenarioId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex flex-col">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="font-semibold text-gray-900">
                  {scenario ? scenario.titleZh : '自由对话'}
                </h1>
                <p className="text-xs text-gray-500">
                  {scenario ? scenario.title : 'Free Chat'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="hidden lg:flex lg:w-80 flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white border-r border-gray-100">
          <TeacherAvatar teacherId={teacherId} size="lg" mood="speaking" />
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              {scenario ? '场景练习' : '自由对话模式'}
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span>💬 {speakingCount} 句</span>
              <span>✨ {correctionsFixed} 次纠正</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 pb-2">
            <div className="max-w-3xl mx-auto space-y-2">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="lg:hidden p-4 border-t border-gray-100 bg-white">
            <div className="flex items-center justify-center gap-4 mb-3 text-xs text-gray-500">
              <span>💬 {speakingCount} 句</span>
              <span>✨ {correctionsFixed} 次纠正</span>
            </div>
          </div>

          <InputArea onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
