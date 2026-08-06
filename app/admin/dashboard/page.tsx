import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#F8FAFC]">
            Admin CMS Overview
          </h1>
          <p className="text-xs font-mono text-[#64748B] mt-1">
            Manage projects, blog posts, client leads, and site config.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="px-4 py-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-mono font-semibold transition-colors"
        >
          + Add New Project
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Inquiries', value: '28', change: '+12% this week' },
          { label: 'Active Projects', value: '6', change: '2 in QA phase' },
          { label: 'Published Blogs', value: '14', change: '1 draft pending' },
          { label: 'Monthly Traffic', value: '45.2K', change: '+24% vs last month' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl glass p-5 border border-[rgba(255,255,255,0.08)]">
            <span className="text-[11px] font-mono text-[#64748B] block uppercase tracking-wider mb-1">
              {stat.label}
            </span>
            <div className="text-2xl font-display font-black text-[#F8FAFC] mb-1">
              {stat.value}
            </div>
            <span className="text-[10px] font-mono text-[#3B82F6]">
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      {/* Recent Leads Table */}
      <div className="rounded-2xl glass p-6 border border-[rgba(255,255,255,0.08)] mb-8">
        <h2 className="font-display font-bold text-base text-[#F8FAFC] mb-4">
          Recent Project Inquiries
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-[#94A3B8]">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)] text-[#64748B]">
                <th className="pb-3">Client</th>
                <th className="pb-3">Service</th>
                <th className="pb-3">Budget</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
              {[
                { name: 'Sarah Jenkins', service: 'Website Design', budget: '$10k - $25k', date: 'Today, 10:42 AM', status: 'New' },
                { name: 'David Miller', service: 'SaaS Platform', budget: '$25k - $50k', date: 'Yesterday', status: 'Replied' },
                { name: 'Elena Rostova', service: 'Android App', budget: '$50k+', date: 'Aug 4, 2026', status: 'Closed' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="py-3 font-semibold text-[#F8FAFC]">{row.name}</td>
                  <td className="py-3">{row.service}</td>
                  <td className="py-3 text-[#06B6D4]">{row.budget}</td>
                  <td className="py-3">{row.date}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[rgba(59,130,246,0.15)] text-[#3B82F6]">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
