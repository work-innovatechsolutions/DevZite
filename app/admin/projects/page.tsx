'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FolderKanban, Plus, ExternalLink, Zap, Trash2, X, Upload, Image as ImageIcon, Edit3 } from 'lucide-react';

interface ProjectItem {
  id?: string;
  slug: string;
  name: string;
  category: string;
  status: string;
  summary?: string;
  lighthouseScore: number;
  techStack: string[];
  url: string;
  image?: string;
}

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    slug: 'aura-studio-platform',
    name: 'Aura Studio Platform',
    category: 'Next.js 15 Platform',
    status: 'Live Production',
    summary: 'Living web operating system built with modular component architecture, 60fps animations, and edge delivery.',
    lighthouseScore: 99,
    techStack: ['Next.js 15', 'Tailwind', 'GSAP', 'Lenis'],
    url: 'https://devzite.com',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
  },
  {
    slug: 'cyberpulse-saas-dashboard',
    name: 'CyberPulse SaaS Dashboard',
    category: 'Full-Stack Web App',
    status: 'Active QA',
    summary: 'Enterprise real-time analytics portal with WebSocket telemetry and serverless API backend.',
    lighthouseScore: 98,
    techStack: ['React 19', 'TypeScript', 'Serverless'],
    url: 'https://cyberpulse.io',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
  },
  {
    slug: 'omnitrade-mobile-app',
    name: 'OmniTrade Mobile Software',
    category: 'Native Android App',
    status: 'In Development',
    summary: 'Native Android trading suite with low-latency order execution and biometric authentication.',
    lighthouseScore: 97,
    techStack: ['Kotlin', 'Jetpack Compose', 'Clean Arch'],
    url: 'https://omnitrade.app',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
  },
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>(DEFAULT_PROJECTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Next.js 15 Web App');
  const [status, setStatus] = useState('Live Production');
  const [score, setScore] = useState(99);
  const [url, setUrl] = useState('https://devzite.com');
  const [tech, setTech] = useState('Next.js 15, Tailwind, TypeScript');
  const [summary, setSummary] = useState('High-performance web application engineered for scale.');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80');

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setProjects(data.data);
        }
      } catch (err) {
        console.warn('Projects server API fallback active:', err);
      }
    }
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingSlug(null);
    setName('');
    setCategory('Next.js 15 Web App');
    setStatus('Live Production');
    setScore(99);
    setUrl('https://devzite.com');
    setTech('Next.js 15, Tailwind, TypeScript');
    setSummary('High-performance web application engineered for scale.');
    setImage('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80');
    setIsModalOpen(true);
  };

  const openEditModal = (project: ProjectItem) => {
    setEditingSlug(project.slug);
    setName(project.name || '');
    setCategory(project.category || 'Next.js 15 Web App');
    setStatus(project.status || 'Live Production');
    setScore(project.lighthouseScore || 99);
    setUrl(project.url || 'https://devzite.com');
    setTech(Array.isArray(project.techStack) ? project.techStack.join(', ') : 'Next.js 15, Tailwind, TypeScript');
    setSummary(project.summary || 'High-performance web application engineered for scale.');
    setImage(project.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80');
    setIsModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    const targetSlug = editingSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const projectData: any = {
      slug: targetSlug,
      name,
      category,
      status,
      summary,
      lighthouseScore: Number(score),
      techStack: tech.split(',').map((t) => t.trim()).filter(Boolean),
      url,
      image: image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    };

    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      setProjects((prev) => {
        const exists = prev.some((p) => p.slug === targetSlug);
        if (exists) {
          return prev.map((p) => (p.slug === targetSlug ? projectData : p));
        }
        return [projectData, ...prev];
      });

      setIsModalOpen(false);
      setEditingSlug(null);
    } catch (err) {
      console.error('Error saving project via server API:', err);
      setProjects((prev) => {
        const exists = prev.some((p) => p.slug === targetSlug);
        if (exists) {
          return prev.map((p) => (p.slug === targetSlug ? projectData : p));
        }
        return [projectData, ...prev];
      });
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this project case?')) return;
    try {
      await fetch(`/api/projects?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' });
      setProjects((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      console.error('Error deleting project:', err);
      setProjects((prev) => prev.filter((p) => p.slug !== slug));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setImage(compressedDataUrl);
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#3B82F6] font-semibold mb-1">
            <FolderKanban size={16} />
            <span>DEVZITE / PROJECTS</span>
          </div>
          <h1 className="text-3xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC]">
            Project Workbench
          </h1>
          <p className="text-sm font-body text-[#475569] dark:text-[#94A3B8] mt-1">
            Manage deployed studio software, upload cover imagery, track performance scores, and edit case studies.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-primary text-xs px-5 py-3 shadow-[0_0_20px_rgba(59,130,246,0.25)]"
        >
          <Plus size={16} />
          Create New Project Case
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <div
            key={p.slug}
            className="glass-card rounded-2xl p-6 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] flex flex-col justify-between"
          >
            <div>
              {/* Project Cover Image Preview */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-5 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-[#0C0D14]">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    unoptimized={p.image?.startsWith('data:')}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#64748B] text-xs font-mono">
                    <ImageIcon size={24} className="mr-2 text-[#3B82F6]" />
                    No Image Uploaded
                  </div>
                )}
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#0C0D14]/80 text-[#3B82F6] backdrop-blur-md border border-[rgba(255,255,255,0.1)]">
                  {p.category}
                </span>
                <span className="absolute top-3 right-3 flex items-center gap-1.5 text-xs font-mono font-bold text-[#10B981] bg-[#0C0D14]/80 px-2.5 py-1 rounded-full backdrop-blur-md border border-[rgba(255,255,255,0.1)]">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  {p.status}
                </span>
              </div>

              <h3 className="font-display font-bold text-xl text-[#0F172A] dark:text-[#F8FAFC] mb-2">
                {p.name}
              </h3>

              {p.summary && (
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-body mb-4 line-clamp-2">
                  {p.summary}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-6">
                {p.techStack?.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] text-[#475569] dark:text-[#CBD5E1] border border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.06)] font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-[#0F172A] dark:text-[#F8FAFC]">
                <Zap size={14} className="text-[#3B82F6]" />
                <span>Lighthouse Score: </span>
                <span className="font-bold text-[#10B981]">{p.lighthouseScore || 99}/100</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-mono font-semibold text-[#3B82F6] hover:underline mr-1"
                >
                  <span>Live Demo</span>
                  <ExternalLink size={14} />
                </a>
                <button
                  onClick={() => openEditModal(p)}
                  className="p-1.5 rounded-lg text-[#3B82F6] hover:bg-[#3B82F6]/10 transition-colors"
                  title="Edit Project"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteProject(p.slug)}
                  className="p-1.5 rounded-lg text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] transition-colors"
                  title="Delete Project"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-hidden">
          <div
            data-lenis-prevent="true"
            className="glass-card rounded-2xl p-6 sm:p-8 max-w-2xl w-full border border-[rgba(15,23,42,0.15)] dark:border-[rgba(255,255,255,0.15)] bg-white dark:bg-[#0C0D14] shadow-2xl overflow-y-auto max-h-[85vh] custom-scrollbar"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] sticky top-0 bg-white dark:bg-[#0C0D14] z-10">
              <h3 className="font-display font-bold text-xl text-[#0F172A] dark:text-[#F8FAFC]">
                {editingSlug ? 'Edit Project Case' : 'Create Project Case with Cover Image'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-5 text-xs font-mono">
              {/* Image Upload / URL Preview Box */}
              <div>
                <label className="block text-[#475569] dark:text-[#94A3B8] mb-1.5 font-bold">
                  Project Cover Image
                </label>
                <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-3 border border-dashed border-[#3B82F6]/50 bg-[rgba(59,130,246,0.04)] flex flex-col items-center justify-center text-center p-4">
                  {image ? (
                    <Image src={image} alt="Preview" fill unoptimized={image?.startsWith('data:')} className="object-cover" />
                  ) : (
                    <>
                      <Upload size={24} className="text-[#3B82F6] mb-2" />
                      <span className="text-[#334155] dark:text-[#CBD5E1] font-bold">Click to Upload File or Paste Image URL</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Or paste image URL (https://...)"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Project Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ABjee Travel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div>
                  <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Status</label>
                  <input
                    type="text"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div>
                  <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Lighthouse Score</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Live Demo URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Project Summary / Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explore tourist places, connect with fellow travellers, read trip stories..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#3B82F6] font-body text-sm"
                />
              </div>

              <div>
                <label className="block text-[#475569] dark:text-[#94A3B8] mb-1 font-bold">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={tech}
                  onChange={(e) => setTech(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#3B82F6]"
                />
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
                  {loading ? 'Saving...' : editingSlug ? 'Update Project' : 'Save Project Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
