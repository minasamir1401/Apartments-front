import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { Save, Layout, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SiteSettingsManager = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [settings, setSettings] = useState({ show_filters: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        setSettings(res.data);
      } catch (err) {
        console.error('Fetch settings error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await api.patch('/settings', settings);
      setMessage({ type: 'success', text: isEn ? 'Settings updated successfully' : 'تم تحديث الإعدادات بنجاح' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: isEn ? 'Failed to update settings' : 'فشل تحديث الإعدادات' });
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
    <div className="max-w-4xl mx-auto space-y-8 pb-32 font-arabic">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-outline-variant/10" style={{backgroundColor: 'var(--color-surface-container-lowest)'}}>
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-primary/10 text-primary rounded-2xl">
            <Layout size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black">{isEn ? 'Site Configuration' : 'إعدادات الموقع العامة'}</h2>
            <p className="text-neutral-400 text-sm">{isEn ? 'Control global elements of your website' : 'التحكم في ظهور العناصر الأساسية في الموقع'}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-6 bg-neutral-50 rounded-3xl border border-neutral-100 hover:border-primary/20 transition-all group">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${settings.show_filters ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {settings.show_filters ? <Eye size={20} /> : <EyeOff size={20} />}
              </div>
              <div>
                <h4 className="font-black text-lg">{isEn ? 'Property Filters' : 'فلاتر البحث (شراء / إيجار)'}</h4>
                <p className="text-sm text-neutral-400 font-bold">{isEn ? 'Show or hide the category tabs on the apartments page' : 'إظهار أو إخفاء أزرار الشراء والإيجار في صفحة العقارات'}</p>
              </div>
            </div>
            <button 
              onClick={() => setSettings({ ...settings, show_filters: !settings.show_filters })}
              className={`w-16 h-8 rounded-full relative transition-all duration-300 ${settings.show_filters ? 'bg-primary' : 'bg-neutral-300'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${settings.show_filters ? 'right-9' : 'right-1'}`}></div>
            </button>
          </div>
        </div>

        <div className="mt-12">
          <button 
            onClick={handleSave} 
            disabled={saving} 
            className="bg-neutral-900 text-white px-12 h-16 rounded-2xl font-bold flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={20} />}
            {isEn ? 'Save Settings' : 'حفظ الإعدادات'}
          </button>
        </div>
      </div>

      {message && (
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`fixed bottom-10 right-10 px-8 py-4 rounded-2xl font-bold shadow-2xl z-[999] ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
           {message.text}
        </motion.div>
      )}
    </div>
  );
};

export default SiteSettingsManager;
