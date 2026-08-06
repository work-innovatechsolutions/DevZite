'use client';

import { Settings, Shield, Sliders, Database, Key } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#3B82F6] font-semibold mb-1">
            <Settings size={16} />
            <span>DEVZITE / SYSTEM CONFIG</span>
          </div>
          <h1 className="text-3xl font-display font-black text-[#0F172A] dark:text-[#F8FAFC]">
            Studio Settings
          </h1>
          <p className="text-sm font-body text-[#475569] dark:text-[#94A3B8] mt-1">
            Configure system flags, API integration tokens, and deployment environments.
          </p>
        </div>
      </div>

      <div className="space-y-6 max-w-4xl">
        <div className="glass-card rounded-2xl p-6 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
            <Sliders size={20} className="text-[#3B82F6]" />
            <h3 className="font-display font-bold text-lg text-[#0F172A] dark:text-[#F8FAFC]">
              Feature Environment Flags
            </h3>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between py-2">
              <div>
                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] block">AI Assistant Widget</span>
                <span className="text-[#64748B]">Enable interactive Gemini AI assistant on live site</span>
              </div>
              <input type="checkbox" defaultChecked className="toggle accent-[#3B82F6] w-5 h-5" />
            </div>

            <div className="flex items-center justify-between py-2 border-t border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.04)]">
              <div>
                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] block">Custom Motion Cursor</span>
                <span className="text-[#64748B]">Enable fluid spring cursor tracking globally</span>
              </div>
              <input type="checkbox" defaultChecked className="toggle accent-[#3B82F6] w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
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
                className="w-full px-4 py-2.5 rounded-xl bg-[rgba(15,23,42,0.03)] dark:bg-[rgba(255,255,255,0.04)] border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[#0F172A] dark:text-[#F8FAFC]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
