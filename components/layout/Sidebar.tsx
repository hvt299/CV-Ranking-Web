'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Briefcase, Users,
    BarChart2, Settings, HelpCircle, ChevronLeft,
    ChevronRight, Hexagon, X, Building2, ShieldCheck
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { UserRole } from "@/types";
import { cn } from "@/utils/utils";
import { useEffect, useState } from "react";

type MenuItem = {
    name: string;
    icon: any;
    href: string;
    badge?: string;
    pro?: boolean;
};

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (val: boolean) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (val: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) {
    const pathname = usePathname();
    const { user } = useAuthStore();

    const role = user?.role || UserRole.APPLICANT;
    const isAdmin = role === UserRole.ADMIN;
    const isHrOwner = role === UserRole.HR_OWNER;

    const [viewMode, setViewMode] = useState<'OWNER' | 'MEMBER'>(isHrOwner ? 'OWNER' : 'MEMBER');

    useEffect(() => {
        if (isHrOwner) {
            const saved = localStorage.getItem('cv_ranking_hr_view');
            if (saved === 'MEMBER' || saved === 'OWNER') setViewMode(saved);
        } else {
            setViewMode('MEMBER');
        }
    }, [isHrOwner]);

    const handleToggleView = () => {
        const newMode = viewMode === 'OWNER' ? 'MEMBER' : 'OWNER';
        setViewMode(newMode);
        localStorage.setItem('cv_ranking_hr_view', newMode);
        window.dispatchEvent(new Event('hrViewModeChanged'));
        window.location.reload();
    };

    const hrMenu: MenuItem[] = [
        { name: "Tổng quan", icon: LayoutDashboard, href: "/dashboard" },
        { name: "Chiến dịch tuyển dụng", icon: Briefcase, href: "/jobs" },
        { name: "Kho hồ sơ", icon: Users, href: "/candidates" },
        ...(viewMode === 'OWNER'
            ? [
                {
                    name: "Phân tích & Báo cáo",
                    icon: BarChart2,
                    href: "/analytics",
                    pro: true,
                }
            ]
            : []),
    ];

    const adminMenu: MenuItem[] = [
        { name: "Tổng quan", icon: LayoutDashboard, href: "/admin/dashboard" },
        { name: "Quản lý công ty", icon: Building2, href: "/admin/companies" },
        { name: "Phân tích hệ thống", icon: BarChart2, href: "/admin/analytics" },
        { name: "Nhật ký hệ thống", icon: ShieldCheck, href: "/admin/audit-logs" },
    ];

    const mainMenuItems = isAdmin ? adminMenu : hrMenu;

    const bottomItems: MenuItem[] = isAdmin ? [
        { name: "Cài đặt", icon: Settings, href: "/admin/settings" },
        { name: "Trợ giúp", icon: HelpCircle, href: "/support" },
    ] : [
        { name: "Cài đặt", icon: Settings, href: "/settings" },
        { name: "Trợ giúp", icon: HelpCircle, href: "/support" },
    ];

    return (
        <>
            {/* OVERLAY & LAYOUT RENDER */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 dark:bg-text/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside
                className={cn(
                    "fixed md:relative top-0 left-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col transition-all duration-300 shadow-2xl shrink-0",
                    isCollapsed ? "w-20" : "w-64",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className="h-20 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800/80 shrink-0">
                    <Link href="/dashboard" className="flex items-center gap-2 group relative z-50">
                        <div className="w-10 h-10 bg-linear-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform shrink-0">
                            <Hexagon className="w-6 h-6 text-white" fill="currentColor" />
                        </div>
                        {(!isCollapsed || isMobileOpen) && (
                            <span className="text-xl font-black text-slate-900 dark:text-white whitespace-nowrap tracking-tight">
                                ATS<span className="text-primary-600 dark:text-primary-400">SYSTEM</span>
                            </span>
                        )}
                    </Link>

                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-3 top-6 w-6 h-6 bg-primary-600 text-white rounded-full items-center justify-center hover:bg-primary-500 hover:scale-110 shadow-lg shadow-primary-500/30 transition-all z-50"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">

                    {/* TOGGLE SWITCH DÀNH RIÊNG CHO HR OWNER */}
                    {isHrOwner && (!isCollapsed || isMobileOpen) && (
                        <div className="mb-6 px-2">
                            <div className="bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl flex items-center shadow-inner border border-slate-200 dark:border-slate-700/50">
                                <button
                                    onClick={handleToggleView}
                                    className={cn("flex-1 py-1.5 text-xs font-bold rounded-lg transition-all", viewMode === 'OWNER' ? "bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}
                                >
                                    Quản lý
                                </button>
                                <button
                                    onClick={handleToggleView}
                                    className={cn("flex-1 py-1.5 text-xs font-bold rounded-lg transition-all", viewMode === 'MEMBER' ? "bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}
                                >
                                    Tuyển dụng
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="px-3 mb-2">
                        {(!isCollapsed || isMobileOpen) && (
                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                                {isAdmin
                                    ? "Quản trị hệ thống"
                                    : viewMode === 'OWNER'
                                        ? "Quản lý Doanh nghiệp"
                                        : "Chuyên viên Tuyển dụng"}
                            </p>
                        )}
                    </div>

                    {mainMenuItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        const showText = !isCollapsed || isMobileOpen;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                title={!showText ? item.name : undefined}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl transition-all font-medium text-sm group overflow-hidden relative",
                                    !showText ? "justify-center p-3" : "px-4 py-3",
                                    isActive
                                        ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-r-full" />
                                )}
                                <item.icon className={cn(
                                    "shrink-0 w-5 h-5 transition-colors",
                                    isActive
                                        ? "text-primary-600 dark:text-primary-400"
                                        : "text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-400"
                                )} />
                                {showText && <span className="whitespace-nowrap flex-1">{item.name}</span>}
                                {showText && item.pro && (
                                    <span className="ml-1.5 px-1.5 py-0.5 rounded-sm text-[9px] font-black bg-linear-to-r from-amber-500 to-orange-500 text-white uppercase tracking-widest shadow-sm">
                                        Pro
                                    </span>
                                )}

                                {showText && item.badge && (
                                    <span className="bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {bottomItems.length > 0 && (
                    <div className="px-3 py-4 space-y-1.5 border-t border-slate-200 dark:border-slate-800/50 shrink-0">
                        {bottomItems.map((item) => {
                            const isActive = pathname === item.href;
                            const showText = !isCollapsed || isMobileOpen;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    title={!showText ? item.name : undefined}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl transition-all font-medium text-sm group overflow-hidden",
                                        !showText ? "justify-center p-3" : "px-4 py-3",
                                        isActive
                                            ? "bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white"
                                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "shrink-0 w-5 h-5",
                                        isActive
                                            ? "text-slate-900 dark:text-white"
                                            : "text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-400"
                                    )} />
                                    {showText && <span className="whitespace-nowrap">{item.name}</span>}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </aside>
        </>
    );
}