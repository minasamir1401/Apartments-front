import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import { ar } from 'date-fns/locale';
import { CheckCircle, AlertCircle, Calendar, Home, ArrowLeft } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";

const Booking = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const passedData = location.state || {};

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    checkIn: null,
    checkOut: null,
    notes: '',
    apartmentTitle: passedData.aptTitle || 'لم يتم اختيار شقة',
    price: passedData.price || 0,
    apartmentId: passedData.aptId || ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.checkIn || !formData.checkOut) {
      alert("يرجى اختيار تواريخ الدخول والخروج");
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      await axios.post(`${API_BASE}/api/bookings`, {
        ...formData,
        checkIn: formData.checkIn.toISOString(),
        checkOut: formData.checkOut.toISOString()
      });
      
      // Save phone to localStorage for auto-tracking
      localStorage.setItem('bookingPhone', formData.phone);
      
      setStatus({ type: 'success', message: t('booking_success_msg') || 'Booking request received successfully!' });
      setTimeout(() => navigate('/status'), 3000);
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || t('status_error')
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-20 max-w-4xl">
      <div className="text-center mb-10 md:mb-16">
         <motion.div initial={{scale:0}} animate={{scale:1}} className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <Calendar size={32} />
         </motion.div>
        <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter leading-tight text-on-surface">
          <Trans i18nKey="booking_hero_title">
            تأكيد تفاصيل <span className="text-primary italic">إقامتك</span>
          </Trans>
        </h2>
        <p className="text-neutral-400 text-base md:text-xl font-light px-4">
          {t('booking_hero_subtitle')} <span className="font-bold text-black border-b-2 border-primary leading-loose">{formData.apartmentTitle}</span>
        </p>
      </div>

      <motion.form 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={handleSubmit} 
        className="p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.08)] border border-outline-variant/10 relative overflow-hidden bg-white"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>

        {status.type && (
          <div className={`p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center gap-4 mb-8 transition-all ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {status.type === 'success' ? <CheckCircle className="w-8 h-8 shrink-0" /> : <AlertCircle className="w-8 h-8 shrink-0" />}
            <span className="font-bold text-sm md:text-lg">{status.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-3">
             <label className="text-[10px] md:text-sm font-black uppercase tracking-widest text-neutral-400 mr-4">{t('booking_checkin_label')}</label>
             <div className="relative group">
                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-primary z-10" size={18} />
                <DatePicker
                  selected={formData.checkIn}
                  onChange={(date) => setFormData({...formData, checkIn: date})}
                  selectsStart
                  startDate={formData.checkIn}
                  endDate={formData.checkOut}
                  minDate={new Date()}
                  placeholderText={t('booking_checkin_placeholder')}
                  locale={i18n.language === 'ar' ? ar : undefined}
                  dateFormat="dd/MM/yyyy"
                  className="w-full bg-neutral-50 border-2 border-neutral-100 h-16 px-6 pr-14 rounded-2xl font-bold focus:border-primary focus:bg-white outline-none transition-all cursor-pointer"
                  required
                />
             </div>
          </div>

          <div className="space-y-3">
             <label className="text-[10px] md:text-sm font-black uppercase tracking-widest text-neutral-400 mr-4">{t('booking_checkout_label')}</label>
             <div className="relative group">
                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-primary z-10" size={18} />
                <DatePicker
                  selected={formData.checkOut}
                  onChange={(date) => setFormData({...formData, checkOut: date})}
                  selectsEnd
                  startDate={formData.checkIn}
                  endDate={formData.checkOut}
                  minDate={formData.checkIn || new Date()}
                  placeholderText={t('booking_checkout_placeholder')}
                  locale={i18n.language === 'ar' ? ar : undefined}
                  dateFormat="dd/MM/yyyy"
                  className="w-full bg-neutral-50 border-2 border-neutral-100 h-16 px-6 pr-14 rounded-2xl font-bold focus:border-primary focus:bg-white outline-none transition-all cursor-pointer"
                  required
                />
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="font-bold text-sm mr-4 text-neutral-600">{t('booking_name')}</label>
                 <input 
                    required 
                    name="name" 
                    className="w-full h-16 px-8 bg-neutral-50 border-2 border-neutral-100 rounded-2xl focus:border-primary outline-none transition-all font-bold" 
                    placeholder={t('booking_name_placeholder')}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="font-bold text-sm mr-4 text-neutral-600">{t('booking_phone')}</label>
                 <input 
                    required 
                    name="phone" 
                    type="tel"
                    className="w-full h-16 px-8 bg-neutral-50 border-2 border-neutral-100 rounded-2xl focus:border-primary outline-none text-left font-bold" 
                    placeholder="01xxxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                 />
              </div>
           </div>

           <div className="p-6 md:p-8 bg-neutral-900 rounded-[2rem] flex flex-col sm:flex-row justify-between items-center text-white gap-4">
              <div className="flex items-center gap-4 text-center sm:text-right">
                 <div className="hidden sm:flex p-3 bg-primary/20 rounded-2xl text-primary"><Home size={24} /></div>
                  <div>
                    <h5 className="font-bold text-sm md:text-base">{formData.apartmentTitle}</h5>
                    <p className="text-[10px] md:text-xs text-neutral-400">
                      {t('booking_est_price')}
                    </p>
                  </div>
              </div>
              <div className="text-2xl md:text-3xl font-black text-primary">{formData.price.toLocaleString()} <span className="text-xs md:text-sm font-bold opacity-50">{t('currency')}</span></div>
           </div>

           <button 
             disabled={loading}
             className="btn-primary w-full h-18 md:h-20 text-lg md:text-2xl font-black group relative overflow-hidden"
           >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              {loading ? (t('booking_loading') || "...") : (t('booking_confirm_btn') || "Confirm")}
           </button>
        </div>
      </motion.form>

      {/* DatePicker Custom CSS */}
      <style>{`
        .react-datepicker-wrapper { width: 100%; }
        .react-datepicker {
          font-family: 'Cairo', sans-serif;
          border: none;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
          border-radius: 2rem;
          padding: 1rem;
        }
        .react-datepicker__header {
          background: white;
          border-bottom: 2px border-neutral-50;
        }
        .react-datepicker__day--selected {
          background-color: #b20007 !important;
          border-radius: 1rem;
          color: white !important;
          font-weight: bold;
        }
        .react-datepicker__day--keyboard-selected { background: none; color: #b20007; }
        .react-datepicker__day:hover { background-color: #f7f7f7 !important; border-radius: 1rem; }
      `}</style>
    </div>
  );
};

export default Booking;
