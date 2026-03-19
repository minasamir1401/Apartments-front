import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Wifi, Wind, ChefHat, Tv, Car, ShieldCheck, Coffee, Calendar as CalendarIcon,
  MapPin, MessageCircle, ArrowRight, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Share2
} from 'lucide-react';

const ICON_MAP = { Wifi, Wind, ChefHat, Tv, Car, ShieldCheck, Coffee, CheckCircle };

// Fallback logic for details
const DEFAULT_APTS = {
  '1': { title: "شقة رويال 1 - إطلالة النيل البانورامية", price: 2500, location: "المعادي", description: "شقة ملكية فاخرة تطل مباشرة على النيل.", images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"], amenities: [{label: 'واي فاي 5G', iconName: 'Wifi', enabled: true}], rules: ['ممنوع التدخين'] },
  '2': { title: "جناح جاردن فيو - التجمع الخامس", price: 1800, location: "التجمع الخامس", description: "جناح هادئ يطل على مساحات خضراء.", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"], amenities: [{label: 'واي فاي 5G', iconName: 'Wifi', enabled: true}], rules: [] },
};

const ApartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apt, setApt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchApt = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || '';
        const res = await axios.get(`${API_BASE}/api/apartments/${id}`);
        setApt(res.data);
      } catch (err) {
        console.warn("Using default view for details");
        setApt(DEFAULT_APTS[id] || DEFAULT_APTS['1']);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };
    fetchApt();
  }, [id]);

  const SERVER_URL = import.meta.env.VITE_API_URL || '';
  const getFullImg = (url) => url?.startsWith('/uploads') ? `${SERVER_URL}${url}` : url;

  const handleShare = async () => {
    const shareData = {
      title: apt.title,
      text: `شاهد هذه الوحدة المميزة في أثر: ${apt.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse">جاري جلب بيانات الوحدة...</div>;

  const whatsappUrl = `https://wa.me/201234567890?text=${encodeURIComponent(`مرحباً، أود الاستفسار عن ${apt.title}`)}`;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      {usingFallback && (
        <div className="mb-6 md:mb-8 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl flex items-center gap-3 text-xs">
           <AlertCircle size={16} />
           <span>عرض توضيحي للمواصفات الأساسية.</span>
        </div>
      )}

      <Link to="/apartments" className="inline-flex items-center gap-2 text-neutral-400 hover:text-primary mb-6 md:mb-8 transition-colors text-sm">
        <ArrowRight className="w-5 h-5" /> العودة لقائمة الشقق
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16">
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          <div className="relative h-[40vh] md:h-[65vh] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl bg-neutral-200">
             <img src={getFullImg(apt.images?.[activeImgIdx] || apt.images?.[0]) || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'} className="w-full h-full object-cover" />
          </div>
          
          {apt.images?.length > 1 && (
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 no-scrollbar">
              {apt.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImgIdx(idx)}
                  className={`relative h-16 w-24 md:h-20 md:w-32 shrink-0 rounded-[1rem] md:rounded-[1.5rem] overflow-hidden transition-all duration-300 border-2 ${activeImgIdx === idx ? 'border-primary opacity-100 shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                >
                  <img src={getFullImg(img)} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div>
            <div className="flex justify-between items-start gap-4 mb-4">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black leading-tight flex-grow">{apt.title}</h1>
              <button 
                onClick={handleShare}
                className="flex-shrink-0 p-4 bg-neutral-100 hover:bg-primary hover:text-black rounded-2xl transition-all relative group"
                title="مشاركة الوحدة"
              >
                <Share2 size={24} />
                {copied && (
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-3 py-1 rounded-full whitespace-nowrap">
                    تم نسخ الرابط!
                  </span>
                )}
              </button>
            </div>
            <p className="text-lg md:text-xl text-neutral-500 mb-8 md:mb-10 font-light flex items-center gap-2">
              <MapPin className="text-primary" /> {apt.location}
            </p>
            <p className="text-neutral-600 leading-relaxed text-base md:text-lg font-light mb-12 md:mb-16">{apt.description}</p>

            <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">المزايا والمرافق</h3>
            <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {apt.amenities?.filter(a => a.enabled).map((info, idx) => {
                const Icon = ICON_MAP[info.iconName] || CheckCircle;
                return (
                  <div key={idx} className="p-6 md:p-8 bg-neutral-50 rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center gap-3 md:gap-4 hover:bg-white hover:shadow-xl hover:scale-105 transition-all text-neutral-700 cursor-default">
                    <Icon className="text-primary w-6 h-6 md:w-8 md:h-8" />
                    <span className="text-xs md:text-sm font-bold text-center">{info.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="static lg:sticky lg:top-28 bg-white p-6 sm:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border border-neutral-100">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-black mb-2">
              {apt.price} <span className="text-base md:text-lg font-bold text-neutral-400">ج.م</span>
            </h3>
            <p className="text-neutral-400 mb-6 md:mb-8 border-b pb-6 text-xs md:text-sm">
              التكلفة {apt.priceType === 'monthly' ? 'للشهر الواحد' : 'لليلة الواحدة'} شاملة الخدمات
            </p>
            
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/book', { state: { aptTitle: apt.title, price: apt.price, aptId: apt._id || id, priceType: apt.priceType } })}
                className="btn-primary w-full h-14 md:h-18 text-lg md:text-xl"
              >
                احجز الآن
              </button>
              <a href={whatsappUrl} className="w-full h-14 md:h-18 flex justify-center items-center border-2 border-green-500 text-green-600 rounded-full font-bold hover:bg-green-50 transition-all text-sm md:text-base">
                تواصل سريع واتساب
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApartmentDetails;
