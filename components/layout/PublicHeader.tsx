'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hexagon, Search, Briefcase, Building2 } from 'lucide-react';

export default function PublicHeader() {
    const pathname = usePathname();

    const navLinks = [
        { name: 'Trang chủ', href: '/', icon: Hexagon },
        { name: 'Việc làm', href: '/careers', icon: Search },
        { name: 'Công ty', href: '/companies', icon: Building2 },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                {/* Logo & Navigation */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Hexagon className="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform" fill="currentColor" />
                        <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                            ATS<span className="text-blue-600">SYSTEM</span>
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive
                                            ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:block border-r border-slate-200 dark:border-slate-700 pr-3 mr-1">
                        {/* Thay bằng component Toggle Theme của bạn nếu có */}
                    </div>

                    <Link href="/login" className="hidden sm:flex px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        Đăng nhập
                    </Link>
                    <Link href="/register" className="px-5 py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Tham gia ngay
                    </Link>
                </div>
            </div>
        </header>
    );
}