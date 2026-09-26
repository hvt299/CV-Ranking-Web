'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Hexagon, Search, Building2, LayoutDashboard, CreditCard, Menu, X, ChevronDown, Layers, Sparkles, BookOpen, Info, FileText, HelpCircle, Sun, Moon, Settings, LogOut, Zap, CalendarDays, Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { UserRole } from '@/types';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/useAuthStore';
import { useSubscription } from '@/hooks/useSubscription';
import { cn } from '@/utils/utils';
import { getTierBadgeConfig } from '@/utils/tier-colors';
import { formatSubscriptionDate } from '@/utils/format';

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
        ],
    },
    {
        name: 'Tài nguyên',
        href: '#',
        icon: BookOpen,
        children: [
            { name: 'Về chúng tôi', href: ROUTES.ABOUT, icon: Info },
            { name: 'Cẩm nang nghề nghiệp', href: ROUTES.BLOG, icon: FileText },
            { name: 'Trung tâm hỗ trợ', href: ROUTES.SUPPORT, icon: HelpCircle },
        ],
    },
];

export const LANGUAGES = [
    { code: 'VI' as const, name: 'Tiếng Việt', flag: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/960px-Flag_of_Vietnam.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail' },
    { code: 'EN' as const, name: 'English', flag: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/3840px-Flag_of_the_United_Kingdom_%283-5%29.svg.png?utm_source=vi.wikipedia.org&utm_campaign=index&utm_content=thumbnail' },
];

export default function PublicHeader({ isAuthenticated = false, user = null, isScrolled = false }: PublicHeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const { logout } = useAuthStore();

    const { data: subscriptionRes } = useSubscription();
    const planInfo = subscriptionRes?.data;
    const planBadgeConfig = getTierBadgeConfig(planInfo?.tier_level || 1);

    const [mounted, setMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const [language, setLanguage] = useState<'VI' | 'EN'>('VI');

    const dropdownRef = useRef<HTMLDivElement>(null);
    const languageRef = useRef<HTMLDivElement>(null);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
        setIsLanguageOpen(false);
    }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;

            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                setIsDropdownOpen(false);
            }

            if (languageRef.current && !languageRef.current.contains(target)) {
                setIsLanguageOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const role = user?.role || UserRole.APPLICANT;

    const systemLink =
        role === UserRole.APPLICANT
            ? ROUTES.APPLICANT_DASHBOARD
            : role === UserRole.ADMIN
                ? ROUTES.ADMIN_DASHBOARD
                : ROUTES.HR_DASHBOARD;

    const profileRoute =
        role === UserRole.ADMIN
            ? ROUTES.ADMIN_SETTINGS
            : role === UserRole.APPLICANT
                ? ROUTES.APPLICANT_PROFILE
                : ROUTES.HR_SETTINGS;

    const getRoleDisplayName = () => {
        if (role === UserRole.HR_OWNER || role === UserRole.HR_MEMBER) {
            return 'Nhà tuyển dụng';
        }

        if (role === UserRole.ADMIN) {
            return 'Quản trị viên';
        }

        return 'Ứng viên';
    };

    const selectedLanguage = LANGUAGES.find((item) => item.code === language) || LANGUAGES[0];

    const handleLanguageChange = (code: 'VI' | 'EN') => {
        setLanguage(code);
        setIsLanguageOpen(false);
    };

    const headerBg = isScrolled || isMobileMenuOpen ? 'bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 py-3 shadow-sm backdrop-blur-md' : 'bg-transparent border-transparent py-5';

    return (
        <header className={`fixed top-0 z-50 w-full border-b font-sans transition-all duration-300 ${headerBg}`}>
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="flex items-center gap-10">
                    <Link
                        href={ROUTES.HOME}
                        className="group relative z-50 flex items-center gap-2"
                    >
                        {/* Logo Mark */}
                        <div className="relative flex h-10 w-10 items-center justify-center">
                            {/* Ambient glow */}
                            <div className="absolute inset-0 rounded-xl bg-blue-500/20 blur-md transition-all duration-500 group-hover:bg-blue-500/35 group-hover:blur-lg" />

                            {/* Main mark */}
                            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-blue-600 to-blue-800 shadow-md shadow-blue-500/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl group-hover:shadow-blue-600/30">
                                {/* Subtle light sweep */}
                                <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-linear-to-r from-transparent via-white/25 to-transparent transition-all duration-700 group-hover:left-[130%]" />

                                {/* Hexagon */}
                                <Hexagon
                                    className="relative z-10 h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110"
                                    fill="currentColor"
                                />
                            </div>
                        </div>

                        {/* Wordmark */}
                        <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                            ATS
                            <span className="text-blue-600 transition-colors duration-300 group-hover:text-blue-500 dark:text-blue-400 dark:group-hover:text-blue-300">
                                SYSTEM
                            </span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-10 lg:flex">
                        {NAV_ITEMS.map((item) => {
                            const isParentActive = pathname === item.href || item.children?.some((child) => pathname.startsWith(child.href));

                            if (item.children) {
                                return (
                                    <div key={item.name} className="group relative">
                                        <button className={cn('relative flex items-center gap-1.5 py-2 text-sm font-bold transition-colors', isParentActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white')}>
                                            {item.name}

                                            <ChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform duration-300 group-hover:rotate-180" />

                                            <span className={cn('absolute -bottom-1 left-0 h-0.5 w-9 origin-left scale-x-0 rounded-full bg-linear-to-r from-primary-600 to-primary-800 transition-transform duration-300 group-hover:scale-x-100', isParentActive && 'scale-x-100')} />
                                        </button>

                                        <div className="invisible absolute left-1/2 top-full mt-3 w-56 -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                                            <div className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/20">
                                                {item.children.map((child) => {
                                                    const isChildActive = pathname.startsWith(child.href);
                                                    const Icon = child.icon;

                                                    return (
                                                        <Link key={child.href} href={child.href} className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors', isChildActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400')}>
                                                            <Icon className={cn('h-4 w-4', isChildActive ? 'text-blue-500' : 'text-slate-400')} />
                                                            {child.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <Link key={item.href} href={item.href} className={cn('group relative py-2 text-sm font-bold transition-colors', isParentActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white')}>
                                    {item.name}

                                    <span className={cn('absolute -bottom-1 left-0 h-0.5 w-9 origin-left scale-x-0 rounded-full bg-linear-to-r from-primary-600 to-primary-800 transition-transform duration-300 group-hover:scale-x-100', isParentActive && 'scale-x-100')} />
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="relative z-50 flex items-center gap-1 md:gap-2">
                    {/* Language */}
                    <div className="relative" ref={languageRef}>
                        <button onClick={() => setIsLanguageOpen((prev) => !prev)} className={cn('flex h-10 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold transition-colors', isLanguageOpen ? 'bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400' : 'text-slate-500 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400')} title="Chọn ngôn ngữ" aria-label="Chọn ngôn ngữ" aria-expanded={isLanguageOpen}>
                            <img src={selectedLanguage.flag} alt={selectedLanguage.name} className="h-4 w-6 rounded-sm object-cover shadow-sm" />
                            <span>{selectedLanguage.code}</span>
                            <ChevronDown className={cn('h-3 w-3 text-slate-400 transition-transform duration-200', isLanguageOpen && 'rotate-180')} />
                        </button>

                        {isLanguageOpen && (
                            <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 animate-in fade-in slide-in-from-top-2 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20">
                                {LANGUAGES.map((item) => {
                                    const isSelected = language === item.code;

                                    return (
                                        <button key={item.code} onClick={() => handleLanguageChange(item.code)} className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors', isSelected ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white')}>
                                            <img src={item.flag} alt={item.name} className="h-4 w-6 rounded-sm object-cover shadow-sm" />
                                            <span className="flex-1">{item.name}</span>
                                            {isSelected && <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Theme */}
                    {mounted && (
                        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400" aria-label="Chuyển đổi giao diện" title="Chuyển đổi giao diện">
                            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
                        </button>
                    )}

                    <div className="mx-2 hidden h-6 w-px bg-slate-200 dark:bg-slate-700 lg:block" />

                    {/* Authenticated User */}
                    {isAuthenticated ? (
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setIsDropdownOpen((prev) => !prev)} className="flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 md:gap-3" aria-expanded={isDropdownOpen} aria-haspopup="menu">
                                <img src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=random`} alt="Avatar" className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm dark:border-slate-700" referrerPolicy="no-referrer" />

                                <div className="hidden flex-col items-start text-left md:flex">
                                    <span className="line-clamp-1 max-w-30 text-sm font-bold leading-tight text-slate-700 dark:text-white">
                                        {user?.full_name || 'User'}
                                    </span>

                                    <div className="mt-0.5 flex items-center gap-1.5">
                                        <span className="text-[10px] font-medium leading-tight text-slate-500 dark:text-slate-400">
                                            {getRoleDisplayName()}
                                        </span>

                                        {planInfo?.current_plan && role !== UserRole.ADMIN && (
                                            <span className={cn('rounded-sm border px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider shadow-sm', planBadgeConfig.bg, planBadgeConfig.text, planBadgeConfig.border)}>
                                                {planInfo.current_plan.replace('HR ', '').replace('App ', '')}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <ChevronDown className={cn('hidden h-4 w-4 text-slate-400 transition-transform duration-200 md:block', isDropdownOpen && 'rotate-180')} />
                            </button>

                            {/* User Dropdown */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl animate-in fade-in slide-in-from-top-2 dark:border-slate-800 dark:bg-slate-900">
                                    {role !== UserRole.ADMIN && planInfo && (
                                        <div className="mx-2 mb-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/60">
                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-0">
                                                <div className="min-w-0 sm:pr-3">
                                                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Gói hiện tại</span>
                                                    <span className="mt-0.5 block truncate text-xs font-bold text-blue-600 dark:text-blue-400" title={planInfo.current_plan}>{planInfo.current_plan}</span>
                                                </div>

                                                <div className="border-t border-slate-200 pt-2 sm:border-l sm:border-t-0 sm:px-3 sm:pt-0 dark:border-slate-700">
                                                    <div className="flex items-center gap-1.5">
                                                        <Zap className="h-3.5 w-3.5 text-amber-500" fill="currentColor" />
                                                        <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Credits</span>
                                                    </div>
                                                    <span className="mt-0.5 block text-xs font-bold text-slate-700 dark:text-slate-200">{(planInfo.credits_remaining || 0).toLocaleString('vi-VN')}</span>
                                                </div>

                                                <div className="border-t border-slate-200 pt-2 sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0 dark:border-slate-700">
                                                    <div className="flex items-center gap-1.5">
                                                        <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
                                                        <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Thời hạn</span>
                                                    </div>
                                                    <span className="mt-0.5 block truncate text-xs font-bold text-slate-700 dark:text-slate-200">{formatSubscriptionDate(planInfo.end_date)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <Link href={profileRoute} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-blue-400">
                                        <Settings className="h-4 w-4" />
                                        Hồ sơ cá nhân
                                    </Link>

                                    <Link href={systemLink} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-blue-500/10 dark:hover:text-blue-400">
                                        <LayoutDashboard className="h-4 w-4" />
                                        Vào hệ thống ATS
                                    </Link>

                                    <div className="my-2 h-px bg-slate-100 dark:bg-slate-700/50" />

                                    <button onClick={() => { setIsDropdownOpen(false); logout(router); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10">
                                        <LogOut className="h-4 w-4" />
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden items-center gap-2 lg:flex">
                            <Link href={ROUTES.LOGIN} className="rounded-full px-5 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400">
                                Đăng nhập
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button onClick={() => setIsMobileMenuOpen((prev) => !prev)} className="rounded-full bg-slate-100 p-2.5 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 lg:hidden" aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}>
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={cn('absolute left-0 top-full flex w-full flex-col overflow-hidden border-b border-slate-200 bg-white shadow-2xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 lg:hidden', isMobileMenuOpen ? 'max-h-[calc(100vh-70px)] opacity-100' : 'max-h-0 opacity-0')}>
                    <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-6">
                        <nav className="flex flex-col gap-2">
                            {NAV_ITEMS.map((item) => {
                                if (item.children) {
                                    return (
                                        <div key={item.name} className="py-2">
                                            <div className="mb-3 px-3 text-xs font-black uppercase tracking-widest text-slate-400">{item.name}</div>

                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                {item.children.map((child) => {
                                                    const Icon = child.icon;
                                                    const isChildActive = pathname.startsWith(child.href);

                                                    return (
                                                        <Link key={child.href} href={child.href} className={cn('flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors', isChildActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400')}>
                                                            <Icon className="h-4 w-4 text-blue-500" />
                                                            {child.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                }

                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <Link key={item.href} href={item.href} className={cn('flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors', isActive ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400')}>
                                        <Icon className="h-4 w-4 text-slate-400" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Mobile User */}
                        <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
                            {isAuthenticated ? (
                                <div className="flex flex-col gap-2">
                                    {role !== UserRole.ADMIN && planInfo && (
                                        <div className="mb-2 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="min-w-0">
                                                    <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Gói hiện tại</span>
                                                    <span className="block truncate text-sm font-black text-blue-600 dark:text-blue-400">{planInfo.current_plan}</span>
                                                </div>

                                                <span className={cn('shrink-0 rounded-md border px-2 py-1 text-[9px] font-black uppercase', planBadgeConfig.bg, planBadgeConfig.text, planBadgeConfig.border)}>
                                                    {planInfo.current_plan.replace('HR ', '').replace('App ', '')}
                                                </span>
                                            </div>

                                            <div className="mt-3 grid grid-cols-2 gap-2">
                                                <div className="rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
                                                    <div className="flex items-center gap-1.5">
                                                        <Zap className="h-3.5 w-3.5 text-amber-500" fill="currentColor" />
                                                        <span className="text-[9px] font-bold uppercase text-slate-400">Credits</span>
                                                    </div>
                                                    <span className="text-sm font-black text-slate-800 dark:text-white">{(planInfo.credits_remaining || 0).toLocaleString('vi-VN')}</span>
                                                </div>

                                                <div className="rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
                                                    <div className="flex items-center gap-1.5">
                                                        <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
                                                        <span className="text-[9px] font-bold uppercase text-slate-400">Thời hạn</span>
                                                    </div>
                                                    <span className="text-sm font-black text-slate-800 dark:text-white">{formatSubscriptionDate(planInfo.end_date)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <Link href={profileRoute} onClick={() => setIsMobileMenuOpen(false)} className="flex w-full items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400">
                                        <Settings className="h-4 w-4" />
                                        Hồ sơ cá nhân
                                    </Link>

                                    <Link href={systemLink} onClick={() => setIsMobileMenuOpen(false)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-medium text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700">
                                        <LayoutDashboard className="h-4 w-4" />
                                        Vào hệ thống ATS
                                    </Link>

                                    <button onClick={() => { setIsMobileMenuOpen(false); logout(router); }} className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 py-3.5 text-sm font-bold text-rose-500 transition-colors hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20">
                                        <LogOut className="h-4 w-4" />
                                        Đăng xuất
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link href={ROUTES.LOGIN} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-3.5 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
                                        Đăng nhập hệ thống
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}