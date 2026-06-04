"use client";
import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, Bot, User, Loader2 } from 'lucide-react'; // تأكدي من تثبيت lucide-react

export default function GeminiChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'أهلاً بك! أنا مساعدك الذكي Gemini. كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(input);
      const response = await result.response.text();

      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "عذراً، حدث خطأ في الاتصال. تأكدي من إعدادات الـ API." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4 bg-white shadow-lg">
      <h1 className="text-xl font-bold p-4 border-b">Gemini Smart Assistant</h1>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className="p-2 rounded-full bg-gray-100">
              {msg.role === 'user' ? <User size={20}/> : <Bot size={20}/>}
            </div>
            <div className={`p-3 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && <Loader2 className="animate-spin text-blue-500" />}
      </div>

      <div className="p-4 border-t flex gap-2">
        <input 
          className="flex-1 border p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="اكتب رسالتك هنا..."
          aria-label="مربع إدخال الرسالة"
        />
        <button 
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400" 
          onClick={handleSend}
          disabled={isLoading}
          aria-label="إرسال الرسالة"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
}
