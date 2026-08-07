'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { UserCheck, Plus, Trash2, Mail, X, ShieldCheck, Key, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Manager {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
  avatar?: string;
  isRealAuth?: boolean;
}

const DEFAULT_MANAGERS: Manager[] = [];

export default function AdminManagersPage() {
  const [managers, setManagers] = useState<Manager[]>(DEFAULT_MANAGERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingManager, setDeletingManager] = useState<Manager | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('DevziteAdmin123!');
  const [newRole, setNewRole] = useState('Admin');

  async function loadManagers() {
    try {
      const res = await fetch('/api/managers');
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setManagers(data.data);
      }
    } catch (err) {
      console.warn('Managers fetch fallback active:', err);
    }
  }

  useEffect(() => {
    loadManagers();
  }, []);

  const handleCreateManager = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    setLoading(true);

    try {
      await fetch('/api/managers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName || newEmail.split('@')[0],
          email: newEmail,
          password: newPassword,
          role: newRole,
        }),
      });

      setIsModalOpen(false);
      setNewName('');
      setNewEmail('');
      setNewPassword('DevziteAdmin123!');
      await loadManagers();
    } catch (err) {
      console.error('Error creating manager:', err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteManager = async () => {
    if (!deletingManager) return;

    setLoading(true);
    try {
      const targetId = deletingManager.id;
      const targetEmail = deletingManager.email;

      setManagers((prev) =>
        prev.filter(
          (m) => m.id !== targetId && m.email?.toLowerCase() !== targetEmail?.toLowerCase()
        )
      );

      await fetch(
        `/api/managers?id=${encodeURIComponent(targetId)}&email=${encodeURIComponent(targetEmail || '')}`,
        { method: 'DELETE' }
      );
      setDeletingManager(null);
      await loadManagers();
    } catch (err) {
      console.error('Error deleting manager:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-body">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <UserCheck size={20} className="text-[#3B82F6]" />
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#0F172A] dark:text-[#F8FAFC]">
              Real Admin Accounts & Firebase Auth Users
            </h1>
          </div>
          <p className="text-xs font-mono text-[#64748B]">
            Live Firebase Authentication users & verified admin managers authorized for Devzite Studio.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0"
        >
          <Plus size={16} />
          <span>Add Real Admin Account</span>
        </button>
      </div>

      {/* Grid of Admin Managers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managers.map((m) => (
          <div
            key={m.id}
            className="rounded-3xl glass-card p-6 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0C0D14] shadow-xl flex flex-col justify-between relative group hover:border-[rgba(59,130,246,0.35)] transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#3B82F6]/30 shadow-md">
                  <Image
                    src={m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={m.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col items-end">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 flex items-center gap-1">
                    <ShieldCheck size={12} />
                    <span>{m.role}</span>
                  </span>
                  <span className="text-[9px] font-mono text-[#10B981] font-bold mt-1 flex items-center gap-1">
                    <CheckCircle2 size={10} />
                    <span>Firebase Verified</span>
                  </span>
                </div>
              </div>

              <h3 className="font-display font-bold text-xl text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                {m.name}
              </h3>

              <div className="flex items-center gap-1.5 text-xs font-mono text-[#64748B] mb-4">
                <Mail size={12} className="text-[#3B82F6]" />
                <span>{m.email}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] flex items-center justify-between text-xs font-mono">
              <span className="text-[#10B981] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                {m.lastActive}
              </span>

              <button
                onClick={() => setDeletingManager(m)}
                className="p-2 rounded-xl hover:bg-[#EF4444]/10 text-[#EF4444] transition-colors cursor-pointer"
                title="Revoke Admin Access & Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Delete Confirmation */}
      {deletingManager && (
        <div className="fixed inset-0 z-[300] bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="rounded-3xl glass-card p-8 border border-[rgba(239,68,68,0.3)] bg-[#0C0D14] text-white w-full max-w-md shadow-2xl relative text-center">
            <div className="w-14 h-14 rounded-2xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center text-[#EF4444] mx-auto mb-4">
              <AlertTriangle size={28} />
            </div>

            <h2 className="font-display font-bold text-2xl mb-2">Delete Admin Account?</h2>
            <p className="text-xs text-[#94A3B8] leading-relaxed mb-6 font-mono">
              Are you sure you want to delete <strong className="text-white font-bold">{deletingManager.name}</strong> ({deletingManager.email})? This action will permanently revoke admin access and remove the user from Firebase Auth and Firestore.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingManager(null)}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] text-xs font-mono text-[#94A3B8] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteManager}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-mono font-bold uppercase tracking-wider shadow-lg"
              >
                {loading ? 'Deleting...' : 'Yes, Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Real Admin Account */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="rounded-3xl glass-card p-8 border border-[rgba(255,255,255,0.1)] bg-[#0C0D14] text-white w-full max-w-md shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-2">
                <Key size={20} className="text-[#3B82F6]" />
                <h2 className="font-display font-bold text-xl">Create Firebase Admin Account</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[#94A3B8] hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateManager} className="space-y-4 font-body">
              <div>
                <label className="block text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                  Admin Full Name
                </label>
                <input
                  type="text"
                  placeholder="Souvik Lead Engineer"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white text-sm outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                  Firebase Auth Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@devzite.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white text-sm outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                  Initial Auth Password *
                </label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white text-sm outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                  Admin Role & Privilege Level
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white text-sm outline-none focus:border-[#3B82F6]"
                >
                  <option value="Admin" className="bg-[#0C0D14] text-white">Admin</option>
                  <option value="Lead Architect" className="bg-[#0C0D14] text-white">Lead Architect</option>
                  <option value="Client Operations" className="bg-[#0C0D14] text-white">Client Operations</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] text-xs font-mono text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-mono font-bold uppercase tracking-wider shadow-md"
                >
                  {loading ? 'Registering User...' : 'Provision Firebase Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
