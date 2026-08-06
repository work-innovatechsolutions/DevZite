import Link from 'next/link';

export default function ClientDashboardPage() {
  return (
    <div>
      {/* Welcome Banner */}
      <div className="rounded-3xl glass p-8 border border-[rgba(255,255,255,0.08)] mb-8 bg-gradient-to-r from-[rgba(6,182,212,0.05)] to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-[#06B6D4] uppercase tracking-wider block mb-1">
              Active Project: Nexus AI Studio Workbench
            </span>
            <h1 className="text-2xl font-display font-bold text-[#F8FAFC]">
              Sprint 4 of 6 · QA & Edge Deployment Phase
            </h1>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-mono bg-[rgba(39,201,63,0.15)] text-[#27C93F] border border-[rgba(39,201,63,0.3)]">
            ● On Track for Aug 18 Launch
          </span>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="rounded-2xl glass p-6 border border-[rgba(255,255,255,0.08)]">
          <span className="text-xs font-mono text-[#64748B] block mb-1">Milestone Progress</span>
          <div className="text-3xl font-display font-black text-[#F8FAFC] mb-2">78%</div>
          <div className="w-full h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
            <div className="h-full bg-[#3B82F6] w-[78%]" />
          </div>
        </div>

        <div className="rounded-2xl glass p-6 border border-[rgba(255,255,255,0.08)]">
          <span className="text-xs font-mono text-[#64748B] block mb-1">Next Deliverable</span>
          <div className="text-lg font-display font-bold text-[#F8FAFC] mb-1">
            Lighthouse Performance Audit
          </div>
          <span className="text-xs text-[#06B6D4] font-mono">Due Aug 12, 2026</span>
        </div>

        <div className="rounded-2xl glass p-6 border border-[rgba(255,255,255,0.08)]">
          <span className="text-xs font-mono text-[#64748B] block mb-1">Assigned Tech Lead</span>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-2xl">👨‍💻</span>
            <div>
              <span className="text-xs font-bold text-[#F8FAFC] block">Alexander Wright</span>
              <span className="text-[10px] text-[#64748B] font-mono">Senior Engineer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Files & Timeline Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl glass p-6 border border-[rgba(255,255,255,0.08)]">
          <h3 className="font-display font-bold text-base text-[#F8FAFC] mb-4">
            Recent Deliverables & Files
          </h3>
          <ul className="space-y-3 font-mono text-xs text-[#94A3B8]">
            <li className="flex justify-between items-center p-2.5 rounded-xl bg-[rgba(255,255,255,0.02)]">
              <span>📄 Architecture_Specification_v2.pdf</span>
              <button className="text-[#3B82F6] hover:underline">Download</button>
            </li>
            <li className="flex justify-between items-center p-2.5 rounded-xl bg-[rgba(255,255,255,0.02)]">
              <span>🎨 Design_Tokens_Export.json</span>
              <button className="text-[#3B82F6] hover:underline">Download</button>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl glass p-6 border border-[rgba(255,255,255,0.08)]">
          <h3 className="font-display font-bold text-base text-[#F8FAFC] mb-4">
            Live Sprint Activity
          </h3>
          <ul className="space-y-3 font-mono text-xs text-[#94A3B8]">
            <li className="flex items-center gap-2">
              <span className="text-[#27C93F]">✓</span> Optimized WebGL fragment shaders for 60fps
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#27C93F]">✓</span> Configured Firebase Firestore security rules
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#3B82F6]">●</span> Currently testing edge image compression
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
