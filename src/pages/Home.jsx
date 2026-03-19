import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { Shield, Star, ArrowLeft, ArrowRight, Play, MapPin, Coffee, Wifi, Wind, ShieldCheck, Heart, Camera, Layout, Building2, Key, Gem, Sparkles, CheckCircle, Search, Home as HomeIcon, Users, Map as MapIcon, CheckCircle2 } from 'lucide-react';
import AqarSearch from '../components/AqarSearch';
import PropertyCard from '../components/PropertyCard';
import SEO from '../components/SEO';

const API_BASE = import.meta.env.VITE_API_URL || '';
const API = `${API_BASE}/api/hero`;
const SERVER_URL = API_BASE; 

const Home = () => {
  const { t, i18n } = useTranslation();
  const [slides, setSlides] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [areas, setAreas] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, aptRes, areaRes] = await Promise.all([
          axios.get(API),
          axios.get(`${import.meta.env.VITE_API_URL || ''}/api/apartments`),
          axios.get(`${import.meta.env.VITE_API_URL || ''}/api/areas`)
        ]);
        
        if (Array.isArray(heroRes.data) && heroRes.data.length > 0) {
          setSlides(heroRes.data);
        } else if (heroRes.data && !Array.isArray(heroRes.data)) {
          setSlides([heroRes.data]);
        } else {
          setSlides([{
            title: 'RED GATE LUXURY',
            subtitle: 'Distinctive Quality Residences',
            highlight: 'RED GATE',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000',
            button_text: 'استعراض الوحدات',
            button_link: '/apartments'
          }]);
        }

        if (Array.isArray(aptRes.data) && aptRes.data.length > 0) {
          setApartments(aptRes.data.slice(0, 4));
        }
        
        if (Array.isArray(areaRes.data)) {
          setAreas(areaRes.data);
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

  if (loading) return null;
  if (!Array.isArray(slides) || slides.length === 0) return null;
  const current = slides[currentSlide];
  const heroImage = current?.image?.startsWith('/uploads') ? `${SERVER_URL}${current.image}` : current?.image;

  return (
    <div className="overflow-hidden" style={{backgroundColor: 'var(--color-surface)'}}>
      <SEO 
        title={t('nav_home')} 
        description={t('hero_subtitle')}
        keywords="Red Gate, ريد غيت, عقارات مصر, Luxury Properties Egypt, Hurghada, El Gouna"
      />

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          "name": "Red Gate Egypt | ريد غيت",
          "image": "https://redgate-egypt.com/logo.png",
          "url": "https://redgate-egypt.com",
          "telephone": "+201234567890",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "New Cairo",
            "addressLocality": "Cairo",
            "addressCountry": "EG"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 30.0444,
            "longitude": 31.2357
          },
          "priceRange": "$$$",
          "description": "Premium luxury real estate platform in Egypt."
        })}
      </script>

      {/* 1. Cinematic Hero Entrance (Slider) */}
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
               transition={{ duration: 10, ease: "linear" }}
               src={heroImage} 
               className="w-full h-full object-cover"
               alt="Luxury Interior"
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
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto"
              >
                <div className="mb-10 inline-block font-cairo text-center">
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

        {slides.length > 1 && (
          <div className="absolute inset-x-0 bottom-20 z-30 flex justify-between px-10 pointer-events-none">
             <button onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)} className="w-16 h-16 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-black hover:border-primary transition-all pointer-events-auto">
                <ArrowRight size={24} />
             </button>
             <button onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)} className="w-16 h-16 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-black hover:border-primary transition-all pointer-events-auto">
                <ArrowLeft size={24} />
             </button>
          </div>
        )}
      </section>

      {/* 2. Real Estate Stats & Trust (Aqarmap Style) */}
      <section className="py-12 bg-surface relative z-30 -mt-10 mx-auto max-w-6xl rounded-[3rem] shadow-xl border border-outline-variant/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-2">
                <HomeIcon size={24} />
              </div>
              <h4 className="text-2xl font-black text-on-surface">1,500+</h4>
              <p className="text-on-surface-variant text-xs font-bold">{t('stats_units')}</p>
            </div>
            <div className="text-center flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-2">
                <Users size={24} />
              </div>
              <h4 className="text-2xl font-black text-on-surface">50,000+</h4>
              <p className="text-on-surface-variant text-xs font-bold">{t('stats_visitors')}</p>
            </div>
            <div className="text-center flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-2">
                <MapIcon size={24} />
              </div>
              <h4 className="text-2xl font-black text-on-surface">25+</h4>
              <p className="text-on-surface-variant text-xs font-bold">{t('stats_cities')}</p>
            </div>
            <div className="text-center flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-2">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="text-2xl font-black text-on-surface">100%</h4>
              <p className="text-on-surface-variant text-xs font-bold">{t('stats_verified')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Cities (Browse by Area) */}
      <section className="py-24" style={{backgroundColor: 'var(--color-surface)'}}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 text-right">
            <div className="text-right">
               <h2 className="text-4xl md:text-6xl font-black text-on-surface mb-4">
                 <Trans i18nKey="browse_title">
                   تصفح حسب <span className="text-primary italic">المنطقة</span>
                 </Trans>
               </h2>
               <p className="text-on-surface-variant text-lg font-bold">{t('browse_subtitle')}</p>
            </div>
            <Link to="/apartments" className="text-primary font-black hover:underline flex items-center gap-2 text-xl">
               {t('view_all')} <ArrowLeft size={24} className="rtl-flip" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {areas.length > 0 ? (
              areas.map((area) => (
                <motion.div 
                  whileHover={{ y: -10 }}
                  key={area._id || area.id} 
                  onClick={() => navigate(`/apartments?search=${encodeURIComponent(area.name)}`)}
                  className="relative aspect-[4/5] rounded-[3rem] overflow-hidden group cursor-pointer shadow-xl border border-outline-variant/10"
                >
                  <img src={area.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={area.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 right-8 text-right">
                    <h4 className="text-white text-2xl font-black mb-1">
                      {t('lang') === 'ar' ? area.name : (area.name_en || area.name)}
                    </h4>
                    <p className="text-white/70 text-sm font-bold">
                      {t('lang') === 'ar' ? area.count : (area.count_en || area.count)}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              // Empty state or instructions
              <div className="col-span-full py-12 text-center text-on-surface-variant font-bold italic">
                {t('no_areas_yet')}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Featured Listings Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 text-right">
            <div className="text-right">
               <h2 className="text-4xl md:text-6xl font-black text-on-surface mb-4">
                 <Trans i18nKey="featured_title">
                   وحدات <span className="text-primary italic">مميزة</span>
                 </Trans>
               </h2>
               <p className="text-on-surface-variant text-lg font-bold">{t('featured_subtitle')}</p>
            </div>
            <button 
              onClick={() => navigate('/apartments')}
              className="px-10 py-4 bg-surface-low text-on-surface font-black rounded-full hover:bg-primary hover:text-white transition-all shadow-md text-lg"
            >
              {t('more_btn')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {apartments.length > 0 ? (
              apartments.map(apt => (
                <PropertyCard 
                  key={apt._id} 
                  property={apt} 
                  onClick={() => navigate(`/apartments/${apt._id}`)}
                />
              ))
            ) : (
              <div className="col-span-full p-24 text-center bg-surface-low rounded-[3rem] border-2 border-dashed border-outline-variant/10">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 size={40} className="animate-pulse" />
                </div>
                <p className="text-on-surface-variant text-xl font-black italic">جاري تحميل أحدث العقارات المتاحة...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .font-cairo { font-family: 'Cairo', sans-serif; }
      `}} />
    </div>
  );
};

export default Home;
