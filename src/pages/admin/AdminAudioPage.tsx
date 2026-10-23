import React, { useEffect, useRef, useState } from 'react';
import { DataService } from '../../services/dataService';
import { AudioTeaching } from '../../types';

export const AdminAudioPage: React.FC = () => {
  const [audioList, setAudioList] = useState<AudioTeaching[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AudioTeaching | null>(null);

  // Form states - only the needed fields
  const [formData, setFormData] = useState({
    title: '',
    speaker: 'Evangelist S. O. Okon',
    category: 'Discipleship Series' as AudioTeaching['category'],
    audio_storage_path: '',
    audio_file_id: '',
    duration_seconds: 1800,
    published: true,
  });

  // File upload states
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string>('');
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [useManualUrl, setUseManualUrl] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const audioFileInputRef = useRef<HTMLInputElement | null>(null);

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
    setPreviewAudioUrl('');
    setUseManualUrl(false);
    setFormData({
      title: '',
      speaker: 'Evangelist S. O. Okon',
      category: 'Discipleship Series',
      audio_storage_path: '',
      audio_file_id: '',
      duration_seconds: 0,
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AudioTeaching) => {
    setEditingItem(item);
    setUploadedFileName('');
    setUploadedFileSize('');
    setPreviewAudioUrl(item.audio_storage_path);
    setUseManualUrl(item.audio_storage_path?.startsWith('http') && !item.audio_storage_path.includes('base64'));
    setFormData({
      title: item.title,
      speaker: item.speaker,
      category: item.category,
      audio_storage_path: item.audio_storage_path,
      audio_file_id: item.audio_file_id || '',
      duration_seconds: item.duration_seconds || 1800,
      published: item.published,
    });
    setIsModalOpen(true);
  };

  // Handle audio file selection
  const handleAudioFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAudio(true);
    try {
      const result = await DataService.uploadAudioFile(file);
      setUploadedFileName(result.fileName);
      setUploadedFileSize(result.fileSize);
      setPreviewAudioUrl(result.objectUrl);

      setFormData((prev) => {
        // Auto-populate title if empty
        const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const cleanTitle = prev.title.trim() ? prev.title : rawName.charAt(0).toUpperCase() + rawName.slice(1);
        return {
          ...prev,
          title: cleanTitle,
          audio_storage_path: result.url,
          audio_file_id: result.audioFileId,
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a title for the teaching.');
      return;
    }
    if (!formData.audio_storage_path) {
      alert('Please choose an audio file from your device to upload.');
      return;
    }

    setIsSaving(true);
    try {
      await DataService.saveAudioTeaching({
        id: editingItem?.id,
        title: formData.title.trim(),
        speaker: formData.speaker.trim(),
        category: formData.category,
        audio_storage_path: formData.audio_storage_path,
        audio_file_id: formData.audio_file_id,
        duration_seconds: formData.duration_seconds || 1800,
        published: formData.published,
      });

      setIsSaving(false);
      setIsModalOpen(false);
      setMessage(editingItem ? 'Audio teaching updated!' : 'New audio teaching uploaded successfully!');
      setTimeout(() => setMessage(null), 3000);
      await loadAudio();
    } catch (err) {
      console.error('Error saving audio teaching:', err);
      setIsSaving(false);
      alert('Error saving audio teaching. Please try again.');
    }
  };

  const handleTogglePublish = async (item: AudioTeaching) => {
    await DataService.saveAudioTeaching({
      ...item,
      published: !item.published,
    });
    loadAudio();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this audio teaching?')) {
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
            Upload audio files (MP3, WAV, M4A) directly from your device. You can create as many audio teachings as you want.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-lg bg-[#1b4332] text-amber-300 font-bold text-xs hover:bg-emerald-800 transition-colors shadow flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>+ Upload Audio Teaching</span>
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
      ) : audioList.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
          </div>
          <h3 className="text-base font-serif font-bold text-slate-800">No Audio Teachings Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "+ Upload Audio Teaching" above to select and upload your first audio sermon or message.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#1b4332] text-amber-300 text-xs font-bold rounded-lg hover:bg-emerald-800"
          >
            Upload First Audio
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {audioList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-lg bg-emerald-950 flex items-center justify-center shrink-0 border border-slate-200 text-amber-300 font-bold text-xs">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.published ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.published ? 'Published' : 'Draft / Private'}
                    </span>
                    <span className="text-xs text-amber-700 font-semibold">{item.category}</span>
                    <span className="text-xs text-slate-400 font-mono">· {formatDuration(item.duration_seconds)}</span>
                  </div>
                  <h3 className="text-base font-serif font-bold text-slate-900 truncate">{item.title}</h3>
                  <p className="text-xs text-slate-600">Speaker: {item.speaker}</p>

                  {/* Inline audio player for instant preview */}
                  {item.audio_storage_path && (
                    <div className="pt-1 max-w-md">
                      <audio
                        src={item.audio_storage_path}
                        controls
                        className="w-full h-7"
                        preload="none"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button
                  onClick={() => handleTogglePublish(item)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer ${
                    item.published ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                  }`}
                >
                  {item.published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1.5 text-xs font-semibold rounded text-red-600 hover:bg-red-50 cursor-pointer"
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-xl font-serif font-bold text-slate-900">
                {editingItem ? 'Edit Audio Record' : 'Upload Audio Teaching'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* 1. AUDIO FILE PICKER */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🎙️ Audio File (MP3, WAV, M4A, OGG)</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseManualUrl(!useManualUrl)}
                    className="text-[11px] text-emerald-800 hover:underline font-medium cursor-pointer"
                  >
                    {useManualUrl ? '← Switch to File Upload' : 'Or enter link →'}
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
                                {uploadedFileName || (editingItem ? 'Audio file attached' : 'New audio file attached')}
                              </p>
                              <p className="text-[11px] text-emerald-800">
                                {uploadedFileSize ? `${uploadedFileSize} · ` : ''}Duration: {formatDuration(formData.duration_seconds)}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => audioFileInputRef.current?.click()}
                            className="px-3 py-1.5 text-xs font-semibold rounded bg-white text-emerald-950 border border-emerald-300 hover:bg-emerald-100 shrink-0 cursor-pointer"
                          >
                            Replace File
                          </button>
                        </div>

                        {/* Inline preview player */}
                        {(previewAudioUrl || formData.audio_storage_path) && (
                          <div className="pt-2 border-t border-emerald-200">
                            <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-1">
                              Audio Preview:
                            </span>
                            <audio
                              src={previewAudioUrl || formData.audio_storage_path}
                              controls
                              className="w-full h-8"
                            />
                          </div>
                        )}
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
                          Supports MP3, WAV, M4A, OGG. Duration is calculated automatically.
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
                    <p className="text-[11px] text-slate-400">Direct public audio URL</p>
                  </div>
                )}
              </div>

              {/* 2. TEACHING TITLE */}
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

              {/* 3. PREACHER / SPEAKER */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Preacher / Speaker *</label>
                <input
                  type="text"
                  required
                  value={formData.speaker}
                  onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                  placeholder="e.g. Evangelist S. O. Okon"
                  className="w-full px-3 py-2 rounded-lg border text-xs"
                />
              </div>

              {/* 4. CATEGORY */}
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

              {/* 5. PUBLICATION STATUS */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <input
                  type="checkbox"
                  id="pub-aud"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                />
                <label htmlFor="pub-aud" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Publish publicly in Audio Resource Center
                </label>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploadingAudio}
                  className="px-6 py-2 text-xs font-bold text-amber-300 bg-[#1b4332] rounded-lg hover:bg-emerald-800 disabled:opacity-50 shadow cursor-pointer"
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
