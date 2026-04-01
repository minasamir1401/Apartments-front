import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ArrowRight, X, ChevronRight, ChevronLeft, MapPin, Ruler, Tag, Phone, CalendarCheck, Plus, CheckCircle2, User, Send } from 'lucide-react';
import SEO from '../components/SEO';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  // Booking Form State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStatus, setBookingStatus] = useState('idle'); // idle, loading, success
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    notes: ''
  });

  const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  const WHATSAPP_NUMBER = '01203311567';

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const getImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${API_BASE}${url}`;
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setBookingStatus('loading');
    
    try {
      const payload = {
        name: bookingForm.name,
        phone: bookingForm.phone,
        notes: bookingForm.notes,
        projectId: project._id,
        projectTitle: project.title,
        price: project.unit_types?.[0]?.price || 'N/A'
      };

      await axios.post(`${API_BASE}/api/bookings`, payload);
      setBookingStatus('success');

      // Construct WhatsApp message with ALL details
      const msg = isEn 
        ? `Hello, I'm interested in reserving a unit in "${project.title_en || project.title}".\n\n` +
          `📍 Location: ${project.location_en || project.location}\n` +
          `📝 Details: ${project.description_en || project.description}\n\n` +
          `My Contact: ${bookingForm.name} (${bookingForm.phone})\n` +
          `Notes: ${bookingForm.notes}`
        : `السلام عليكم، أرغب في حجز وحدة في مشروع "${project.title}".\n\n` +
          `📍 الموقع: ${project.location || project.location_en}\n` +
          `📝 الوصف: ${project.description}\n\n` +
          `الاسم: ${bookingForm.name}\n` +
          `رقم الهاتف: ${bookingForm.phone}\n` +
          `ملاحظات: ${bookingForm.notes}`;

      const waLink = `https://wa.me/20${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      
      // Delay redirect to show success state
      setTimeout(() => {
        window.open(waLink, '_blank');
        setShowBookingModal(false);
        setBookingStatus('idle');
      }, 2000);
    } catch (err) {
      alert('Error submitting booking');
      setBookingStatus('idle');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-surface pt-20">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!project) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface pt-20">
      <h2 className="text-2xl font-black mb-4">Project not found</h2>
      <button onClick={() => navigate('/projects')} className="bg-primary text-white px-6 py-2 rounded-xl">Back to Projects</button>
    </div>
  );

  const allImages = [];
  if (project.main_image) allImages.push(project.main_image);
  if (Array.isArray(project.images)) allImages.push(...project.images);

  const directWhatsappLink = `https://wa.me/20${WHATSAPP_NUMBER}?text=${encodeURIComponent(isEn ? `Hello, I am interested in project: ${project.title}` : `السلام عليكم، أنا مهتم بمشروع: ${project.title}`)}`;

  return (
    <div className="min-h-screen bg-surface pb-24 pt-20" dir={isEn ? 'ltr' : 'rtl'}>
      <SEO
        title={isEn ? (project.title_en || project.title) + ' | Red Gate Egypt' : project.title + ' | ريد غيت'}
        description={(isEn ? (project.description_en || project.description) : project.description)?.substring(0, 160)}
        url={`https://red-gate.tech/projects/${project._id}`}
        image={getImageUrl(project.main_image || (project.images && project.images[0]))}
        type="article"
        schema={{
          "@context": "https://schema.org",
          "@type": "RealEstateListing",
          "name": isEn ? (project.title_en || project.title) : project.title,
          "description": isEn ? (project.description_en || project.description) : project.description,
          "image": getImageUrl(project.main_image || (project.images && project.images[0])),
          "url": `https://red-gate.tech/projects/${project._id}`,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": isEn ? (project.location_en || project.location) : project.location,
            "addressCountry": "EG"
          }
        }}
      />
      {/* Hero Section */}
      <div className="h-[50vh] md:h-[60vh] relative overflow-hidden">
        <img 
          src={getImageUrl(project.main_image || (project.images && project.images[0]))} 
          className="w-full h-full object-cover" 
          alt={project.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-bottom p-8">
          <div className="container mx-auto">
             <motion.button 
               whileHover={{ x: isEn ? 5 : -5 }}
               onClick={() => navigate('/projects')}
               className="bg-white/10 backdrop-blur-md text-white p-3 rounded-2xl mb-6 hover:bg-white/20 transition-all flex items-center gap-2"
             >
               <ArrowRight className={isEn ? "rotate-180" : ""} /> {isEn ? 'Back' : 'الرجوع'}
             </motion.button>
             <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-4xl md:text-6xl font-black text-white mb-4"
             >
               {isEn ? (project.title_en || project.title) : project.title}
             </motion.h1>
             <div className="flex items-center gap-4 text-white/80 font-bold">
               <span className="bg-primary px-4 py-1 rounded-full text-xs uppercase shadow-lg">
                 {isEn ? project.status : (project.status === 'active' ? 'نشط' : (project.status === 'completed' ? 'مكتمل' : 'قيد الإنشاء'))}
               </span>
               <span className="flex items-center gap-2 drop-shadow-md"><MapPin size={16}/> {isEn ? (project.location_en || project.location) : (project.location || project.location_en)}</span>
             </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Info */}
        <div className="lg:col-span-2 space-y-12">
          
          <section>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
               <h2 className="text-3xl font-black text-on-surface">{isEn ? 'About the Project' : 'عن المشروع'}</h2>
               {/* Reservation Button - Opens Modal */}
               <motion.button 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => setShowBookingModal(true)}
                 className="flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-green-700 transition-all"
               >
                 <CalendarCheck size={24}/> {isEn ? 'Book Now' : 'زرار حجز'}
               </motion.button>
            </div>
            <p className="text-lg text-on-surface-variant leading-relaxed font-bold whitespace-pre-line bg-surface-container p-8 rounded-[3rem] border border-outline-variant/10 shadow-sm">
              {isEn ? (project.description_en || project.description) : project.description}
            </p>
            {(project.details || project.details_en) && (
              <div className="mt-8 text-on-surface-variant/80 font-medium whitespace-pre-line border-t border-dashed border-outline-variant/20 pt-8 px-4">
                {isEn ? (project.details_en || project.details) : (project.details || project.details_en)}
              </div>
            )}
          </section>

          {/* Unit Types Section */}
          <section className="bg-surface-container p-8 md:p-10 rounded-[3rem] border border-outline-variant/10 shadow-xl overflow-hidden relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
             <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                <Building2 size={32} className="text-primary"/>
                {isEn ? 'Unit Types & Pricing' : 'نماذج الوحدات والأسعار'}
             </h2>
             <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse" dir={isEn ? 'ltr' : 'rtl'}>
                   <thead>
                      <tr className="border-b-2 border-primary/20">
                         <th className="py-4 px-2 font-black text-primary text-sm uppercase">{isEn ? 'Type' : 'النوع'}</th>
                         <th className="py-4 px-2 font-black text-primary text-sm uppercase">{isEn ? 'Size' : 'المساحة'}</th>
                         <th className="py-4 px-2 font-black text-primary text-sm uppercase">{isEn ? 'Price' : 'السعر'}</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-outline-variant/10">
                      {(project.unit_types || []).map((unit, idx) => (
                        <tr key={idx} className="hover:bg-primary/5 transition-colors">
                           <td className="py-5 px-2 font-black text-on-surface">{unit.title}</td>
                           <td className="py-5 px-2 font-bold text-on-surface-variant flex items-center gap-2 italic">
                              <Ruler size={16}/> {unit.size} {isEn ? 'sqm' : 'م²'}
                           </td>
                           <td className="py-5 px-2 font-black text-primary text-lg">
                              {unit.price.includes(isEn ? '$' : 'ج.م') || unit.price.includes('EGP') ? unit.price : `${unit.price} ${isEn ? 'EGP' : 'ج.م'}`}
                           </td>
                        </tr>
                      ))}
                      {(!project.unit_types || project.unit_types.length === 0) && (
                        <tr>
                          <td colSpan="3" className="py-10 text-center text-neutral-400 font-bold italic">
                            {isEn ? 'Contact us for units and pricing details' : 'اتصل بنا للحصول على تفاصيل الوحدات والأسعار'}
                          </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </section>

          {/* Gallery Section */}
          <section>
             <h2 className="text-3xl font-black mb-8">{isEn ? 'Project Gallery' : 'معرض الصور'}</h2>
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {allImages.map((img, idx) => (
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    whileTap={{ scale: 0.95 }}
                    key={idx} 
                    onClick={() => { setSelectedGallery(allImages); setCurrentImgIdx(idx); }}
                    className="group relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer shadow-xl bg-neutral-100 border border-outline-variant/10"
                  >
                    <img src={getImageUrl(img)} className="w-full h-full object-cover group-hover:blur-[2px] transition-all duration-700" alt={`Gallery ${idx}`} />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Plus size={40} className="text-white drop-shadow-2xl" />
                    </div>
                  </motion.div>
                ))}
             </div>
          </section>

        </div>

        {/* Right Column: CTA */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-6">
            <div className="bg-primary p-8 md:p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <h3 className="text-2xl font-black mb-4 italic tracking-tighter">{isEn ? 'Interested?' : 'هل أنت مهتم؟'}</h3>
              <p className="font-bold opacity-90 mb-8 leading-relaxed">
                {isEn ? 'Reserve your unit today and join the Athar family.' : 'احجز وحدتك اليوم وانضم إلى عائلة أثر.'}
              </p>
              <div className="space-y-4">
                 <motion.button 
                   whileHover={{ y: -5 }}
                   onClick={() => setShowBookingModal(true)}
                   className="w-full bg-white text-primary py-5 rounded-2xl font-black text-center flex items-center justify-center gap-3 hover:shadow-2xl transition-all"
                 >
                   <CalendarCheck size={24}/> {isEn ? 'Reserve Now' : 'زرار حجز'}
                 </motion.button>
                 <a 
                   href={directWhatsappLink} target="_blank" rel="noopener noreferrer"
                   className="w-full bg-primary-dark/40 border border-white/20 text-white py-5 rounded-2xl font-black text-center flex items-center justify-center gap-3 hover:bg-white/10 transition-all mb-4"
                 >
                   <Phone size={24}/> {isEn ? 'Contact Sales' : 'تواصل مع المبيعات'}
                 </a>
              </div>
            </div>
            
            <div className="bg-surface-container p-8 rounded-[3rem] border border-outline-variant/10 shadow-lg">
               <h4 className="font-black text-lg mb-4 flex items-center gap-2">
                 <MapPin size={24} className="text-primary"/> 
                 {isEn ? 'Project Location' : 'موقع المشروع'}
               </h4>
               <p className="font-bold text-on-surface-variant leading-relaxed">
                 {isEn ? (project.location_en || project.location || 'New Cairo, Egypt') : (project.location || project.location_en || 'القاهرة الجديدة، مصر')}
               </p>
               {project.map_link && (
                 <a 
                   href={project.map_link} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-primary/5 text-primary border border-primary/20 rounded-2xl font-black hover:bg-primary hover:text-white transition-all shadow-sm"
                 >
                   <MapPin size={16} /> {t('view_on_map')}
                 </a>
               )}
            </div>

            <div className="bg-neutral-800 p-8 rounded-[3rem] text-white shadow-xl flex items-center justify-between">
               <div>
                 <h4 className="font-black text-sm opacity-50 uppercase">{isEn ? 'Current Status' : 'حالة المشروع'}</h4>
                 <span className="font-black text-xl italic">
                   {isEn ? project.status : (project.status === 'active' ? 'نشط' : (project.status === 'completed' ? 'مكتمل' : 'قيد الإنشاء'))}
                 </span>
               </div>
               <div className={`w-12 h-12 rounded-full flex items-center justify-center ${project.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-primary/20 text-primary'}`}>
                  <Building2 size={24} />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
          >
             <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               className="bg-surface w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl relative"
               onClick={e => e.stopPropagation()}
             >
                <button onClick={() => setShowBookingModal(false)} className="absolute top-6 left-6 p-2 h-12 w-12 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"><X size={24} /></button>
                
                <div className="p-10 md:p-12">
                   {bookingStatus === 'success' ? (
                     <div className="text-center py-10">
                        <motion.div 
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                           <CheckCircle2 size={48} />
                        </motion.div>
                        <h2 className="text-3xl font-black mb-2">{isEn ? 'Booking Received!' : 'تم استلام طلبك!'}</h2>
                        <p className="text-on-surface-variant font-bold mb-8">{isEn ? 'Redirecting to WhatsApp for consultation...' : 'نقوم الآن بتوجيهك للواتساب للمتابعة...'}</p>
                     </div>
                   ) : (
                     <>
                        <h2 className="text-3xl font-black mb-2">{isEn ? 'Project Reservation' : 'حجز وحدة في المشروع'}</h2>
                        <p className="text-on-surface-variant font-bold mb-8 italic">{isEn ? 'Fill in your details and we will contact you immediately.' : 'اترك بياناتك وسنقوم بالتواصل معك فوراً.'}</p>
                        
                        <form onSubmit={submitBooking} className="space-y-6">
                           <div>
                              <label className="block text-sm font-black mb-2 flex items-center gap-2">
                                <User size={16} className="text-primary"/> {isEn ? 'Full Name' : 'الأسم الكامل'}
                              </label>
                              <input 
                                required
                                className="w-full bg-surface-container px-6 py-4 rounded-2xl outline-none focus:ring-2 ring-primary border-none font-bold"
                                value={bookingForm.name}
                                onChange={e => setBookingForm({...bookingForm, name: e.target.value})}
                                placeholder={isEn ? 'Enter your name' : 'ادخل اسمك بالكامل'}
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-black mb-2 flex items-center gap-2">
                                <Phone size={16} className="text-primary"/> {isEn ? 'Phone Number' : 'رقم الهاتف'}
                              </label>
                              <input 
                                required
                                type="tel"
                                className="w-full bg-surface-container px-6 py-4 rounded-2xl outline-none focus:ring-2 ring-primary border-none font-bold text-left"
                                value={bookingForm.phone}
                                onChange={e => setBookingForm({...bookingForm, phone: e.target.value})}
                                placeholder={isEn ? '01XXXXXXXXX' : 'رقم الواتساب'}
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-black mb-2">{isEn ? 'Notes (Optional)' : 'ملاحظات (اختياري)'}</label>
                              <textarea 
                                className="w-full bg-surface-container px-6 py-4 rounded-2xl outline-none focus:ring-2 ring-primary border-none font-bold h-32"
                                value={bookingForm.notes}
                                onChange={e => setBookingForm({...bookingForm, notes: e.target.value})}
                                placeholder={isEn ? 'Any specific unit you like?' : 'أي ملاحظات أو طلب خاص؟'}
                              />
                           </div>
                           
                           <button 
                             disabled={bookingStatus === 'loading'}
                             className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-3 mt-4"
                           >
                             {bookingStatus === 'loading' ? (
                               <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                             ) : (
                               <> <Send size={24}/> {isEn ? 'Confirm & Reserve' : 'تأكيد وحجز'} </>
                             )}
                           </button>
                        </form>
                     </>
                   )}
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
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

export default ProjectDetails;
