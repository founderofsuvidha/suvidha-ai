import React, { useState, useRef, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import InputArea from './components/InputArea';
import MessageBubble from './components/MessageBubble';
import { Message, MessageRole, MessageType, GenerationMode } from './types';
import { generateTextResponse, generateImageResponse, generateVideoResponse } from './services/gemini';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: MessageRole.MODEL,
      type: MessageType.TEXT,
      content: "Hello! I'm Suvidha AI. I can help you with coding, generate images, or create videos. How can I assist you today?",
      timestamp: Date.now(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<GenerationMode>(GenerationMode.CHAT);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    setMessages([{
      id: Date.now().toString(),
      role: MessageRole.MODEL,
      type: MessageType.TEXT,
      content: "New chat started. How can I help you with your SaaS project today?",
      timestamp: Date.now(),
    }]);
    setMode(GenerationMode.CHAT);
  };

  const handleSend = async (text: string, currentMode: GenerationMode) => {
    const userMsgId = Date.now().toString();
    const userMessage: Message = {
      id: userMsgId,
      role: MessageRole.USER,
      type: MessageType.TEXT,
      content: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Check for low balance
    const lowBalanceMsg = (window as any).LOW_BALANCE_MSG;
    if (lowBalanceMsg) {
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: MessageRole.MODEL,
          type: MessageType.TEXT,
          content: lowBalanceMsg,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, botMessage]);
      }, 500); // Small delay to simulate response
      return;
    }

    setIsLoading(true);

    try {
      let responseContent = '';
      let responseType = MessageType.TEXT;

      if (currentMode === GenerationMode.CHAT) {
        // Prepare history for context
        const history = messages
          .filter(m => m.type === MessageType.TEXT && m.role !== MessageRole.MODEL) // Simple history filter
          .map(m => ({
            role: m.role === MessageRole.USER ? 'user' : 'model',
            parts: [{ text: m.content }]
          }));
        
        // Add current message to history context implicitly by the API or explicitly here
        // The service takes history, but we need to exclude the one we just added to state if we pass it manually
        // Actually, let's just pass the previous messages as history
        const chatHistory = messages
          .filter(m => m.type === MessageType.TEXT)
          .map(m => ({
            role: m.role === MessageRole.USER ? 'user' : 'model',
            parts: [{ text: m.content }]
          }));

        responseContent = await generateTextResponse(text, chatHistory);
        responseType = MessageType.TEXT;

      } else if (currentMode === GenerationMode.IMAGE) {
        responseContent = await generateImageResponse(text);
        responseType = MessageType.IMAGE;

      } else if (currentMode === GenerationMode.VIDEO) {
        // Notify user that video is starting
        const tempId = 'temp-video-loading';
        setMessages(prev => [...prev, {
          id: tempId,
          role: MessageRole.MODEL,
          type: MessageType.TEXT,
          content: "I'm generating your video now. This might take a minute or two...",
          timestamp: Date.now()
        }]);
        
        responseContent = await generateVideoResponse(text);
        responseType = MessageType.VIDEO;
        
        // Remove the temp message
        setMessages(prev => prev.filter(m => m.id !== tempId));
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        type: responseType,
        content: responseContent,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        type: MessageType.ERROR,
        content: error.message || "Something went wrong. Please try again.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-dark text-slate-200 font-sans">
      <Sidebar 
        onNewChat={handleNewChat} 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
      />

      <div className="flex-1 flex flex-col h-full relative w-full">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 border-b border-slate-800 bg-dark-lighter">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-slate-400 hover:text-white">
            <Menu size={24} />
          </button>
          <span className="ml-2 font-bold text-white">Suvidha AI</span>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-4xl mx-auto">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            
            {isLoading && mode !== GenerationMode.VIDEO && (
              <div className="flex justify-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce mx-0.5" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-slate-500 animate-pulse">Thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <InputArea 
          onSend={handleSend} 
          isLoading={isLoading} 
          currentMode={mode}
          onModeChange={setMode}
        />
      </div>
    </div>
  );
};

export default App;
