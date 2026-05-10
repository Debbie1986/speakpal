import { useState, useRef } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

interface InputAreaProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function InputArea({ onSend, disabled }: InputAreaProps) {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('您的浏览器不支持语音识别功能，请使用Chrome浏览器');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.log('语音识别错误:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (input.trim()) {
        onSend(input.trim());
        setInput('');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 bg-white">
      <div className="flex items-center gap-3 max-w-4xl mx-auto">
        <button
          type="button"
          onClick={isRecording ? stopVoiceInput : startVoiceInput}
          disabled={disabled}
          className={`p-3 rounded-full transition-all duration-300 ${
            isRecording
              ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200'
              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isRecording ? '正在聆听...' : '输入英语消息...'}
          disabled={disabled || isRecording}
          className="flex-1 px-5 py-3 bg-gray-50 border border-gray-200 rounded-full text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all disabled:opacity-50"
        />
        
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className={`p-3 rounded-full transition-all duration-300 ${
            input.trim() && !disabled
              ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      
      {isRecording && (
        <div className="text-center mt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-red-50 text-red-600 rounded-full text-sm">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            正在聆听...
          </div>
        </div>
      )}
    </form>
  );
}
