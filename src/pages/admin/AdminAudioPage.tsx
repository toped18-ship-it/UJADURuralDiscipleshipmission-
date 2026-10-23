import React, { useEffect, useRef, useState } from 'react';
import { DataService } from '../../services/dataService';
import { AudioTeaching } from '../../types';

export const AdminAudioPage: React.FC = () => {
  const [audioList, setAudioList] = useState<AudioTeaching[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AudioTeaching | null>(null);

  // Form states
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

  // File upload states
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [useManualUrl, setUseManualUrl] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const audioFileInputRef = useRef<HTMLInputElement | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);

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
    setUploadedFileName('');
    setUploadedFileSize('');
    setUseManualUrl(false);
    setFormData({
      title: '',
      speaker: 'Evangelist S. O. Okon',
      description: '',
      category: 'Discipleship Series',
      scripture_reference: 'Matthew 28:19',
      audio_storage_path: '',
      cover_storage_path: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80',
      duration_seconds: 0,
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AudioTeaching) => {
    setEditingItem(item);
    setUploadedFileName('');
    setUploadedFileSize('');
    setUseManualUrl(item.audio_storage_path?.startsWith('http') && !item.audio_storage_path.includes('base64'));
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

  // Handle direct audio file selection
  const handleAudioFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAudio(true);
    try {
      const result = await DataService.uploadAudioFile(file);
      setUploadedFileName(result.fileName);
      setUploadedFileSize(result.fileSize);

      setFormData((prev) => {
        // Auto-populate title if empty or untitled
        const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const cleanTitle = prev.title.trim() ? prev.title : rawName.charAt(0).toUpperCase() + rawName.slice(1);
        return {
          ...prev,
          title: cleanTitle,
          audio_storage_path: result.url,
          duration_seconds: result.duration,
        };
      });
    } catch (err) {
      console.error('Audio file upload error:', err);
      alert('Failed to process audio file. Please try another MP3 or audio file.');
    } finally {
      setIsUploadingAudio(false);
    }
  };

  // Handle cover image file selection
  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const imageUrl = await DataService.uploadImageFile(file, 'audio-teachings');
      setFormData((prev) => ({
        ...prev,
        cover_storage_path: imageUrl,
      }));
    } catch (err) {
      console.error('Cover upload error:', err);
      alert('Failed to upload image cover.');
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a title for the teaching.');
      return;
    }
    if (!formData.audio_storage_path) {
      alert('Please upload an audio file (MP3, WAV, M4A) for this teaching.');
      return;
    }

    setIsSaving(true);
    await DataService.saveAudioTeaching({
      id: editingItem?.id,
      title: formData.title.trim(),
      speaker: formData.speaker.trim(),
      description: formData.description.trim(),
      category: formData.category,
      scripture_reference: formData.scripture_reference.trim(),
      audio_storage_path: formData.audio_storage_path,
      cover_storage_path: formData.cover_storage_path,
      duration_seconds: Number(formData.duration_seconds) || 1800,
      published: formData.published,
    });

    setIsSaving(false);
    setIsModalOpen(false);
    setMessage(editingItem ? 'Audio teaching updated!' : 'New audio teaching uploaded successfully!');
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

  const formatDuration = (secs: number) => {
    if (!secs) return '0 min';
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return remainingSecs > 0 ? `${mins}m ${remainingSecs}s` : `${mins} mins`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Audio Teachings Management</h1>
          <p className="text-xs text-slate-500">
            Upload MP3 audio files, set preachers, scripture topics, and manage discipleship recordings.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-lg bg-[#1b4332] text-amber-300 font-bold text-xs hover:bg-emerald-800 transition-colors shadow flex items-center gap-2 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>Upload Audio File</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <span>✓</span>
          <span>{message}</span>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-slate-200 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {audioList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className="w-14 h-14 rounded-lg bg-emerald-950 overflow-hidden shrink-0 border border-slate-200">
                  {item.cover_storage_path ? (
                    <img
                      src={item.cover_storage_path}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-900 text-amber-300 font-bold text-xs">
                      UJADU
                    </div>
                  )}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.published ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.published ? 'Published' : 'Draft / Private'}
                    </span>
                    <span className="text-xs text-amber-700 font-semibold">{item.category}</span>
                    {item.scripture_reference && (
                      <span className="text-xs text-slate-400 font-mono">· {item.scripture_reference}</span>
                    )}
                    <span className="text-xs text-slate-400 font-mono">· {formatDuration(item.duration_seconds)}</span>
                  </div>
                  <h3 className="text-base font-serif font-bold text-slate-900 truncate">{item.title}</h3>
                  <p className="text-xs text-slate-600">Speaker: {item.speaker}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button
                  onClick={() => handleTogglePublish(item)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded ${
                    item.published ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                  }`}
                >
                  {item.published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1.5 text-xs font-semibold rounded text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-xl font-serif font-bold text-slate-900">
                {editingItem ? 'Edit Audio Record' : 'Upload Audio Teaching'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* 1. AUDIO FILE UPLOAD SECTION */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🎙️ Audio File (MP3, WAV, M4A, OGG)</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseManualUrl(!useManualUrl)}
                    className="text-[11px] text-emerald-800 hover:underline font-medium"
                  >
                    {useManualUrl ? '← Switch to File Upload' : 'Or enter external link →'}
                  </button>
                </div>

                {!useManualUrl ? (
                  <div>
                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={audioFileInputRef}
                      accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
                      onChange={handleAudioFileChange}
                      className="hidden"
                    />

                    {formData.audio_storage_path ? (
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-[#1b4332] text-amber-300 flex items-center justify-center shrink-0">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {uploadedFileName || (editingItem ? 'Current audio recording attached' : 'Audio file attached')}
                              </p>
                              <p className="text-[11px] text-emerald-800">
                                {uploadedFileSize ? `${uploadedFileSize} · ` : ''}Duration: {formatDuration(formData.duration_seconds)}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => audioFileInputRef.current?.click()}
                            className="px-3 py-1.5 text-xs font-semibold rounded bg-white text-emerald-950 border border-emerald-300 hover:bg-emerald-100 shrink-0"
                          >
                            Replace File
                          </button>
                        </div>

                        {/* Inline audio preview player */}
                        <div className="pt-2 border-t border-emerald-200">
                          <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-1">
                            Audio Preview:
                          </span>
                          <audio
                            src={formData.audio_storage_path}
                            controls
                            className="w-full h-8"
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => audioFileInputRef.current?.click()}
                        className="border-2 border-dashed border-emerald-700/40 hover:border-emerald-700 rounded-xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-emerald-50/40 transition-colors space-y-2"
                      >
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#1b4332] flex items-center justify-center mx-auto">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          {isUploadingAudio ? 'Processing audio file...' : 'Click to select audio file from your device'}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Supports MP3, WAV, M4A, OGG. Duration and audio details are calculated automatically.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <input
                      type="text"
                      required={useManualUrl}
                      value={formData.audio_storage_path}
                      onChange={(e) => setFormData({ ...formData, audio_storage_path: e.target.value })}
                      placeholder="https://example.com/sermon.mp3"
                      className="w-full px-3 py-2 rounded-lg border text-xs"
                    />
                    <p className="text-[11px] text-slate-400">Direct public MP3 URL</p>
                  </div>
                )}
              </div>

              {/* 2. TEACHING METADATA */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Teaching Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. The Call to Rural Frontier Evangelism"
                  className="w-full px-3 py-2 rounded-lg border text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <label className="text-xs font-bold text-slate-700">Duration (calculated in seconds)</label>
                  <input
                    type="number"
                    value={formData.duration_seconds}
                    onChange={(e) => setFormData({ ...formData, duration_seconds: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-400">
                    Display: {formatDuration(formData.duration_seconds)}
                  </span>
                </div>
              </div>

              {/* 3. COVER ARTWORK FILE / URL */}
              <div className="space-y-1 pt-1 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700">Cover Artwork Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={coverFileInputRef}
                    accept="image/*"
                    onChange={handleCoverFileChange}
                    className="hidden"
                  />

                  {formData.cover_storage_path && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-300 shrink-0">
                      <img
                        src={formData.cover_storage_path}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 space-y-1">
                    <button
                      type="button"
                      onClick={() => coverFileInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-100 text-slate-800 hover:bg-slate-200 border"
                    >
                      {isUploadingCover ? 'Uploading...' : '📁 Choose Image File'}
                    </button>
                    <input
                      type="text"
                      value={formData.cover_storage_path}
                      onChange={(e) => setFormData({ ...formData, cover_storage_path: e.target.value })}
                      placeholder="Or enter image URL..."
                      className="w-full px-2.5 py-1 text-xs border rounded"
                    />
                  </div>
                </div>
              </div>

              {/* 4. DESCRIPTION */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Description / Teaching Notes</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief synopsis of this discipleship message..."
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                />
              </div>

              {/* 5. PUBLICATION STATUS */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pub-aud"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="pub-aud" className="text-xs font-bold text-slate-700">
                  Publish publicly in Audio Resource Center
                </label>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploadingAudio}
                  className="px-6 py-2 text-xs font-bold text-amber-300 bg-[#1b4332] rounded-lg hover:bg-emerald-800 disabled:opacity-50 shadow"
                >
                  {isSaving ? 'Saving Audio...' : 'Save Audio Teaching'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
