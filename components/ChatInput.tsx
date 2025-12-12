import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim() && !isLoading) {
      onSend(text);
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  return (
    <div className="bg-slate-50 border-t border-slate-200 p-4 sticky bottom-0 z-20">
      <div className="max-w-4xl mx-auto relative flex items-end gap-3 bg-white p-2 rounded-3xl border border-slate-300 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all shadow-sm">
        
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Seek clarity..."
          className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 py-3 px-4 text-slate-700 placeholder:text-slate-400 font-sans"
          rows={1}
          disabled={isLoading}
        />

        <button
          onClick={() => handleSubmit()}
          disabled={!text.trim() || isLoading}
          className={`mb-1 p-3 rounded-full flex items-center justify-center transition-all duration-200 ${
            text.trim() && !isLoading
              ? 'bg-slate-800 text-white shadow-md hover:bg-slate-700 hover:scale-105 active:scale-95'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
          aria-label="Send message"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          )}
        </button>
      </div>
      <div className="text-center mt-3">
         <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Synthesized Wisdom &bull; Principles &bull; Clarity</span>
      </div>
    </div>
  );
};

export default ChatInput;