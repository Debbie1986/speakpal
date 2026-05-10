import { TeacherType } from '../types';
import { getTeacher } from '../data/teachers';

interface TeacherAvatarProps {
  teacherId: TeacherType;
  mood?: 'happy' | 'thinking' | 'speaking' | 'encouraging';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const moodEmojis = {
  happy: ['😊', '😄', '🙂'],
  thinking: ['🤔', '💭', '🤨'],
  speaking: ['🗣️', '👄', '💬'],
  encouraging: ['💪', '🌟', '✨'],
};

export default function TeacherAvatar({ 
  teacherId, 
  mood = 'happy', 
  size = 'md',
  className = '' 
}: TeacherAvatarProps) {
  const teacher = getTeacher(teacherId);
  const emojis = moodEmojis[mood];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  
  const sizeClasses = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-20 h-20 text-3xl',
    lg: 'w-32 h-32 text-5xl',
  };

  const teacherAvatars: Record<TeacherType, string> = {
    emma: '👩‍🏫',
    james: '👨‍🏫',
    lily: '👩‍💼',
    david: '👨‍💻',
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full ${teacher.bgColor} flex items-center justify-center shadow-lg border-4 border-white transition-all duration-500`}
        style={{
          boxShadow: `0 10px 40px -10px ${teacher.bgColor.replace('bg-', 'rgba(').replace('-100', ', 0.3)')}`,
        }}
      >
        <span className="select-none">{teacherAvatars[teacherId]}</span>
      </div>
      
      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md border-2 border-gray-100 animate-bounce">
        <span className="text-lg">{emoji}</span>
      </div>

      <div className="mt-3 text-center">
        <p className={`font-semibold ${teacher.color}`}>{teacher.name}</p>
        <p className="text-xs text-gray-500">{teacher.nameZh}</p>
      </div>
    </div>
  );
}
