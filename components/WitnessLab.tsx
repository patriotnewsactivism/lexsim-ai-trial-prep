import React, { useState, useRef, useEffect, useContext } from 'react';
import { MOCK_WITNESSES } from '../constants';
import { AppContext } from '../App';
import { generateWitnessResponse } from '../services/geminiService';
import { Message, Witness } from '../types';
import { Send, Mic, User, ShieldAlert, HeartPulse, ChevronDown } from 'lucide-react';

const WitnessLab = () => {
  const { activeCase } = useContext(AppContext);
  const [selectedWitness, setSelectedWitness] = useState<Witness>(MOCK_WITNESSES[0]);
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', sender: 'system', text: 'Simulation initialized. You may begin your examination.', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMobileWitnessSelector, setShowMobileWitnessSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Prepare history for AI
    const history = messages
      .filter(m => m.sender !== 'system')
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
    
    // Add current user message to history for the call context
    history.push({ role: 'user', parts: [{ text: userMsg.text }] });

    const responseText = await generateWitnessResponse(
      history, 
      selectedWitness.name, 
      selectedWitness.personality, 
      activeCase?.summary || "A generic legal case."
    );

    const witnessMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'witness',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, witnessMsg]);
    setIsTyping(false);
  };

  return (
    <div className="min-h-[500px] md:h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-4 md:gap-6">
      {/* Sidebar: Witness Selection */}
      <div className="w-full md:w-72 flex flex-col gap-4 bg-slate-800 border border-slate-700 rounded-xl p-4 overflow-y-auto hidden md:flex">
        <h3 className="text-white font-serif font-bold px-2">Witness List</h3>
        {MOCK_WITNESSES.map(w => (
          <button
            key={w.id}
            onClick={() => {
              setSelectedWitness(w);
              setMessages([{ id: '0', sender: 'system', text: `Simulation with ${w.name} started.`, timestamp: Date.now() }]);
            }}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${selectedWitness.id === w.id ? 'bg-slate-700 border border-gold-500/30' : 'hover:bg-slate-700/50 border border-transparent'}`}
          >
            <img src={w.avatarUrl} alt={w.name} className="w-10 h-10 rounded-full object-cover border border-slate-600" />
            <div>
              <p className="text-sm font-semibold text-white">{w.name}</p>
              <p className="text-xs text-slate-400">{w.role}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-900 border border-slate-700 rounded-xl overflow-hidden relative">
        {/* Chat Header */}
        <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center px-4 md:px-6 justify-between">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <div className="relative">
              <img src={selectedWitness.avatarUrl} alt="Active" className="w-10 h-10 rounded-full object-cover border-2 border-gold-500" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-white font-semibold truncate">{selectedWitness.name}</h2>
                <button
                  onClick={() => setShowMobileWitnessSelector(!showMobileWitnessSelector)}
                  className="md:hidden p-1 text-slate-400 hover:text-white"
                >
                  <ChevronDown size={18} />
                </button>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span className="capitalize">{selectedWitness.personality}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Credibility: {selectedWitness.credibilityScore}%</span>
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-400 text-xs">
            <div className="flex items-center gap-1">
               <HeartPulse size={14} className={selectedWitness.personality === 'Nervous' ? 'text-red-400 animate-pulse' : 'text-green-400'} />
               Stress Level
            </div>
            <div className="flex items-center gap-1">
               <ShieldAlert size={14} className={selectedWitness.personality === 'Hostile' ? 'text-red-400' : 'text-slate-500'} />
               Hostility
            </div>
          </div>
        </div>

        {/* Mobile Witness Selector Dropdown */}
        {showMobileWitnessSelector && (
          <div className="md:hidden bg-slate-800 border-b border-slate-700 max-h-64 overflow-y-auto">
            {MOCK_WITNESSES.map(w => (
              <button
                key={w.id}
                onClick={() => {
                  setSelectedWitness(w);
                  setMessages([{ id: '0', sender: 'system', text: `Simulation with ${w.name} started.`, timestamp: Date.now() }]);
                  setShowMobileWitnessSelector(false);
                }}
                className={`w-full flex items-center gap-3 p-3 border-b border-slate-700/50 transition-colors text-left ${
                  selectedWitness.id === w.id ? 'bg-slate-700' : 'hover:bg-slate-700/50'
                }`}
              >
                <img src={w.avatarUrl} alt={w.name} className="w-10 h-10 rounded-full object-cover border border-slate-600" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{w.name}</p>
                  <p className="text-xs text-slate-400">{w.role}</p>
                </div>
                {selectedWitness.id === w.id && (
                  <div className="w-2 h-2 rounded-full bg-gold-500" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 custom-scrollbar">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isSystem = msg.sender === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center">
                  <span className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full">{msg.text}</span>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 sm:px-5 py-3 ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                }`}>
                  <p className="text-sm sm:text-base leading-relaxed">{msg.text}</p>
                </div>
              </div>
            );
          })}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-none px-5 py-3 flex items-center gap-1">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-slate-800 border-t border-slate-700 p-3 md:p-4">
          <form onSubmit={handleSendMessage} className="flex gap-1 sm:gap-2 items-center bg-slate-900 border border-slate-600 rounded-xl p-1 pr-2 focus-within:border-gold-500 focus-within:ring-1 focus-within:ring-gold-500 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your question..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white px-3 md:px-4 py-3 placeholder-slate-500 text-sm sm:text-base min-h-[44px]"
              disabled={isTyping}
            />
            <button type="button" className="p-2 text-slate-400 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
              <Mic size={20} />
            </button>
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2 bg-gold-600 hover:bg-gold-500 text-slate-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WitnessLab;