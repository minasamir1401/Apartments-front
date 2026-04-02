import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ArrowLeft, ArrowRight, Building2, MapPin, SlidersHorizontal } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import SEO from '../components/SEO';

const Apartments = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  // States
  const [apartments, setApartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get('category') || 'all');
  const [showProjects, setShowProjects] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Apartments
        const aptRes = await axios.get(`${API_BASE}/api/apartments${location.search}`);
        setApartments(aptRes.data);

        // Fetch Projects
        const projRes = await axios.get(`${API_BASE}/api/projects`);
        setProjects(projRes.data);

        // Fetch Settings
        const setRes = await axios.get(`${API_BASE}/api/settings`);
        setShowFilters(setRes.data.show_filters);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    
    // Sync UI filter state
    const cat = searchParams.get('category');
    if (cat) {
      setFilter(cat);
      setShowProjects(false);
    } else {
      setFilter('all');
    }
  }, [location.search]);

  const filteredApts = apartments.filter(apt => {
    if (filter === 'all') return true;
    if (filter === 'buy') return apt.priceType !== 'per_night';
    if (filter === 'rent') return apt.priceType === 'per_night';
    return true;
  });

  const getImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${API_BASE}${url}`;
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-surface">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-on-surface-variant text-xl font-black italic animate-pulse">{t('loading_properties')}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface pt-32 pb-24">
      <SEO
        title="شقق ووحدات للبيع والإيجار في مصر | Red Gate Egypt"
        description="تصفح مئات الشقق والوحدات السكنية الفاخرة للبيع والإيجار في مصر - الجونة، الغردقة، القاهرة الجديدة. أسعار منافسة وعقارات موثوقة من Red Gate."
        url="https://red-gate.tech/apartments"
        schema={{
          "@context": "https://schema.org",
          "@type": "SearchResultsPage",
          "name": "شقق ووحدات للبيع والإيجار | Red Gate Egypt",
          "description": "تصفح جميع العقارات المتاحة على منصة ريد غيت",
          "url": "https://red-gate.tech/apartments"
        }}
      />
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-16 text-right">
           <h1 className="text-4xl md:text-6xl font-black text-on-surface mb-6 italic">
             {t('discover_your_opportunity')} <span className="text-primary not-italic">{t('real_estate_opportunity')}</span>
           </h1>
           <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-on-surface-variant text-lg font-bold max-w-2xl">
                {t('apartments_intro_text')}
              </p>
              
              {/* Filter Tabs */}
              {showFilters && (
                <div className="flex flex-wrap items-center gap-4 mb-10">
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => { setShowProjects(false); navigate('/apartments'); }}
                      className={`px-8 py-3 rounded-2xl font-black transition-all ${(!showProjects && filter === 'all') ? 'bg-primary text-on-primary shadow-lg' : 'bg-surface-container text-on-surface hover:bg-primary/10'}`}
                    >
                      {t('filter_all')}
                    </button>
                    <button 
                      onClick={() => { setShowProjects(false); navigate('/apartments?category=buy'); }}
                      className={`px-8 py-3 rounded-2xl font-black transition-all ${(!showProjects && filter === 'buy') ? 'bg-primary text-on-primary shadow-lg' : 'bg-surface-container text-on-surface hover:bg-primary/10'}`}
                    >
                      {t('search_buy')}
                    </button>
                    <button 
                      onClick={() => { setShowProjects(false); navigate('/apartments?category=rent'); }}
                      className={`px-8 py-3 rounded-2xl font-black transition-all ${(!showProjects && filter === 'rent') ? 'bg-primary text-on-primary shadow-lg' : 'bg-surface-container text-on-surface hover:bg-primary/10'}`}
                    >
                      {t('search_rent')}
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => setShowProjects(true)}
                    className={`px-8 py-3 rounded-2xl font-black transition-all flex items-center gap-2 ${showProjects ? 'bg-primary text-on-primary shadow-lg' : 'bg-surface-container text-on-surface hover:bg-primary/10'}`}
                  >
                    <Building2 size={18} />
                    {t('our_projects')}
                  </button>
                </div>
              )}
           </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {showProjects ? (
              projects.length > 0 ? (
                projects.map((project) => (
                  <ProjectGridItem key={project._id} project={project} isEn={isEn} getImageUrl={getImageUrl} />
                ))
              ) : (
                <EmptyState icon={<Building2 size={48} />} title={isEn ? 'No Projects Found' : 'لم نجد مشاريع حالياً'} />
              )
            ) : (
              <>
                {/* Mixed View: Projects first group, only when in "All" filter */}
                {filter === 'all' && projects.length > 0 && projects.map((project) => (
                  <ProjectGridItem key={project._id} project={project} isEn={isEn} getImageUrl={getImageUrl} />
                ))}

                {/* Apartments group */}
                {filteredApts.length > 0 ? (
                  filteredApts.map((apt) => (
                    <PropertyCard 
                      key={apt._id} 
                      property={apt} 
                      linkUrl={`/apartments/${apt._id}`} 
                    />
                  ))
                ) : (
                  filter !== 'all' && <EmptyState icon={<Search size={48} />} title="لم نجد نتائج تطابق اختيارك" subtitle="حاول اختيار فئة أخرى أو العودة لاحقاً" />
                )}

                {/* If absolutely nothing found in "All" view */}
                {filter === 'all' && projects.length === 0 && filteredApts.length === 0 && (
                   <EmptyState icon={<Search size={48} />} title="لا يوجد محتوى حالياً" />
                )}
              </>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default Apartments;

// Sub-components for cleaner code
const ProjectGridItem = ({ project, isEn, getImageUrl }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="col-span-1"
  >
    <Link to={`/projects/${project._id}`} className="block h-full no-underline group font-arabic">
      <div className="bg-surface-container rounded-[2.5rem] overflow-hidden group shadow-xl border border-outline-variant/10 h-full flex flex-col relative transition-all hover:translate-y-[-8px]">
        <div className="aspect-[4/3] relative overflow-hidden bg-neutral-100">
          {(project.main_image || (project.images && project.images.length > 0)) ? (
            <img 
              src={getImageUrl(project.main_image || project.images[0])} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              alt={project.title} 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
              <Building2 size={40} className="mb-2 opacity-50" />
            </div>
          )}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full font-black text-[10px] text-primary shadow-lg uppercase tracking-wider">
            {project.status === 'active' ? (isEn ? 'Active' : 'نشط') : (isEn ? 'Completed' : 'مكتمل')}
          </div>
        </div>
        <div className="p-6 md:p-8 flex flex-col flex-grow text-right">
          <h3 className="text-xl md:text-2xl font-black text-on-surface mb-2 line-clamp-1">{isEn ? (project.title_en || project.title) : project.title}</h3>
          <div className="flex items-center gap-1 text-on-surface-variant text-sm font-bold mt-auto border-t border-outline-variant/10 pt-4 group-hover:text-primary transition-colors">
            <span>{isEn ? 'View Project Details' : 'استعراض تفاصيل المشروع'}</span>
            <ArrowLeft size={16} />
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const EmptyState = ({ icon, title, subtitle }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="col-span-full py-32 text-center bg-surface-container rounded-[3rem] border-2 border-dashed border-outline-variant/10"
  >
    <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
      {icon}
    </div>
    <h3 className="text-2xl font-black text-on-surface mb-2">{title}</h3>
    {subtitle && <p className="text-on-surface-variant font-bold">{subtitle}</p>}
  </motion.div>
);
