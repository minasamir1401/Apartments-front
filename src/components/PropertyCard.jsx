import React, { useState } from 'react';
import { MapPin, BedDouble, Bath, Square, Heart, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property, onClick, linkUrl }) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [imgLoaded, setImgLoaded] = useState(false);
  const SERVER_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  const firstImage = property.images?.[0];
  const mainImage = !firstImage
    ? null
    : firstImage.startsWith('http') || firstImage.startsWith('data:')
    ? firstImage
    : `${SERVER_URL}${firstImage.startsWith('/') ? firstImage : '/' + firstImage}`;

  const cardContent = (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-surface rounded-[1.5rem] overflow-hidden border border-outline-variant/10 hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col h-full"
      onClick={!linkUrl ? onClick : undefined}
    >
      {/* Image Section — explicit 4:3 prevents CLS */}
      <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
        {/* Skeleton shown until image loads */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
        )}
        {mainImage && (
          <img 
            src={mainImage} 
            alt={isEn && property.title_en ? property.title_en : property.title}
            width={400}
            height={300}
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            className="p-2 bg-surface/20 backdrop-blur-md rounded-full text-white hover:bg-primary transition-colors z-10"
            aria-label={t('save_property') || 'حفظ العقار'}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <Heart size={18} />
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
           <span className="bg-primary text-on-primary px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
             {property.priceType === 'per_night' ? t('rent') : t('buy')}
           </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-black text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
            {isEn && property.title_en ? property.title_en : property.title}
          </h3>
        </div>

        <div className="flex items-center gap-1 text-on-surface-variant text-sm mb-4">
          <MapPin size={14} className="text-primary flex-shrink-0" />
          <span className="line-clamp-1">
            {isEn && property.location_en ? property.location_en : property.location}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-4 border-y border-outline-variant/10 mb-4">
          <div className="flex flex-col items-center gap-1">
            <BedDouble size={18} className="text-on-surface-variant" />
            <span className="text-xs font-bold text-on-surface">{property.beds} {t('rooms')}</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-outline-variant/10">
            <Bath size={18} className="text-on-surface-variant" />
            <span className="text-xs font-bold text-on-surface">{property.baths} {t('baths')}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Square size={18} className="text-on-surface-variant" />
            <span className="text-xs font-bold text-on-surface">{property.size} {t('sqm')}</span>
          </div>
        </div>

        {/* Price Section */}
        <div className="mt-auto flex justify-between items-center">
          <div>
            <span className="text-primary text-2xl font-black">
              {Number(property.price).toLocaleString()}
            </span>
            <span className="text-on-surface-variant text-sm font-bold mr-1">{t('currency')}</span>
          </div>
          <button 
            className="text-primary hover:bg-primary/5 p-2 rounded-xl transition-colors z-10"
            aria-label="مشاركة العقار"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigator.clipboard?.writeText(window.location.origin + '/apartments/' + property._id); }}
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return linkUrl ? <Link to={linkUrl} className="block h-full no-underline">{cardContent}</Link> : cardContent;
};

export default PropertyCard;
