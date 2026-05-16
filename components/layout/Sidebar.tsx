'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Briefcase, Users, CalendarCheck, Mail, BarChart2,
    Settings, HelpCircle, ChevronLeft, ChevronRight, Hexagon, X,
    FileText, User as UserIcon
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAuth } from "@/context/AuthContext";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

type MenuItem = {
    name: string;
    icon: any;
    href: string;
    badge?: string;
};

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (val: boolean) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (val: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) {
    const pathname = usePathname();
    const { user } = useAuth();

    const role = user?.role || 'applicant';
    const isAdmin = role === 'admin';
    const isApplicant = role === 'applicant';

    const applicantMenu: MenuItem[] = [
        { name: "Tìm việc làm", icon: Briefcase, href: "/apply" },
        { name: "Hồ sơ của tôi", icon: FileText, href: "/my-applications" },
        { name: "Thông tin cá nhân", icon: UserIcon, href: "/profile" },
    ];

    const hrMenu: MenuItem[] = [
        { name: "Tổng quan", icon: LayoutDashboard, href: "/dashboard" },
        { name: "Chiến dịch tuyển dụng", icon: Briefcase, href: "/jobs" },
        { name: "Kho hồ sơ", icon: Users, href: "/candidates" },
        { name: "Lịch phỏng vấn", icon: CalendarCheck, href: "/interviews" },
        { name: "Hộp thư", icon: Mail, href: "/messages", badge: "3" },
        ...(isAdmin ? [{ name: "Báo cáo hệ thống", icon: BarChart2, href: "/analytics" }] : [])
    ];

    const mainMenuItems = isApplicant ? applicantMenu : hrMenu;

    const bottomItems: MenuItem[] = [
        ...(isAdmin ? [{ name: "Cài đặt", icon: Settings, href: "/settings" }] : []),
        { name: "Trợ giúp", icon: HelpCircle, href: "/help" },
    ];

    return (
        <>
            {/* ================= OVERLAY (Chỉ hiện trên Mobile) ================= */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* ================= SIDEBAR CHÍNH ================= */}
            <aside
                className={cn(
                    "fixed top-0 left-0 h-screen bg-[#0f172a] border-r border-slate-800 z-50 flex flex-col transition-all duration-300 shadow-2xl",
                    isCollapsed ? "w-20" : "w-65",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* ---------- Header Logo ---------- */}
                <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800/80 shrink-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                            <Hexagon className="w-6 h-6 text-white" fill="currentColor" />
                        </div>
                        {(!isCollapsed || isMobileOpen) && (
                            <span className="text-xl font-black text-white whitespace-nowrap tracking-tight">
                                ATS<span className="text-blue-500">SYSTEM</span>
                            </span>
                        )}
                    </div>

                    {/* Nút đóng Sidebar trên Mobile */}
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ---------- Nút Thu Gọn (Chỉ hiện trên Desktop) ---------- */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-3 top-24 w-6 h-6 bg-blue-600 text-white rounded-full items-center justify-center hover:bg-blue-500 hover:scale-110 shadow-lg shadow-blue-500/30 transition-all z-50"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                {/* ---------- Danh sách Menu Chính ---------- */}
                <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
                    <div className="px-3 mb-2">
                        {(!isCollapsed || isMobileOpen) && (
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                {isApplicant ? 'Dành cho Ứng viên' : 'Quản lý chung'}
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
                                        ? "bg-blue-600/10 text-blue-500"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />
                                )}
                                <item.icon className={cn(
                                    "shrink-0 w-5 h-5 transition-colors",
                                    isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-400"
                                )} />
                                {showText && <span className="whitespace-nowrap flex-1">{item.name}</span>}
                                {showText && item.badge && (
                                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* ---------- Danh sách Menu Phụ (Nếu có) ---------- */}
                {bottomItems.length > 0 && (
                    <div className="px-3 py-4 space-y-1.5 border-t border-slate-800/50 shrink-0">
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
                                        isActive ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                    )}
                                >
                                    <item.icon className={cn("shrink-0 w-5 h-5", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-400")} />
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