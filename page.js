"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Copy, Check } from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "أهلاً بك! أنا مساعدك الذكي المتطور المدعوم بـ Gemini. كيف يمكنني مساعدتك اليوم؟" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: `هذه محاكاة استجابة ذكية متطورة لرسالتك: "${userMessage}". تطبيقك يعمل الآن بنجاح على الواجهة الحديثة!` }
        ]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", text: "عذراً، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي." }]);
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans" dir="rtl">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/30">
            <Sparkles size={22} className="animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-lg bg-gradient-to-l from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Gemini Smart Assistant</h1>
            <p className="text-xs text-slate-400 flex items-center gap-1">المساعد الذكي المتطور <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-ping"></span></p>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-4xl w-full mx-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-4 ${msg.role === "user" ? "justify-start flex-row-reverse" : "justify-start"}`}>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${msg.role === "user" ? "bg-cyan-600 text-white" : "bg-slate-800 text-indigo-400 border border-slate-700"}`}>
              {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className={`relative max-w-[80%] rounded-2xl px-4 py-3 text-sm md:text-base shadow-sm group transition-all duration-200 ${msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-none" : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"}`}>
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              
              {msg.role === "assistant" && (
                <button 
                  onClick={() => copyToClipboard(msg.text, index)}
                  className="absolute left-2 bottom-2 p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="نسخ النص"
                >
                  {copiedIndex === index ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4 justify-start">
            <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 text-indigo-400 flex items-center justify-center shadow-md">
              <Bot size={20} />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="border-t border-slate-800 bg-slate-900/30 p-4 sticky bottom-0 backdrop-blur">
        <form onSubmit={handleSend} className="max-w-4xl w-full mx-auto flex gap-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب رسالتك الذكية هنا..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-sm md:text-base focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-100 placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white disabled:text-slate-600 p-2.5 rounded-lg transition-all shadow-md active:scale-95"
          >
            <Send size={18} className="transform rotate-180" />
          </button>
        </form>
      </footer>
    </div>
  );
}
