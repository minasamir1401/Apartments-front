import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Home, Trash2, Bell, BellOff, BellRing, Building2, Lock, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import ApartmentManager from '../components/ApartmentManager';
import HeroManager from '../components/HeroManager';
import AreaManager from '../components/AreaManager';
import ProjectManager from '../components/ProjectManager';
import api from '../utils/api';


const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'bookings';

  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ totalBookings: 0, totalIncome: 0, expectedIncome: 0, monthlyIncome: 0, pendingCount: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Password Change State
  const [pwData, setPwData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [location.search]);
  const [lastBookingCount, setLastBookingCount] = useState(null);
  const [newBookingAlert, setNewBookingAlert] = useState(null);
  const [notifPermission, setNotifPermission] = useState(
    'Notification' in window ? Notification.permission : 'denied'
  );
  const navigate = useNavigate();

  const enableNotifications = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotifPermission(perm);
    }
  };

  const showNotification = (booking) => {
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(isEn ? '🔔 New Booking!' : '🔔 حجز جديد وصل!', {
        body: `${booking.name} · ${booking.apartmentTitle} · ${booking.price} ${t('currency')}`,
        icon: '/favicon.ico',
        tag: booking._id,
      });
    }
    // Visual alert (always works)
    setNewBookingAlert(booking);
    setTimeout(() => setNewBookingAlert(null), 8000);
  };

  const fetchData = async () => {
    try {
      const [bRes, sRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/admin/stats')
      ]);
      setBookings(bRes.data);
      setStats(sRes.data);
      // Set initial count for polling comparison
      if (lastCountRef.current === null) {
        lastCountRef.current = bRes.data.length;
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testNotification = () => {
    showNotifRef.current && showNotifRef.current({
      name: 'تجريبي - عميل تجريبي',
      apartmentTitle: 'شقة الفلوريدا',
      price: '5000',
    });
  };

  const lastCountRef = useRef(null);
  const showNotifRef = useRef(null);
  showNotifRef.current = showNotification; // Always up-to-date

  useEffect(() => {
    fetchData();
    // Poll every 10 seconds for new bookings
    const interval = setInterval(async () => {
      try {
        const res = await api.get('/bookings');
        const newBookings = res.data;
        const currentCount = newBookings.length;

        if (lastCountRef.current !== null && currentCount > lastCountRef.current) {
          // New booking(s) arrived!
          const newest = newBookings[newBookings.length - 1];
          showNotifRef.current(newest);
        }
        lastCountRef.current = currentCount;
        setBookings(newBookings);
      } catch (_) {}
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      // Update in local bookings array first (optimistic UI)
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
      await api.patch(`/bookings/${id}`, { status });
      fetchData();
    } catch (e) {
      alert('خطأ في التحديث');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(isEn ? 'Delete this booking permanently?' : 'حذف هذا الحجز نهائياً؟')) return;
    setBookings(prev => prev.filter(b => b._id !== id));
    await api.delete(`/bookings/${id}`);
    fetchData();
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwData.newPassword !== pwData.confirmPassword) {
      return setPwMessage({ type: 'error', text: isEn ? "Passwords don't match" : 'كلمات المرور الجديدة غير متطابقة' });
    }
    setPwLoading(true);
    setPwMessage({ type: '', text: '' });
    try {
      await api.post('/admin/change-password', {
        oldPassword: pwData.oldPassword,
        newPassword: pwData.newPassword
      });
      setPwMessage({ type: 'success', text: isEn ? 'Password updated successfully' : 'تم تحديث كلمة المرور بنجاح' });
      setPwData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwMessage({ type: 'error', text: err.response?.data?.message || (isEn ? 'Failed to update password' : 'فشل تحديث كلمة المرور') });
    } finally {
      setPwLoading(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="text-neutral-400 font-bold">{t('loading_data')}</span>
    </div>
  );

  const getStatusBadge = (status) => {
    const map = {
      pending: 'bg-amber-50 text-amber-600 border-amber-200',
      approved: 'bg-green-50 text-green-600 border-green-200',
      rejected: 'bg-red-50 text-red-500 border-red-200',
    };
    const labels = { 
      pending: t('status_pending'), 
      approved: t('status_approved'), 
      rejected: t('status_rejected') 
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${map[status] || map.pending}`}>
        {labels[status] || 'قيد الانتظار'}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-10">

      {/* New Booking Toast Alert */}
      <AnimatePresence>
        {newBookingAlert && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -80, scale: 0.9 }}
            className="fixed top-4 right-4 left-4 sm:left-auto z-[999] bg-neutral-900 text-white p-6 rounded-[2rem] shadow-2xl border border-primary max-w-sm mx-auto sm:mx-0"
            style={{borderLeftWidth: '8px'}}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary rounded-xl flex-shrink-0">
                <BellRing size={20} className="text-black animate-bounce" />
              </div>
              <div>
                <h4 className="font-black text-base">{isEn ? '🔔 New Booking!' : '🔔 حجز جديد وصل!'}</h4>
                <p className="text-neutral-300 text-xs mt-1">{newBookingAlert.name}</p>
                <p className="text-primary font-bold text-sm">{newBookingAlert.apartmentTitle}</p>
                <p className="text-neutral-400 text-xs">{newBookingAlert.price} {t('currency')}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 md:mb-12 gap-6">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold flex items-center gap-3">
          <LayoutDashboard className="text-primary w-6 h-6 md:w-10 md:h-10" /> {t('admin_dashboard')}
        </h1>
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Notification Permission Button */}
          <button
            onClick={testNotification}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-bold border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors text-xs sm:text-sm flex-1 sm:flex-none"
          >
            <BellRing size={14} className="text-primary" />
            {t('admin_test_notif')}
          </button>
          <button
            onClick={enableNotifications}
            title={notifPermission === 'granted' ? t('notif_enabled_title') : t('notif_disabled_title')}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-bold border transition-colors text-xs sm:text-sm flex-1 sm:flex-none ${notifPermission === 'granted' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-amber-50 text-amber-600 border-amber-200 animate-pulse'}`}
          >
            {notifPermission === 'granted' ? <Bell size={14} /> : <BellOff size={14} />}
            {notifPermission === 'granted' ? t('notif_enabled') : t('notif_disabled')}
          </button>
          <button
            onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin/login'); }}
            className="text-red-500 font-bold border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors text-xs sm:text-sm w-full sm:w-auto uppercase tracking-tighter"
          >
            {t('admin_logout')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 md:gap-4 mb-8 md:mb-10 bg-neutral-100 p-1.5 md:p-2 rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 md:px-8 py-2 md:py-3 rounded-xl font-bold transition-all text-sm whitespace-nowrap flex-1 sm:flex-none ${activeTab === 'bookings' ? 'bg-white shadow-sm text-black' : 'text-neutral-400'}`}
        >
          {t('nav_status')} ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('apartments')}
          className={`px-4 md:px-8 py-2 md:py-3 rounded-xl font-bold transition-all text-sm whitespace-nowrap flex-1 sm:flex-none ${activeTab === 'apartments' ? 'bg-white shadow-sm text-black' : 'text-neutral-400'}`}
        >
          {t('admin_manage_apts')}
        </button>
        <button
          onClick={() => setActiveTab('areas')} // Added areas tab
          className={`px-4 md:px-8 py-2 md:py-3 rounded-xl font-bold transition-all text-sm whitespace-nowrap flex-1 sm:flex-none ${activeTab === 'areas' ? 'bg-white shadow-sm text-black' : 'text-neutral-400'}`}
        >
          {t('admin_manage_areas')} {/* Translated label for areas */}
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 md:px-8 py-2 md:py-3 rounded-xl font-bold transition-all text-sm whitespace-nowrap flex-1 sm:flex-none ${activeTab === 'projects' ? 'bg-white shadow-sm text-black' : 'text-neutral-400'}`}
        >
          {isEn ? 'Manage Projects' : 'إدارة المشاريع'}
        </button>
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 md:px-8 py-2 md:py-3 rounded-xl font-bold transition-all text-sm whitespace-nowrap flex-1 sm:flex-none ${activeTab === 'hero' ? 'bg-white shadow-sm text-black' : 'text-neutral-400'}`}
        >
          {t('admin_manage_hero')}
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 md:px-8 py-2 md:py-3 rounded-xl font-bold transition-all text-sm whitespace-nowrap flex-1 sm:flex-none ${activeTab === 'security' ? 'bg-white shadow-sm text-black' : 'text-neutral-400'}`}
        >
          {isEn ? 'Security' : 'الأمان'}
        </button>
      </div>

      {activeTab === 'bookings' ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
            <div className="p-5 sm:p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-outline-variant/10" style={{backgroundColor: 'var(--color-surface-container-lowest)'}}>
              <p className="text-on-surface-variant text-[10px] sm:text-xs md:text-sm mb-1 md:mb-2 italic">{t('admin_total_bookings')}</p>
              <h3 className="text-xl sm:text-2xl md:text-4xl font-black text-on-surface">{stats.totalBookings}</h3>
            </div>
            <div className="p-5 sm:p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-outline-variant/10" style={{backgroundColor: 'var(--color-surface-container-lowest)'}}>
              <p className="text-on-surface-variant text-[10px] sm:text-xs md:text-sm mb-1 md:mb-2 italic">{t('admin_confirmed_income')}</p>
              <h3 className="text-xl sm:text-2xl md:text-4xl font-black text-green-500">{stats.totalIncome} <span className="text-[10px] md:text-sm text-on-surface-variant">{t('currency')}</span></h3>
            </div>
            <div className="p-5 sm:p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-outline-variant/10" style={{backgroundColor: 'var(--color-surface-container-lowest)'}}>
              <p className="text-on-surface-variant text-[10px] sm:text-xs md:text-sm mb-1 md:mb-2 italic">{t('admin_expected_income')}</p>
              <h3 className="text-xl sm:text-2xl md:text-4xl font-black text-primary">{stats.expectedIncome} <span className="text-[10px] md:text-sm text-on-surface-variant">{t('currency')}</span></h3>
            </div>
            <div className="p-5 sm:p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-outline-variant/10" style={{backgroundColor: 'var(--color-surface-container-lowest)'}}>
              <p className="text-on-surface-variant text-[10px] sm:text-xs md:text-sm mb-1 md:mb-2 italic">{t('admin_pending_bookings')}</p>
              <h3 className="text-xl sm:text-2xl md:text-4xl font-black text-amber-500">{stats.pendingCount}</h3>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="rounded-[2rem] md:rounded-[3rem] shadow-xl border border-outline-variant/10 overflow-hidden mb-12" style={{backgroundColor: 'var(--color-surface-container-lowest)'}}>
            <div className="p-6 md:p-8 bg-neutral-900 text-white flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-bold">{t('booking_requests')}</h2>
              <span className="bg-primary text-white px-4 py-1 rounded-full text-xs md:text-sm font-bold">{bookings.length} {t('order')}</span>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-right min-w-[600px]">
                <thead className="bg-neutral-50 text-neutral-400 text-[10px] md:text-xs uppercase tracking-widest">
                  <tr>
                    <th className="p-4 md:p-6 text-right">{t('admin_unit')}</th>
                    <th className="p-4 md:p-6 text-right">{t('admin_client')}</th>
                    <th className="p-4 md:p-6 text-right">{t('status_dates')}</th>
                    <th className="p-4 md:p-6 text-right">{t('status_price')}</th>
                    <th className="p-4 md:p-6 text-right">{t('status')}</th>
                    <th className="p-4 md:p-6 text-center">{t('admin_actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {bookings.length === 0 ? (
                    <tr><td colSpan={6} className="p-16 text-center text-neutral-300 font-bold">{t('status_empty')}</td></tr>
                  ) : bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-neutral-50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-2 font-bold">
                          {b.project_title ? <Building2 className="w-4 h-4 text-primary" /> : <Home className="w-4 h-4 text-primary" />}
                          {b.project_title || b.apartmentTitle || t('not_specified')}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="font-bold">{b.name}</div>
                        <div className="text-neutral-400 text-sm">{b.phone}</div>
                      </td>
                      <td className="p-6 text-sm text-neutral-500">
                        {b.checkIn ? new Date(b.checkIn).toLocaleDateString(isEn ? 'en-US' : 'ar-EG') : '-'} ←
                        {b.checkOut ? new Date(b.checkOut).toLocaleDateString(isEn ? 'en-US' : 'ar-EG') : '-'}
                      </td>
                      <td className="p-6 font-bold text-primary">{b.price?.toLocaleString()} {t('currency')}</td>
                      <td className="p-6">{getStatusBadge(b.status)}</td>
                      <td className="p-6">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleStatusUpdate(b._id, 'approved')}
                            className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition-colors font-bold text-sm px-4"
                          >
                            ✓ {t('admin_approve')}
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(b._id, 'rejected')}
                            className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors font-bold text-sm px-4"
                          >
                            ✕ {t('admin_reject')}
                          </button>
                          <button
                            onClick={() => handleDelete(b._id)}
                            className="p-2 text-neutral-400 hover:bg-neutral-100 rounded-xl transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : activeTab === 'apartments' ? (
        <ApartmentManager />
      ) : activeTab === 'areas' ? ( // Added conditional rendering for AreaManager
        <AreaManager />
      ) : activeTab === 'projects' ? (
        <ProjectManager />
      ) : activeTab === 'hero' ? (
        <HeroManager />
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-outline-variant/10" style={{backgroundColor: 'var(--color-surface-container-lowest)'}}>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-primary/10 text-primary rounded-2xl">
                <Lock size={24} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold">{isEn ? 'Change Password' : 'تغيير كلمة المرور'}</h2>
                <p className="text-neutral-400 text-sm">{isEn ? 'Keep your account secure' : 'حافظ على أمان حسابك'}</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-6">
              {pwMessage.text && (
                <div className={`p-4 rounded-2xl text-center text-sm font-bold ${pwMessage.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                  {pwMessage.text}
                </div>
              )}

              <div>
                <label className="block text-xs md:text-sm font-bold mb-2 text-neutral-600 pr-2">{isEn ? 'Current Password' : 'كلمة المرور الحالية'}</label>
                <input 
                  required
                  type="password" 
                  className="input-field h-14"
                  value={pwData.oldPassword}
                  onChange={(e) => setPwData({...pwData, oldPassword: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-bold mb-2 text-neutral-600 pr-2">{isEn ? 'New Password' : 'كلمة المرور الجديدة'}</label>
                <input 
                  required
                  type="password" 
                  className="input-field h-14"
                  value={pwData.newPassword}
                  onChange={(e) => setPwData({...pwData, newPassword: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-bold mb-2 text-neutral-600 pr-2">{isEn ? 'Confirm New Password' : 'تأكيد كلمة المرور الجديدة'}</label>
                <input 
                  required
                  type="password" 
                  className="input-field h-14"
                  value={pwData.confirmPassword}
                  onChange={(e) => setPwData({...pwData, confirmPassword: e.target.value})}
                />
              </div>

              <button 
                disabled={pwLoading}
                className="btn-primary w-full h-14 md:h-16 text-lg flex justify-center items-center gap-3 shadow-xl"
              >
                {pwLoading ? <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Save size={20} />}
                {pwLoading ? (isEn ? 'Updating...' : 'جاري التحديث...') : (isEn ? 'Save Password' : 'حفظ كلمة المرور الجديدة')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
