import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Check, Save, Image, Link } from 'lucide-react';
import api from '../utils/api';

const AMENITIES_OPTIONS = [
  { id: 'wifi', label: 'واي فاي 5G', iconName: 'Wifi' },
  { id: 'wind', label: 'تكييف مركزي', iconName: 'Wind' },
  { id: 'kitchen', label: 'مطبخ كامل', iconName: 'ChefHat' },
  { id: 'tv', label: 'سينما منزلية', iconName: 'Tv' },
  { id: 'parking', label: 'بركنج مؤمن', iconName: 'Car' },
  { id: 'security', label: 'أمن خاص', iconName: 'ShieldCheck' },
  { id: 'coffee', label: 'ركن قهوة', iconName: 'Coffee' },
  { id: 'furnish', label: 'فرش فاخر', iconName: 'CheckCircle' },
];

const EMPTY_APT = {
  title: '', title_en: '', price: 0, priceType: 'daily', location: '', location_en: '', beds: 1, baths: 1, size: '',
  description: '', description_en: '', images: [], amenities: [], rules: [],
  type: 'apartment', category: 'buy', map_link: ''
};

const ApartmentManager = () => {
  const [apartments, setApartments] = useState([]);
  const [editingApt, setEditingApt] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchApts = async () => {
    try {
      const res = await api.get('/apartments');
      setApartments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setApartments([]);
    }
  };

  useEffect(() => { fetchApts(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingApt._id) {
        await api.patch(`/apartments/${editingApt._id}`, editingApt);
      } else {
        await api.post('/apartments', editingApt);
      }
      setShowModal(false);
      fetchApts();
      alert('✅ تم الحفظ بنجاح!');
    } catch (err) {
      alert('❌ خطأ في الحفظ، تأكد من تشغيل السيرفر');
    } finally {
      setSaving(false);
    }
  };

  const deleteApt = async (id) => {
    if (!window.confirm('هل تريد حذف هذه الشقة نهائياً؟')) return;
    try {
      await api.delete(`/apartments/${id}`);
      fetchApts();
    } catch (err) {
      alert('خطأ في الحذف');
    }
  };

  const toggleAmenity = (id) => {
    const amenities = [...(editingApt.amenities || [])];
    const idx = amenities.findIndex(a => a.id === id);
    if (idx > -1) {
      amenities[idx] = { ...amenities[idx], enabled: !amenities[idx].enabled };
    } else {
      const opt = AMENITIES_OPTIONS.find(o => o.id === id);
      amenities.push({ ...opt, enabled: true });
    }
    setEditingApt({ ...editingApt, amenities });
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    try {
      const res = await api.post('/apartments/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = res.data;
      if (data.urls) {
        setEditingApt(prev => ({ ...prev, images: [...(prev.images || []), ...data.urls] }));
      }
    } catch (err) {
      alert('خطأ في الرفع');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (idx) => {
    setEditingApt(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setEditingApt(prev => ({ ...prev, images: [...(prev.images || []), newImageUrl.trim()] }));
    setNewImageUrl('');
  };

  const SERVER_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  const getFullImg = (url) => url?.startsWith('/uploads') ? `${SERVER_URL}${url}` : url;

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-xl md:text-2xl font-bold">إدارة الشقق</h2>
        <button
          onClick={() => { setEditingApt({ ...EMPTY_APT }); setShowModal(true); }}
          className="btn-primary flex items-center justify-center gap-2 px-6 h-12 w-full sm:w-auto text-sm md:text-base"
        >
          <Plus size={20} /> إضافة شقة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {Array.isArray(apartments) && apartments.map(apt => (
          <div key={apt._id} className="p-4 md:p-6 rounded-3xl border border-outline-variant/10 flex flex-col xs:flex-row items-center gap-4 shadow-sm hover:shadow-lg transition-all" style={{backgroundColor: 'var(--color-surface-container-lowest)'}}>
            {apt.images?.[0] && (
              <img src={getFullImg(apt.images[0])} className="w-full xs:w-20 h-40 xs:h-20 rounded-2xl object-cover flex-shrink-0" alt="" />
            )}
            <div className="flex-grow text-center xs:text-right">
              <h3 className="font-bold text-base md:text-lg leading-tight">{apt.title}</h3>
              <p className="text-neutral-400 text-xs md:text-sm mt-1">
                {apt.location} · {Number(apt.price).toLocaleString()} ج.م
              </p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center xs:justify-start">
                <span className="bg-surface-dim text-on-surface-variant text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {apt.beds} غرف · {apt.baths} حمام · {apt.size}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 justify-center xs:justify-start">
                <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-black">
                  {apt.category === 'buy' ? 'شراء' : 'إيجار'}
                </span>
                <span className="bg-neutral-100 text-neutral-500 text-[10px] px-2 py-0.5 rounded-full font-black">
                  {apt.type === 'apartment' ? 'شقة' : apt.type === 'villa' ? 'فيلا' : apt.type === 'twinhouse' ? 'توين هاوس' : 'محل تجاري'}
                </span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0 w-full xs:w-auto justify-center mt-2 xs:mt-0">
              <button onClick={() => { setEditingApt(apt); setShowModal(true); }} className="p-3 bg-blue-50 text-blue-500 rounded-xl flex-1 xs:flex-none flex justify-center hover:bg-blue-100">
                <Edit size={16} />
              </button>
              <button onClick={() => deleteApt(apt._id)} className="p-3 bg-red-50 text-red-500 rounded-xl flex-1 xs:flex-none flex justify-center hover:bg-red-100">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && editingApt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-2 md:p-4 font-cairo">
          <div className="rounded-[2rem] md:rounded-[3rem] w-full max-w-4xl max-h-[95vh] overflow-y-auto p-4 md:p-10 relative shadow-2xl border border-outline-variant/10" style={{backgroundColor: 'var(--color-surface-container-lowest)'}}>
            <button onClick={() => setShowModal(false)} className="absolute top-4 left-4 p-2 hover:bg-neutral-100 rounded-full z-[110] bg-white shadow-sm">
              <X size={20} />
            </button>
            <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center px-10">
              {editingApt._id ? 'تعديل الشقة' : 'إضافة شقة جديدة'}
            </h2>

            <form onSubmit={handleSave} className="space-y-6 md:space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs md:text-sm font-bold mb-2 text-primary pr-2">اسم الشقة (عربي) *</label>
                  <input className="input-field h-12 md:h-14 text-sm font-bold" value={editingApt.title}
                    onChange={e => setEditingApt({ ...editingApt, title: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-bold mb-2 text-neutral-400 pr-2 italic">Apartment Name (English)</label>
                  <input className="input-field h-12 md:h-14 text-sm font-bold border-dashed" value={editingApt.title_en || ''}
                    onChange={e => setEditingApt({ ...editingApt, title_en: e.target.value })} placeholder="E.g. Luxury Apartment in Cairo" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs md:text-sm font-bold mb-2 text-primary pr-2">الموقع (عربي) *</label>
                  <input className="input-field h-12 md:h-14 text-sm font-bold" value={editingApt.location}
                    onChange={e => setEditingApt({ ...editingApt, location: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-bold mb-2 text-neutral-400 pr-2 italic">Location (English)</label>
                  <input className="input-field h-12 md:h-14 text-sm font-bold border-dashed" value={editingApt.location_en || ''}
                    onChange={e => setEditingApt({ ...editingApt, location_en: e.target.value })} placeholder="E.g. New Cairo, Egypt" />
                </div>
              </div>

              {/* Price + Type */}
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs md:text-sm font-bold mb-2 text-neutral-600 pr-2">السعر *</label>
                  <input type="number" className="input-field h-12 md:h-14 text-sm font-bold" value={editingApt.price}
                    onChange={e => setEditingApt({ ...editingApt, price: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-bold mb-2 text-neutral-600 pr-2">نوع المعاملة</label>
                  <select className="input-field h-12 md:h-14 text-sm font-bold" value={editingApt.category || 'buy'}
                    onChange={e => setEditingApt({ ...editingApt, category: e.target.value })}>
                    <option value="buy">شراء</option>
                    <option value="rent">إيجار</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-bold mb-2 text-neutral-600 pr-2">نوع العقار</label>
                  <select className="input-field h-12 md:h-14 text-sm font-bold" value={editingApt.type || 'apartment'}
                    onChange={e => setEditingApt({ ...editingApt, type: e.target.value })}>
                    <option value="apartment">شقة</option>
                    <option value="villa">فيلا</option>
                    <option value="twinhouse">توين هاوس</option>
                    <option value="commercial">محل تجاري</option>
                  </select>
                </div>
                <div className={editingApt.category === 'buy' ? 'opacity-30 pointer-events-none' : ''}>
                  <label className="block text-xs md:text-sm font-bold mb-2 text-neutral-600 pr-2">نوع الإيجار</label>
                  <select className="input-field h-12 md:h-14 text-sm font-bold" value={editingApt.priceType}
                    onChange={e => setEditingApt({ ...editingApt, priceType: e.target.value })}>
                    <option value="daily">يومي / ليلة</option>
                    <option value="monthly">شهري</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-bold mb-2 text-neutral-600 pr-2">عدد الغرف</label>
                  <input type="number" className="input-field h-12 md:h-14 text-sm font-bold" value={editingApt.beds}
                    onChange={e => setEditingApt({ ...editingApt, beds: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-bold mb-2 text-neutral-600 pr-2">عدد الحمامات</label>
                  <input type="number" className="input-field h-12 md:h-14 text-sm font-bold" value={editingApt.baths}
                    onChange={e => setEditingApt({ ...editingApt, baths: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs md:text-sm font-bold mb-2 text-neutral-600 pr-2">المساحة (متر²)</label>
                  <input 
                    type="text" 
                    className="input-field h-12 md:h-14 text-sm font-bold" 
                    value={editingApt.size || ''}
                    onChange={e => setEditingApt({ ...editingApt, size: e.target.value })}
                    placeholder="مثال: 150م"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-bold mb-2 text-neutral-600 pr-2">رابط الخريطة (Google Maps)</label>
                  <input 
                    type="text" 
                    className="input-field h-12 md:h-14 text-sm font-bold" 
                    value={editingApt.map_link || ''}
                    onChange={e => setEditingApt({ ...editingApt, map_link: e.target.value })}
                    placeholder="ضع رابط Location هنا (مثل: https://maps.app.goo.gl/...)"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs md:text-sm font-bold mb-2 text-primary pr-2">وصف الشقة (عربي)</label>
                  <textarea className="input-field h-24 md:h-32 resize-none text-sm font-bold" value={editingApt.description}
                    onChange={e => setEditingApt({ ...editingApt, description: e.target.value })}
                    placeholder="وصف مفصل عن الشقة..." />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-bold mb-2 text-neutral-400 pr-2 italic">Description (English)</label>
                  <textarea className="input-field h-24 md:h-32 resize-none text-sm font-bold border-dashed" value={editingApt.description_en || ''}
                    onChange={e => setEditingApt({ ...editingApt, description_en: e.target.value })}
                    placeholder="Detailed English description..." />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs md:text-sm font-bold mb-4 flex items-center gap-2 text-neutral-600 pr-2">
                  <Image size={18} /> صور الشقة ({editingApt.images?.length || 0} صورة)
                </label>
                <div className="flex flex-col gap-3 mb-6">
                  <div className="relative border-2 border-dashed border-outline-variant/30 rounded-3xl p-6 md:p-10 text-center hover:border-primary transition-all group" style={{backgroundColor: 'var(--color-surface-container-low)'}}>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-surface rounded-2xl group-hover:bg-primary/10 transition-colors">
                        <Plus className="text-on-surface-variant group-hover:text-primary" />
                      </div>
                      <span className="text-xs md:text-sm font-bold text-on-surface-variant">
                        {isUploading ? '⏳ جاري الرفع... الرجاء الانتظار' : 'اضغط لرفع الصور من جهازك'}
                      </span>
                      <span className="text-[10px] md:text-xs text-on-surface-variant/60">
                        {isUploading ? 'جاري السحب والرفع للسيرفر...' : '(لرفع صور متعددة حددها كلها معاً)'}
                      </span>
                    </div>
                  </div>

                  {/* Add URL Field */}
                  <div className="flex flex-col sm:flex-row gap-2 w-full mt-2">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Link size={16} className="text-neutral-400" />
                      </div>
                      <input 
                        type="text" 
                        value={newImageUrl}
                        onChange={e => setNewImageUrl(e.target.value)}
                        placeholder="أو أضف رابط صورة مباشر هنا (مثال: https://...)" 
                        className="input-field h-12 text-sm pr-9 w-full"
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={handleAddImageUrl}
                      disabled={!newImageUrl.trim()}
                      className="btn-primary h-12 px-6 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} /> إضافة الرابط
                    </button>
                  </div>

                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 overflow-x-hidden">
                  {editingApt.images?.map((url, idx) => (
                    <div key={idx} className="relative group rounded-2xl overflow-hidden h-24 md:h-28 shadow-sm">
                      <img src={getFullImg(url)} className="w-full h-full object-cover" alt={`img-${idx}`} />
                      <button type="button" onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-lg">
                        <X size={12} />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-2 left-2 bg-primary text-black text-[8px] md:text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">رئيسية</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-xs md:text-sm font-bold mb-4 pr-2">المميزات والمرافق</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                  {AMENITIES_OPTIONS.map(opt => {
                    const active = editingApt.amenities?.find(a => a.id === opt.id)?.enabled;
                    return (
                      <button type="button" key={opt.id} onClick={() => toggleAmenity(opt.id)}
                        className={`p-2.5 rounded-xl md:rounded-2xl border transition-all text-[10px] md:text-xs font-bold flex items-center gap-2 ${active ? 'bg-primary text-white border-primary shadow-sm' : 'bg-surface-low border-outline-variant/10 text-on-surface-variant'}`}>
                        {active ? <Check size={14} /> : <Plus size={14} />} {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rules */}
              <div>
                <label className="block text-xs md:text-sm font-bold mb-2 pr-2">قوانين المكان (سطر لكل قانون)</label>
                <textarea className="input-field h-24 md:h-32 resize-none text-sm font-bold"
                  value={editingApt.rules?.join('\n')}
                  onChange={e => setEditingApt({ ...editingApt, rules: e.target.value.split('\n').filter(r => r) })}
                  placeholder={"ممنوع التدخين\nممنوع الحيوانات الأليفة\nوقت الدخول بعد 2 ظهرًا"} />
              </div>

              <div className="px-2 pb-2">
                <button type="submit" disabled={saving}
                  className="btn-primary w-full h-14 md:h-18 text-base md:text-xl flex justify-center items-center gap-3 shadow-xl">
                  {saving ? <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Save size={20} />}
                  {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentManager;
