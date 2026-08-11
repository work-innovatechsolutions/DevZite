'use client';

import { useState, useEffect } from 'react';
import { FileCode2, Plus, Edit2, Trash2, X, Eye, Sparkles, BookOpen } from 'lucide-react';
import { COMPREHENSIVE_BLOGS, BlogPost, BlogSection } from '@/lib/data/blogs';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>(COMPREHENSIVE_BLOGS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [author, setAuthor] = useState('DevZite Technical Team');
  const [authorRole, setAuthorRole] = useState('Principal Architect');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');
  const [excerpt, setExcerpt] = useState('');
  const [readTime, setReadTime] = useState('6 min read');
  const [icon, setIcon] = useState('⚡');
  const [tagsInput, setTagsInput] = useState('Next.js 15, Performance, Web');
  
  // Section 1 State
  const [section1Heading, setSection1Heading] = useState('1. Overview & Architecture');
  const [section1Body, setSection1Body] = useState('Detailed architectural analysis and implementation details...');
  const [section1Code, setSection1Code] = useState('');

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setBlogs(data.data);
        }
      } catch (err) {
        console.warn('Blogs fetch warning:', err);
      }
    }
    fetchBlogs();
  }, []);

  const openCreateModal = () => {
    setEditingSlug(null);
    setTitle('');
    setCategory('Engineering');
    setAuthor('DevZite Technical Team');
    setAuthorRole('Principal Architect');
    setStatus('Published');
    setExcerpt('');
    setReadTime('6 min read');
    setIcon('⚡');
    setTagsInput('Next.js 15, Performance, Web');
    setSection1Heading('1. Overview & Architecture');
    setSection1Body('Detailed architectural analysis and implementation details...');
    setSection1Code('');
    setIsModalOpen(true);
  };

  const openEditModal = (blog: BlogPost) => {
    setEditingSlug(blog.slug);
    setTitle(blog.title || '');
    setCategory(blog.category || 'Engineering');
    setAuthor(blog.author || 'DevZite Team');
    setAuthorRole(blog.authorRole || 'Engineering');
    setStatus(blog.status || 'Published');
    setExcerpt(blog.excerpt || '');
    setReadTime(blog.readTime || '6 min read');
    setIcon(blog.icon || '⚡');
    setTagsInput(blog.tags ? blog.tags.join(', ') : 'Tech');
    
    if (blog.sections && blog.sections.length > 0) {
      setSection1Heading(blog.sections[0].heading || '1. Section Title');
      setSection1Body(blog.sections[0].body || '');
      setSection1Code(blog.sections[0].code || '');
    } else {
      setSection1Heading('1. Overview');
      setSection1Body(blog.excerpt || '');
      setSection1Code('');
    }

    setIsModalOpen(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setLoading(true);
    const slug = editingSlug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const sections: BlogSection[] = [
      {
        heading: section1Heading,
        body: section1Body,
        ...(section1Code ? { code: section1Code, codeLanguage: 'typescript' } : {}),
      },
    ];

    const blogData: BlogPost = {
      slug,
      title,
      category,
      author,
      authorRole,
      status,
      views: editingSlug ? (blogs.find(b => b.slug === editingSlug)?.views || 100) : 1,
      likes: editingSlug ? (blogs.find(b => b.slug === editingSlug)?.likes || 12) : 0,
      excerpt,
      readTime,
      icon,
      tags: parsedTags,
      sections,
      publishedAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    try {
      await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData),
      });

      setBlogs((prev) => {
        const exists = prev.some((b) => b.slug === slug);
        if (exists) {
          return prev.map((b) => (b.slug === slug ? blogData : b));
        }
        return [blogData, ...prev];
      });

      setIsModalOpen(false);
      setEditingSlug(null);
    } catch (err) {
      console.error('Error saving blog post:', err);
      setBlogs((prev) => {
        const exists = prev.some((b) => b.slug === slug);
        if (exists) {
          return prev.map((b) => (b.slug === slug ? blogData : b));
        }
        return [blogData, ...prev];
      });
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this blog publication?')) return;
    try {
      await fetch(`/api/blogs?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' });
      setBlogs((prev) => prev.filter((b) => b.slug !== slug));
    } catch (err) {
      console.error('Error deleting blog article:', err);
      setBlogs((prev) => prev.filter((b) => b.slug !== slug));
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#3B82F6] font-semibold mb-1">
            <FileCode2 size={16} />
            <span>DEVZITE / BLOG & MDX CMS</span>
          </div>
          <h1 className="text-3xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC]">
            MDX Content Publication Manager
          </h1>
          <p className="text-sm font-body text-[#475569] dark:text-[#94A3B8] mt-1">
            Create, edit, and publish technical insights, code snippets, and engineering blueprints.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-primary text-xs px-5 py-3 shadow-[0_0_20px_rgba(59,130,246,0.25)] cursor-pointer"
        >
          <Plus size={16} />
          Create New MDX Article
        </button>
      </div>

      {/* Blog Table */}
      <div className="glass-card rounded-2xl p-6 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-[#475569] dark:text-[#94A3B8]">
            <thead>
              <tr className="border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#64748B]">
                <th className="pb-4 font-bold uppercase tracking-wider">Article Title</th>
                <th className="pb-4 font-bold uppercase tracking-wider">Category</th>
                <th className="pb-4 font-bold uppercase tracking-wider">Author</th>
                <th className="pb-4 font-bold uppercase tracking-wider">Status</th>
                <th className="pb-4 font-bold uppercase tracking-wider">Views</th>
                <th className="pb-4 text-right font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(15,23,42,0.06)] dark:divide-[rgba(255,255,255,0.04)]">
              {blogs.map((post) => (
                <tr key={post.slug} className="hover:bg-[rgba(15,23,42,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2 font-display font-bold text-base text-[#0F172A] dark:text-[#F8FAFC]">
                      <span>{post.icon || '⚡'}</span>
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="hover:text-[#3B82F6] transition-colors">
                        {post.title}
                      </a>
                    </div>
                    {post.excerpt && (
                      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-body line-clamp-1 mt-0.5">
                        {post.excerpt}
                      </p>
                    )}
                  </td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] bg-[rgba(59,130,246,0.1)] text-[#3B82F6] font-semibold">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-4 font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{post.author || 'Devzite Team'}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      post.status === 'Published'
                        ? 'bg-[rgba(16,185,129,0.15)] text-[#10B981]'
                        : 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="py-4 font-semibold">{post.views || 0}</td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg hover:bg-[rgba(6,182,212,0.1)] text-[#06B6D4] transition-colors cursor-pointer"
                        title="View Public Article"
                      >
                        <Eye size={16} />
                      </a>
                      <button
                        onClick={() => openEditModal(post)}
                        className="p-2 rounded-lg hover:bg-[rgba(59,130,246,0.1)] text-[#3B82F6] transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(post.slug)}
                        className="p-2 rounded-lg hover:bg-[rgba(239,68,68,0.1)] text-[#EF4444] transition-colors cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Creating & Editing Blogs */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-hidden">
          <div
            data-lenis-prevent="true"
            className="glass-card rounded-2xl p-6 sm:p-8 max-w-2xl w-full border border-[rgba(15,23,42,0.15)] dark:border-[rgba(255,255,255,0.15)] bg-white dark:bg-[#0C0D14] shadow-2xl overflow-y-auto max-h-[85vh] custom-scrollbar"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] sticky top-0 bg-white dark:bg-[#0C0D14] z-10">
              <h3 className="font-display font-bold text-xl text-[#0F172A] dark:text-[#F8FAFC]">
                {editingSlug ? 'Edit MDX Publication' : 'Create New MDX Publication'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-5 text-xs font-mono">
              <div>
                <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Article Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Building High-Performance Web Apps with Next.js 15"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#3B82F6]"
                  >
                    <option value="Engineering" className="dark:bg-[#0C0D14]">Engineering</option>
                    <option value="Mobile Dev" className="dark:bg-[#0C0D14]">Mobile Dev</option>
                    <option value="Backend" className="dark:bg-[#0C0D14]">Backend</option>
                    <option value="AI Pipeline" className="dark:bg-[#0C0D14]">AI Pipeline</option>
                    <option value="Design Systems" className="dark:bg-[#0C0D14]">Design Systems</option>
                    <option value="SaaS Growth" className="dark:bg-[#0C0D14]">SaaS Growth</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Author Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div>
                  <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Publish Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#3B82F6]"
                  >
                    <option value="Published" className="dark:bg-[#0C0D14]">Published</option>
                    <option value="Draft" className="dark:bg-[#0C0D14]">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Excerpt / Abstract *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Write a compelling overview of the article content..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#3B82F6] font-body text-xs"
                />
              </div>

              {/* Section 1 Content Editor */}
              <div className="p-4 rounded-xl glass border border-[rgba(59,130,246,0.15)] bg-[rgba(59,130,246,0.02)] space-y-3">
                <span className="text-[11px] font-bold text-[#3B82F6] uppercase tracking-wider block">
                  Article Body & Code Content
                </span>
                
                <div>
                  <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Section Heading</label>
                  <input
                    type="text"
                    value={section1Heading}
                    onChange={(e) => setSection1Heading(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div>
                  <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Section Paragraph Body</label>
                  <textarea
                    rows={4}
                    value={section1Body}
                    onChange={(e) => setSection1Body(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#3B82F6] font-body text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Code Snippet (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. const app = next({ dev });"
                    value={section1Code}
                    onChange={(e) => setSection1Code(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#60A5FA] outline-none focus:border-[#3B82F6] font-mono text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-3 rounded-xl border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#475569] dark:text-[#94A3B8] font-bold hover:bg-[rgba(15,23,42,0.04)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 py-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold transition-colors shadow-md cursor-pointer"
                >
                  {loading ? 'Saving...' : editingSlug ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
