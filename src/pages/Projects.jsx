import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ArrowLeft, X, ChevronRight, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const Projects = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/projects`);
        setProjects(res.data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const getImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${API_BASE}${url}`;
  };

  const openGallery = (project) => {
    const allImages = [];
    if (project.main_image) allImages.push(project.main_image);
    if (Array.isArray(project.images)) allImages.push(...project.images);
    
    if (allImages.length > 0) {
      setSelectedGallery(allImages);
      setCurrentImgIdx(0);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-surface pt-20">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-on-surface-variant text-xl font-black italic animate-pulse">{isEn ? 'Loading Projects...' : 'جاري تحميل المشاريع...'}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface pt-32 pb-24">
      <SEO
        title={isEn ? 'Luxury Real Estate Projects in Egypt | Red Gate Egypt' : 'مشاريع سكنية فاخرة في مصر | ريد غيت'}
        description={isEn ? "Explore Red Gate's premium real estate projects in El Gouna, Hurghada, and New Cairo Egypt. Luxury units for sale with easy payment plans." : "اكتشف مشاريع ريد غيت العقارية الفاخرة في الجونة والغردقة والقاهرة الجديدة. وحدات سكنية راقية للبيع بأنظمة سداد مرنة."}
        keywords={isEn ? "Red Gate Projects, Luxury Egypt Projects, El Gouna Real Estate, Hurghada Projects, New Cairo Compounds" : "مشاريع ريد غيت, مشاريع سكنية مصر, عقارات الجونة, مشاريع الغردقة, كمبوندات القاهرة الجديدة"}
        url="https://red-gate.tech/projects"
        schema={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": isEn ? "Red Gate Egypt Real Estate Projects" : "مشاريع ريد غيت العقارية",
          "url": "https://red-gate.tech/projects",
          "description": isEn ? "All Red Gate real estate projects in Egypt" : "جميع مشاريع ريد غيت العقارية في مصر",
          "itemListElement": projects.slice(0, 10).map((p, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "url": `https://red-gate.tech/projects/${p._id}`,
            "name": p.title
          }))
        }}
      />
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-16 text-right">
           <h1 className="text-4xl md:text-6xl font-black text-on-surface mb-6 italic text-center md:text-right">
             {isEn ? 'Our Latest' : 'أحدث'} <span className="text-primary not-italic">{isEn ? 'Projects' : 'مشاريعنا'}</span>
           </h1>
           <p className="text-on-surface-variant text-lg font-bold max-w-2xl ml-auto text-center md:text-right">
             {isEn ? 'Explore our portfolio of exceptional real estate developments, designed to bring you the highest quality of living and investment opportunities.' : 'استكشف محفظتنا من التطويرات العقارية الاستثنائية، المصممة لتوفر لك أعلى مستويات المعيشة وفرص الاستثمار.'}
           </p>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <AnimatePresence mode="popLayout">
            {projects.length > 0 ? (
              projects.map((project, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={project._id}
                  className="bg-surface-container rounded-[3rem] overflow-hidden group shadow-xl border border-outline-variant/10 flex flex-col md:flex-row relative cursor-pointer"
                  onClick={() => navigate(`/projects/${project._id}`)}
                >
                  <div 
                    onClick={(e) => { e.stopPropagation(); openGallery(project); }}
                    className="w-full md:w-2/5 aspect-[4/3] md:aspect-auto md:min-h-full relative overflow-hidden bg-neutral-100"
                  >
                    {(project.main_image || (project.images && project.images.length > 0)) ? (
                      <img 
                        src={getImageUrl(project.main_image || project.images[0])} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 max-h-[300px] md:max-h-none" 
                        alt={isEn ? project.title_en : project.title} 
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 bg-neutral-200">
                        <Building2 size={48} className="mb-2 opacity-50" />
                        <span className="font-bold text-sm">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-sm text-primary shadow-lg border border-white/20">
                      {project.status === 'active' ? (isEn ? 'Active' : 'نشط') : (isEn ? 'Completed' : 'مكتمل')}
                    </div>
                  </div>
                  <div className="p-8 md:p-10 w-full md:w-3/5 flex flex-col justify-center text-right">
                    <h3 className="text-2xl md:text-3xl font-black text-on-surface mb-2">
                      {isEn ? (project.title_en || project.title) : project.title}
                    </h3>
                    <p className="text-on-surface-variant text-sm md:text-base font-bold leading-relaxed mb-6 line-clamp-3">
                      {isEn ? (project.description_en || project.description) : project.description}
                    </p>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project._id}`); }}
                      className="mt-auto self-start px-6 py-3 bg-primary text-on-primary rounded-2xl font-black flex items-center gap-3 hover:bg-primary/90 transition-colors shadow-lg"
                    >
                      {isEn ? 'Project Details' : 'استعراض الوحدات'} <ArrowLeft size={18} className={isEn ? "rotate-180" : ""} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-32 text-center bg-surface-container rounded-[3rem] border-2 border-dashed border-outline-variant/10"
              >
                <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 size={48} />
                </div>
                <h3 className="text-2xl font-black text-on-surface mb-2">{isEn ? 'No Projects Found' : 'لم نجد مشاريع حالياً'}</h3>
                <p className="text-on-surface-variant font-bold">{isEn ? 'Check back later for updates.' : 'عد لاحقاً لمتابعة أحدث المشاريع.'}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Gallery Lightbox Modal */}
      <AnimatePresence>
        {selectedGallery && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedGallery(null)}
          >
            <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2"><X size={40} /></button>
            <div className="relative w-full max-w-6xl flex items-center justify-center" onClick={e => e.stopPropagation()}>
              <motion.img 
                key={currentImgIdx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={getImageUrl(selectedGallery[currentImgIdx])} 
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                alt="Gallery"
              />
              {selectedGallery.length > 1 && (
                <>
                  <button onClick={() => setCurrentImgIdx((currentImgIdx - 1 + selectedGallery.length) % selectedGallery.length)}
                    className="absolute left-4 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full"><ChevronLeft size={32} /></button>
                  <button onClick={() => setCurrentImgIdx((currentImgIdx + 1) % selectedGallery.length)}
                    className="absolute right-4 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full"><ChevronRight size={32} /></button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
