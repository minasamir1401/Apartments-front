import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Bot, User, Home as HomeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'مرحباً! أنا مساعدك العقاري. ما هو المكان الذي تبحث عن عقار فيه، وما هي ميزانيتك التقريبية؟' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/chatbot`, { message: userText });
      const { reply, data } = res.data;
      
      setMessages(prev => [...prev, { sender: 'bot', text: reply, data: data }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'عذراً، حدث خطأ أثناء الاتصال. يرجى المحاولة مرة أخرى لاحقاً.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} right-6 md:right-auto md:left-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-50 transition-opacity duration-300`}
        aria-label="Chat with us"
      >
        <MessageCircle size={28} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
            className="fixed bottom-6 right-6 md:right-auto md:left-6 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[80vh] bg-surface rounded-3xl shadow-2xl border border-outline/10 flex flex-col z-50 overflow-hidden"
            style={{ direction: 'rtl' }}
          >
            {/* Header */}
            <div className="bg-primary px-4 py-4 flex items-center justify-between shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight">المساعد العقاري</h3>
                  <p className="text-white/80 text-xs text-right w-full">متصل الآن</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                aria-label="Close Chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-background scroll-smooth flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-primary/20 text-primary' : 'bg-surface-low text-on-surface'}`}>
                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  
                  <div className={`max-w-[75%] rounded-2xl p-3 text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-br-sm' 
                      : 'bg-surface border border-outline/10 text-on-surface rounded-bl-sm shadow-sm'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    
                    {/* Render Recommended Properties if any */}
                    {msg.data && msg.data.length > 0 && (
                      <div className="mt-3 flex flex-col gap-2">
                        {msg.data.map(property => (
                          <div 
                            key={property._id} 
                            onClick={() => { setIsOpen(false); navigate(`/apartments/${property._id}`); }}
                            className="bg-background border border-outline/10 rounded-xl p-2 cursor-pointer hover:border-primary/50 transition-colors flex items-center gap-2"
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-surface-low flex items-center justify-center">
                              {property.images && property.images[0] ? (
                                <img 
                                  src={property.images[0].startsWith('/uploads') ? `${API_BASE}${property.images[0]}` : property.images[0]} 
                                  alt={property.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <HomeIcon size={16} className="text-on-surface-variant" />
                              )}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <h4 className="font-bold text-xs text-on-surface truncate">{property.title}</h4>
                              <p className="text-[10px] text-primary truncate font-bold">{property.price ? `${property.price}` : 'تواصل لمعرفة السعر'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {loading && (
                <div className="flex gap-2 items-center text-on-surface-variant p-2 opacity-70">
                  <div className="flex gap-1">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-current rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-current rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-current rounded-full" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-surface border-t border-outline/10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  className="w-full bg-background border border-outline/20 text-on-surface placeholder:text-on-surface/40 rounded-full py-3 pr-4 pl-12 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                  dir="rtl"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute left-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={14} className="rtl-flip translate-x-[-1px]" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
