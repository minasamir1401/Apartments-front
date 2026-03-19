import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ArrowLeft, ArrowRight, Building2, MapPin, SlidersHorizontal } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';

const Apartments = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  // Initial filter from URL or 'all'
  const urlCategory = searchParams.get('category');
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(urlCategory || 'all'); // all, buy, rent

  useEffect(() => {
    const fetchApts = async () => {
      setLoading(true);
      try {
        const API_BASE = import.meta.env.VITE_API_URL || '';
        const res = await axios.get(`${API_BASE}/api/apartments${location.search}`);
        setApartments(res.data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApts();
    
    // Sync UI filter state
    const cat = searchParams.get('category');
    if (cat) setFilter(cat);
    else setFilter('all');
  }, [location.search]);

  const filteredApts = apartments.filter(apt => {
    if (filter === 'all') return true;
    if (filter === 'buy') return apt.priceType !== 'per_night';
    if (filter === 'rent') return apt.priceType === 'per_night';
    return true;
  });

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-surface">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-on-surface-variant text-xl font-black italic animate-pulse">{t('loading_properties')}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface pt-32 pb-24">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-16 text-right">
           <h1 className="text-4xl md:text-6xl font-black text-on-surface mb-6 italic">
             {t('discover_your_opportunity')} <span className="text-primary not-italic">{t('real_estate_opportunity')}</span>
           </h1>
           <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-on-surface-variant text-lg font-bold max-w-2xl">
                {t('apartments_intro_text')}
              </p>
              
              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2 mb-10">
                <button 
                  onClick={() => navigate('/apartments')}
                  className={`px-8 py-3 rounded-2xl font-black transition-all ${filter === 'all' ? 'bg-primary text-on-primary shadow-lg' : 'bg-surface-container text-on-surface hover:bg-primary/10'}`}
                >
                  {t('filter_all')}
                </button>
                <button 
                  onClick={() => navigate('/apartments?category=buy')}
                  className={`px-8 py-3 rounded-2xl font-black transition-all ${filter === 'buy' ? 'bg-primary text-on-primary shadow-lg' : 'bg-surface-container text-on-surface hover:bg-primary/10'}`}
                >
                  {t('search_buy')}
                </button>
                <button 
                  onClick={() => navigate('/apartments?category=rent')}
                  className={`px-8 py-3 rounded-2xl font-black transition-all ${filter === 'rent' ? 'bg-primary text-on-primary shadow-lg' : 'bg-surface-container text-on-surface hover:bg-primary/10'}`}
                >
                  {t('search_rent')}
                </button>
              </div>
           </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredApts.length > 0 ? (
              filteredApts.map((apt) => (
                <PropertyCard 
                  key={apt._id} 
                  property={apt} 
                  onClick={() => navigate(`/apartments/${apt._id}`)} 
                />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-32 text-center bg-surface-container rounded-[3rem] border-2 border-dashed border-outline-variant/10"
              >
                <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={48} />
                </div>
                <h3 className="text-2xl font-black text-on-surface mb-2">لم نجد نتائج تطابق اختيارك</h3>
                <p className="text-on-surface-variant font-bold">حاول اختيار فئة أخرى أو العودة لاحقاً</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default Apartments;
