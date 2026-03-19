import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Star, ArrowLeft, ArrowRight, Play, MapPin, Coffee, Wifi, Wind, ShieldCheck, Heart, Camera, Layout, Building2, Key, Gem, Sparkles, CheckCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';
const API = `${API_BASE}/api/hero`;
const SERVER_URL = API_BASE; 

const Home = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get(API);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setSlides(res.data);
        } else if (res.data && !Array.isArray(res.data)) {
          setSlides([res.data]);
        } else {
          // Fallback if empty
          setSlides([{
            title: 'ATHAR LUXURY',
            subtitle: 'Distinctive Quality Residences',
            highlight: 'ATHAR',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000',
            button_text: 'استعراض الوحدات',
            button_link: '/apartments'
          }]);
        }
      } catch (err) {
        console.error('Home Hero fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  // Auto-play timer
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
    <div className="overflow-hidden bg-white">
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
              >
                <div className="mb-8 px-6 py-2 bg-primary/20 backdrop-blur-xl border border-primary/40 rounded-full inline-flex items-center gap-3">
                   <Sparkles className="text-primary w-4 h-4 fill-primary" />
                   <span className="text-primary font-bold text-xs uppercase tracking-[0.4em]">{current.subtitle}</span>
                </div>

                <div className="overflow-hidden mb-6">
                  <h1 className="text-4xl sm:text-6xl md:text-9xl font-black text-white leading-none tracking-tighter uppercase">
                    {current.title.split(' ')[0]} <span className="text-transparent stroke-text">{current.highlight}</span>
                  </h1>
                </div>

                <div className="mt-12 flex flex-col items-center gap-6">
                  <Link to={current.button_link || '/apartments'} className="group relative inline-block">
                    <motion.div 
                       animate={{ scale: [1, 1.05, 1] }} 
                       transition={{ repeat: Infinity, duration: 2 }}
                       className="absolute -inset-4 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all"
                    />
                    <button className="relative bg-primary text-black px-8 sm:px-16 h-16 sm:h-20 rounded-full font-black text-lg sm:text-xl flex items-center gap-4 hover:bg-white transition-colors duration-500 shadow-2xl">
                       {current.button_text} <ArrowLeft />
                    </button>
                  </Link>

                  {/* Indicators */}
                  <div className="flex gap-3 mt-12">
                     {slides.map((_, i) => (
                       <button 
                         key={i} 
                         onClick={() => setCurrentSlide(i)}
                         className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-12 bg-primary' : 'w-4 bg-white/20 hover:bg-white/40'}`}
                       />
                     ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
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

      {/* NEW SECTION: Focused on Property Features & Diversity */}

      {/* NEW SECTION: Focused on Property Features & Diversity */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="text-center mb-16 md:mb-24"
           >
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black mb-6">تنوع فريد في <span className="text-primary italic">المساحات</span></h2>
              <p className="text-neutral-500 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                 نحن نوفر لك باقة متنوعة من الخيارات التي تلبي كافة الاحتياجات؛ من الاستوديوهات الذكية إلى الفلل الفاخرة، مع وعد ثابت بالجودة الفائقة.
              </p>
           </motion.div>

           <div className="grid md:grid-cols-3 gap-10">
              {[
                { title: "أجنحة رويال", desc: "إطلالات مباشرة وتصاميم ملكية كلاسيكية.", icon: <Building2 /> },
                { title: "استوديوهات ذكية", desc: "استغلال مثالي للمساحات بتكنولوجيا حديثة.", icon: <Key /> },
                { title: "وحدات بانورامية", desc: "طوابق عليا مع واجهات زجاجية ممتدة.", icon: <Layout /> },
                { title: "أحياء سكنية رقية", desc: "تواجد في أكثر المناطق طلباً وأماناً.", icon: <MapPin /> },
                { title: "خدمات متكاملة", desc: "تجهيز كامل بأحدث الأجهزة العالمية.", icon: <Gem /> },
                { title: "أثاث مختار بعناية", desc: "لمسات فنية في كل قطعة أثاث بالوحدة.", icon: <Camera /> }
              ].map((box, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-10 bg-neutral-50 rounded-[3rem] hover:bg-neutral-900 transition-all group border border-neutral-100"
                >
                   <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-8 border border-neutral-100 group-hover:bg-primary transition-colors">
                      <div className="text-black opacity-100 fill-none" style={{ color: '#000000' }}>
                        {React.cloneElement(box.icon, { size: 32, strokeWidth: 2.5 })}
                      </div>
                   </div>
                   <h4 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">{box.title}</h4>
                   <p className="text-neutral-500 group-hover:text-neutral-400 font-light leading-relaxed">{box.desc}</p>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* NEW SECTION: Property Gallery Style Content */}
      <section className="py-20 bg-neutral-900 overflow-hidden">
        <div className="container mx-auto px-6">
           <div className="grid lg:grid-cols-2 gap-20 items-center">
              <motion.div 
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className="space-y-6"
              >
                 <h2 className="text-3xl sm:text-5xl text-white font-black leading-tight">جاهزية تامة <br /> <span className="text-primary">لكافة المتطلبات</span></h2>
                 <p className="text-neutral-400 text-lg font-light leading-relaxed">
                    جميع وحداتنا تخضع لنظام صيانة وتطوير دوري لضمان بقائها في أبهى صورها دائماً. نحن نهتم بكل التفاصيل الدقيقة من الإضاءة إلى جودة الخامات المستخدمة.
                 </p>
                 <ul className="space-y-4 pt-6">
                    <li className="flex items-center gap-4 text-white font-bold"><CheckCircle className="text-primary" size={20}/> تشطيبات ألترا لوكس</li>
                    <li className="flex items-center gap-4 text-white font-bold"><CheckCircle className="text-primary" size={20}/> مطابخ مجهزة بالكامل بالكهربائيات</li>
                    <li className="flex items-center gap-4 text-white font-bold"><CheckCircle className="text-primary" size={20}/> تأمين خاص وأنظمة دخول إلكترونية</li>
                 </ul>
              </motion.div>

              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-2 gap-6"
              >
                 <img src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=400" className="rounded-3xl h-64 w-full object-cover" alt="Interior 1" />
                 <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400" className="rounded-3xl h-64 w-full object-cover mt-12" alt="Interior 2" />
                 <img src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=400" className="rounded-3xl h-64 w-full object-cover -mt-12" alt="Interior 3" />
                 <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=400" className="rounded-3xl h-64 w-full object-cover" alt="Interior 4" />
              </motion.div>
           </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .stroke-text {
          -webkit-text-stroke: 2px white;
          color: transparent;
        }
        @media (max-width: 768px) {
          .stroke-text { -webkit-text-stroke: 1px white; }
        }
      `}} />
    </div>
  );
};

export default Home;
