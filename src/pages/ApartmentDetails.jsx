import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { 
  Wifi, Wind, ChefHat, Tv, Car, ShieldCheck, Coffee, Calendar as CalendarIcon,
  MapPin, MessageCircle, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, 
  AlertCircle, Share2, BedDouble, Bath, Square, Heart, Star, Phone
} from 'lucide-react';

import SEO from '../components/SEO';

const ICON_MAP = { Wifi, Wind, ChefHat, Tv, Car, ShieldCheck, Coffee, CheckCircle };

const ApartmentDetails = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const { id } = useParams();
  const navigate = useNavigate();
  const [apt, setApt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchApt = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || '';
        const res = await axios.get(`${API_BASE}/api/apartments/${id}`);
        setApt(res.data);
      } catch (err) {
        console.error("Fetch apartment error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApt();
  }, [id]);

  useEffect(() => {
    if (apt) {
      const currentTitle = isEn && apt.title_en ? apt.title_en : apt.title;
      document.title = `${currentTitle} | Red Gate Egypt`;
    }
  }, [apt, isEn]);

  const SERVER_URL = import.meta.env.VITE_API_URL || '';
  const getFullImg = (url) => url?.startsWith('/uploads') ? `${SERVER_URL}${url}` : url;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!apt) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-surface p-6">
      <h2 className="text-3xl font-black text-on-surface">{t('not_found')}</h2>
      <Link to="/apartments" className="btn-primary px-8">{t('go_back')}</Link>
    </div>
  );

  const currentTitle = isEn && apt.title_en ? apt.title_en : apt.title;
  const currentLoc = isEn && apt.location_en ? apt.location_en : apt.location;
  const currentDesc = isEn && apt.description_en ? apt.description_en : (apt.description || t('no_desc_available'));

  const whatsappUrl = `https://wa.me/201203311567?text=${encodeURIComponent(`مرحباً، أود الاستفسار عن ${currentTitle}`)}`;

  return (
    <div className="min-h-screen bg-background pb-24">
      <SEO 
        title={currentTitle} 
        description={currentDesc?.substring(0, 160)}
        keywords={`${currentTitle}, ${currentLoc}, Red Gate Egypt, ريد غيت`}
        image={getFullImg(apt.images[0])}
        type="article"
      />

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Accommodation",
          "name": currentTitle,
          "description": currentDesc,
          "numberOfRooms": apt.beds,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": currentLoc
          },
          "offers": {
            "@type": "Offer",
            "price": apt.price,
            "priceCurrency": "EGP"
          }
        })}
      </script>
      
      {/* 1. Immersive Gallery Grid (Aqarmap/Airbnb Style) */}
      <section className="pt-24 md:pt-32 container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
           <div>
              <div className="flex items-center gap-2 text-primary font-black mb-2">
                 <Star size={16} fill="currentColor" />
                 <span className="text-sm uppercase tracking-widest">{t('verified_badge')}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-on-surface mb-2">{currentTitle}</h1>
              <div className="flex items-center gap-2 text-on-surface-variant font-bold">
                 <MapPin size={18} className="text-primary" />
                 <span>{currentLoc}</span>
              </div>
           </div>
           
           <div className="flex gap-4">
              <button onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }} className="flex items-center gap-2 px-6 py-3 bg-surface border border-outline-variant/10 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all shadow-sm">
                 <Share2 size={18} /> {copied ? (isEn ? 'Copied!' : 'تم النسخ!') : t('details_share')}
              </button>
              <button className="p-3 bg-surface border border-outline-variant/10 rounded-2xl hover:text-primary transition-all shadow-sm">
                 <Heart size={20} />
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[50vh] md:h-[70vh] rounded-[3rem] overflow-hidden shadow-2xl relative group">
           {/* Main Image */}
           <div className="md:col-span-2 relative overflow-hidden h-full">
              <img src={getFullImg(apt.images?.[0])} alt="Main" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
           </div>
           
           {/* Secondary Grid */}
           <div className="hidden md:grid md:col-span-2 grid-cols-2 grid-rows-2 gap-4 h-full">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="relative overflow-hidden h-full bg-surface-container">
                   {apt.images?.[i] ? (
                     <img src={getFullImg(apt.images[i])} alt={`Interior ${i}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-surface-variant/10">
                        <Camera size={32} className="text-on-surface-variant opacity-20" />
                     </div>
                   )}
                 </div>
               ))}
           </div>
           
           <button className="absolute bottom-8 right-8 bg-surface/90 backdrop-blur-md text-on-surface px-8 py-3 rounded-2xl font-black shadow-xl hover:bg-primary hover:text-white transition-all">
              {t('view_photos')} ({apt.images?.length || 0})
           </button>
        </div>
      </section>

      {/* 2. Main Content & Sidebar */}
      <section className="container mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Detailed Info */}
          <div className="lg:col-span-2">
             
             {/* Key Features Icons */}
             <div className="grid grid-cols-4 gap-4 p-8 bg-surface rounded-[2.5rem] mb-12 border border-outline-variant/10">
                <div className="flex flex-col items-center gap-2 border-l border-outline-variant/10">
                   <BedDouble size={28} className="text-primary" />
                   <span className="text-sm font-black text-on-surface">{apt.beds} {t('rooms')}</span>
                </div>
                <div className="flex flex-col items-center gap-2 border-l border-outline-variant/10">
                   <Bath size={28} className="text-primary" />
                   <span className="text-sm font-black text-on-surface">{apt.baths} {t('baths')}</span>
                </div>
                <div className="flex flex-col items-center gap-2 border-l border-outline-variant/10">
                   <Square size={28} className="text-primary" />
                   <span className="text-sm font-black text-on-surface">{apt.size} {t('sqm')}</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                   <CheckCircle2 size={28} className="text-primary" />
                   <span className="text-sm font-black text-on-surface">{t('verified')}</span>
                </div>
             </div>

             <div className="mb-16">
                <h3 className="text-2xl font-black text-on-surface mb-6 italic underline decoration-primary/30 decoration-8 underline-offset-8">{isEn ? 'Description' : 'وصف العقار'}</h3>
                <p className="text-on-surface-variant leading-relaxed text-lg font-bold whitespace-pre-wrap">
                   {currentDesc}
                </p>
             </div>

             <div className="mb-16">
                <h3 className="text-2xl font-black text-on-surface mb-8 italic underline decoration-primary/30 decoration-8 underline-offset-8">{t('details_amenities')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                   {apt.amenities?.filter(a => a.enabled).map((info, idx) => {
                     const Icon = ICON_MAP[info.iconName] || CheckCircle;
                     return (
                       <div key={idx} className="flex items-center gap-4 p-6 bg-surface border border-outline-variant/10 rounded-[2rem] hover:shadow-xl hover:border-primary/20 transition-all group">
                          <div className="p-3 bg-primary/5 rounded-2xl group-hover:bg-primary transition-colors">
                             <Icon size={24} className="text-primary group-hover:text-white" />
                          </div>
                          <span className="font-black text-on-surface">{t(info.id)}</span>
                       </div>
                     )
                   })}
                </div>
             </div>

             {apt.rules?.length > 0 && (
                <div>
                   <h3 className="text-2xl font-black text-on-surface mb-6 italic underline decoration-primary/30 decoration-8 underline-offset-8">{t('details_rules')}</h3>
                   <div className="space-y-4">
                      {apt.rules.map((rule, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 hover:bg-surface rounded-2xl transition-colors font-bold text-on-surface-variant">
                           <AlertCircle className="text-primary" size={20} />
                           {rule}
                        </div>
                      ))}
                   </div>
                </div>
             )}
          </div>

          {/* Sticky Sidebar (Booking Card) */}
          <div className="lg:col-span-1">
             <div className="sticky top-32 p-10 bg-surface-container-lowest text-on-surface rounded-[4rem] shadow-2xl border border-outline-variant/10">
                <div className="flex items-end gap-2 mb-8 border-b border-outline-variant/10 pb-8">
                   <span className="text-5xl font-black text-primary">
                      {Number(apt.price).toLocaleString()}
                   </span>
                   <span className="text-lg font-bold text-on-surface-variant mb-2">{t('currency')}</span>
                   <span className="text-sm font-bold text-on-surface-variant/40 mb-2 mr-auto uppercase tracking-widest">{apt.priceType === 'per_night' ? t('per_night') : t('total_price')}</span>
                </div>
                
                <div className="space-y-6">
                   <button 
                     onClick={() => navigate('/book', { state: { aptTitle: currentTitle, price: apt.price, aptId: apt._id || id, priceType: apt.priceType } })}
                     className="w-full py-6 bg-primary text-on-primary text-xl font-black rounded-3xl hover:opacity-90 hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3"
                   >
                     {t('details_book_now')}
                     <ArrowLeft size={24} className="rtl-flip" />
                   </button>
                   
                   <a href={whatsappUrl} className="w-full py-6 border-2 border-primary/30 text-primary text-lg font-black rounded-3xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3">
                     <MessageCircle size={24} />
                     {t('whatsapp')}
                   </a>
                   
                   <div className="flex items-center justify-center gap-4 pt-4 text-on-surface-variant/40">
                      <Phone size={16} />
                      <span className="text-sm font-bold">اتصل بنا: 01203311567</span>
                   </div>
                </div>
                
                <div className="mt-8 p-6 bg-surface-container rounded-3xl border border-outline-variant/10 group hover:bg-primary/10 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center font-black">RG</div>
                      <div>
                         <h4 className="font-black">Red Gate Support</h4>
                         <p className="text-xs text-on-surface-variant/40 font-bold">{t('support_ready')}</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default ApartmentDetails;

const CheckCircle2 = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const Camera = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);
