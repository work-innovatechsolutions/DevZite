import Link from 'next/link';

const ADMIN_NAV = [
  { label: '📊 Dashboard', href: '/admin/dashboard' },
  { label: '🚀 Projects',  href: '/admin/projects' },
  { label: '📝 Blogs',     href: '/admin/blogs' },
  { label: '💌 Leads',     href: '/admin/leads' },
  { label: '👥 Clients',   href: '/admin/clients' },
  { label: '📈 Analytics', href: '/admin/analytics' },
  { label: '⚙️ Settings',  href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#06070A] text-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[rgba(255,255,255,0.08)] bg-[#0C0D14] p-6 flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <span className="w-3 h-3 rounded-full bg-[#3B82F6]" />
            <span className="font-display font-bold text-sm tracking-wide">
              INNOVATECH <span className="text-[#3B82F6]">ADMIN</span>
            </span>
          </Link>

          <nav className="space-y-1">
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs font-mono text-[#64748B]">
          <span>Role: Admin</span>
          <Link href="/" className="hover:text-[#F8FAFC]">Exit</Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        {children}
      </div>
    </div>
  );
}
