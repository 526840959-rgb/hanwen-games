import React, { useState, useRef, useEffect } from 'react';
import { sendGeminiMessage } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '你好！我是你的洛托姆AI助手。有什么关于战斗的疑问，或者是想让我分析宝可梦图片吗洛托？' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: input,
      image: selectedImage || undefined,
      isThinking: isThinkingMode
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // Call Gemini API
      // We pass previous messages for context, but limit them to avoid token limits in this demo
      const recentHistory = messages.slice(-6); 
      const responseText = await sendGeminiMessage(recentHistory, userMsg.text, userMsg.image, isThinkingMode);

      setMessages(prev => [...prev, {
        role: 'model',
        text: responseText
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'model',
        text: '抱歉，连接出错了洛托...'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white text-slate-800 w-80 md:w-96 h-[500px] rounded-xl shadow-2xl flex flex-col overflow-hidden mb-4 border border-slate-300">
          {/* Header */}
          <div className="bg-red-500 p-3 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <span className="material-icons text-sm">smart_toy</span>
              <span className="font-bold">洛托姆 AI 助手</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-red-600 rounded p-1">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg p-3 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                }`}>
                  {msg.image && (
                    <img src={msg.image} alt="Uploaded" className="w-full h-auto rounded mb-2 border border-white/20" />
                  )}
                  {msg.isThinking && (
                    <div className="text-xs opacity-75 mb-1 flex items-center gap-1">
                       <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                       深度思考模式
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 text-gray-500 rounded-lg p-3 text-xs italic flex items-center gap-2">
                  <span className="animate-spin h-3 w-3 border-2 border-gray-500 border-t-transparent rounded-full"></span>
                  洛托姆正在思考中...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-200">
            {/* Tools */}
            <div className="flex items-center gap-2 mb-2">
              <label className={`cursor-pointer text-xs px-2 py-1 rounded flex items-center gap-1 border transition-colors ${
                  isThinkingMode ? 'bg-purple-100 border-purple-400 text-purple-700' : 'bg-gray-100 border-gray-300 text-gray-600'
                }`}>
                <input 
                  type="checkbox" 
                  checked={isThinkingMode} 
                  onChange={(e) => setIsThinkingMode(e.target.checked)} 
                  className="hidden"
                />
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                深度思考
              </label>

              <label className="cursor-pointer text-xs px-2 py-1 rounded bg-gray-100 border border-gray-300 text-gray-600 flex items-center gap-1 hover:bg-gray-200">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                图片分析
              </label>
              
              {selectedImage && (
                <span className="text-xs text-green-600 truncate max-w-[100px]">已选择图片</span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="询问战术或上传图片..."
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 disabled:opacity-50 text-sm font-bold"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 border-4 border-white"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;