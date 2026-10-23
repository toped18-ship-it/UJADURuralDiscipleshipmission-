import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { SEOHead } from '../components/SEOHead';
import { DataService } from '../services/dataService';
import { BlogPost } from '../types';

export const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const categories = [
    'All',
    'Bible Teachings',
    'Discipleship',
    'Devotionals',
    'Evangelism',
    'Mission Reports',
    'Testimonies',
    'Ministry News',
  ];

  useEffect(() => {
    setIsLoading(true);
    DataService.getBlogPosts(selectedCategory, false).then((data) => {
      setBlogs(data);
      setIsLoading(false);
    });
  }, [selectedCategory]);

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const featuredBlog = filteredBlogs[0];
  const regularBlogs = filteredBlogs.slice(1);

  return (
    <div className="space-y-12 pb-16">
      <SEOHead
        title="Mission Blog & Teachings – UJADU Rural Discipleship Mission"
        description="Read inspirational biblical teachings, rural outreach updates, field testimonies, and devotionals from UJADU Mission."
      />

      {/* HEADER BANNER */}
      <section className="bg-[#0f2a1d] text-white py-14 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Biblical Truth & Outreach Updates</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">Mission Blog & Articles</h1>
          <p className="text-emerald-100 max-w-xl mx-auto text-xs sm:text-sm">
            Articles, field testimonies, devotionals, and biblical discipleship studies.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* CATEGORIES & SEARCH */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#1b4332] text-amber-300 shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search articles by title, tag, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 pl-9 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* FEATURED BLOG POST */}
        {featuredBlog && !searchQuery && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-6 sm:p-8">
            <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-900">
              <ImageWithFallback
                src={featuredBlog.featured_image_path}
                alt={featuredBlog.title}
                category={featuredBlog.category}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-bold text-amber-600 uppercase tracking-wider">{featuredBlog.category}</span>
                <span>·</span>
                <span>{new Date(featuredBlog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 leading-tight">
                <Link to={`/blog/${featuredBlog.slug}`} className="hover:text-emerald-900 transition-colors">
                  {featuredBlog.title}
                </Link>
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{featuredBlog.excerpt}</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500 font-medium">By {featuredBlog.author_name}</span>
                <Link
                  to={`/blog/${featuredBlog.slug}`}
                  className="px-4 py-2 rounded-lg bg-emerald-900 text-amber-300 font-bold text-xs hover:bg-emerald-800 transition-colors"
                >
                  Read Featured Article
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ARTICLES GRID */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-200 rounded-xl aspect-[4/3]" />
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 space-y-3">
            <svg className="w-12 h-12 text-slate-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="text-base font-serif font-bold text-slate-800">No Published Articles Found</h3>
            <p className="text-xs text-slate-500">Check back soon or search for a different topic.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(searchQuery ? filteredBlogs : regularBlogs).map((blog) => (
              <article
                key={blog.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
                    <ImageWithFallback
                      src={blog.featured_image_path}
                      alt={blog.title}
                      category={blog.category}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-emerald-900">{blog.category}</span>
                      <span>·</span>
                      <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h3 className="text-lg font-serif font-bold text-slate-900 hover:text-emerald-900 transition-colors line-clamp-2">
                      <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{blog.excerpt}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                  <span className="text-[11px] text-slate-400">By {blog.author_name}</span>
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    <span>Read More</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
