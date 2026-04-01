import React, { useState, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import axios from 'axios';

const GoogleMapEmbed = ({ link, title }) => {
  const [resolvedUrl, setResolvedUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!link) return;
    
    // 1. If it's a short link (maps.app.goo.gl), resolve it via backend
    if (link.includes('maps.app.goo.gl')) {
      const resolveLink = async () => {
        setLoading(true);
        try {
          const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
          const res = await axios.get(`${API_BASE}/api/resolve-map?url=${encodeURIComponent(link)}`);
          setResolvedUrl(res.data.resolvedUrl);
        } catch (err) {
          console.error("Resolve error:", err);
          setResolvedUrl(link); // fallback to original
        } finally {
          setLoading(false);
        }
      };
      resolveLink();
    } else {
      setResolvedUrl(link);
    }
  }, [link]);

  if (!link) return null;

  const getFinalEmbedUrl = (url) => {
    if (!url) return null;
    
    // If user pasted iframe, extract src
    if (url.includes('<iframe')) {
      const match = url.match(/src="([^"]+)"/);
      if (match) return match[1];
    }
    
    if (url.includes('/embed')) return url;

    // Extract place name or query from regular/long URL
    if (url.includes('google.com/maps')) {
      // 1. Try to extract query 'q' parameter if it already exists
      const qParam = new URL(url).searchParams.get('q');
      if (qParam) return `https://maps.google.com/maps?q=${encodeURIComponent(qParam)}&output=embed`;

      // 2. Try to extract from path: /maps/place/Place+Name/... or /@lat,lon,zoom
      const placeMatch = url.match(/\/place\/([^\/@]+)/);
      if (placeMatch) return `https://maps.google.com/maps?q=${placeMatch[1]}&output=embed`;
      
      const coordMatch = url.match(/\/@(-?\d+\.\d+,-?\d+\.\d+)/);
      if (coordMatch) return `https://maps.google.com/maps?q=${coordMatch[1]}&output=embed`;
      
      // Default: wrap the whole maps URL in the legacy maps embed query
      return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&output=embed`;
    }

    // Default Fallback
    return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&output=embed`;
  };

  const finalSrc = getFinalEmbedUrl(resolvedUrl);

  if (loading) return (
     <div className="w-full h-[300px] bg-neutral-100 flex flex-col items-center justify-center gap-2 rounded-[2rem] border-2 border-dashed border-primary/20">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-xs font-black text-primary uppercase italic">جاري جلب بيانات الخريطة...</p>
     </div>
  );

  return (
    <div className="w-full rounded-[2rem] overflow-hidden shadow-xl border border-outline-variant/10 aspect-video md:aspect-[21/9] bg-neutral-100 relative group">
      {finalSrc ? (
        <iframe
          title={title || "Location Map"}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          src={finalSrc}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-neutral-400">
           <MapPin size={48} className="mb-4 opacity-20" />
           <p className="font-bold">يرجى إضافة رابط صحيح لموقع العقار</p>
        </div>
      )}
      
      <a 
        href={link} 
        target="_blank" 
        rel="noreferrer" 
        className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black text-primary shadow-xl hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 uppercase"
      >
        فتح خريطة أصلية
      </a>
    </div>
  );
};

export default GoogleMapEmbed;
