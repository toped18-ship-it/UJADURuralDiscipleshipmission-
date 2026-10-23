import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { SEOHead } from '../components/SEOHead';
import { DataService } from '../services/dataService';
import { BlogPost } from '../types';

export const BlogPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);

    DataService.getBlogPostBySlug(slug, false).then((found) => {
      if (!found) {
        setIsLoading(false);
        return;
      }
      setPost(found);
      setIsLoading(false);

      // Fetch related articles
      DataService.getBlogPosts(found.category, false).then((all) => {
        setRelatedPosts(all.filter((b) => b.id !== found.id).slice(0, 3));
      });
    });
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-3/4" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-slate-900">Article Not Found or Unpublished</h2>
        <p className="text-xs text-slate-500">The article you requested is either unavailable or restricted.</p>
        <button
          onClick={() => navigate('/blog')}
          className="px-4 py-2 bg-[#1b4332] text-amber-300 rounded-lg text-xs font-semibold"
        >
          Return to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <SEOHead title={post.title} description={post.excerpt} />

      {/* ARTICLE HEADER */}
      <section className="bg-[#0f2a1d] text-white py-12 border-b border-amber-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 font-semibold transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to All Blog Articles</span>
          </Link>

          <div className="flex items-center gap-3 text-xs text-emerald-200">
            <span className="px-2.5 py-0.5 rounded bg-emerald-900 border border-emerald-700 text-amber-300 font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <span>·</span>
            <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between pt-2 border-t border-emerald-900 text-xs text-emerald-200">
            <span>By {post.author_name}</span>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-900 hover:bg-emerald-800 text-amber-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 9a3 3 0 100-2.684 3 3 0 000 2.684z" />
              </svg>
              <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ARTICLE BODY CONTAINER */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Featured Image */}
        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 shadow-md">
          <ImageWithFallback
            src={post.featured_image_path}
            alt={post.title}
            category={post.category}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Lead Excerpt */}
        <div className="p-6 rounded-xl bg-amber-500/10 border-l-4 border-amber-400 text-slate-800 font-serif italic text-base sm:text-lg leading-relaxed">
          "{post.excerpt}"
        </div>

        {/* Main Prose Content */}
        <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-6">
          {post.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-2xl font-serif font-bold text-emerald-950 pt-4 pb-1 border-b border-slate-200">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('#### ')) {
              return (
                <h4 key={idx} className="text-lg font-serif font-bold text-slate-900 pt-2">
                  {paragraph.replace('#### ', '')}
                </h4>
              );
            }
            if (paragraph.startsWith('> ')) {
              return (
                <blockquote key={idx} className="p-4 bg-emerald-950 text-amber-200 rounded-xl font-serif italic border-l-4 border-amber-400 my-4">
                  {paragraph.replace('> ', '')}
                </blockquote>
              );
            }
            return (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* TAGS */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Tags:</span>
            {post.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* RELATED ARTICLES */}
      {relatedPosts.length > 0 && (
        <section className="bg-slate-50 py-12 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h3 className="text-2xl font-serif font-bold text-slate-900">Related Discipleship Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <div key={rel.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 shadow-sm">
                  <span className="text-[10px] font-bold text-emerald-900 uppercase">{rel.category}</span>
                  <h4 className="text-sm font-serif font-bold text-slate-900 line-clamp-2">
                    <Link to={`/blog/${rel.slug}`} className="hover:text-emerald-900">
                      {rel.title}
                    </Link>
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{rel.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
