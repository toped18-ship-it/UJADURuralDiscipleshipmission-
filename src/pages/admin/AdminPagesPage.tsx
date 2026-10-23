import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataService } from '../../services/dataService';
import {
  CustomPage,
  CustomPageGalleryItem,
  CustomPageSection,
  CustomPageSlide,
} from '../../types';

export const AdminPagesPage: React.FC = () => {
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CustomPage | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'content' | 'slides' | 'gallery' | 'audio'>('info');

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    hero_image: '',
    content: '',
    sections: [] as CustomPageSection[],
    slides: [] as CustomPageSlide[],
    gallery: [] as CustomPageGalleryItem[],
    audio_title: '',
    audio_speaker: 'Evangelist S. O. Okon',
    audio_storage_path: '',
    audio_file_id: '',
    audio_duration: 0,
    published: true,
  });

  // Audio upload state
  const [uploadedAudioName, setUploadedAudioName] = useState<string>('');
  const [uploadedAudioSize, setUploadedAudioSize] = useState<string>('');
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);

  // Image upload states
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isUploadingSlide, setIsUploadingSlide] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const audioFileInputRef = useRef<HTMLInputElement | null>(null);
  const heroFileInputRef = useRef<HTMLInputElement | null>(null);
  const slideFileInputRef = useRef<HTMLInputElement | null>(null);
  const galleryFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadPages();
  }, []);

  async function loadPages() {
    setIsLoading(true);
    const data = await DataService.getCustomPages(true);
    setPages(data);
    setIsLoading(false);
  }

  const handleOpenAdd = () => {
    setEditingItem(null);
    setUploadedAudioName('');
    setUploadedAudioSize('');
    setActiveTab('info');
    setFormData({
      title: '',
      slug: '',
      subtitle: '',
      hero_image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
      content: '',
      sections: [
        {
          id: `sec-${Date.now()}`,
          heading: 'Mission Objectives & Overview',
          content: 'Details and core scriptural foundations for this program.',
        },
      ],
      slides: [
        {
          id: `sl-${Date.now()}`,
          image_url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
          title: 'Village Discipleship Gathering',
          caption: 'Believers assembling for open-air biblical training and prayer.',
        },
      ],
      gallery: [
        {
          id: `g-${Date.now()}`,
          image_url: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=80',
          caption: 'Bible study circle with open study Bibles',
        },
      ],
      audio_title: '',
      audio_speaker: 'Evangelist S. O. Okon',
      audio_storage_path: '',
      audio_file_id: '',
      audio_duration: 0,
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: CustomPage) => {
    setEditingItem(item);
    setUploadedAudioName('');
    setUploadedAudioSize('');
    setActiveTab('info');
    setFormData({
      title: item.title,
      slug: item.slug,
      subtitle: item.subtitle || '',
      hero_image: item.hero_image || '',
      content: item.content || '',
      sections: item.sections || [],
      slides: item.slides || [],
      gallery: item.gallery || [],
      audio_title: item.audio_title || '',
      audio_speaker: item.audio_speaker || 'Evangelist S. O. Okon',
      audio_storage_path: item.audio_storage_path || '',
      audio_file_id: item.audio_file_id || '',
      audio_duration: item.audio_duration || 0,
      published: item.published,
    });
    setIsModalOpen(true);
  };

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !editingItem || !prev.slug ? generatedSlug : prev.slug,
    }));
  };

  // Upload hero banner image
  const handleHeroFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingHero(true);
    try {
      const url = await DataService.uploadImageFile(file, 'page-heroes');
      setFormData((prev) => ({ ...prev, hero_image: url }));
    } catch (err) {
      console.error(err);
      alert('Failed to upload hero image.');
    } finally {
      setIsUploadingHero(false);
    }
  };

  // Audio file upload via IndexedDB AudioStore
  const handleAudioFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAudio(true);
    try {
      const result = await DataService.uploadAudioFile(file);
      setUploadedAudioName(result.fileName);
      setUploadedAudioSize(result.fileSize);
      setFormData((prev) => ({
        ...prev,
        audio_title: prev.audio_title.trim() ? prev.audio_title : result.fileName.replace(/\.[^/.]+$/, ''),
        audio_storage_path: result.url,
        audio_file_id: result.audioFileId,
        audio_duration: result.duration,
      }));
    } catch (err) {
      console.error('Audio upload error:', err);
      alert('Failed to process audio file.');
    } finally {
      setIsUploadingAudio(false);
    }
  };

  // Section handlers
  const handleAddSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: `sec-${Date.now()}`,
          heading: 'New Section Heading',
          content: '',
        },
      ],
    }));
  };

  const handleUpdateSection = (index: number, field: keyof CustomPageSection, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.sections];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, sections: updated };
    });
  };

  const handleRemoveSection = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  // Slide handlers
  const handleAddSlide = () => {
    setFormData((prev) => ({
      ...prev,
      slides: [
        ...prev.slides,
        {
          id: `sl-${Date.now()}`,
          image_url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
          title: 'Slide Title',
          caption: 'Slide caption or scripture quotation',
        },
      ],
    }));
  };

  const handleUpdateSlide = (index: number, field: keyof CustomPageSlide, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.slides];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, slides: updated };
    });
  };

  const handleRemoveSlide = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      slides: prev.slides.filter((_, i) => i !== index),
    }));
  };

  // Slide image upload
  const handleSlideImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingSlide(true);
    try {
      const url = await DataService.uploadImageFile(file, 'page-slides');
      handleUpdateSlide(index, 'image_url', url);
    } catch (err) {
      console.error(err);
      alert('Failed to upload slide image.');
    } finally {
      setIsUploadingSlide(false);
    }
  };

  // Gallery handlers
  const handleAddGalleryItem = () => {
    setFormData((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        {
          id: `g-${Date.now()}`,
          image_url: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=80',
          caption: 'Photo description or village outreach event',
        },
      ],
    }));
  };

  const handleUpdateGallery = (index: number, field: keyof CustomPageGalleryItem, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.gallery];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, gallery: updated };
    });
  };

  const handleRemoveGallery = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  // Gallery image file upload
  const handleGalleryImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingGallery(true);
    try {
      const url = await DataService.uploadImageFile(file, 'page-gallery');
      handleUpdateGallery(index, 'image_url', url);
    } catch (err) {
      console.error(err);
      alert('Failed to upload gallery image.');
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a title for the page.');
      return;
    }
    if (!formData.slug.trim()) {
      alert('Please enter a URL slug for the page.');
      return;
    }

    setIsSaving(true);
    try {
      await DataService.saveCustomPage({
        id: editingItem?.id,
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        subtitle: formData.subtitle.trim(),
        hero_image: formData.hero_image.trim(),
        content: formData.content.trim(),
        sections: formData.sections,
        slides: formData.slides,
        gallery: formData.gallery,
        audio_title: formData.audio_title.trim(),
        audio_speaker: formData.audio_speaker.trim(),
        audio_storage_path: formData.audio_storage_path,
        audio_file_id: formData.audio_file_id,
        audio_duration: formData.audio_duration,
        published: formData.published,
      });

      setIsSaving(false);
      setIsModalOpen(false);
      setMessage(editingItem ? 'Custom page updated!' : 'New custom page created successfully!');
      setTimeout(() => setMessage(null), 3000);
      await loadPages();
    } catch (err) {
      console.error('Error saving custom page:', err);
      setIsSaving(false);
      alert('Error saving custom page. Please try again.');
    }
  };

  const handleTogglePublish = async (page: CustomPage) => {
    await DataService.saveCustomPage({
      ...page,
      published: !page.published,
    });
    loadPages();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this custom page?')) {
      await DataService.deleteCustomPage(id);
      loadPages();
    }
  };

  const formatDuration = (secs?: number) => {
    if (!secs) return '';
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return remainingSecs > 0 ? `${mins}m ${remainingSecs}s` : `${mins} mins`;
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Custom Pages Builder</h1>
          <p className="text-xs text-slate-500">
            Create and manage rich ministry pages complete with headings, narrative contents, interactive slides, photo galleries, and audio uploads.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-lg bg-[#1b4332] text-amber-300 font-bold text-xs hover:bg-emerald-800 transition-colors shadow flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>+ Create New Page</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <span>✓</span>
          <span>{message}</span>
        </div>
      )}

      {/* PAGE CARDS LIST */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-slate-200 rounded-xl" />
          ))}
        </div>
      ) : pages.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#1b4332] flex items-center justify-center mx-auto text-xl">
            📄
          </div>
          <h3 className="text-base font-serif font-bold text-slate-800">No Custom Pages Created Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "+ Create New Page" to design a rich page with custom headings, text, photo gallery, slides, and audio message.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#1b4332] text-amber-300 text-xs font-bold rounded-lg hover:bg-emerald-800 cursor-pointer"
          >
            Create First Page
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <div className="w-16 h-16 rounded-xl bg-emerald-950 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center text-amber-300 font-bold">
                  {p.hero_image ? (
                    <img src={p.hero_image} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs">UJADU</span>
                  )}
                </div>

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.published ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      /page/{p.slug}
                    </span>
                  </div>

                  <h3 className="text-base font-serif font-bold text-slate-900 truncate">{p.title}</h3>

                  {p.subtitle && (
                    <p className="text-xs text-slate-500 truncate">{p.subtitle}</p>
                  )}

                  {/* Feature badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-600">
                    <span className="bg-slate-100 px-2 py-0.5 rounded border text-slate-700">
                      🏷️ {p.sections?.length || 0} Headed Sections
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded border text-slate-700">
                      🖼️ {p.slides?.length || 0} Slides
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded border text-slate-700">
                      📸 {p.gallery?.length || 0} Gallery Photos
                    </span>
                    {p.audio_storage_path && (
                      <span className="bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded border border-amber-300">
                        🎙️ Audio Attached {p.audio_duration ? `(${formatDuration(p.audio_duration)})` : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <Link
                  to={`/page/${p.slug}`}
                  target="_blank"
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1"
                >
                  <span>View</span>
                  <span>↗</span>
                </Link>
                <button
                  onClick={() => handleTogglePublish(p)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer ${
                    p.published ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                  }`}
                >
                  {p.published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-3 py-1.5 text-xs font-semibold rounded text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-5 sm:p-7 space-y-5 shadow-2xl max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0">
              <div>
                <h3 className="text-xl font-serif font-bold text-slate-900">
                  {editingItem ? 'Edit Custom Page' : 'Create Custom Page'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Configure page headings, contents, slides, gallery, and audio uploads.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto shrink-0 no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'info'
                    ? 'bg-[#1b4332] text-amber-300 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                1. Page Info & Hero
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'content'
                    ? 'bg-[#1b4332] text-amber-300 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                2. Headings & Contents ({formData.sections.length + 1})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('slides')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'slides'
                    ? 'bg-[#1b4332] text-amber-300 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                3. Slides ({formData.slides.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('gallery')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'gallery'
                    ? 'bg-[#1b4332] text-amber-300 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                4. Gallery ({formData.gallery.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('audio')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'audio'
                    ? 'bg-[#1b4332] text-amber-300 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                5. Audio Upload {formData.audio_storage_path ? '✓' : ''}
              </button>
            </div>

            {/* TAB CONTENT (SCROLLABLE BODY) */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-5 pr-1">
              {/* TAB 1: BASIC INFO & HERO */}
              {activeTab === 'info' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Page Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Rural Discipleship Camp 2026"
                      className="w-full px-3 py-2 rounded-lg border text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">URL Slug *</label>
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                      <span>/page/</span>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="rural-discipleship-camp-2026"
                        className="flex-1 px-3 py-1.5 rounded-lg border text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Subtitle / Hero Headline</label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="e.g. Equipping village pastors and frontline evangelists for biblical revival"
                      className="w-full px-3 py-2 rounded-lg border text-xs"
                    />
                  </div>

                  {/* HERO BANNER IMAGE */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-700">Hero Banner Background Image</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        ref={heroFileInputRef}
                        accept="image/*"
                        onChange={handleHeroFileChange}
                        className="hidden"
                      />
                      {formData.hero_image && (
                        <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-300 shrink-0">
                          <img src={formData.hero_image} alt="Hero banner preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 space-y-1.5">
                        <button
                          type="button"
                          onClick={() => heroFileInputRef.current?.click()}
                          className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-100 text-slate-800 hover:bg-slate-200 border cursor-pointer"
                        >
                          {isUploadingHero ? 'Uploading...' : '📁 Choose Hero Banner Image'}
                        </button>
                        <input
                          type="text"
                          value={formData.hero_image}
                          onChange={(e) => setFormData({ ...formData, hero_image: e.target.value })}
                          placeholder="Or paste image URL (Unsplash, etc.)..."
                          className="w-full px-3 py-1.5 rounded-lg border text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PUBLISH STATUS */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <input
                      type="checkbox"
                      id="page-pub"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                    />
                    <label htmlFor="page-pub" className="text-xs font-bold text-slate-700 cursor-pointer">
                      Publish publicly on website
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: HEADINGS & CONTENTS */}
              {activeTab === 'content' && (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Main Introduction Content</label>
                    <p className="text-[11px] text-slate-400">
                      Primary narrative text introducing the program, objectives, or biblical exposition.
                    </p>
                    <textarea
                      rows={5}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your main article, program summary, or devotional content..."
                      className="w-full px-3 py-2 rounded-lg border text-xs leading-relaxed"
                    />
                  </div>

                  {/* SUBSECTIONS WITH HEADINGS */}
                  <div className="space-y-3 pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Additional Headed Subsections ({formData.sections.length})
                      </label>
                      <button
                        type="button"
                        onClick={handleAddSection}
                        className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg hover:bg-emerald-100 cursor-pointer"
                      >
                        + Add Section
                      </button>
                    </div>

                    {formData.sections.map((section, idx) => (
                      <div key={section.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-amber-800">Section {idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSection(idx)}
                            className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            Remove Section
                          </button>
                        </div>
                        <input
                          type="text"
                          value={section.heading}
                          onChange={(e) => handleUpdateSection(idx, 'heading', e.target.value)}
                          placeholder="Section Heading (e.g. Schedule of Events, Core Teachings)"
                          className="w-full px-3 py-1.5 rounded-lg border text-xs font-bold bg-white"
                        />
                        <textarea
                          rows={3}
                          value={section.content}
                          onChange={(e) => handleUpdateSection(idx, 'content', e.target.value)}
                          placeholder="Section narrative text and notes..."
                          className="w-full px-3 py-1.5 rounded-lg border text-xs bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: SLIDESHOW / SLIDES */}
              {activeTab === 'slides' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Interactive Slideshow ({formData.slides.length} slides)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Add photo slides with titles and captions to showcase highlighted themes.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSlide}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg hover:bg-emerald-100 cursor-pointer"
                    >
                      + Add Slide
                    </button>
                  </div>

                  {formData.slides.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-2">
                      <p className="text-xs text-slate-500">No slides added yet.</p>
                      <button
                        type="button"
                        onClick={handleAddSlide}
                        className="px-3 py-1.5 bg-[#1b4332] text-amber-300 text-xs font-bold rounded-lg hover:bg-emerald-800 cursor-pointer"
                      >
                        Add First Slide
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.slides.map((slide, idx) => (
                        <div key={slide.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">Slide #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSlide(idx)}
                              className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                            >
                              Remove Slide
                            </button>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                              <img src={slide.image_url} alt="Slide preview" className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <label className="text-[11px] font-semibold text-slate-600 shrink-0">
                                  Image:
                                </label>
                                <input
                                  type="file"
                                  id={`slide-file-${idx}`}
                                  accept="image/*"
                                  onChange={(e) => handleSlideImageUpload(idx, e)}
                                  className="hidden"
                                />
                                <button
                                  type="button"
                                  onClick={() => document.getElementById(`slide-file-${idx}`)?.click()}
                                  className="px-2.5 py-1 text-[11px] font-semibold rounded bg-white border border-slate-300 hover:bg-slate-100 cursor-pointer"
                                >
                                  {isUploadingSlide ? 'Uploading...' : '📁 Choose File'}
                                </button>
                                <input
                                  type="text"
                                  value={slide.image_url}
                                  onChange={(e) => handleUpdateSlide(idx, 'image_url', e.target.value)}
                                  placeholder="Or image URL..."
                                  className="flex-1 px-2.5 py-1 rounded border text-xs bg-white"
                                />
                              </div>

                              <input
                                type="text"
                                value={slide.title || ''}
                                onChange={(e) => handleUpdateSlide(idx, 'title', e.target.value)}
                                placeholder="Slide Title (e.g. Frontier Evangelism Fellowship)"
                                className="w-full px-2.5 py-1 rounded border text-xs bg-white font-medium"
                              />

                              <input
                                type="text"
                                value={slide.caption || ''}
                                onChange={(e) => handleUpdateSlide(idx, 'caption', e.target.value)}
                                placeholder="Slide Caption / Scripture reference"
                                className="w-full px-2.5 py-1 rounded border text-xs bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PHOTO GALLERY */}
              {activeTab === 'gallery' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Page Photo Gallery ({formData.gallery.length} photos)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Upload or link images that will display in a responsive grid on this page.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddGalleryItem}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg hover:bg-emerald-100 cursor-pointer"
                    >
                      + Add Photo
                    </button>
                  </div>

                  {formData.gallery.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-2">
                      <p className="text-xs text-slate-500">No gallery photos added yet.</p>
                      <button
                        type="button"
                        onClick={handleAddGalleryItem}
                        className="px-3 py-1.5 bg-[#1b4332] text-amber-300 text-xs font-bold rounded-lg hover:bg-emerald-800 cursor-pointer"
                      >
                        Add First Photo
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {formData.gallery.map((photo, idx) => (
                        <div key={photo.id || idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-700">Photo #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveGallery(idx)}
                              className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                            >
                              ✕ Remove
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-16 h-14 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                              <img src={photo.image_url} alt="Gallery item" className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 space-y-1.5">
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="file"
                                  id={`gallery-file-${idx}`}
                                  accept="image/*"
                                  onChange={(e) => handleGalleryImageUpload(idx, e)}
                                  className="hidden"
                                />
                                <button
                                  type="button"
                                  onClick={() => document.getElementById(`gallery-file-${idx}`)?.click()}
                                  className="px-2 py-1 text-[10px] font-semibold rounded bg-white border border-slate-300 hover:bg-slate-100 cursor-pointer shrink-0"
                                >
                                  {isUploadingGallery ? 'Uploading...' : '📁 File'}
                                </button>
                                <input
                                  type="text"
                                  value={photo.image_url}
                                  onChange={(e) => handleUpdateGallery(idx, 'image_url', e.target.value)}
                                  placeholder="Or image URL..."
                                  className="flex-1 px-2 py-1 rounded border text-xs bg-white"
                                />
                              </div>

                              <input
                                type="text"
                                value={photo.caption || ''}
                                onChange={(e) => handleUpdateGallery(idx, 'caption', e.target.value)}
                                placeholder="Caption (optional)"
                                className="w-full px-2 py-1 rounded border text-xs bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: AUDIO UPLOAD */}
              {activeTab === 'audio' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🎙️ Attached Audio Sermon / Message</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Upload an audio file (MP3, WAV, M4A, OGG) from your computer. Visitors can listen directly on this custom page.
                    </p>
                  </div>

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
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-[#1b4332] text-amber-300 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {uploadedAudioName || 'Audio recording attached'}
                            </p>
                            <p className="text-[11px] text-emerald-800">
                              {uploadedAudioSize ? `${uploadedAudioSize} · ` : ''}
                              {formData.audio_duration ? `Duration: ${formatDuration(formData.audio_duration)}` : 'Ready to stream'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => audioFileInputRef.current?.click()}
                            className="px-3 py-1.5 text-xs font-semibold rounded bg-white text-emerald-950 border border-emerald-300 hover:bg-emerald-100 shrink-0 cursor-pointer"
                          >
                            Replace Audio
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                audio_storage_path: '',
                                audio_file_id: '',
                                audio_title: '',
                                audio_duration: 0,
                              }))
                            }
                            className="px-2.5 py-1.5 text-xs font-semibold rounded text-red-600 hover:bg-red-50 shrink-0 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Preview Player */}
                      <div className="pt-2 border-t border-emerald-200">
                        <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-1">
                          Audio Preview:
                        </span>
                        <audio src={formData.audio_storage_path} controls className="w-full h-8" />
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => audioFileInputRef.current?.click()}
                      className="border-2 border-dashed border-emerald-700/40 hover:border-emerald-700 rounded-xl p-8 text-center cursor-pointer bg-slate-50 hover:bg-emerald-50/40 transition-colors space-y-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#1b4332] flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        {isUploadingAudio ? 'Processing audio file...' : 'Click to select audio message file (MP3, WAV, M4A)'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        High-capacity client-side storage with instant streaming and download support.
                      </p>
                    </div>
                  )}

                  {/* Audio Metadata Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Audio Title</label>
                      <input
                        type="text"
                        value={formData.audio_title}
                        onChange={(e) => setFormData({ ...formData, audio_title: e.target.value })}
                        placeholder="e.g. Keynote Sermon: Reaching Unreached Villages"
                        className="w-full px-3 py-1.5 rounded-lg border text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Preacher / Speaker</label>
                      <input
                        type="text"
                        value={formData.audio_speaker}
                        onChange={(e) => setFormData({ ...formData, audio_speaker: e.target.value })}
                        placeholder="e.g. Evangelist S. O. Okon"
                        className="w-full px-3 py-1.5 rounded-lg border text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Or Public Direct Audio Link</label>
                    <input
                      type="text"
                      value={formData.audio_storage_path}
                      onChange={(e) => setFormData({ ...formData, audio_storage_path: e.target.value })}
                      placeholder="https://example.com/audio.mp3"
                      className="w-full px-3 py-1.5 rounded-lg border text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {/* MODAL FOOTER */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 shrink-0">
                <div className="text-xs text-slate-400">
                  Step {activeTab === 'info' ? '1' : activeTab === 'content' ? '2' : activeTab === 'slides' ? '3' : activeTab === 'gallery' ? '4' : '5'} of 5
                </div>

                <div className="flex items-center gap-3">
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
                    {isSaving ? 'Saving Page...' : 'Save & Publish Page'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
