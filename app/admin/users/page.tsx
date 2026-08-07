'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Users,
  Search,
  ShieldCheck,
  User,
  Clock,
  Mail,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'User';
  status: string;
  lastLogin: string;
  createdAt: string;
}

export default function RegisteredUsersAdminPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingEmail, setUpdatingEmail] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setUsers(data.data);
      }
    } catch (err) {
      console.warn('Users fetch notice:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (email: string, newRole: 'Admin' | 'User') => {
    setUpdatingEmail(email);
    try {
      // Optimistic update
      setUsers((prev) =>
        prev.map((u) => (u.email.toLowerCase() === email.toLowerCase() ? { ...u, role: newRole } : u))
      );

      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: newRole }),
      });
      const data = await res.json();

      if (data.success) {
        setToastMessage(`Permission updated: ${email} is now ${newRole}`);
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      console.error('Error updating user role:', err);
    } finally {
      setUpdatingEmail(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const userName = (u.name || u.email || '').toLowerCase();
    const userEmail = (u.email || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    return userName.includes(q) || userEmail.includes(q);
  });

  const adminCount = users.filter((u) => u.role === 'Admin').length;
  const standardUserCount = users.filter((u) => u.role === 'User').length;

  return (
    <div className="space-y-8 font-body">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[300] bg-[#10B981] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold"
          >
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users size={22} className="text-[#3B82F6]" />
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#0F172A] dark:text-[#F8FAFC]">
              Registered Users & Permission Management
            </h1>
          </div>
          <p className="text-xs text-[#64748B]">
            All logged-in user accounts stored with profiles, DP avatars, and dynamic Admin permission assignments.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#0C0D14] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:text-[#3B82F6] transition-colors shrink-0"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Users</span>
        </button>
      </div>

      {/* Stats Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-3xl glass-card p-6 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0C0D14] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-[#64748B] block mb-1 uppercase font-bold tracking-wider">
              Total Logged In Users
            </span>
            <span className="font-display font-black text-3xl text-[#0F172A] dark:text-[#F8FAFC]">
              {users.length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6]">
            <Users size={22} />
          </div>
        </div>

        <div className="rounded-3xl glass-card p-6 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0C0D14] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-[#64748B] block mb-1 uppercase font-bold tracking-wider">
              Authorized Admins
            </span>
            <span className="font-display font-black text-3xl text-[#10B981]">
              {adminCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981]">
            <ShieldCheck size={22} />
          </div>
        </div>

        <div className="rounded-3xl glass-card p-6 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0C0D14] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-[#64748B] block mb-1 uppercase font-bold tracking-wider">
              Standard Client Users
            </span>
            <span className="font-display font-black text-3xl text-[#8B5CF6]">
              {standardUserCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
            <User size={22} />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
        <input
          type="text"
          placeholder="Search registered users by name or email address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white dark:bg-[#0C0D14] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-sm outline-none focus:ring-2 focus:ring-[#3B82F6]/50 transition-all text-[#0F172A] dark:text-[#F8FAFC]"
        />
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((u) => (
          <div
            key={u.id}
            className={`rounded-3xl glass-card p-6 border bg-white dark:bg-[#0C0D14] shadow-xl flex flex-col justify-between relative transition-all ${
              u.role === 'Admin'
                ? 'border-[#3B82F6]/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                : 'border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]'
            }`}
          >
            <div>
              {/* Header Profile DP & Role Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#3B82F6]/30 shadow-md bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] font-bold text-lg">
                  {u.avatar ? (
                    <Image
                      src={u.avatar}
                      alt={u.name || u.email || 'User Avatar'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span>{(u.name || u.email || 'U').charAt(0).toUpperCase()}</span>
                  )}
                </div>

                <div className="flex flex-col items-end">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      u.role === 'Admin'
                        ? 'bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30'
                        : 'bg-[rgba(15,23,42,0.05)] dark:bg-[rgba(255,255,255,0.05)] text-[#64748B] border border-[rgba(15,23,42,0.1)] dark:border-[rgba(255,255,255,0.1)]'
                    }`}
                  >
                    {u.role === 'Admin' ? <ShieldCheck size={14} /> : <User size={14} />}
                    <span>{u.role || 'User'}</span>
                  </span>
                </div>
              </div>

              <h3 className="font-display font-bold text-xl text-[#0F172A] dark:text-[#F8FAFC] mb-1 truncate">
                {u.name || u.email || 'Registered User'}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-4 truncate font-medium">
                <Mail size={13} className="text-[#3B82F6] shrink-0" />
                <span className="truncate">{u.email || 'No email provided'}</span>
              </div>
            </div>

            {/* Role Permission Dropdown Selector */}
            <div className="pt-4 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5 flex items-center gap-1">
                  <UserCheck size={12} className="text-[#3B82F6]" />
                  <span>Assign Privilege Role</span>
                </label>

                <select
                  value={u.role}
                  disabled={updatingEmail === u.email}
                  onChange={(e) => handleRoleChange(u.email, e.target.value as 'Admin' | 'User')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[rgba(15,23,42,0.04)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.12)] dark:border-[rgba(255,255,255,0.12)] text-[#0F172A] dark:text-[#F8FAFC] text-xs font-semibold outline-none focus:ring-2 focus:ring-[#3B82F6]/50 cursor-pointer"
                >
                  <option value="User" className="bg-[#0C0D14] text-white">Standard User (Client Access)</option>
                  <option value="Admin" className="bg-[#0C0D14] text-white">Admin (Full CMS Access)</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1">
                <span className="flex items-center gap-1 text-[#10B981] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  Active Profile
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  Logged in
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
