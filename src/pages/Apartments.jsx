import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import { MapPin, Users, Maximize, ArrowLeft, Share2, Copy, Check } from 'lucide-react';
import { useState as useLocalState } from 'react';

const DEFAULT_APARTMENTS = [
  { _id: '1', title: "شقة رويال 1 - إطلالة النيل البانورامية", images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200"], price: 2500, location: "المعادي", beds: 3, size: "180م", priceType: 'daily' },
  { _id: '2', title: "جناح جاردن فيو - التجمع الخامس", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200"], price: 1800, location: "التجمع الخامس", beds: 2, size: "120م", priceType: 'daily' },
  { _id: '3', title: "شقة سكاى لاين - الشيخ زايد", images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200"], price: 2200, location: "الشيخ زايد", beds: 3, size: "200م", priceType: 'daily' },
  { _id: '4', title: "فيلا ريزيدنس - الشروق", images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200"], price: 4500, location: "الشروق", beds: 5, size: "450م", priceType: 'daily' },
  { _id: '5', title: "استوديو لاكشري - الزمالك", images: ["https://images.unsplash.com/photo-1536376074432-8d63d592bf0d?auto=format&fit=crop&q=80&w=1200"], price: 1200, location: "الزمالك", beds: 1, size: "65م", priceType: 'daily' },
  { _id: '6', title: "شقة بريميوم - مصر الجديدة", images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200"], price: 2100, location: "مصر الجديدة", beds: 3, size: "160م", priceType: 'daily' }
];

const shareApartment = async (apt, setCopied) => {
  const pageUrl = `${window.location.origin}/apartments/${apt._id}`;
  const shareData = {
    title: apt.title,
    text: `🏡 ${apt.title} - ${apt.location}`,
    url: pageUrl,
  };
  // Use native Web Share API if available (mobile)
  if (navigator.share) {
    try { await navigator.share(shareData); } catch (_) {}
  } else {
    // Fallback: copy link to clipboard
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(apt._id);
      setTimeout(() => setCopied(null), 2000);
    });
  }
};

const Apartments = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopied] = useState(null);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || '';
    axios.get(`${API_BASE}/api/apartments`)
      .then(res => {
        // Use server data if available; only fallback to defaults if server unreachable
        if (Array.isArray(res.data)) {
          setApartments(res.data.length > 0 ? res.data : DEFAULT_APARTMENTS);
        } else {
          setApartments(DEFAULT_APARTMENTS);
        }
      })
      .catch(() => setApartments(DEFAULT_APARTMENTS))
      .finally(() => setLoading(false));
  }, []);

  const SERVER_URL = import.meta.env.VITE_API_URL || '';
  const getFullImg = (url) => url?.startsWith('/uploads') ? `${SERVER_URL}${url}` : url;

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="text-neutral-400 font-bold">جاري تحميل الوحدات...</span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 md:mb-24 text-center"
      >
        <h1 className="text-3xl sm:text-6xl md:text-7xl font-black mb-4 md:mb-6 tracking-tighter italic leading-tight">
          اكتشف <span className="text-primary not-italic">مجموعتنا</span>
        </h1>
        <p className="text-neutral-400 text-sm sm:text-lg md:text-xl font-light px-4">قطع فنية في صورة عقارات، بانتظار صاحب الذوق الرفيع.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16">
        {apartments.map((apt, index) => (
          <motion.div
            key={apt._id}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <div className="group relative bg-white rounded-[2rem] overflow-hidden border border-neutral-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">

              {/* Image Section */}
              <div className="relative h-72 md:h-80 overflow-hidden bg-neutral-100">
                <img src={getFullImg(apt.images?.[0])} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={apt.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100"></div>

                  {/* Price Tag */}
                  <div className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-black text-sm sm:text-lg shadow-2xl">
                    {apt.price} ج.م
                    <span className="text-[10px] sm:text-xs text-neutral-400 mr-1">/ {apt.priceType === 'monthly' ? 'شهر' : 'ليلة'}</span>
                  </div>

                  {/* Share Link Button */}
                  <button
                    onClick={(e) => { e.preventDefault(); shareApartment(apt, setCopied); }}
                    className={`absolute top-8 left-8 w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl transition-all opacity-0 group-hover:opacity-100 ${
                      copiedId === apt._id ? 'bg-green-500 text-white scale-110' : 'bg-white text-black hover:scale-110'
                    }`}
                    title="مشاركة الرابط"
                  >
                    {copiedId === apt._id ? <Check size={18} /> : <Share2 size={18} />}
                  </button>
                </div>

              {/* Content */}
              <div className="p-5 sm:p-8">
                <div className="flex items-center gap-2 text-neutral-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-3">
                  <MapPin size={12} className="text-primary" /> {apt.location}
                </div>
                <h3 className="text-xl sm:text-2xl font-black mb-6 group-hover:text-primary transition-colors">{apt.title}</h3>

                {/* Info Array */}
                <div className="flex items-center gap-6 text-neutral-500 border-t border-neutral-100 pt-6 mb-6">
                  <span className="flex items-center gap-2 font-bold text-sm"><Users size={16} className="text-primary" /> {apt.beds || 1} غرف</span>
                  <span className="flex items-center gap-2 font-bold text-sm"><Maximize size={16} className="text-primary" /> {apt.size || '--'} م²</span>
                  <span className="text-xs text-neutral-400 font-bold bg-neutral-50 px-3 py-1.5 rounded-full">{apt.priceType === 'monthly' ? 'شهري' : 'يومي'}</span>
                </div>

                <div className="relative opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                  <Link to={`/apartments/${apt._id}`} className="btn-primary w-full h-14 flex items-center justify-center gap-2 text-base font-bold shadow-lg">
                    حجز الوحدة <ArrowLeft size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Apartments;
