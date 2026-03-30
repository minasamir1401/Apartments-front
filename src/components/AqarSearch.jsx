import React, { useState } from 'react';
import { Search, MapPin, Building2, CircleDollarSign, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AqarSearch = ({ areas = [] }) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('buy'); // buy or rent
  const [searchTerm, setSearchTerm] = useState('');
  const [propType, setPropType] = useState('all');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (propType !== 'all') params.append('type', propType);
    params.append('category', activeTab);
    navigate(`/apartments?${params.toString()}`);
  };

  const displayAreas = areas.length > 0 ? areas : [
    { name: 'القاهرة الجديدة', name_en: 'New Cairo' },
    { name: 'الشيخ زايد', name_en: 'Sheikh Zayed' },
    { name: '6 أكتوبر', name_en: '6th of October' },
    { name: 'مصر الجديدة', name_en: 'Heliopolis' },
    { name: 'العاصمة الإدارية', name_en: 'New Capital' }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Tabs Layout */}
      <div className="flex gap-1 mb-0 w-full max-w-[320px] relative z-10 mr-7">
        <button 
          onClick={() => setActiveTab('buy')}
          className={`flex-1 py-4 rounded-t-2xl font-black transition-all text-xl ${activeTab === 'buy' ? 'bg-surface text-primary shadow-[0_-4px_15px_rgba(0,0,0,0.05)]' : 'bg-on-surface/10 text-white hover:bg-on-surface/20'}`}
        >
          {t('search_buy')}
        </button>
        <button 
          onClick={() => setActiveTab('rent')}
          className={`flex-1 py-4 rounded-t-2xl font-black transition-all text-xl ${activeTab === 'rent' ? 'bg-surface text-primary shadow-[0_-4px_15px_rgba(0,0,0,0.05)]' : 'bg-on-surface/10 text-white hover:bg-on-surface/20'}`}
        >
          {t('search_rent')}
        </button>
      </div>

      {/* Search Bar container */}
      <div className="bg-surface rounded-b-[2rem] rounded-tr-[2rem] shadow-2xl p-2 md:p-3 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-2">
          
          {/* Location Input */}
          <div className="flex-grow w-full lg:w-auto relative group">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
              <MapPin size={20} />
            </div>
            <input 
              type="text" 
              placeholder={t('search_placeholder')}
              className="w-full h-16 md:h-20 pr-12 pl-4 bg-surface-container border-none rounded-2xl md:rounded-[1.5rem] outline-none font-bold text-on-surface focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all font-cairo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-2 items-stretch">
            {/* Property Type Selector */}
            <div className="relative group min-w-[160px]">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-hover:text-primary transition-colors">
                <Building2 size={18} />
              </div>
              <select 
                className="w-full h-16 md:h-20 pr-12 pl-10 bg-surface-container border-none rounded-2xl outline-none font-bold text-on-surface appearance-none cursor-pointer hover:bg-surface-container-high transition-all font-cairo"
                value={propType}
                onChange={(e) => setPropType(e.target.value)}
              >
                <option value="all">{t('search_prop_type')}</option>
                <option value="apartment">{t('prop_apartment')}</option>
                <option value="villa">{t('prop_villa')}</option>
                <option value="twinhouse">{t('prop_twinhouse')}</option>
                <option value="commercial">{t('prop_commercial')}</option>
              </select>
              <ChevronDown size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
            </div>


            {/* Search Button */}
            <button 
              onClick={handleSearch}
              className="btn-primary h-16 md:h-20 px-12 flex items-center justify-center gap-3 text-xl font-black shadow-lg shadow-primary/20"
            >
              <Search size={22} className="stroke-[3]" /> {t('search_btn')}
            </button>
          </div>

        </div>
      </div>

      {/* Fast Shortcuts */}
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        {displayAreas.map((area, idx) => {
          const areaName = isEn ? (area.name_en || area.name) : area.name;
          return (
            <button 
              key={idx}
              onClick={() => { setSearchTerm(areaName); handleSearch(); }}
              className="px-5 py-2 bg-on-surface/10 backdrop-blur-md text-white text-sm font-bold rounded-full border border-outline-variant hover:bg-on-surface/20 transition-all font-cairo"
            >
              {areaName}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AqarSearch;
