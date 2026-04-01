import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { Shield, Star, ArrowLeft, ArrowRight, Play, MapPin, Coffee, Wifi, Wind, ShieldCheck, Heart, Camera, Layout, Building2, Key, Gem, Sparkles, CheckCircle, Search, Home as HomeIcon, Users, Map as MapIcon, CheckCircle2 } from 'lucide-react';
import AqarSearch from '../components/AqarSearch';
import PropertyCard from '../components/PropertyCard';
import SEO from '../components/SEO';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API = `${API_BASE}/api/hero`;
const SERVER_URL = API_BASE; 

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${SERVER_URL}${path}`;
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const [slides, setSlides] = useState([{
    title: 'RED GATE LUXURY',
    subtitle: 'Distinctive Quality Residences',
    highlight: 'RED GATE',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&w=1200&q=70',
    button_text: 'استعراض الوحدات',
    button_link: '/apartments'
  }]);
  const [apartments, setApartments] = useState([]);
  const [areas, setAreas] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, aptRes, areaRes, projectRes] = await Promise.all([
          axios.get(API),
          axios.get(`${API_BASE}/api/apartments`),
          axios.get(`${API_BASE}/api/areas`),
          axios.get(`${API_BASE}/api/projects`)
        ]);
        
        if (Array.isArray(heroRes.data) && heroRes.data.length > 0) {
          setSlides(heroRes.data);
        }

        if (Array.isArray(aptRes.data)) {
          setApartments(aptRes.data.slice(0, 4));
        }
        
        if (Array.isArray(areaRes.data)) {
          setAreas(areaRes.data);
        }

        if (Array.isArray(projectRes.data)) {
          setProjects(projectRes.data.slice(0, 4));
        }
      } catch (err) {
        console.error('Home fetchData error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    document.title = i18n.language === 'ar' ? 'ريد غيت | عقارات مصر الفاخرة' : 'Red Gate | Luxury Real Estate Egypt';
  }, [i18n.language]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const current = slides[currentSlide];
  const heroImage = getImageUrl(current?.image);

  return (
    <div className="overflow-hidden" style={{backgroundColor: 'var(--color-surface)'}}>
      <SEO 
        title="Red Gate Egypt | المنصة الأولى للعقارات الفاخرة"
        description="استكشف أرقى الشقق والمشاريع السكنية في الجونة، الغردقة، والقاهرة الجديدة."
        url="https://red-gate.tech"
      />

      {/* 1. Hero */}
      <section className="relative h-screen flex items-center justify-center bg-black overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0"
          >
             <motion.img 
               initial={{ scale: 1.1 }}
               animate={{ scale: 1.25 }}
               src={heroImage} 
               className="w-full h-full object-cover"
               alt="Red Gate"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90"></div>
          </motion.div>
        </AnimatePresence>
        <div className="container mx-auto px-6 relative z-20 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentSlide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto"
              >
                <div className="mb-10 inline-block text-center font-cairo">
                   <h1 className="text-4xl md:text-7xl font-black text-white leading-tight mb-4 drop-shadow-lg">
                     <Trans i18nKey="hero_title">
                       ابحث عن <span className="text-primary italic">منزلك المثالي</span> في مصر
                     </Trans>
                   </h1>
                   <p className="text-white/80 text-lg md:text-2xl font-light">{t('hero_subtitle')}</p>
                </div>
                <AqarSearch areas={areas} />
              </motion.div>
            </AnimatePresence>
        </div>
      </section>

      {/* 2. Stats */}
      <section className="py-12 bg-surface relative z-30 -mt-10 mx-auto max-w-6xl rounded-[3rem] shadow-xl border border-outline-variant/10">
        <div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-2"><HomeIcon size={24} /></div>
              <h4 className="text-2xl font-black text-on-surface">1,500+</h4>
              <p className="text-on-surface-variant text-xs font-bold">{t('stats_units')}</p>
            </div>
            <div className="text-center flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-2"><Users size={24} /></div>
              <h4 className="text-2xl font-black text-on-surface">50,000+</h4>
              <p className="text-on-surface-variant text-xs font-bold">{t('stats_visitors')}</p>
            </div>
            <div className="text-center flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-2"><MapIcon size={24} /></div>
              <h4 className="text-2xl font-black text-on-surface">25+</h4>
              <p className="text-on-surface-variant text-xs font-bold">{t('stats_cities')}</p>
            </div>
            <div className="text-center flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-2"><CheckCircle2 size={24} /></div>
              <h4 className="text-2xl font-black text-on-surface">100%</h4>
              <p className="text-on-surface-variant text-xs font-bold">{t('stats_verified')}</p>
            </div>
        </div>
      </section>

      {/* 3. Areas */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 text-right">
            <div>
               <h2 className="text-4xl md:text-6xl font-black text-on-surface mb-4">
                 <Trans i18nKey="browse_title">تصفح حسب <span className="text-primary italic">المنطقة</span></Trans>
               </h2>
               <p className="text-on-surface-variant text-lg font-bold">{t('browse_subtitle')}</p>
            </div>
            <Link to="/apartments" className="text-primary font-black flex items-center gap-2 text-xl">
               {t('view_all')} <ArrowLeft size={24} className="rtl-flip" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {areas.map((area, idx) => (
              <motion.div whileHover={{ y: -10 }} key={area._id || area.id || idx} onClick={() => navigate(`/apartments?search=${encodeURIComponent(area.name)}`)} className="relative aspect-[4/5] rounded-[3rem] overflow-hidden group cursor-pointer shadow-xl border border-outline-variant/10">
                <img src={getImageUrl(area.image)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={area.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 right-8 text-right">
                  <h4 className="text-white text-2xl font-black mb-1">{i18n.language === 'ar' ? area.name : (area.name_en || area.name)}</h4>
                  <p className="text-white/70 text-sm font-bold">{area.count} {t('stats_units')}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Projects Section */}
      <section className="py-24 bg-surface-container/30">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16 text-right">
            <div>
               <h2 className="text-4xl md:text-6xl font-black text-on-surface mb-4">
                  {i18n.language === 'ar' ? 'أحدث ' : 'Latest '}
                  <span className="text-primary italic">
                    {i18n.language === 'ar' ? 'مشاريعنا' : 'Our Projects'}
                  </span>
               </h2>
               <p className="text-on-surface-variant text-lg font-bold">{i18n.language === 'ar' ? 'استكشف مشاريعنا السكنية الفاخرة' : 'Explore our premium residential projects'}</p>
            </div>
            <Link to="/projects" className="text-primary font-black flex items-center gap-2 text-xl">
               {t('view_all')} <ArrowLeft size={24} className="rtl-flip" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projects.map((p, idx) => (
              <motion.div 
                key={p._id || p.id || idx}
                whileHover={{ y: -10 }}
                onClick={() => navigate(`/projects/${p._id || p.id}`)}
                className="bg-surface-container rounded-[3rem] overflow-hidden group shadow-xl border border-outline-variant/10 flex flex-col md:flex-row relative cursor-pointer"
              >
                <div className="w-full md:w-2/5 aspect-[4/3] md:aspect-auto md:min-h-full overflow-hidden bg-neutral-100 relative">
                  <img 
                    src={getImageUrl(p.main_image)} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 max-h-[300px] md:max-h-none" 
                    alt={p.title}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-sm text-primary shadow-lg border border-white/20">
                    {i18n.language === 'ar' ? (p.status || 'مكتمل') : (p.status_en || p.status || 'Completed')}
                  </div>
                </div>
                <div className="p-8 md:p-10 w-full md:w-3/5 flex flex-col justify-center text-right">
                  <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-3">
                    <Building2 size={14} />
                    {i18n.language === 'ar' ? p.location : (p.location_en || p.location)}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-on-surface mb-2">
                    {i18n.language === 'ar' ? p.title : (p.title_en || p.title)}
                  </h3>
                  <p className="text-on-surface-variant text-sm md:text-base font-bold leading-relaxed mb-6 line-clamp-3">
                    {i18n.language === 'ar' ? p.description : (p.description_en || p.description)}
                  </p>
                  <span className="mt-auto self-start px-6 py-3 bg-primary text-on-primary rounded-2xl font-black flex items-center gap-3 transition-all hover:scale-105 shadow-lg">
                    {i18n.language === 'ar' ? 'استعراض الوحدات' : 'View Units'} <ArrowLeft size={18} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Units */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16 text-right">
            <div>
               <h2 className="text-4xl md:text-6xl font-black text-on-surface mb-4">
                 <Trans i18nKey="featured_title">وحدات <span className="text-primary italic">مميزة</span></Trans>
               </h2>
               <p className="text-on-surface-variant text-lg font-bold">{t('featured_subtitle')}</p>
            </div>
            <button onClick={() => navigate('/apartments')} className="px-10 py-4 bg-surface-low text-on-surface font-black rounded-full hover:bg-primary hover:text-white transition-all shadow-md text-lg">{t('more_btn')}</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {apartments.map((apt, idx) => (
              <PropertyCard key={apt._id || apt.id || idx} property={apt} linkUrl={`/apartments/${apt._id}`} />
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `.font-cairo { font-family: 'Cairo', sans-serif; }` }} />
    </div>
  );
};

export default Home;
