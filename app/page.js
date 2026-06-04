"use client";
import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function GeminiChat() {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // إضافة رسالة المستخدم للسجل
    const userMessage = { role: 'user', text: input };
    setChatHistory(prev => [...prev, userMessage]);

    try {
      // الاتصال بـ Gemini باستخدام المفتاح المضاف في Vercel
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(input);
      const response = await result.response.text();

      // إضافة رد Gemini للسجل
      setChatHistory(prev => [...prev, { role: 'gemini', text: response }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'gemini', text: "عذراً، حدث خطأ في الاتصال. تأكدي من إعدادات الـ API." }]);
    }
    
    setInput('');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gemini Smart Assistant</h1>
      
      <div className="h-96 overflow-y-auto border p-4 mb-4 bg-gray-50 rounded">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-200'}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <textarea 
          className="border p-2 w-full rounded" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="اسألني أي شيء..."
          aria-label="اكتب رسالتك"
        />
        <button 
          className="bg-blue-500 text-white p-2 rounded" 
          onClick={handleSend}
          aria-label="إرسال"
        >
          إرسال
        </button>
      </div>
    </div>
  );
}
