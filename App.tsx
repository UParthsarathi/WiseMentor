import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, INITIAL_MESSAGE } from './types';
import { sendMessageStream, initializeChat } from './services/geminiService';
import MessageBubble from './components/MessageBubble';
import ChatInput from './components/ChatInput';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat service on mount
  useEffect(() => {
    try {
      initializeChat();
    } catch (e) {
      console.error("Failed to init chat", e);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date(),
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Create a placeholder for the bot response
      const botMessageId = (Date.now() + 1).toString();
      const botMessagePlaceholder: Message = {
        id: botMessageId,
        role: 'model',
        text: '',
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, botMessagePlaceholder]);

      let fullResponse = "";
      
      const stream = sendMessageStream(text);

      for await (const chunk of stream) {
        fullResponse += chunk;
        
        // Update the specific bot message in the state
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === botMessageId 
              ? { ...msg, text: fullResponse } 
              : msg
          )
        );
      }
      
      // Finalize the message
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === botMessageId 
            ? { ...msg, isStreaming: false } 
            : msg
        )
      );

    } catch (error) {
      console.error("Chat error:", error);
      // Add error message from system
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'model',
        text: "I am unable to process your request at this moment. Please try again shortly.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Header */}
      <header className="flex-none bg-white border-b border-slate-200 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-800 rounded-md flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
             </div>
             <div>
               <h1 className="text-xl font-semibold tracking-tight text-slate-800 serif-font">Wise Mentor</h1>
               <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Rationality &bull; Balance &bull; Insight</p>
             </div>
          </div>
        </div>
      </header>

      {/* Background Decorative Elements (Subtle & Clean) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-[20%] -left-[10%] w-[400px] h-[400px] bg-slate-100 rounded-full blur-3xl opacity-80"></div>
      </div>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto z-10 p-4 md:p-6 scroll-smooth">
        <div className="max-w-4xl mx-auto flex flex-col min-h-full">
          
          <div className="flex-1">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex w-full mb-6 justify-start">
                 <div className="flex items-end gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center text-indigo-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm">
                       <div className="flex gap-1.5">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></span>
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></span>
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></span>
                       </div>
                    </div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>
      </main>

      {/* Footer / Input */}
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;