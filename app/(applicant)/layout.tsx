'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, FileText, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const navItems = [
        { href: '/apply', label: 'Tìm việc', icon: Briefcase },
        { href: '/my-applications', label: 'Hồ sơ của tôi', icon: FileText },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#0f172a]">
            <aside className="w-60 min-h-screen bg-slate-900 text-white flex flex-col shrink-0">
                <div className="px-6 py-5 border-b border-slate-700">
                    <h1 className="text-lg font-bold">CV Ranking AI</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Cổng ứng tuyển</p>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname.startsWith(href) ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                        >
                            <Icon className="w-4 h-4" /> {label}
                        </Link>
                    ))}
                </nav>

                <div className="px-3 py-4 border-t border-slate-700">
                    {user && (
                        <div className="px-3 py-2 mb-2">
                            <p className="text-sm font-semibold text-white truncate">{user.full_name}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                    )}
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                        <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
