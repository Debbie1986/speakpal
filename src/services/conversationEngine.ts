import { Message, Scenario, TeacherType } from '../types';
import { checkForCorrections, getEncouragement } from './correctionEngine';
import { getTeacher } from '../data/teachers';

const generateFollowUpQuestion = (scenario: Scenario, messageIndex: number): string => {
  if (messageIndex < scenario.prompts.length) {
    return scenario.prompts[messageIndex];
  }
  const followUps = [
    "That's interesting! Can you tell me more about that?",
    "Great! Do you have any other thoughts on this topic?",
    "Wonderful! What else would you like to share?",
    "Excellent! Let's keep practicing. What do you think about...?",
    "Perfect! How would you say this in a different way?",
  ];
  return followUps[Math.floor(Math.random() * followUps.length)];
};

const getGreeting = (teacher: TeacherType): string => {
  const greetings: Record<TeacherType, string> = {
    emma: "Hello, dear! I'm so excited to practice English with you today. Let's start with something fun! 😊",
    james: "Good day. I'm James, and I'll be your instructor today. Shall we begin with our lesson?",
    lily: "Hey there! I'm Lily! Let's have some fun with English today! 🎉",
    david: "Hi! I'm David. Ready to supercharge your English? Let's do this! 💪",
  };
  return greetings[teacher];
};

const getClosing = (teacher: TeacherType): string => {
  const closings: Record<TeacherType, string> = {
    emma: "That was wonderful! You're doing great! See you next time! 🌟",
    james: "Excellent work today. You've made significant progress. Until next time.",
    lily: "That was amazing! You're getting so good! Can't wait for our next session! 🌈",
    david: "Brilliant! You're absolutely crushing it! See you soon, champion! 🏆",
  };
  return closings[teacher];
};

const positiveResponses = [
  "That's great! Keep it up!",
  "Wonderful! You're improving so much!",
  "Excellent! That's very natural!",
  "Perfect! You're a star! ⭐",
  "Amazing work!",
  "That's really good!",
];

export const processUserMessage = (
  userMessage: string,
  scenario: Scenario | null,
  teacher: TeacherType,
  messageCount: number,
  isEndOfScenario: boolean = false
): Message => {
  const correction = checkForCorrections(userMessage);
  const teacherInfo = getTeacher(teacher);
  
  let aiContent: string;
  
  if (correction) {
    const gentleCorrections = [
      "Great try! But let me help you with something. ",
      "Almost there! Just one small thing. ",
      "Good effort! Here's a little tip. ",
    ];
    const gentleCorrection = gentleCorrections[Math.floor(Math.random() * gentleCorrections.length)];
    aiContent = `${gentleCorrection}${correction.explanation}\n\nYou could say: "${correction.corrected}"\n\nWould you like to try again?`;
  } else {
    const encouragement = getEncouragement();
    if (isEndOfScenario) {
      aiContent = `${encouragement} ${getClosing(teacher)}`;
    } else {
      const nextQuestion = scenario 
        ? generateFollowUpQuestion(scenario, messageCount)
        : "That's interesting! What else would you like to talk about?";
      aiContent = `${encouragement} ${nextQuestion}`;
    }
  }
  
  return {
    id: Date.now().toString(),
    role: 'ai',
    content: aiContent,
    timestamp: Date.now(),
    correction,
  };
};

export const generateScenarioIntro = (scenario: Scenario, teacher: TeacherType): Message[] => {
  const teacherInfo = getTeacher(teacher);
  const greeting = getGreeting(teacher);
  
  return [
    {
      id: (Date.now() - 2).toString(),
      role: 'ai',
      content: greeting,
      timestamp: Date.now() - 2000,
    },
    {
      id: (Date.now() - 1).toString(),
      role: 'ai',
      content: `Today we're practicing: **${scenario.titleZh}** - ${scenario.description}`,
      timestamp: Date.now() - 1000,
    },
    {
      id: Date.now().toString(),
      role: 'ai',
      content: scenario.introMessages[0],
      timestamp: Date.now(),
    },
  ];
};

export const calculateExpGain = (
  speakingCount: number,
  correctionsFixed: number,
  duration: number
): number => {
  const baseExp = speakingCount * 5;
  const correctionBonus = correctionsFixed * 10;
  const timeBonus = Math.floor(duration / 60) * 2;
  return baseExp + correctionBonus + timeBonus;
};

export const generateDailyTips = (): string => {
  const tips = [
    "💡 Try to think in English instead of translating from Chinese!",
    "📚 Reading English books can greatly improve your vocabulary.",
    "🎧 Listen to English podcasts during your commute!",
    "🗣️ Practice speaking every day, even if just for 5 minutes!",
    "📝 Keep a daily English journal to track your progress!",
    "🎬 Watch English movies with subtitles to learn natural expressions!",
    "🤝 Don't be afraid of making mistakes - they're the best teachers!",
    "⏰ Consistency is key! 30 minutes daily is better than 3 hours once a week.",
  ];
  return tips[Math.floor(Math.random() * tips.length)];
};
