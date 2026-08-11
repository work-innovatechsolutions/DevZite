'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  FolderOpen,
  FileText,
  Download,
  UploadCloud,
  Search,
  CheckCircle2,
  FileCode,
  FileSpreadsheet,
  HardDrive,
  Trash2,
  Eye,
  Tag
} from 'lucide-react';
import { BlurReveal } from '@/components/motion';

interface AssetFile {
  id: string;
  name: string;
  category: 'Specs' | 'Design' | 'Code' | 'Legal';
  size: string;
  uploadedBy: string;
  date: string;
  type: string;
}

const INITIAL_CLIENT_FILES: AssetFile[] = [
  { id: 'f-1', name: 'Nexus_System_Architecture_v2.4.pdf', category: 'Specs', size: '4.2 MB', uploadedBy: 'Alex Wright (DevZite)', date: 'Aug 09, 2026', type: 'PDF' },
  { id: 'f-2', name: 'Lighthouse_Audit_Performance_Benchmark.pdf', category: 'Specs', size: '1.8 MB', uploadedBy: 'Sophia Lin (DevZite)', date: 'Aug 07, 2026', type: 'PDF' },
  { id: 'f-3', name: 'DevZite_Design_Tokens_Aura_v2.json', category: 'Design', size: '420 KB', uploadedBy: 'Devin Zhao (DevZite)', date: 'Aug 04, 2026', type: 'JSON' },
  { id: 'f-4', name: 'Postman_Collection_REST_Staging.json', category: 'Code', size: '890 KB', uploadedBy: 'Alex Wright (DevZite)', date: 'Aug 01, 2026', type: 'JSON' },
  { id: 'f-5', name: 'Master_Services_Agreement_Signed.pdf', category: 'Legal', size: '2.1 MB', uploadedBy: 'Sarah Jenkins (Nexus)', date: 'Jul 01, 2026', type: 'PDF' },
  { id: 'f-6', name: 'High_Res_Brand_Logo_Vector.svg', category: 'Design', size: '1.2 MB', uploadedBy: 'Sarah Jenkins (Nexus)', date: 'Jul 05, 2026', type: 'SVG' },
];

export default function ClientFilesPage() {
  const [files, setFiles] = useState<AssetFile[]>(INITIAL_CLIENT_FILES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [uploadedNotification, setUploadedNotification] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const newFile = acceptedFiles[0];
        const newAsset: AssetFile = {
          id: `f-${Date.now()}`,
          name: newFile.name,
          category: 'Specs',
          size: `${(newFile.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadedBy: 'Sarah Jenkins (Client)',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          type: newFile.name.split('.').pop()?.toUpperCase() || 'FILE',
        };
        setFiles((prev) => [newAsset, ...prev]);
        setUploadedNotification(newFile.name);
        setTimeout(() => setUploadedNotification(null), 3500);
      }
    },
  });

  const filteredFiles = files.filter((f) => {
    const matchesCat = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDownload = (id: string, name: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`Asset download initiated for ${name}`);
    }, 700);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <BlurReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#06B6D4] font-bold uppercase tracking-wider mb-1">
              <FolderOpen size={16} />
              <span>Project Deliverables & Repository</span>
            </div>
            <h1 className="text-3xl font-display font-black text-[#F8FAFC]">
              Files & Shared Assets
            </h1>
            <p className="text-sm font-body text-[#94A3B8] mt-1">
              Access architecture specifications, design tokens, legal contracts, and uploaded attachments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl glass border border-[rgba(255,255,255,0.08)] flex items-center gap-3 text-xs font-mono">
              <HardDrive size={16} className="text-[#06B6D4]" />
              <div>
                <span className="text-[#F8FAFC] font-bold">10.5 MB</span>
                <span className="text-[#64748B]"> / 10 GB Storage</span>
              </div>
            </div>
          </div>
        </div>
      </BlurReveal>

      {/* File Upload Dropzone */}
      <BlurReveal delay={0.15}>
        <div
          {...getRootProps()}
          className={`rounded-3xl glass p-8 border-2 border-dashed transition-all cursor-pointer text-center ${
            isDragActive
              ? 'border-[#06B6D4] bg-[rgba(6,182,212,0.1)] scale-[1.01]'
              : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(6,182,212,0.4)] bg-[#0C0D14]'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud size={36} className="text-[#06B6D4] mx-auto mb-3" />
          <h3 className="font-display font-bold text-base text-[#F8FAFC] mb-1">
            Drag and drop client asset files or feedback PDFs here
          </h3>
          <p className="text-xs font-mono text-[#94A3B8]">
            Supports PDF, PNG, SVG, JSON, ZIP up to 50MB. Uploaded assets are shared instantly with your engineering team.
          </p>
        </div>

        {uploadedNotification && (
          <div className="mt-3 p-3 rounded-2xl bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] text-[#10B981] text-xs font-mono flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Uploaded &quot;{uploadedNotification}&quot; to project workspace!</span>
          </div>
        )}
      </BlurReveal>

      {/* Filter & Search Bar */}
      <BlurReveal delay={0.2} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {['All', 'Specs', 'Design', 'Code', 'Legal'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#06B6D4] text-[#06070A] shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'glass text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative flex items-center max-w-xs w-full">
          <Search size={16} className="absolute left-3.5 text-[#64748B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-xs font-mono text-[#F8FAFC] placeholder-[#64748B] outline-none focus:border-[#06B6D4]"
          />
        </div>
      </BlurReveal>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFiles.map((file) => (
          <BlurReveal key={file.id} delay={0.05}>
            <div className="rounded-3xl glass p-6 border border-[rgba(255,255,255,0.08)] bg-[#0C0D14] hover:border-[rgba(6,182,212,0.3)] transition-all flex flex-col justify-between h-full group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="p-3 rounded-2xl glass border border-[rgba(6,182,212,0.2)] bg-[rgba(6,182,212,0.05)] text-[#06B6D4]">
                    <FileText size={20} />
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[rgba(255,255,255,0.04)] text-[#94A3B8]">
                    {file.category}
                  </span>
                </div>

                <h4 className="font-display font-bold text-sm text-[#F8FAFC] group-hover:text-[#06B6D4] transition-colors leading-snug mb-2 line-clamp-2">
                  {file.name}
                </h4>

                <p className="text-[11px] font-mono text-[#64748B] mb-4">
                  Uploaded by {file.uploadedBy}
                </p>
              </div>

              <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                <span>{file.size} · {file.date}</span>

                <button
                  onClick={() => handleDownload(file.id, file.name)}
                  disabled={downloadingId === file.id}
                  className="px-3 py-1.5 rounded-xl bg-[rgba(6,182,212,0.15)] hover:bg-[#06B6D4] text-[#06B6D4] hover:text-[#06070A] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download size={12} />
                  <span>{downloadingId === file.id ? 'Saving...' : 'Download'}</span>
                </button>
              </div>
            </div>
          </BlurReveal>
        ))}
      </div>
    </div>
  );
}
