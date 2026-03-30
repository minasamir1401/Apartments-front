import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Info, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BookingStatus = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [phone, setPhone] = useState(localStorage.getItem('bookingPhone') || '');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStatus = async (phoneNum) => {
    if (!phoneNum) return;
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      const res = await axios.get(`${API_BASE}/api/bookings`);
      const filtered = res.data.filter(b => b.phone === phoneNum);
      setResults(filtered);
      if (filtered.length === 0) setError(t('status_not_found'));
    } catch (err) {
      setError(t('status_error'));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const savedPhone = localStorage.getItem('bookingPhone');
    if (savedPhone) {
      fetchStatus(savedPhone);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    localStorage.setItem('bookingPhone', phone);
    fetchStatus(phone);
  };

  return (
    <div className="container mx-auto px-6 py-20 max-w-2xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black mb-4 italic text-on-surface">{t('status_title')}</h1>
        <p className="text-on-surface-variant font-bold">{t('status_subtitle')}</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-4 mb-16">
        <input 
          required
          type="tel" 
          placeholder={t('status_phone_placeholder')}
          className="input-field flex-grow text-left font-bold"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button disabled={loading} className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap px-10 h-16 min-w-[140px] shadow-xl">
          {loading ? t('status_searching') : <><Search className="w-5 h-5" /> {t('search_btn')}</>}
        </button>
      </form>

      {error && <div className="text-center p-8 bg-red-50 text-red-600 rounded-3xl">{error}</div>}

      <div className="space-y-6">
        {results?.map((res) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={res._id} 
            className="p-8 rounded-[2.5rem] shadow-lg border border-outline-variant/10"
            style={{backgroundColor: 'var(--color-surface-container-lowest)'}}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-on-surface-variant/40 text-xs block mb-1 uppercase tracking-widest font-black">{t('status_id')}</span>
                <span className="font-mono text-sm font-black">#{res._id.slice(-6)}</span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${
                res.status === 'approved' ? 'bg-green-50 text-green-600' :
                res.status === 'rejected' ? 'bg-red-50 text-red-600' :
                'bg-amber-50 text-amber-600'
              }`}>
                {res.status === 'approved' ? <CheckCircle className="w-4 h-4" /> : 
                 res.status === 'rejected' ? <XCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                {res.status === 'approved' ? t('status_approved') : 
                 res.status === 'rejected' ? t('status_rejected') : t('status_pending')}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <span className="text-on-surface-variant/40 text-xs block mb-1 font-black">{t('status_name')}</span>
                <span className="font-black text-on-surface">{res.name}</span>
              </div>
              <div>
                <span className="text-on-surface-variant/40 text-xs block mb-1 font-black">{t('status_price')}</span>
                <span className="font-black text-primary">{res.price.toLocaleString()} {t('currency')}</span>
              </div>
            </div>

            <div className="p-4 rounded-3xl flex items-center justify-between text-sm bg-surface-low border border-outline-variant/10">
              <div className="flex items-center gap-3 text-on-surface font-bold">
                <Info className="w-4 h-4 text-primary" />
                {t('status_dates')}: {new Date(res.checkIn).toLocaleDateString(isEn ? 'en-US' : 'ar-EG')} - {new Date(res.checkOut).toLocaleDateString(isEn ? 'en-US' : 'ar-EG')}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BookingStatus;
