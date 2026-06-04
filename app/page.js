"use client";
import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function GeminiChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'أهلاً بك! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // التأكد من وجود مفتاح الـ API
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key غير موجود");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(input);
      const response = await result.response.text();

      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "حدث خطأ في الاتصال، تأكدي من إعدادات الـ API Key في Vercel." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen max-w-2xl mx-auto p-4 bg-white shadow-lg">
      <h1 className="text-xl font-bold p-4 border-b">Gemini Smart Assistant</h1>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex gap-2">
        <input 
          className="flex-1 border p-3 rounded-full focus:outline-none" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="اكتبي رسالتك هنا..."
          aria-label="مربع إدخال الرسالة"
        />
        <button 
          className="p-3 bg-blue-600 text-white rounded-full disabled:bg-gray-400" 
          onClick={handleSend}
          disabled={isLoading}
          aria-label="إرسال"
        >
          {isLoading ? "..." : "إرسال"}
        </button>
      </div>
    </main>
  );
}
