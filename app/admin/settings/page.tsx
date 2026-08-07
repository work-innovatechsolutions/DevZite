'use client';

import { useState } from 'react';
import { Settings, Sliders, Database, Key, CheckCircle2, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSettingsPage() {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);

  const handleSyncFirestore = async () => {
    setSyncing(true);
    setSyncResult(null);

    try {
      const res = await fetch('/api/sync-firestore', { method: 'POST' });
      const data = await res.json();
      setSyncResult(data);
    } catch (err: any) {
      setSyncResult({ success: false, error: err?.message || 'Sync failed' });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-8 font-body">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#3B82F6] font-semibold mb-1">
            <Settings size={16} />
            <span>DEVZITE / SYSTEM CONFIG</span>
          </div>
          <h1 className="text-3xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC]">
            Studio Settings & Firestore Operations
          </h1>
          <p className="text-sm text-[#475569] dark:text-[#94A3B8] mt-1 font-medium">
            Configure system flags, API tokens, and sync all database collections to live Firestore.
          </p>
        </div>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* ── Firestore Database Sync Section ── */}
        <div className="rounded-3xl glass-card p-6 sm:p-8 border border-[rgba(59,130,246,0.25)] bg-white dark:bg-[#0C0D14] shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6]">
                <Database size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-[#0F172A] dark:text-[#F8FAFC]">
                  Firestore Database Synchronization
                </h3>
                <p className="text-xs text-[#64748B] font-mono">
                  Batch sync all Projects, Pricing CMS, Leads/CRM, Blogs, Managers, and Users to Firestore.
                </p>
              </div>
            </div>

            <button
              onClick={handleSyncFirestore}
              disabled={syncing}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
              <span>{syncing ? 'Syncing to Firestore...' : 'Sync All Data to Firestore'}</span>
            </button>
          </div>

          {/* Sync Result Banner */}
          <AnimatePresence>
            {syncResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`p-5 rounded-2xl border text-xs font-mono space-y-3 ${
                  syncResult.success
                    ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]'
                    : 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 size={18} />
                  <span>{syncResult.message || syncResult.error}</span>
                </div>

                {syncResult.stats && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-[#10B981]/20 text-[#0F172A] dark:text-[#F8FAFC]">
                    <div>
                      <span className="text-[#64748B] block text-[10px]">PROJECTS</span>
                      <span className="font-bold text-sm">{syncResult.stats.projects} docs synced</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[10px]">PRICING TIERS</span>
                      <span className="font-bold text-sm">{syncResult.stats.pricing} docs synced</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[10px]">LEADS & CRM</span>
                      <span className="font-bold text-sm">{syncResult.stats.leads} docs synced</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[10px]">BLOG POSTS</span>
                      <span className="font-bold text-sm">{syncResult.stats.blogs} docs synced</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[10px]">ADMIN MANAGERS</span>
                      <span className="font-bold text-sm">{syncResult.stats.managers} docs synced</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[10px]">REGISTERED USERS</span>
                      <span className="font-bold text-sm">{syncResult.stats.registeredUsers} docs synced</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Environment Flags Card ── */}
        <div className="rounded-3xl glass-card p-6 sm:p-8 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0C0D14]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
            <Sliders size={20} className="text-[#3B82F6]" />
            <h3 className="font-display font-bold text-lg text-[#0F172A] dark:text-[#F8FAFC]">
              Feature Environment Flags
            </h3>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between py-2">
              <div>
                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] block text-sm">AI Assistant Widget</span>
                <span className="text-[#64748B]">Enable interactive Gemini AI assistant on live site</span>
              </div>
              <input type="checkbox" defaultChecked className="toggle accent-[#3B82F6] w-5 h-5 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between py-2 border-t border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.04)]">
              <div>
                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] block text-sm">Custom Motion Cursor</span>
                <span className="text-[#64748B]">Enable fluid spring cursor tracking globally</span>
              </div>
              <input type="checkbox" defaultChecked className="toggle accent-[#3B82F6] w-5 h-5 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* ── API Integration Tokens Card ── */}
        <div className="rounded-3xl glass-card p-6 sm:p-8 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0C0D14]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
            <Key size={20} className="text-[#8B5CF6]" />
            <h3 className="font-display font-bold text-lg text-[#0F172A] dark:text-[#F8FAFC]">
              API Integration Tokens
            </h3>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-[#64748B] mb-1 font-bold">NEXT_PUBLIC_SITE_URL</label>
              <input
                type="text"
                readOnly
                value="https://devzite.com"
                className="w-full px-4 py-3 rounded-2xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
