import React, { useEffect, useState } from 'react';
import { DataService } from '../../services/dataService';
import { AudioTeaching } from '../../types';

export const AdminAudioPage: React.FC = () => {
  const [audioList, setAudioList] = useState<AudioTeaching[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AudioTeaching | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    speaker: 'Evangelist S. O. Okon',
    description: '',
    category: 'Discipleship Series' as AudioTeaching['category'],
    scripture_reference: '',
    audio_storage_path: '',
    cover_storage_path: '',
    duration_seconds: 1800,
    published: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadAudio();
  }, []);

  async function loadAudio() {
    setIsLoading(true);
    const data = await DataService.getAudioTeachings(undefined, true);
    setAudioList(data);
    setIsLoading(false);
  }

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      speaker: 'Evangelist S. O. Okon',
      description: '',
      category: 'Discipleship Series',
      scripture_reference: 'Matthew 28:19',
      audio_storage_path: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      cover_storage_path: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80',
      duration_seconds: 1800,
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AudioTeaching) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      speaker: item.speaker,
      description: item.description || '',
      category: item.category,
      scripture_reference: item.scripture_reference || '',
      audio_storage_path: item.audio_storage_path,
      cover_storage_path: item.cover_storage_path || '',
      duration_seconds: item.duration_seconds || 1800,
      published: item.published,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.audio_storage_path) {
      alert('Please provide a title and MP3 audio path/URL.');
      return;
    }

    setIsSaving(true);
    await DataService.saveAudioTeaching({
      id: editingItem?.id,
      title: formData.title,
      speaker: formData.speaker,
      description: formData.description,
      category: formData.category,
      scripture_reference: formData.scripture_reference,
      audio_storage_path: formData.audio_storage_path,
      cover_storage_path: formData.cover_storage_path,
      duration_seconds: Number(formData.duration_seconds),
      published: formData.published,
    });

    setIsSaving(false);
    setIsModalOpen(false);
    setMessage(editingItem ? 'Audio teaching updated!' : 'New audio teaching uploaded!');
    setTimeout(() => setMessage(null), 3000);
    loadAudio();
  };

  const handleTogglePublish = async (item: AudioTeaching) => {
    await DataService.saveAudioTeaching({
      ...item,
      published: !item.published,
    });
    loadAudio();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this audio record?')) {
      await DataService.deleteAudioTeaching(id);
      loadAudio();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Audio Teachings Management</h1>
          <p className="text-xs text-slate-500">Upload MP3 sermon recordings, scripture topics, and speakers.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-lg bg-[#1b4332] text-amber-300 font-bold text-xs hover:bg-emerald-800 transition-colors shadow flex items-center gap-1.5 shrink-0"
        >
          <span>+ Upload / Add Sermon Audio</span>
        </button>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-semibold">
          {message}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 bg-slate-200 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {audioList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.published ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {item.published ? 'Published' : 'Draft / Private'}
                  </span>
                  <span className="text-xs text-amber-700 font-semibold">{item.category}</span>
                  {item.scripture_reference && (
                    <span className="text-xs text-slate-400 font-mono">· {item.scripture_reference}</span>
                  )}
                </div>
                <h3 className="text-base font-serif font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600">Speaker: {item.speaker} · Duration: {Math.floor((item.duration_seconds || 1800) / 60)} mins</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleTogglePublish(item)}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200"
                >
                  {item.published ? 'Unpublish' : 'Publish'}
                </button>
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
          ))}
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-slate-900">
              {editingItem ? 'Edit Audio Record' : 'Add New Sermon Audio'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Teaching Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. The Call to Rural Frontier Evangelism"
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Preacher / Speaker *</label>
                  <input
                    type="text"
                    required
                    value={formData.speaker}
                    onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as typeof formData.category })}
                    className="w-full px-3 py-2 rounded-lg border text-xs bg-white"
                  >
                    <option value="Sermon">Sermon</option>
                    <option value="Discipleship Series">Discipleship Series</option>
                    <option value="Evangelism">Evangelism</option>
                    <option value="Devotionals">Devotionals</option>
                    <option value="Prayer">Prayer</option>
                    <option value="Leadership">Leadership</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Scripture Reference</label>
                  <input
                    type="text"
                    value={formData.scripture_reference}
                    onChange={(e) => setFormData({ ...formData, scripture_reference: e.target.value })}
                    placeholder="e.g. Matthew 28:18-20"
                    className="w-full px-3 py-2 rounded-lg border text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Duration (seconds)</label>
                  <input
                    type="number"
                    value={formData.duration_seconds}
                    onChange={(e) => setFormData({ ...formData, duration_seconds: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">MP3 Audio Storage Path / URL *</label>
                <input
                  type="text"
                  required
                  value={formData.audio_storage_path}
                  onChange={(e) => setFormData({ ...formData, audio_storage_path: e.target.value })}
                  placeholder="https://... MP3 file URL"
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Cover Artwork Image URL</label>
                <input
                  type="text"
                  value={formData.cover_storage_path}
                  onChange={(e) => setFormData({ ...formData, cover_storage_path: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of message..."
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pub-aud"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded text-amber-500"
                />
                <label htmlFor="pub-aud" className="text-xs font-bold text-slate-700">Publish publicly in Audio Library</label>
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
                  {isSaving ? 'Saving...' : 'Save Audio Teaching'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
