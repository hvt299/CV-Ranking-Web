'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, Users, CalendarCheck, Mail, BarChart2, Settings, HelpCircle, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (val: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
    const pathname = usePathname();

    const menuItems = [
        { name: "Tổng quan", icon: LayoutDashboard, href: "/" },
        { name: "Chiến dịch tuyển dụng", icon: Briefcase, href: "/jobs" },
        { name: "Kho hồ sơ", icon: Users, href: "/candidates" },
        { name: "Lịch phỏng vấn", icon: CalendarCheck, href: "/interviews" },
        { name: "Hộp thư", icon: Mail, href: "/messages", badge: "3" },
        { name: "Thống kê", icon: BarChart2, href: "/analytics" },
    ];

    const bottomItems = [
        { name: "Cài đặt hệ thống", icon: Settings, href: "/settings" },
        { name: "Hỗ trợ", icon: HelpCircle, href: "/help" },
    ];

    return (
        <aside className={cn(
            "h-screen fixed left-0 top-0 bg-[#0f172a] flex flex-col font-sans z-20 transition-all duration-300 md:flex border-r border-slate-800",
            isCollapsed ? "w-20" : "w-65"
        )}>
            {/* Nút Thu gọn / Mở rộng */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3.5 top-8 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-500 transition-colors shadow-lg z-30 border-2 border-[#0f172a]"
            >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Profile HR */}
            <div className={cn("flex flex-col items-center border-b border-slate-800/50 transition-all duration-300", isCollapsed ? "p-4 mt-6" : "p-8 pb-6 mt-2")}>
                <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-blue-500 to-teal-400 p-0.5 mb-2 shadow-lg">
                    <div className="w-full h-full bg-[#1e293b] rounded-xl flex items-center justify-center">
                        <span className="font-bold text-white text-sm">TN</span>
                    </div>
                </div>
                {!isCollapsed && (
                    <div className="text-center overflow-hidden">
                        <h2 className="text-white font-semibold text-base tracking-wide whitespace-nowrap">Trần Nam</h2>
                        <p className="text-slate-400 text-xs mt-0.5 whitespace-nowrap">Trưởng phòng NS</p>
                    </div>
                )}
            </div>

            {/* Main Menu */}
            <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.name} href={item.href} title={isCollapsed ? item.name : undefined} className={cn("flex items-center rounded-xl transition-all group overflow-hidden", isCollapsed ? "justify-center p-3" : "justify-between px-4 py-3", isActive ? "bg-[#1e293b] text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50")}>
                            <div className="flex items-center gap-3 font-medium text-sm">
                                <item.icon className={cn("shrink-0 w-5 h-5", isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-400")} />
                                {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                            </div>
                            {!isCollapsed && item.badge && <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Menu & Đăng xuất */}
            <div className="px-3 py-4 space-y-1.5 border-t border-slate-800/50">
                {bottomItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.name} href={item.href} title={isCollapsed ? item.name : undefined} className={cn("flex items-center gap-3 rounded-xl transition-all font-medium text-sm group overflow-hidden", isCollapsed ? "justify-center p-3" : "px-4 py-3", isActive ? "bg-[#1e293b] text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50")}>
                            <item.icon className={cn("shrink-0 w-5 h-5", isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-400")} />
                            {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                        </Link>
                    );
                })}
                <button title={isCollapsed ? "Đăng xuất" : undefined} className={cn("w-full flex items-center gap-3 rounded-xl transition-all font-medium text-sm group text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 overflow-hidden", isCollapsed ? "justify-center p-3" : "px-4 py-3 mt-2")}>
                    <LogOut className="shrink-0 w-5 h-5 text-rose-500 group-hover:text-rose-400" />
                    {!isCollapsed && <span className="whitespace-nowrap">Đăng xuất</span>}
                </button>
            </div>
        </aside>
    );
}