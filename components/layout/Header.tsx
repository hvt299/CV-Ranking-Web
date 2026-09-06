'use client';

import {
    Search,
    Sun,
    Moon,
    Menu,
    LogOut,
    ChevronDown,
    Settings,
    CreditCard,
    Zap,
    Globe,
    CalendarDays,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import NotificationBell from '@/components/shared/NotificationBell';
import { UserRole } from '@/types';
import { ROUTES } from '@/constants/routes';
import { useSubscription } from '@/hooks/useSubscription';
import { cn } from '@/utils/utils';
import { getTierBadgeConfig } from '@/utils/tier-colors';
import { useQueryClient } from '@tanstack/react-query';
import { formatSubscriptionDate } from '@/utils/format';

interface HeaderProps {
    setIsMobileOpen: (val: boolean) => void;
}

export default function Header({ setIsMobileOpen }: HeaderProps) {
    const { data: subscriptionRes } = useSubscription();
    const planInfo = subscriptionRes?.data;
    const planBadgeConfig = getTierBadgeConfig(planInfo?.tier_level || 1);

    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [language, setLanguage] = useState<'VI' | 'EN'>('VI');

    const dropdownRef = useRef<HTMLDivElement>(null);

    const { user, logout, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const queryClient = useQueryClient();

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (isAuthenticated) {
            queryClient.invalidateQueries({
                queryKey: ['my-subscription'],
            });
        } else {
            queryClient.removeQueries({
                queryKey: ['my-subscription'],
            });
        }
    }, [isAuthenticated, queryClient]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const role = user?.role || UserRole.APPLICANT;

    const getRoleDisplayName = () => {
        if (
            role === UserRole.HR_OWNER ||
            role === UserRole.HR_MEMBER
        ) {
            return 'Nhà tuyển dụng';
        }

        if (role === UserRole.ADMIN) {
            return 'Quản trị viên';
        }

        return 'Ứng viên';
    };

    const profileRoute =
        role === UserRole.ADMIN
            ? ROUTES.ADMIN_SETTINGS
            : role === UserRole.APPLICANT
                ? ROUTES.APPLICANT_PROFILE
                : ROUTES.HR_SETTINGS;

    const billingRoute =
        role === UserRole.APPLICANT
            ? ROUTES.APPLICANT_BILLING
            : ROUTES.HR_BILLING;

    const getPlanName = () => {
        if (!planInfo?.current_plan) {
            return 'Chưa có gói';
        }

        return planInfo.current_plan
            .replace('HR ', '')
            .replace('App ', '');
    };

    const getSubscriptionEndDate = () => {
        const info = planInfo as
            | (typeof planInfo & {
                end_date?: string;
                expires_at?: string;
                expiration_date?: string;
            })
            | undefined;

        return (
            info?.end_date ||
            info?.expires_at ||
            info?.expiration_date ||
            null
        );
    };

    const formatDate = (date?: string | Date | null) => {
        if (!date) return 'Vĩnh viễn';

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return 'Vĩnh viễn';
        }

        return parsedDate.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <header className="sticky top-0 z-25 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 md:px-8">
            {/* LEFT */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
                    aria-label="Mở menu"
                >
                    <Menu className="h-6 w-6" />
                </button>

                <div className="hidden w-80 items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 transition-all focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 dark:border-slate-700/50 dark:bg-slate-800/50 md:flex">
                    <Search className="h-5 w-5 text-slate-400" />

                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"
                    />
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Language */}
                <button
                    type="button"
                    onClick={() =>
                        setLanguage((prev) => (prev === 'VI' ? 'EN' : 'VI'))
                    }
                    className="flex items-center gap-1.5 rounded-full px-2.5 py-2.5 text-xs font-black text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                    title="Chuyển đổi ngôn ngữ"
                    aria-label="Chuyển đổi ngôn ngữ"
                >
                    <Globe className="h-4 w-4" />
                    <span>{language}</span>
                </button>

                {/* Theme */}
                {mounted && (
                    <button
                        onClick={() =>
                            setTheme(
                                theme === 'dark'
                                    ? 'light'
                                    : 'dark',
                            )
                        }
                        className="rounded-xl p-2.5 text-slate-500 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:text-slate-400 dark:hover:bg-primary-500/10 dark:hover:text-primary-400"
                        title="Chuyển đổi giao diện"
                    >
                        {theme === 'dark' ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </button>
                )}

                {/* Notification */}
                <NotificationBell />

                <div className="mx-1 hidden h-8 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

                {/* PROFILE */}
                <div
                    className="relative"
                    ref={dropdownRef}
                >
                    <button
                        type="button"
                        onClick={() =>
                            setIsDropdownOpen(
                                (prev) => !prev,
                            )
                        }
                        className="flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 md:gap-3"
                    >
                        <img
                            src={
                                user?.avatar_url ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    user?.full_name ||
                                    'User',
                                )}&background=random`
                            }
                            alt="Avatar"
                            className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm dark:border-slate-700"
                            referrerPolicy="no-referrer"
                        />

                        <div className="hidden flex-col items-start text-left md:flex">
                            <span className="max-w-30 truncate text-sm font-bold leading-tight text-slate-700 dark:text-white">
                                {user?.full_name || 'User'}
                            </span>

                            <div className="mt-0.5 flex items-center gap-1.5">
                                <span className="text-[10px] font-medium leading-tight text-slate-500 dark:text-slate-400">
                                    {getRoleDisplayName()}
                                </span>

                                {planInfo?.current_plan &&
                                    role !== UserRole.ADMIN && (
                                        <span
                                            className={cn(
                                                'rounded-sm border px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider shadow-sm',
                                                planBadgeConfig.bg,
                                                planBadgeConfig.text,
                                                planBadgeConfig.border,
                                            )}
                                        >
                                            {getPlanName()}
                                        </span>
                                    )}
                            </div>
                        </div>

                        <ChevronDown
                            className={cn(
                                'hidden h-4 w-4 text-slate-400 transition-transform duration-200 md:block',
                                isDropdownOpen &&
                                'rotate-180',
                            )}
                        />
                    </button>

                    {/* DROPDOWN */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl animate-in fade-in slide-in-from-top-2 dark:border-slate-800 dark:bg-slate-900">
                            {/* Subscription */}
                            {role !== UserRole.ADMIN && planInfo && (
                                <div className="mx-2 mb-2 rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-800/60">
                                    <div className="space-y-2">
                                        {/* Tên gói */}
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="shrink-0 text-[9px] font-black uppercase tracking-wider text-slate-400">
                                                Gói hiện tại
                                            </span>

                                            <span
                                                className="min-w-0 truncate text-right text-sm font-black text-blue-600 dark:text-blue-400"
                                                title={planInfo.current_plan}
                                            >
                                                {planInfo.current_plan}
                                            </span>
                                        </div>

                                        {/* Credits */}
                                        <div className="flex items-center justify-between border-t border-slate-200 pt-2 dark:border-slate-700">
                                            <div className="flex items-center gap-1.5">
                                                <Zap
                                                    className="h-3.5 w-3.5 text-amber-500"
                                                    fill="currentColor"
                                                />

                                                <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                                                    Credits
                                                </span>
                                            </div>

                                            <span className="text-xs font-black text-slate-800 dark:text-white">
                                                {(planInfo.credits_remaining || 0).toLocaleString('vi-VN')}
                                            </span>
                                        </div>

                                        {/* Thời hạn */}
                                        <div className="flex items-center justify-between border-t border-slate-200 pt-2 dark:border-slate-700">
                                            <div className="flex items-center gap-1.5">
                                                <CalendarDays className="h-3.5 w-3.5 text-blue-500" />

                                                <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                                                    Thời hạn
                                                </span>
                                            </div>

                                            <span className="text-xs font-black text-slate-800 dark:text-white">
                                                {formatSubscriptionDate(planInfo.end_date)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Profile */}
                            <Link
                                href={profileRoute}
                                onClick={() =>
                                    setIsDropdownOpen(false)
                                }
                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-primary-400"
                            >
                                <Settings className="h-4 w-4" />
                                Thiết lập thông tin
                            </Link>

                            {/* Billing */}
                            {role !== UserRole.ADMIN && (
                                <Link
                                    href={billingRoute}
                                    onClick={() =>
                                        setIsDropdownOpen(
                                            false,
                                        )
                                    }
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-primary-400"
                                >
                                    <CreditCard className="h-4 w-4" />
                                    Quản lý gói cước
                                </Link>
                            )}

                            <div className="my-2 h-px bg-slate-100 dark:bg-slate-700/50" />

                            {/* Logout */}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    logout(router);
                                }}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                            >
                                <LogOut className="h-4 w-4" />
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}