'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    sender: 'bot',
    text: 'Hello! I am DevZite AI. Ask me about our services, pricing estimates, tech stack, or project timelines.',
  },
];

const PRESET_QUESTIONS = [
  'How much does a Next.js website cost?',
  'What is your typical project timeline?',
  'Do you build Android native apps?',
  'How do AI video pipelines work?',
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Generate automated response
    setTimeout(() => {
      let reply = 'Thank you for asking! For custom requirements, you can fill out our project brief form or email hello@devzite.com.';
      const q = query.toLowerCase();

      if (q.includes('cost') || q.includes('price') || q.includes('pricing')) {
        reply = 'Our project pricing starts at $4.5k for AI Videos, $6.5k for custom Next.js 15 websites, and $12k for full-stack SaaS platforms. Try our Interactive Pricing page for instant estimates!';
      } else if (q.includes('timeline') || q.includes('time') || q.includes('long')) {
        reply = 'Custom websites typically take 3-4 weeks, SaaS platforms take 6-8 weeks, and AI video pipelines deliver in under 48 hours.';
      } else if (q.includes('android') || q.includes('mobile')) {
        reply = 'Yes! We build native Android applications focusing on 60fps animations, Kotlin Clean Architecture, and offline-first Firebase synchronization.';
      } else if (q.includes('ai video') || q.includes('video')) {
        reply = 'Our AI video workflow converts text prompts into cinematic storyboards, realistic voiceovers, and 4K final renders in 7 automated steps.';
      }

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'bot', text: reply },
      ]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[350]">
      {/* Trigger Orb Button */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-[#3B82F6] text-white flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-[rgba(255,255,255,0.2)]"
        aria-label="Open AI Assistant"
      >
        {isOpen ? <X size={22} /> : <Bot size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-18 right-0 w-[360px] sm:w-[400px] h-[480px] rounded-3xl glass-strong border border-[rgba(255,255,255,0.12)] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(59,130,246,0.1)] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center text-white">
                <Sparkles size={16} />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-[#F8FAFC]">DevZite AI Lead Assistant</h4>
                <span className="text-[10px] font-mono text-[#06B6D4]">● Online · Instant Guidance</span>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 font-body text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      m.sender === 'user'
                        ? 'bg-[#3B82F6] text-white rounded-br-none'
                        : 'glass text-[#F8FAFC] border border-[rgba(255,255,255,0.08)] rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Presets */}
            <div className="p-2 border-t border-[rgba(255,255,255,0.06)] flex gap-1.5 overflow-x-auto no-scrollbar">
              {PRESET_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="px-2.5 py-1 rounded-full text-[10px] font-mono glass text-[#94A3B8] hover:text-[#F8FAFC] shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="p-3 border-t border-[rgba(255,255,255,0.08)] flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about pricing, timelines, tech..."
                className="flex-1 px-3 py-2 rounded-xl glass text-xs text-[#F8FAFC] placeholder-[#64748B] outline-none"
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-xl bg-[#3B82F6] text-white flex items-center justify-center shrink-0"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
