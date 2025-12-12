import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Format time
  const timeString = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border shadow-sm ${
          isUser 
            ? 'bg-slate-200 border-slate-300 text-slate-600' 
            : 'bg-indigo-900 border-indigo-700 text-indigo-100'
        }`}>
          {isUser ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          ) : (
            // Compass / Wisdom Icon representation
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z"/></svg>
          )}
        </div>

        {/* Bubble */}
        <div className={`relative px-5 py-3.5 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${
          isUser
            ? 'bg-white text-slate-800 rounded-br-none border border-slate-200'
            : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
        }`}>
          {!isUser && (
            <div className="absolute -top-3 left-4 text-[10px] font-bold text-indigo-800 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Mentor
            </div>
          )}
          
          <div className="whitespace-pre-wrap font-medium">
             {/* Markdown-like formatting for bold text if the model returns it */}
             {message.text.split('**').map((part, i) => 
                i % 2 === 1 ? <strong key={i} className="text-slate-900 font-bold">{part}</strong> : part
             )}
          </div>
          
          <div className={`text-[10px] mt-2 opacity-50 ${isUser ? 'text-right' : 'text-left'}`}>
            {timeString}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MessageBubble;