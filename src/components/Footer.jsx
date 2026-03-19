import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowUpLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-neutral-950 text-white pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand & Mission */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-2 group">
                 <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center p-1 shadow-lg group-hover:rotate-6 transition-transform overflow-hidden">
                    <img src="/favicon.jpg" className="w-full h-full object-contain rounded-lg" alt="Red Gate" />
                 </div>
              <span className="text-2xl font-black">RED<span className="text-primary italic">GATE</span></span>
            </Link>
            <p className="text-neutral-500 font-bold leading-relaxed text-sm">
              {t('footer_mission')}
            </p>
            <div className="flex gap-4">
               {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                 <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                    <Icon size={18} />
                 </a>
               ))}
            </div>
          </div>

          {/* Quick Explore */}
          <div>
            <h4 className="text-lg font-black mb-8 italic">{t('footer_explore')}</h4>
            <ul className="space-y-4 font-bold text-sm text-neutral-500">
               <li><Link to="/apartments" className="hover:text-primary transition-colors flex items-center gap-2 group"><ArrowUpLeft size={14} className="opacity-0 group-hover:opacity-100 transition-all"/> {t('search_buy')}</Link></li>
               <li><Link to="/apartments" className="hover:text-primary transition-colors flex items-center gap-2 group"><ArrowUpLeft size={14} className="opacity-0 group-hover:opacity-100 transition-all"/> {t('search_rent')}</Link></li>
               <li><Link to="/apartments" className="hover:text-primary transition-colors flex items-center gap-2 group"><ArrowUpLeft size={14} className="opacity-0 group-hover:opacity-100 transition-all"/> {t('nav_explore')}</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-black mb-8 italic">{t('footer_company')}</h4>
            <ul className="space-y-4 font-bold text-sm text-neutral-500">
               <li><Link to="/rules" className="hover:text-primary transition-colors">{t('nav_guide')}</Link></li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 className="text-lg font-black mb-8 italic">{t('footer_contact')}</h4>
            <ul className="space-y-6">
               <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                     <Phone size={18} />
                  </div>
                  <div>
                     <p className="text-xs text-neutral-500 font-bold mb-1">{t('footer_phone')}</p>
                     <p className="text-sm font-black">+20 123 456 7890</p>
                  </div>
               </li>
               <li className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                     <Mail size={18} />
                  </div>
                  <div>
                     <p className="text-xs text-neutral-500 font-bold mb-1">{t('footer_email')}</p>
                     <p className="text-sm font-black">support@redgate-egypt.com</p>
                  </div>
               </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <p className="text-neutral-600 text-xs font-bold text-center md:text-right">
              {t('footer_rights')}
           </p>
           <div className="flex gap-8 text-xs font-black text-neutral-600 uppercase tracking-widest">
              <span className="hover:text-primary cursor-pointer transition-colors">Ar</span>
              <span className="hover:text-primary cursor-pointer transition-colors opacity-30">En</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
