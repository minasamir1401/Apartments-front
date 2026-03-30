import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RefreshCcw, Image as ImageIcon, Type, Layout, Sparkles, Link as LinkIcon, Upload, Trash2, Plus, ArrowLeft, ArrowRight, X } from 'lucide-react';

const SERVER_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const HeroManager = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState(null); // The slide being edited or added
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const res = await api.get('/hero');
      // Ensure res.data is an array. If it's a single object, wrap it.
      if (Array.isArray(res.data)) {
        setSlides(res.data);
      } else if (res.data) {
        setSlides([res.data]);
      } else {
        setSlides([]);
      }
    } catch (err) {
      console.error('Fetch Hero error:', err);
      setSlides([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingSlide({
      title: 'New Title',
      subtitle: 'New Subtitle',
      highlight: 'NEW',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000',
      button_text: 'استعراض الوحدات',
      button_link: '/apartments',
      display_order: slides.length
    });
    setPreviewUrl('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000');
    setSelectedFile(null);
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    const img = slide.image;
    setPreviewUrl(img.startsWith('/uploads') ? `${SERVER_URL}${img}` : img);
    setSelectedFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا السلايد؟')) return;
    try {
      await api.delete(`/hero/${id}`);
      setSlides(prev => prev.filter(s => (s.id || s._id) !== id));
    } catch (err) {
      alert('خطأ في الحذف');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingSlide(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setEditingSlide(prev => ({ ...prev, image: '' })); // clear old URL if any
    }
  };

  const handleUrlAdd = () => {
    if (urlInput.trim()) {
      setPreviewUrl(urlInput.trim());
      setEditingSlide(prev => ({ ...prev, image: urlInput.trim() }));
      setSelectedFile(null); // Clear file if URL is added
      setUrlInput('');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const formData = new FormData();
      Object.keys(editingSlide).forEach(key => {
         formData.append(key, editingSlide[key]);
      });

      if (selectedFile) {
        formData.append('imageFile', selectedFile);
      }

      if (editingSlide.id || editingSlide._id) {
        // Update
        const id = editingSlide.id || editingSlide._id;
        const res = await api.put(`/hero/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSlides(prev => prev.map(s => (s.id || s._id) === id ? res.data : s));
      } else {
        // Create
        const res = await api.post('/hero', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSlides(prev => [...prev, res.data]);
      }

      setEditingSlide(null);
      setMessage({ type: 'success', text: 'تم الحفظ بنجاح' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Save Hero error:', err);
      setMessage({ type: 'error', text: 'فشل في الحفظ' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32 font-arabic">
      {!editingSlide ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex justify-between items-center">
             <div>
               <h2 className="text-3xl font-black">إدارة شرائح "الهيرو"</h2>
               <p className="text-neutral-400">يمكنك إضافة أكثر من عرض وتغييرهم من هنا</p>
             </div>
             <button 
               onClick={handleCreateNew}
               className="bg-primary text-black px-8 h-14 rounded-2xl font-black flex items-center gap-3 hover:bg-neutral-900 hover:text-white transition-all shadow-xl"
             >
               <Plus size={20} /> إضافة شريحة جديدة
             </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {Array.isArray(slides) && slides.map(slide => (
               <motion.div 
                 key={slide.id}
                 layout
                 className="bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl transition-all group"
               >
                 <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={slide.image?.startsWith('/uploads') ? `${SERVER_URL}${slide.image}` : slide.image} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt="" 
                    />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-bold">
                       Order: {slide.display_order}
                    </div>
                 </div>
                 <div className="p-6">
                    <h3 className="font-bold text-lg mb-1 truncate">{slide.title}</h3>
                    <p className="text-neutral-400 text-xs truncate mb-6">{slide.subtitle}</p>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => handleEdit(slide)}
                         className="flex-grow bg-neutral-50 hover:bg-neutral-100 text-neutral-800 h-12 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-neutral-100"
                       >
                          <RefreshCcw size={16} /> تعديل
                       </button>
                       <button 
                         onClick={() => handleDelete(slide.id)}
                         className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-100"
                       >
                          <Trash2 size={18} />
                       </button>
                    </div>
                 </div>
               </motion.div>
             ))}
          </div>

          {slides.length === 0 && (
            <div className="p-32 text-center bg-neutral-50 rounded-[3rem] border-2 border-dashed border-neutral-100">
               <p className="text-neutral-300 font-bold">لا يوجد شرائح حالياً، ابدأ بإضافة أول شريحة!</p>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-outline-variant/10"
          style={{backgroundColor: 'var(--color-surface-container-lowest)'}}
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
               <button onClick={() => setEditingSlide(null)} className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
                 <X size={24} />
               </button>
               <div>
                 <h2 className="text-2xl font-black">{editingSlide.id ? 'تعديل الشريحة' : 'شريحة جديدة'}</h2>
                 <p className="text-neutral-400 text-sm">أدخل البيانات واحفظ التغييرات</p>
               </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
               <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-neutral-500 mb-2">العنوان</label>
                    <input name="title" value={editingSlide.title} onChange={handleChange} className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none font-bold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-500 mb-2">الترتيب</label>
                    <input type="number" name="display_order" value={editingSlide.display_order} onChange={handleChange} className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none font-bold" />
                  </div>
               </div>
               
               <div>
                  <label className="block text-sm font-bold text-neutral-500 mb-2">النص المفرغ (Highlight)</label>
                  <input name="highlight" value={editingSlide.highlight} onChange={handleChange} className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none font-bold" />
               </div>

               <div>
                  <label className="block text-sm font-bold text-neutral-500 mb-2">العنوان الفرعي (Chip)</label>
                  <input name="subtitle" value={editingSlide.subtitle} onChange={handleChange} className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none" />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-neutral-500 mb-2">نص الزر</label>
                    <input name="button_text" value={editingSlide.button_text} onChange={handleChange} className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-neutral-500 mb-2">رابط الزر</label>
                    <input name="button_link" value={editingSlide.button_link} onChange={handleChange} className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none" />
                 </div>
               </div>
            </div>

            <div className="space-y-6">
               <label className="block text-sm font-bold text-neutral-500 mb-2">صورة الخلفية</label>
               <div onClick={() => fileInputRef.current?.click()} className="aspect-video rounded-[2rem] border-2 border-dashed border-outline-variant/30 bg-surface-low flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all overflow-hidden relative group">
                  {previewUrl ? (
                    <img src={previewUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <Upload size={32} className="text-on-surface-variant/30" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">تغيير الصورة</div>
               </div>
               <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

               <div className="flex gap-2">
                 <input 
                   placeholder="أو أضف رابط صورة مباشر هنا..."
                   value={urlInput}
                   onChange={e => setUrlInput(e.target.value)}
                   className="flex-grow px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none text-sm"
                 />
                 <button 
                   onClick={handleUrlAdd}
                   className="bg-neutral-100 px-4 rounded-xl font-bold text-xs"
                 >
                   إضافة
                 </button>
               </div>
            </div>
          </div>

          <div className="mt-12 flex gap-4">
             <button onClick={handleSave} disabled={saving} className="bg-neutral-900 text-white px-12 h-16 rounded-2xl font-bold flex items-center gap-3 shadow-2xl disabled:opacity-50">
                {saving ? <RefreshCcw className="animate-spin" /> : <Save />} حفظ
             </button>
             <button onClick={() => setEditingSlide(null)} className="px-12 h-16 rounded-2xl font-bold text-neutral-400 hover:text-black transition-colors">إلغاء</button>
          </div>
        </motion.div>
      )}

      {message && (
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`fixed bottom-10 right-10 px-8 py-4 rounded-2xl font-bold shadow-2xl z-[999] ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
           {message.text}
        </motion.div>
      )}
    </div>
  );
};

export default HeroManager;
