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
  const heroImage = current?.image?.startsWith('/uploads') ? `${SERVER_URL}${current.image}` : current?.image;

  return (
    <div className="overflow-hidden" style={{backgroundColor: 'var(--color-surface)'}}>
      <SEO 
        title="Red Gate Egypt | ريد غيت للعقارات الفاخرة في مصر"
        description="ريد غيت للعقارات - المنصة الأولى للعقارات الفاخرة في مصر. اعثر على شقتك المثالية في الجونة، الغردقة، والقاهرة الجديدة. Red Gate Egypt – Find luxury properties for sale and rent."
        url="https://red-gate.tech"
        image="https://red-gate.tech/og-image.jpg"
      />

      {/* 1. Hero Slider */}
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
               alt="Red Gate Egypt"
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

      {/* 2. Stats Section */}
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

      {/* 3. Areas Section */}
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
            {areas.map((area) => (
              <motion.div 
                whileHover={{ y: -10 }}
                key={area._id} 
                onClick={() => navigate(`/apartments?search=${encodeURIComponent(area.name)}`)}
                className="relative aspect-[4/5] rounded-[3rem] overflow-hidden group cursor-pointer shadow-xl border border-outline-variant/10"
              >
                <img src={area.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={area.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 right-8 text-right">
                  <h4 className="text-white text-2xl font-black mb-1">
                    {i18n.language === 'ar' ? area.name : (area.name_en || area.name)}
                  </h4>
                  <p className="text-white/70 text-sm font-bold">{area.count} {t('stats_units')}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Projects Section (NEW) */}
      <section className="py-24 bg-surface-container/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 text-right">
            <div className="text-right">
               <h2 className="text-4xl md:text-6xl font-black text-on-surface mb-4">
                  {i18n.language === 'ar' ? 'أحدث' : 'Latest'} <span className="text-primary italic">{t('our_projects')}</span>
               </h2>
               <p className="text-on-surface-variant text-lg font-bold">
                 {i18n.language === 'ar' ? 'استكشف مشاريعنا السكنية الفاخرة والكمبوندات المتكاملة' : 'Explore our world-class residential projects and integrated compounds'}
               </p>
            </div>
            <Link to="/projects" className="text-primary font-black hover:underline flex items-center gap-2 text-xl">
               {t('view_all')} <ArrowLeft size={24} className="rtl-flip" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <motion.div 
                key={project._id}
                whileHover={{ y: -10 }}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="flex flex-col md:flex-row bg-surface border border-outline-variant/10 rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
                  <img 
                    src={project.image?.startsWith('/uploads') ? `${SERVER_URL}${project.image}` : project.image} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={project.name}
                  />
                </div>
                <div className="w-full md:w-3/5 p-8 flex flex-col justify-center text-right">
                   <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-4">
                      <Building2 size={16} />
                      {project.location}
                   </div>
                   <h3 className="text-2xl font-black text-on-surface mb-2 group-hover:text-primary transition-colors">
                      {i18n.language === 'ar' ? project.name : (project.name_en || project.name)}
                   </h3>
                   <p className="text-on-surface-variant text-sm font-bold line-clamp-3 mb-6">
                      {i18n.language === 'ar' ? project.description : (project.desc_en || project.description)}
                   </p>
                   <div className="text-primary font-black flex items-center gap-2 transition-transform">
                      {t('more_btn')} <ArrowLeft size={20} />
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Properties Section */}
      <section className="py-24">
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
            {apartments.map(apt => (
              <PropertyCard 
                key={apt._id} 
                property={apt} 
                linkUrl={`/apartments/${apt._id}`}
              />
            ))}
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
