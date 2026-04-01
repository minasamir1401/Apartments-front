import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Image, RefreshCw, Link as LinkIcon, Upload, Trash, MapPin, Building2 } from 'lucide-react';
import api from '../utils/api';

const EMPTY_PROJECT = { 
  title: '', 
  title_en: '', 
  description: '', 
  description_en: '', 
  images: [], 
  main_image: '',
  details: '',
  details_en: '',
  unit_types: [],
  location: '',
  location_en: '',
  status: 'active',
  map_link: ''
};

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects');
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const id = editingProject._id || editingProject.id;
      if (id) {
        await api.patch(`/projects/${id}`, editingProject);
      } else {
        await api.post('/projects', editingProject);
      }
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      alert('❌ خطأ في الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('هل تريد حذف هذا المشروع؟')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      alert('خطأ في الحذف');
    }
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e, isMain = false) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsUploading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    try {
      const res = await api.post('/apartments/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = res.data;
      if (data.urls) {
        if (isMain) {
          setEditingProject({
            ...editingProject,
            main_image: data.urls[0]
          });
        } else {
          setEditingProject({
            ...editingProject,
            images: [...(editingProject.images || []), ...data.urls]
          });
        }
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const addImageUrl = (isMain = false) => {
    if (!imageUrlInput) return;
    if (isMain) {
      setEditingProject({ ...editingProject, main_image: imageUrlInput });
    } else {
      setEditingProject({
        ...editingProject,
        images: [...(editingProject.images || []), imageUrlInput]
      });
    }
    setImageUrlInput('');
  };

  const removeImage = (index) => {
    const newImages = [...editingProject.images];
    newImages.splice(index, 1);
    setEditingProject({ ...editingProject, images: newImages });
  };

  const addUnitType = () => {
    const newUnits = [...(editingProject.unit_types || []), { title: '', price: '', size: '' }];
    setEditingProject({ ...editingProject, unit_types: newUnits });
  };

  const updateUnitType = (index, field, value) => {
    const newUnits = [...editingProject.unit_types];
    newUnits[index][field] = value;
    setEditingProject({ ...editingProject, unit_types: newUnits });
  };

  const removeUnitType = (index) => {
    const newUnits = [...editingProject.unit_types];
    newUnits.splice(index, 1);
    setEditingProject({ ...editingProject, unit_types: newUnits });
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
    return url.startsWith('http') ? url : `${API_BASE}${url}`;
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">إدارة المشاريع (Projects)</h2>
        <button
          onClick={() => { setEditingProject({ ...EMPTY_PROJECT }); setShowModal(true); }}
          className="bg-primary text-white hover:bg-primary-dark transition-all rounded-xl font-bold flex items-center gap-2 px-6 h-12 shadow-lg"
        >
          <Plus size={20} /> إضافة مشروع جديد
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><RefreshCw className="animate-spin text-primary w-8 h-8"/></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project._id} className="bg-white rounded-[2rem] overflow-hidden group shadow-lg border border-outline-variant/10">
              <div className="relative aspect-[4/3] bg-neutral-100">
                {project.main_image || (project.images && project.images.length > 0) ? (
                  <img src={getImageUrl(project.main_image || project.images[0])} className="w-full h-full object-cover" alt={project.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400"><Image size={40} /></div>
                )}
                <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingProject(project); setShowModal(true); }} className="p-2 bg-white text-blue-600 rounded-full shadow-lg hover:scale-110"><Edit size={16} /></button>
                  <button onClick={() => deleteProject(project.id || project._id)} className="p-2 bg-white text-red-600 rounded-full shadow-lg hover:scale-110"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="p-6 text-right">
                <h4 className="font-black text-xl mb-1">{project.title}</h4>
                <p className="text-neutral-500 text-sm line-clamp-2">{project.description}</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="inline-block px-3 py-1 bg-green-50 text-green-600 border border-green-200 rounded-full text-xs font-bold">
                    {project.status === 'active' ? 'نشط' : project.status}
                  </div>
                  <div className="text-xs text-neutral-400 font-bold flex items-center gap-1">
                    <MapPin size={12}/> {project.location || 'بدون موقع'}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full py-20 text-center text-neutral-400 font-bold border-2 border-dashed border-neutral-200 rounded-[2rem]">
              لا توجد مشاريع مضافة حتى الآن.
            </div>
          )}
        </div>
      )}

      {showModal && editingProject && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-4xl p-8 md:p-10 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => setShowModal(false)} className="absolute top-6 left-6 p-2 hover:bg-neutral-100 rounded-full"><X size={20} /></button>
            <h2 className="text-2xl font-bold mb-8 text-center">{editingProject._id ? 'تعديل مشروع' : 'إضافة مشروع'}</h2>
            
            <form onSubmit={handleSave} className="space-y-6 text-right" dir="rtl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-primary">عنوان المشروع (عربي) *</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary outline-none" value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value})} required />
                </div>
                <div dir="ltr">
                  <label className="block text-sm font-bold mb-2 text-neutral-500 text-left">Project Title (EN)</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary outline-none text-left" value={editingProject.title_en} onChange={e => setEditingProject({...editingProject, title_en: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-primary">الموقع / العنوان (عربي)</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary outline-none" value={editingProject.location || ''} onChange={e => setEditingProject({...editingProject, location: e.target.value})} placeholder="مثلاً: القاهرة الجديدة، مصر" />
                </div>
                <div dir="ltr">
                  <label className="block text-sm font-bold mb-2 text-neutral-500 text-left">Location / Address (EN)</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary outline-none text-left" value={editingProject.location_en || ''} onChange={e => setEditingProject({...editingProject, location_en: e.target.value})} placeholder="e.g. New Cairo, Egypt" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-primary">رابط الخريطة (Google Maps Link)</label>
                <input className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary outline-none" value={editingProject.map_link || ''} onChange={e => setEditingProject({...editingProject, map_link: e.target.value})} placeholder="https://maps.app.goo.gl/..." />
              </div>

              <div className="bg-neutral-50 p-6 rounded-[2rem] border border-neutral-200">
                <label className="block text-lg font-black mb-4 text-primary flex items-center gap-2">
                  <Image size={20}/> الصورة الرئيسية للمشروع
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-xs font-bold text-neutral-500">
                        {isUploading ? '⏳ جاري رفع الصورة الرئيسية...' : 'رفع صورة من الجهاز'}
                      </p>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} disabled={isUploading} className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary file:text-white hover:file:bg-primary-light transition-all disabled:opacity-50 disabled:cursor-wait" />
                    </div>
                    <div className="relative">
                      <p className="text-xs font-bold text-neutral-500 mb-2">أو رابط صورة مباشرة</p>
                      <div className="flex gap-2">
                        <input className="flex-1 px-4 py-2 rounded-xl border border-neutral-200 outline-none text-sm" placeholder="https://..." value={imageUrlInput} onChange={e => setImageUrlInput(e.target.value)} />
                        <button type="button" onClick={() => addImageUrl(true)} className="p-2 bg-primary text-white rounded-xl"><Plus size={20}/></button>
                      </div>
                    </div>
                  </div>
                  <div className="aspect-video bg-white rounded-2xl border border-neutral-200 flex items-center justify-center overflow-hidden relative group">
                    {editingProject.main_image ? (
                      <>
                        <img src={getImageUrl(editingProject.main_image)} className="w-full h-full object-cover" alt="Main" />
                        <button type="button" onClick={() => setEditingProject({...editingProject, main_image: ''})} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={16}/></button>
                      </>
                    ) : (
                      <p className="text-neutral-400 font-bold text-sm">لا توجد صورة رئيسية</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Units Table Management */}
              <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-lg font-black text-blue-900 flex items-center gap-2">
                    <Building2 size={20}/> النماذج المتاحة (الأسعار والأحجام)
                  </label>
                  <button type="button" onClick={addUnitType} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700">
                    <Plus size={16}/> إضافة نموذج
                  </button>
                </div>
                
                <div className="space-y-3">
                  {(editingProject.unit_types || []).map((unit, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-xl shadow-sm border border-blue-100 items-end">
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 mb-1">نوع الوحدة (مثلاً: شقة 3 غرف)</label>
                        <input className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm outline-none" value={unit.title} onChange={e => updateUnitType(idx, 'title', e.target.value)} placeholder="النوع..." />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 mb-1">المساحة (متر مربع)</label>
                        <input className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm outline-none" value={unit.size} onChange={e => updateUnitType(idx, 'size', e.target.value)} placeholder="مثلاً: 120" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 mb-1">السعر (أو يبدأ من)</label>
                        <input className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm outline-none" value={unit.price} onChange={e => updateUnitType(idx, 'price', e.target.value)} placeholder="مثلاً: 5,000,000" />
                      </div>
                      <button type="button" onClick={() => removeUnitType(idx)} className="h-[38px] flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                        <Trash size={18} />
                      </button>
                    </div>
                  ))}
                  {(!editingProject.unit_types || editingProject.unit_types.length === 0) && (
                    <div className="text-center py-4 text-neutral-400 text-sm italic">اضغط على "إضافة نموذج" لبدء إضافة الأسعار والأحجام</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-primary">الوصف المختصر (عربي)</label>
                  <textarea className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary outline-none resize-y min-h-[80px]" value={editingProject.description || ''} onChange={e => setEditingProject({...editingProject, description: e.target.value})} />
                </div>
                <div dir="ltr">
                  <label className="block text-sm font-bold mb-2 text-neutral-500 text-left">Short Description (EN)</label>
                  <textarea className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary outline-none text-left min-h-[80px]" value={editingProject.description_en || ''} onChange={e => setEditingProject({...editingProject, description_en: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-primary">تفاصيل المشروع كاملة (عربي)</label>
                  <textarea className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary outline-none resize-y min-h-[120px]" value={editingProject.details || ''} onChange={e => setEditingProject({...editingProject, details: e.target.value})} placeholder="اكتب تفاصيل المشروع هنا..." />
                </div>
                <div dir="ltr">
                  <label className="block text-sm font-bold mb-2 text-neutral-500 text-left">Full Project Details (EN)</label>
                  <textarea className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary outline-none text-left min-h-[120px]" value={editingProject.details_en || ''} onChange={e => setEditingProject({...editingProject, details_en: e.target.value})} placeholder="Project details in English..." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-primary">حالة المشروع</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary outline-none"
                  value={editingProject.status} 
                  onChange={e => setEditingProject({...editingProject, status: e.target.value})}
                >
                  <option value="active">نشط</option>
                  <option value="completed">مكتمل</option>
                  <option value="upcoming">قادم</option>
                </select>
              </div>

              <div className="border-t pt-6">
                <label className="block text-lg font-black mb-4 flex items-center gap-2"><Plus size={20}/> معرض الصور الإضافية (غير محدود)</label>
                
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-neutral-500 mb-2">
                      {isUploading ? '⏳ جاري الرفع للسيرفر...' : 'رفع صور متعددة'}
                    </p>
                    <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e, false)} disabled={isUploading} className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-neutral-800 file:text-white hover:file:bg-black transition-all disabled:opacity-50 disabled:cursor-wait" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-neutral-500 mb-2">إضافة صورة برابط</p>
                    <div className="flex gap-2">
                      <input className="flex-1 px-4 py-2 rounded-xl border border-neutral-200 outline-none text-sm" placeholder="https://..." value={imageUrlInput} onChange={e => setImageUrlInput(e.target.value)} />
                      <button type="button" onClick={() => addImageUrl(false)} className="p-2 bg-neutral-800 text-white rounded-xl flex items-center gap-2 px-4 shadow-md hover:bg-black transition-colors font-bold text-sm">
                        <LinkIcon size={16}/> إضافة
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4 bg-neutral-50 p-4 rounded-2xl border">
                  {(editingProject.images || []).map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border bg-white shadow-sm">
                      <img src={getImageUrl(img)} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {(!editingProject.images || editingProject.images.length === 0) && (
                    <div className="col-span-full py-8 text-center text-neutral-400 font-bold text-sm italic">لا توجد صور إضافية بعد</div>
                  )}
                </div>
              </div>

              <button type="submit" disabled={saving} className="bg-primary text-white hover:bg-primary-dark w-full py-4 rounded-xl font-bold text-lg shadow-lg flex justify-center items-center gap-3 transition-colors mt-8">
                {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                {saving ? 'جاري الحفظ...' : 'حفظ المشروع'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;
