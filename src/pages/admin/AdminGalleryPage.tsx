import React, { useEffect, useState } from 'react';
import { DataService } from '../../services/dataService';
import { GalleryItem } from '../../types';

export const AdminGalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Rural Outreach' as GalleryItem['category'],
    storage_path: '',
    location: '',
    event_date: new Date().toISOString().split('T')[0],
    published: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const compressedUrl = await DataService.uploadImageFile(file, 'gallery');
      setFormData((prev) => ({
        ...prev,
        storage_path: compressedUrl,
        title: prev.title.trim() ? prev.title : file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      }));
    } catch (err) {
      console.error(err);
      alert('Failed to process image file.');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    setIsLoading(true);
    const data = await DataService.getGalleryImages(undefined, true);
    setImages(data);
    setIsLoading(false);
  }

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      category: 'Rural Outreach',
      storage_path: '',
      location: 'Ujadu Mission Field',
      event_date: new Date().toISOString().split('T')[0],
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      category: item.category,
      storage_path: item.storage_path,
      location: item.location || '',
      event_date: item.event_date || new Date().toISOString().split('T')[0],
      published: item.published,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.storage_path) {
      alert('Please provide a title and image storage path/URL.');
      return;
    }

    setIsSaving(true);
    await DataService.saveGalleryImage({
      id: editingItem?.id,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      storage_path: formData.storage_path,
      location: formData.location,
      event_date: formData.event_date,
      published: formData.published,
    });

    setIsSaving(false);
    setIsModalOpen(false);
    setMessage(editingItem ? 'Gallery image updated!' : 'New gallery image added!');
    setTimeout(() => setMessage(null), 3000);
    loadGallery();
  };

  const handleTogglePublish = async (item: GalleryItem) => {
    await DataService.saveGalleryImage({
      ...item,
      published: !item.published,
    });
    loadGallery();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this gallery image?')) {
      await DataService.deleteGalleryImage(id);
      loadGallery();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Gallery Media Management</h1>
          <p className="text-xs text-slate-500">Upload, categorize, publish or remove outreach photographs.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-lg bg-[#1b4332] text-amber-300 font-bold text-xs hover:bg-emerald-800 transition-colors shadow flex items-center gap-1.5 shrink-0"
        >
          <span>+ Upload / Add Image</span>
        </button>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-semibold">
          {message}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-48 bg-slate-200 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                  <img src={item.storage_path} alt={item.title} className="w-full h-full object-cover" />
                  <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.published ? 'bg-emerald-900 text-amber-300' : 'bg-slate-700 text-slate-200'
                  }`}>
                    {item.published ? 'Published' : 'Draft / Private'}
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-amber-700">{item.category}</span>
                  <h3 className="text-sm font-serif font-bold text-slate-900 line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                  <p className="text-[11px] text-slate-400 font-mono pt-1">{item.event_date} · {item.location || 'Field Base'}</p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                <button
                  onClick={() => handleTogglePublish(item)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded ${
                    item.published ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                  }`}
                >
                  {item.published ? 'Unpublish' : 'Publish'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="text-xs font-semibold text-blue-700 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-slate-900">
              {editingItem ? 'Edit Gallery Photo' : 'Add New Gallery Photo'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Image Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Village Outreach Fellowship"
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Outreach Photograph *</label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-lg bg-emerald-800 text-amber-300 font-semibold text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>📁 Choose Image File</span>
                  </button>
                  <span className="text-[11px] text-slate-400 text-center sm:text-left">or enter image URL below</span>
                </div>
                {isUploading && (
                  <p className="text-[11px] text-amber-600 font-medium animate-pulse">
                    Compressing and optimizing photo for instant cloud publishing...
                  </p>
                )}
                <input
                  type="text"
                  required
                  value={formData.storage_path}
                  onChange={(e) => setFormData({ ...formData, storage_path: e.target.value })}
                  placeholder="https://... or uploaded image"
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                />
                {formData.storage_path && (
                  <div className="w-24 h-16 rounded-lg overflow-hidden border border-slate-200 mt-1">
                    <img
                      src={formData.storage_path}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as typeof formData.category })}
                    className="w-full px-3 py-2 rounded-lg border text-xs bg-white"
                  >
                    <option value="Evangelism">Evangelism</option>
                    <option value="Rural Outreach">Rural Outreach</option>
                    <option value="Bible Study">Bible Study</option>
                    <option value="Discipleship">Discipleship</option>
                    <option value="Prayer Meetings">Prayer Meetings</option>
                    <option value="Mission Events">Mission Events</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Event Date</label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Description / Caption</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the mission gathering..."
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pub"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded text-amber-500"
                />
                <label htmlFor="pub" className="text-xs font-bold text-slate-700">Publish publicly on site</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-bold text-amber-300 bg-[#1b4332] rounded-lg hover:bg-emerald-800"
                >
                  {isSaving ? 'Saving...' : 'Save Gallery Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
