import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Calendar, Lock, Settings, Menu, X, LogOut, 
  Phone, Search, Building2, Info, Globe, Sun, Moon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    setIsAdmin(!!adminToken);

    // Apply theme on mount and changes
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', i18n.language);
    document.body.dir = dir;
  }, [i18n.language]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsOpen(false);
    navigate('/');
    window.location.reload();
  };

  const navLinks = [
    { to: "/", label: t('nav_home'), icon: <Home size={18} /> },
    { to: "/apartments", label: t('nav_explore'), icon: <Search size={18} /> },
    { to: "/projects", label: t('our_projects'), icon: <Building2 size={18} /> },
    { to: "/rules", label: t('nav_guide'), icon: <Info size={18} /> },
    { to: "/status", label: t('nav_status'), icon: <Calendar size={18} /> },
  ];

  const isHome = location.pathname === '/';

  return (
    <>
      <nav 
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 h-24 flex items-center px-6 md:px-12 lg:px-24 justify-between bg-surface border-b border-outline-variant/10 shadow-xl py-4"
      >
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
             <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center p-1 shadow-lg group-hover:rotate-12 transition-transform overflow-hidden">
                <img src="/favicon.jpg" className="w-full h-full object-contain rounded-xl" alt="Red Gate" />
             </div>
          <div className="flex flex-col">
             <span className="text-2xl font-black leading-none text-on-surface">
                RED<span className="text-primary italic">GATE</span>
             </span>
             <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Real Estate Portal
             </span>
          </div>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-10 items-center">
          <div className="flex gap-8 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className="font-black text-sm uppercase tracking-wide flex items-center gap-2 transition-all hover:text-primary text-on-surface"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="h-6 w-px bg-on-surface opacity-10 mx-2"></div>
          
          <div className="flex items-center gap-4">
             {/* Theme Toggle */}
             <button 
               onClick={toggleTheme}
               className="p-3 bg-surface-container border border-outline-variant/10 rounded-xl text-on-surface hover:text-primary transition-all flex items-center justify-center shadow-sm"
             >
               {isDark ? <Sun size={18} /> : <Moon size={18} />}
             </button>

             {/* Language Toggle */}
             <button 
               onClick={toggleLanguage}
               className="px-4 py-2 bg-surface-container border border-outline-variant/10 rounded-xl text-primary font-black hover:bg-primary hover:text-white transition-all text-xs flex items-center gap-2"
             >
               <Globe size={14} />
               {i18n.language === 'ar' ? 'English' : 'العربية'}
             </button>

             {isAdmin ? (
               <div className="flex items-center gap-2">
                 <Link to="/admin" className="p-3 bg-surface-container text-on-surface rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm">
                   <Settings size={20} />
                 </Link>
                 <button onClick={handleLogout} className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
                   <LogOut size={20} />
                 </button>
               </div>
             ) : (
               <Link to="/admin/login" className="px-6 py-2.5 rounded-xl font-bold transition-all border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high">
                 {t('nav_admin')}
               </Link>
             )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(true)}
          className="lg:hidden p-3 rounded-2xl transition-all bg-surface-low text-on-surface"
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: i18n.language === 'ar' ? '100%' : '-100%' }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: i18n.language === 'ar' ? '100%' : '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[200] flex flex-col overflow-hidden"
          >
            {/* Header Area */}
            <div className="h-24 flex items-center justify-between px-8 border-b border-white/5">
               <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center p-1.5 border border-primary/30">
                     <img src="/favicon.jpg" className="w-full h-full object-contain rounded-lg" alt="Red Gate" />
                  </div>
                  <span className="text-xl font-black text-white tracking-tighter italic">RED<span className="text-primary italic">GATE</span></span>
               </Link>
               <button 
                 onClick={() => setIsOpen(false)} 
                 className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 text-white hover:bg-primary hover:text-white transition-all border border-white/10"
               >
                 <X size={24} />
               </button>
            </div>

            {/* Links Area */}
            <div className="flex-grow flex flex-col justify-center px-10">
              <div className="space-y-6">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.to}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                  >
                    <Link 
                      to={link.to} 
                      onClick={() => setIsOpen(false)}
                      className="group flex items-end gap-5 py-4 border-b border-white/5"
                    >
                      <span className="text-primary font-bold text-sm opacity-30 group-hover:opacity-100 transition-opacity font-mono tracking-tighter">
                        /0{idx+1}
                      </span>
                      <span className="text-2xl font-bold text-white group-hover:text-primary transition-all tracking-[0.1em] uppercase">
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom Actions Area */}
            <div className="p-8 pb-12 space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <motion.button 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    onClick={() => { toggleLanguage(); setIsOpen(false); }}
                    className="py-6 bg-white/5 border border-white/10 text-white text-lg font-bold rounded-[2rem] flex items-center justify-center gap-3 active:scale-95"
                  >
                    <Globe size={20} />
                    {i18n.language === 'ar' ? 'English' : 'العربية'}
                  </motion.button>

                  <motion.button 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    onClick={toggleTheme}
                    className="py-6 bg-primary/10 border border-primary/20 text-primary text-lg font-bold rounded-[2rem] flex items-center justify-center gap-3 active:scale-95"
                  >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    {isDark ? (i18n.language === 'ar' ? 'نهاري' : 'Light') : (i18n.language === 'ar' ? 'ليلي' : 'Dark')}
                  </motion.button>
               </div>
               
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.8 }}
                 className="flex justify-center pt-4"
               >
                  {isAdmin ? (
                    <Link 
                      to="/admin/dashboard" 
                      onClick={() => setIsOpen(false)}
                      className="text-primary font-black uppercase tracking-widest text-sm border-b-2 border-primary/20 hover:border-primary transition-all pb-1"
                    >
                      {t('admin_dashboard')}
                    </Link>
                  ) : (
                    <Link 
                      to="/admin/login" 
                      onClick={() => setIsOpen(false)}
                      className="text-white/30 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors"
                    >
                      {t('nav_admin')}
                    </Link>
                  )}
               </motion.div>
            </div>

            {/* Background Decorative Element */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
