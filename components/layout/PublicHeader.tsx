'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hexagon, Search, Building2, Briefcase, LayoutDashboard, CreditCard, Menu, X, ChevronDown, Layers, Sparkles, BookOpen, Info, FileText, HelpCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { UserRole } from '@/types';
import { ROUTES } from '@/constants/routes';

interface PublicHeaderProps {
    isAuthenticated?: boolean;
    user?: any;
    isScrolled?: boolean;
}

const NAV_ITEMS = [
    { name: 'Việc làm', href: ROUTES.PUBLIC_JOBS, icon: Search },
    { name: 'Công ty', href: ROUTES.PUBLIC_COMPANIES, icon: Building2 },
    {
        name: 'Sản phẩm',
        href: '#',
        icon: Layers,
        children: [
            { name: 'Tính năng cốt lõi', href: '/features', icon: Sparkles },
            { name: 'Bảng giá dịch vụ', href: ROUTES.PRICING, icon: CreditCard },
        ]
    },
    {
        name: 'Tài nguyên',
        href: '#',
        icon: BookOpen,
        children: [
            { name: 'Về chúng tôi', href: ROUTES.ABOUT, icon: Info },
            { name: 'Cẩm nang nghề nghiệp', href: ROUTES.BLOG, icon: FileText },
            { name: 'Trung tâm hỗ trợ', href: ROUTES.SUPPORT, icon: HelpCircle },
        ]
    }
];

export default function PublicHeader({ isAuthenticated = false, user = null, isScrolled = false }: PublicHeaderProps) {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileMenuOpen]);

    const systemLink = user?.role === UserRole.APPLICANT ? ROUTES.APPLICANT_DASHBOARD : user?.role === UserRole.ADMIN ? ROUTES.ADMIN_DASHBOARD : ROUTES.HR_DASHBOARD;

    const headerBg = isScrolled || isMobileMenuOpen
        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 py-3 shadow-sm'
        : 'bg-transparent border-transparent py-5';

    return (
        <header className={`fixed top-0 z-50 w-full border-b transition-all duration-300 font-sans ${headerBg}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-8">
                    <Link href={ROUTES.HOME} className="flex items-center gap-2 group relative z-50">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            <Hexagon className="w-6 h-6 text-white" fill="currentColor" />
                        </div>
                        <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                            ATS<span className="text-blue-600 dark:text-blue-400">SYSTEM</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {NAV_ITEMS.map((item) => {
                            const isParentActive = pathname === item.href || item.children?.some(child => pathname.startsWith(child.href));

                            if (item.children) {
                                return (
                                    <div key={item.name} className="relative group">
                                        <button className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-1.5 ${isParentActive ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'}`}>
                                            {item.name}
                                            <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
                                        </button>

                                        {/* Dropdown Box */}
                                        <div className="absolute top-full left-0 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                                            <div className="p-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col gap-1">
                                                {item.children.map(child => {
                                                    const isChildActive = pathname.startsWith(child.href);
                                                    const Icon = child.icon;
                                                    return (
                                                        <Link
                                                            key={child.href}
                                                            href={child.href}
                                                            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-xl transition-colors ${isChildActive ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400'}`}
                                                        >
                                                            <Icon className={`w-4 h-4 ${isChildActive ? 'text-blue-500' : 'text-slate-400'}`} /> {child.name}
                                                        </Link>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all ${isParentActive
                                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Right Actions (Desktop & Mobile) */}
                <div className="flex items-center gap-3 md:gap-4 relative z-50">
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-full transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    )}

                    <div className="hidden lg:block w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

                    {isAuthenticated ? (
                        <Link
                            href={systemLink}
                            className="hidden sm:flex px-6 py-2.5 text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-full shadow-md transition-all items-center gap-2"
                        >
                            <LayoutDashboard className="w-4 h-4" /> Vào hệ thống
                        </Link>
                    ) : (
                        <div className="hidden lg:flex items-center gap-2">
                            <Link href={ROUTES.LOGIN} className="px-5 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-full transition-colors">
                                Đăng nhập
                            </Link>
                            <Link href={ROUTES.REGISTER} className="px-6 py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-500/20 transition-all flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> Bắt đầu miễn phí
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2.5 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-300 overflow-hidden lg:hidden flex flex-col ${isMobileMenuOpen ? 'max-h-[calc(100vh-70px)] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-4 py-6 overflow-y-auto custom-scrollbar flex-1">
                        <nav className="flex flex-col gap-2">
                            {NAV_ITEMS.map((item) => {
                                if (item.children) {
                                    return (
                                        <div key={item.name} className="py-2">
                                            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-3">{item.name}</div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {item.children.map(child => {
                                                    const Icon = child.icon;
                                                    return (
                                                        <Link key={child.href} href={child.href} className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors">
                                                            <Icon className="w-4 h-4 text-blue-500" /> {child.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors">
                                        <item.icon className="w-4 h-4 text-slate-400" /> {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
                            {isAuthenticated ? (
                                <Link href={systemLink} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md">
                                    <LayoutDashboard className="w-4 h-4" /> Truy cập hệ thống ATS
                                </Link>
                            ) : (
                                <>
                                    <Link href={ROUTES.REGISTER} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md">
                                        Tạo tài khoản miễn phí
                                    </Link>
                                    <Link href={ROUTES.LOGIN} className="w-full py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                                        Đăng nhập hệ thống
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </header>
    );
}