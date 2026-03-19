import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, LogIn } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const res = await axios.post(`${API_BASE}/api/admin/login`, formData);
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('بيانات الدخول غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-20 flex justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-12 rounded-[3rem] shadow-2xl border border-neutral-100"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold">تسجيل دخول المسؤول</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-center text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-semibold mb-2 pr-2">اسم المستخدم</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-neutral-400 w-5 h-5" />
              <input 
                required
                type="text" 
                className="input-field pl-12"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 pr-2">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-neutral-400 w-5 h-5" />
              <input 
                required
                type="password" 
                className="input-field pl-12"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="btn-primary w-full h-14 text-lg flex justify-center items-center gap-2"
          >
            {loading ? <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin"></div> : <><LogIn className="w-5 h-5" /> دخول</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
