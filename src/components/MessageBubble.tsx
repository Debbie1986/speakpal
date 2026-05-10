import { Message } from '../types';
import CorrectionCard from './CorrectionCard';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] md:max-w-[70%] ${
          isUser 
            ? 'order-2' 
            : 'order-1'
        }`}
      >
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md'
              : 'bg-white border border-gray-100 text-gray-800 rounded-bl-md shadow-sm'
          }`}
        >
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          
          {message.content.includes('**') && (
            <p className="mt-2 text-sm opacity-80">
              💡 点击下方开始练习！
            </p>
          )}
        </div>
        
        {message.correction && (
          <CorrectionCard correction={message.correction} />
        )}
        
        <p className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
}
