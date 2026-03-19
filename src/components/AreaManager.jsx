import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Image, Link } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';
const API = `${API_BASE}/api/areas`;

const EMPTY_AREA = { name: '', name_en: '', image: '', count: '', count_en: '', display_order: 0 };

const AreaManager = () => {
  const [areas, setAreas] = useState([]);
  const [editingArea, setEditingArea] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchAreas = () => {
    fetch(API)
      .then(r => r.json())
      .then(data => setAreas(Array.isArray(data) ? data : []))
      .catch(() => setAreas([]));
  };

  useEffect(() => { fetchAreas(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingArea.id || editingArea._id ? 'PATCH' : 'POST';
      const id = editingArea.id || editingArea._id;
      const url = id ? `${API}/${id}` : API;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingArea)
      });
      if (!res.ok) throw new Error('Failed');
      setShowModal(false);
      fetchAreas();
    } catch (err) {
      alert('❌ خطأ في الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const deleteArea = async (id) => {
    if (!window.confirm('هل تريد حذف هذه المنطقة؟')) return;
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    fetchAreas();
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">إدارة المناطق</h2>
        <button
          onClick={() => { setEditingArea({ ...EMPTY_AREA }); setShowModal(true); }}
          className="btn-primary flex items-center gap-2 px-6 h-12"
        >
          <Plus size={20} /> إضافة منطقة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {areas.map(area => (
          <div key={area.id || area._id} className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden group shadow-lg border border-outline-variant/10">
            <img src={area.image} className="w-full h-full object-cover" alt={area.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 right-6 text-right">
              <h4 className="text-white font-black text-xl">{area.name}</h4>
              <p className="text-white/70 text-xs">{area.count}</p>
            </div>
            <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setEditingArea(area); setShowModal(true); }} className="p-2 bg-white/90 text-blue-600 rounded-full shadow-lg hover:bg-white"><Edit size={16} /></button>
              <button onClick={() => deleteArea(area.id || area._id)} className="p-2 bg-white/90 text-red-600 rounded-full shadow-lg hover:bg-white"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && editingArea && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl p-8 md:p-10 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => setShowModal(false)} className="absolute top-6 left-6 p-2 hover:bg-neutral-100 rounded-full"><X size={20} /></button>
            <h2 className="text-2xl font-bold mb-8 text-center">{editingArea.id || editingArea._id ? 'تعديل منطقة' : 'إضافة منطقة'}</h2>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 pr-2 text-primary">الاسم (عربي) *</label>
                  <input className="input-field h-14 text-sm font-bold" value={editingArea.name} onChange={e => setEditingArea({...editingArea, name: e.target.value})} required placeholder="مثال: القاهرة الجديدة" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 pr-2 text-neutral-400">Name (English)</label>
                  <input className="input-field h-14 text-sm font-bold border-dashed" value={editingArea.name_en} onChange={e => setEditingArea({...editingArea, name_en: e.target.value})} placeholder="E.g. New Cairo" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 pr-2 text-primary">نص العدد (عربي)</label>
                  <input className="input-field h-14 text-sm font-bold" value={editingArea.count} onChange={e => setEditingArea({...editingArea, count: e.target.value})} placeholder="مثال: 1,240 عقار" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 pr-2 text-neutral-400">Count Label (EN)</label>
                  <input className="input-field h-14 text-sm font-bold border-dashed" value={editingArea.count_en} onChange={e => setEditingArea({...editingArea, count_en: e.target.value})} placeholder="E.g. 1,240 properties" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 pr-2 flex items-center gap-2"><Image size={18}/> رابط الصورة</label>
                <input className="input-field h-14 text-sm font-bold" value={editingArea.image} onChange={e => setEditingArea({...editingArea, image: e.target.value})} placeholder="https://images.unsplash.com/..." required />
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full h-16 text-xl flex justify-center items-center gap-3 shadow-xl mt-4">
                {saving ? <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Save size={20} />}
                {saving ? 'جاري الحفظ...' : 'حفظ المنطقة'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaManager;
