import React, { useEffect, useState } from 'react';
import { DataService } from '../../services/dataService';
import { BlogPost } from '../../types';

export const AdminBlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Discipleship' as BlogPost['category'],
    tagsStr: 'Discipleship, Evangelism',
    author_name: 'Evangelist S. O. Okon',
    featured_image_path: '',
    status: 'draft' as 'draft' | 'published',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  async function loadBlogs() {
    setIsLoading(true);
    const data = await DataService.getBlogPosts(undefined, true);
    setBlogs(data);
    setIsLoading(false);
  }

  const handleTitleChange = (val: string) => {
    const slugVal = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: editingItem ? prev.slug : slugVal,
    }));
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsPreviewMode(false);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: `### Main Headline

Write your discipleship message or mission report here...

> "For I am not ashamed of the gospel of Christ, for it is the power of God to salvation for everyone who believes." — Romans 1:16

#### Key Points
1. Biblical foundation
2. Field application
`,
      category: 'Discipleship',
      tagsStr: 'Discipleship, Evangelism',
      author_name: 'Evangelist S. O. Okon',
      featured_image_path: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80',
      status: 'draft',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: BlogPost) => {
    setEditingItem(item);
    setIsPreviewMode(false);
    setFormData({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || '',
      content: item.content,
      category: item.category,
      tagsStr: (item.tags || []).join(', '),
      author_name: item.author_name || 'UJADU Discipleship Team',
      featured_image_path: item.featured_image_path || '',
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert('Please enter a title and content for the article.');
      return;
    }

    setIsSaving(true);
    const tags = formData.tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    await DataService.saveBlogPost({
      id: editingItem?.id,
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
      excerpt: formData.excerpt,
      content: formData.content,
      category: formData.category,
      tags,
      author_name: formData.author_name,
      featured_image_path: formData.featured_image_path,
      status: formData.status,
    });

    setIsSaving(false);
    setIsModalOpen(false);
    setMessage(editingItem ? 'Blog post updated!' : 'Blog post saved!');
    setTimeout(() => setMessage(null), 3000);
    loadBlogs();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog article?')) {
      await DataService.deleteBlogPost(id);
      loadBlogs();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Blog Publishing System</h1>
          <p className="text-xs text-slate-500">Draft, preview, publish, and manage discipleship articles and mission reports.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-lg bg-[#1b4332] text-amber-300 font-bold text-xs hover:bg-emerald-800 transition-colors shadow flex items-center gap-1.5 shrink-0"
        >
          <span>+ Create New Article</span>
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
            <div key={n} className="h-24 bg-slate-200 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {blogs.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.status === 'published' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {item.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-xs text-emerald-900 font-semibold">{item.category}</span>
                  <span className="text-xs text-slate-400 font-mono">· slug: /blog/{item.slug}</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-1">{item.excerpt}</p>
                <p className="text-[11px] text-slate-400">By {item.author_name} · Created: {new Date(item.created_at).toLocaleDateString()}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200"
                >
                  Edit Article
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

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-serif font-bold text-slate-900">
                {editingItem ? 'Edit Blog Article' : 'Create New Article'}
              </h3>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className="px-3 py-1 rounded bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  {isPreviewMode ? '✏️ Edit Mode' : '👁️ Preview Mode'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 text-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            {isPreviewMode ? (
              <div className="space-y-4 p-4 border rounded-xl bg-slate-50">
                <span className="text-xs font-bold uppercase text-amber-600">{formData.category}</span>
                <h2 className="text-2xl font-serif font-bold text-slate-900">{formData.title}</h2>
                <p className="text-xs italic text-slate-600">"{formData.excerpt}"</p>
                <div className="prose text-xs leading-relaxed space-y-2 border-t pt-4">
                  {formData.content.split('\n\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Article Headline..."
                    className="w-full px-3.5 py-2 rounded-lg border text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as typeof formData.category })}
                      className="w-full px-3 py-2 rounded-lg border text-xs bg-white"
                    >
                      <option value="Bible Teachings">Bible Teachings</option>
                      <option value="Discipleship">Discipleship</option>
                      <option value="Devotionals">Devotionals</option>
                      <option value="Evangelism">Evangelism</option>
                      <option value="Mission Reports">Mission Reports</option>
                      <option value="Testimonies">Testimonies</option>
                      <option value="Ministry News">Ministry News</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Author Name</label>
                    <input
                      type="text"
                      value={formData.author_name}
                      onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Featured Image URL</label>
                    <input
                      type="text"
                      value={formData.featured_image_path}
                      onChange={(e) => setFormData({ ...formData, featured_image_path: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-lg border text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Article Excerpt *</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Short summary displayed on cards..."
                    className="w-full px-3 py-2 rounded-lg border text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Article Content (Markdown / Formatted prose) *</label>
                  <textarea
                    rows={8}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Full article body content..."
                    className="w-full px-3 py-2 rounded-lg border text-xs font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={formData.tagsStr}
                      onChange={(e) => setFormData({ ...formData, tagsStr: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Publication Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                      className="w-full px-3 py-2 rounded-lg border text-xs bg-white font-bold"
                    >
                      <option value="draft">Save as Draft (Private)</option>
                      <option value="published">Publish Publicly</option>
                    </select>
                  </div>
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
                    {isSaving ? 'Saving...' : 'Save Blog Post'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
