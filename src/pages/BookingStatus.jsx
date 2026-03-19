import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Info, CheckCircle, Clock, XCircle } from 'lucide-react';

const BookingStatus = () => {
  const [phone, setPhone] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const res = await axios.get(`${API_BASE}/api/bookings`);
      const filtered = res.data.filter(b => b.phone === phone);
      setResults(filtered);
      if (filtered.length === 0) setError('لم يتم العثور على أي حجوزات لهذا الرقم');
    } catch (err) {
      setError('حدث خطأ في البحث');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-20 max-w-2xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">متابعة حالة الحجز</h1>
        <p className="text-neutral-500">أدخل رقم الهاتف المستخدم في الحجز لعرض التفاصيل.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-4 mb-16">
        <input 
          required
          type="tel" 
          placeholder="رقم الهاتف (012...)"
          className="input-field flex-grow text-left"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button disabled={loading} className="btn-primary flex items-center gap-2 whitespace-nowrap px-10 h-14">
          {loading ? "جاري البحث..." : <><Search className="w-5 h-5" /> بحث</>}
        </button>
      </form>

      {error && <div className="text-center p-8 bg-red-50 text-red-600 rounded-3xl">{error}</div>}

      <div className="space-y-6">
        {results?.map((res) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={res._id} 
            className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-neutral-100"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-neutral-400 text-xs block mb-1 uppercase tracking-widest font-bold">رقم الطلب</span>
                <span className="font-mono text-sm">#{res._id.slice(-6)}</span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${
                res.status === 'approved' ? 'bg-green-50 text-green-600' :
                res.status === 'rejected' ? 'bg-red-50 text-red-600' :
                'bg-amber-50 text-amber-600'
              }`}>
                {res.status === 'approved' ? <CheckCircle className="w-4 h-4" /> : 
                 res.status === 'rejected' ? <XCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                {res.status === 'approved' ? 'تم القبول' : 
                 res.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <span className="text-neutral-400 text-xs block mb-1">الاسم</span>
                <span className="font-bold">{res.name}</span>
              </div>
              <div>
                <span className="text-neutral-400 text-xs block mb-1">المبلغ</span>
                <span className="font-bold text-primary">{res.price} ج.م</span>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-neutral-500">
                <Info className="w-4 h-4" />
                تاريخ الإقامة: {new Date(res.checkIn).toLocaleDateString('ar-EG')} - {new Date(res.checkOut).toLocaleDateString('ar-EG')}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BookingStatus;
