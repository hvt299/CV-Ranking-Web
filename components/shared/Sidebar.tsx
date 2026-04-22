'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, Users, CalendarCheck, Mail, BarChart2, Settings, HelpCircle, ChevronLeft, ChevronRight, Hexagon, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAuth } from "@/context/AuthContext";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (val: boolean) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (val: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) {
    const pathname = usePathname();
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const menuItems = [
        { name: "Tổng quan", icon: LayoutDashboard, href: "/dashboard" },
        { name: "Chiến dịch tuyển dụng", icon: Briefcase, href: "/jobs" },
        { name: "Kho hồ sơ", icon: Users, href: "/candidates" },
        { name: "Lịch phỏng vấn", icon: CalendarCheck, href: "/interviews" },
        { name: "Hộp thư", icon: Mail, href: "/messages", badge: "3" },
        { name: "Thống kê", icon: BarChart2, href: "/analytics" },
    ];

    const bottomItems = [
        ...(isAdmin ? [{ name: "Cài đặt hệ thống", icon: Settings, href: "/settings" }] : []),
        { name: "Hỗ trợ", icon: HelpCircle, href: "/help" },
    ];

    return (
        <>
            {/* Lớp phủ Overlay (Chỉ hiện trên Mobile/Tablet) */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside className={cn(
                "h-screen fixed left-0 top-0 bg-[#0f172a] flex flex-col font-sans z-50 transition-all duration-300 border-r border-slate-800",
                isCollapsed ? "md:w-20" : "md:w-65",
                isMobileOpen ? "translate-x-0 w-65" : "-translate-x-full md:translate-x-0"
            )}>
                {/* Nút Thu gọn / Mở rộng (Chỉ hiện trên Desktop) */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-3.5 top-8 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-500 transition-colors shadow-lg z-50 border-2 border-[#0f172a]"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                {/* Nút Đóng (Chỉ hiện trên Mobile) */}
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="md:hidden absolute right-4 top-5 text-slate-400 hover:text-white transition-colors p-1"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Khu vực Logo */}
                <div className={cn("h-20 flex items-center shrink-0 border-b border-slate-800/50", isCollapsed && !isMobileOpen ? "justify-center" : "px-6")}>
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <div className="bg-linear-to-br from-blue-600 to-blue-500 p-2 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            <Hexagon className="w-6 h-6 text-white fill-white/10" />
                        </div>
                        {(!isCollapsed || isMobileOpen) && (
                            <span className="text-xl font-black text-white tracking-tight">
                                ATS<span className="text-blue-500">SYSTEM</span>
                            </span>
                        )}
                    </Link>
                </div>

                {/* Main Menu */}
                <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const showText = !isCollapsed || isMobileOpen;

                        return (
                            <Link key={item.name} href={item.href} onClick={() => setIsMobileOpen(false)} title={!showText ? item.name : undefined} className={cn("flex items-center rounded-xl transition-all group overflow-hidden", !showText ? "justify-center p-3" : "justify-between px-4 py-3", isActive ? "bg-[#1e293b] text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50")}>
                                <div className="flex items-center gap-3 font-medium text-sm">
                                    <item.icon className={cn("shrink-0 w-5 h-5", isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-400")} />
                                    {showText && <span className="whitespace-nowrap">{item.name}</span>}
                                </div>
                                {showText && item.badge && <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Menu */}
                <div className="px-3 py-4 space-y-1.5 border-t border-slate-800/50">
                    {bottomItems.map((item) => {
                        const isActive = pathname === item.href;
                        const showText = !isCollapsed || isMobileOpen;
                        return (
                            <Link key={item.name} href={item.href} onClick={() => setIsMobileOpen(false)} title={!showText ? item.name : undefined} className={cn("flex items-center gap-3 rounded-xl transition-all font-medium text-sm group overflow-hidden", !showText ? "justify-center p-3" : "px-4 py-3", isActive ? "bg-[#1e293b] text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50")}>
                                <item.icon className={cn("shrink-0 w-5 h-5", isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-400")} />
                                {showText && <span className="whitespace-nowrap">{item.name}</span>}
                            </Link>
                        );
                    })}
                </div>
            </aside>
        </>
    );
}