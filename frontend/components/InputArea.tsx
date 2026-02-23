import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Video, MessageSquare, Loader2 } from 'lucide-react';
import { GenerationMode } from '../types';

interface InputAreaProps {
  onSend: (text: string, mode: GenerationMode) => void;
  isLoading: boolean;
  currentMode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading, currentMode, onModeChange }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input, currentMode);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getPlaceholder = () => {
    switch (currentMode) {
      case GenerationMode.IMAGE: return "Describe the image you want to create...";
      case GenerationMode.VIDEO: return "Describe the video you want to generate (may take a minute)...";
      default: return "Ask Suvidha AI anything about coding or SaaS...";
    }
  };

  return (
    <div className="border-t border-slate-800 bg-dark p-4 pb-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Mode Selector */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          <button
            onClick={() => onModeChange(GenerationMode.CHAT)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              currentMode === GenerationMode.CHAT 
                ? 'bg-primary/20 text-primary border border-primary/50' 
                : 'bg-slate-800 text-slate-400 border border-transparent hover:bg-slate-700'
            }`}
          >
            <MessageSquare size={14} /> Chat
          </button>
          <button
            onClick={() => onModeChange(GenerationMode.IMAGE)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              currentMode === GenerationMode.IMAGE 
                ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50' 
                : 'bg-slate-800 text-slate-400 border border-transparent hover:bg-slate-700'
            }`}
          >
            <ImageIcon size={14} /> Create Image
          </button>
          <button
            onClick={() => onModeChange(GenerationMode.VIDEO)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              currentMode === GenerationMode.VIDEO 
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' 
                : 'bg-slate-800 text-slate-400 border border-transparent hover:bg-slate-700'
            }`}
          >
            <Video size={14} /> Create Video
          </button>
        </div>

        {/* Input Field */}
        <div className="relative flex items-end gap-2 bg-slate-900/50 border border-slate-700 rounded-xl p-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            className="w-full bg-transparent text-slate-200 placeholder-slate-500 text-sm md:text-base resize-none focus:outline-none max-h-[120px] py-2 px-2"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-2 rounded-lg mb-0.5 transition-all ${
              !input.trim() || isLoading
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-blue-600 shadow-lg shadow-blue-900/20'
            }`}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        
        <div className="text-center mt-2">
          <p className="text-[10px] text-slate-600">
            Suvidha AI can make mistakes. Please verify important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
