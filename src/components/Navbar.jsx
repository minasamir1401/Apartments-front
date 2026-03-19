import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Calendar, Lock, Settings, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('adminToken');

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsOpen(false);
    navigate('/');
    window.location.reload();
  };

  const links = [
    { to: "/", label: "الرئيسية", icon: <Home className="w-5 h-5" /> },
    { to: "/apartments", label: "شققنا المميزة", bold: true },
    { to: "/book", label: "احجز الآن", icon: <Calendar className="w-5 h-5" /> },
    { to: "/status", label: "متابعة حجزك" },
    { to: "/rules", label: "القواعد", small: true },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] glass h-20 flex items-center px-4 md:px-10 lg:px-20 justify-between">
        {/* Brand */}
        <Link to="/" className="text-2xl md:text-3xl font-black text-primary tracking-tighter hover:scale-105 transition-transform flex-shrink-0">
          أثـــر <span className="text-neutral-900 uppercase">Athar</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center font-medium">
          {links.map((link, idx) => (
            <Link 
              key={idx}
              to={link.to} 
              className={`hover:text-primary flex items-center gap-1 whitespace-nowrap transition-colors ${link.bold ? 'font-bold' : ''} ${link.small ? 'text-sm text-neutral-400' : ''}`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          
          {isAdmin ? (
            <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="تسجيل الخروج">
              <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <Link to="/admin/login" className="text-neutral-300 hover:text-neutral-900 ml-4 flex-shrink-0">
              <Lock className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle - Only visible when menu is CLOSED */}
        {!isOpen && (
          <button 
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 text-neutral-900 hover:text-primary transition-colors"
          >
            <Menu size={28} />
          </button>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/98 backdrop-blur-2xl z-[200] flex flex-col overflow-y-auto"
          >
            {/* Mobile Header Inside Menu */}
            <div className="h-20 flex items-center justify-between px-4">
              <span className="text-2xl font-black text-primary">أثـــر</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-white hover:text-primary transition-colors"
              >
                <X size={32} />
              </button>
            </div>

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="flex flex-col space-y-4 pt-10"
            >
              {links.map((link, idx) => (
                <Link 
                  key={idx}
                  to={link.to} 
                  onClick={() => setIsOpen(false)}
                  className={`text-white text-2xl font-bold hover:text-primary flex items-center gap-4 border-b border-white/5 pb-4 px-8 ${link.small ? 'text-lg opacity-50' : ''}`}
                >
                  {link.icon} {link.label}
                </Link>
              ))}

              <div className="px-8 space-y-6 pt-4 pb-20">
                {isAdmin ? (
                  <button 
                    onClick={handleLogout}
                    className="w-full bg-red-500/10 text-red-500 px-6 py-4 rounded-2xl flex items-center gap-3 font-bold text-xl hover:bg-red-500 hover:text-white transition-all"
                  >
                    <LogOut className="w-6 h-6" /> تسجيل الخروج
                  </button>
                ) : (
                  <Link 
                    to="/admin/login" 
                    onClick={() => setIsOpen(false)}
                    className="text-white/30 flex items-center gap-2 text-lg"
                  >
                    <Lock size={18} /> دخول المشرف
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
