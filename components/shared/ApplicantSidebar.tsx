'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, FileText, User, LogOut, ChevronLeft, ChevronRight, Hexagon, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAuth } from "@/context/AuthContext";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

interface ApplicantSidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (val: boolean) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (val: boolean) => void;
}

export default function ApplicantSidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }: ApplicantSidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const menuItems = [
        { name: "Tìm việc làm", icon: Briefcase, href: "/apply" },
        { name: "Hồ sơ của tôi", icon: FileText, href: "/my-applications" },
        { name: "Thông tin cá nhân", icon: User, href: "/profile" },
    ];

    return (
        <>
            {/* Overlay (Mobile only) */}
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
                {/* Collapse/Expand button (Desktop only) */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-3.5 top-8 bg-emerald-600 text-white p-1 rounded-full hover:bg-emerald-500 transition-colors shadow-lg z-50 border-2 border-[#0f172a]"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                {/* Close button (Mobile only) */}
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="md:hidden absolute right-4 top-5 text-slate-400 hover:text-white transition-colors p-1"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Logo area */}
                <div className={cn("h-20 flex items-center shrink-0 border-b border-slate-800/50", isCollapsed && !isMobileOpen ? "justify-center" : "px-6")}>
                    <Link href="/apply" className="flex items-center gap-3 group">
                        <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                            <Hexagon className="w-6 h-6 text-white fill-white/10" />
                        </div>
                        {(!isCollapsed || isMobileOpen) && (
                            <div className="flex flex-col">
                                <span className="text-xl font-black text-white tracking-tight">
                                    CV<span className="text-emerald-400">RANKING</span>
                                </span>
                                <span className="text-xs text-slate-400 font-medium -mt-1">Cổng ứng tuyển</span>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Main Menu */}
                <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const showText = !isCollapsed || isMobileOpen;

                        return (
                            <Link 
                                key={item.name} 
                                href={item.href} 
                                onClick={() => setIsMobileOpen(false)} 
                                title={!showText ? item.name : undefined} 
                                className={cn(
                                    "flex items-center rounded-xl transition-all group overflow-hidden",
                                    !showText ? "justify-center p-3" : "px-4 py-3",
                                    isActive 
                                        ? "bg-[#1e293b] text-white shadow-sm" 
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                )}
                            >
                                <div className="flex items-center gap-3 font-medium text-sm">
                                    <item.icon className={cn(
                                        "shrink-0 w-5 h-5", 
                                        isActive 
                                            ? "text-emerald-500" 
                                            : "text-slate-500 group-hover:text-slate-400"
                                    )} />
                                    {showText && <span className="whitespace-nowrap">{item.name}</span>}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* User info and logout */}
                <div className="px-3 py-4 space-y-3 border-t border-slate-800/50">
                    {/* User info */}
                    {(!isCollapsed || isMobileOpen) && user && (
                        <div className="px-3 py-2 rounded-xl bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <img
                                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random&size=32`}
                                    alt="Avatar"
                                    className="w-8 h-8 rounded-full object-cover border border-slate-600"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">{user.full_name}</p>
                                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Logout button */}
                    <button
                        onClick={logout}
                        title={(!isCollapsed && !isMobileOpen) ? undefined : "Đăng xuất"}
                        className={cn(
                            "w-full flex items-center gap-3 rounded-xl transition-all font-medium text-sm group overflow-hidden text-slate-400 hover:text-red-400 hover:bg-red-500/10",
                            !isCollapsed || isMobileOpen ? "px-4 py-3" : "justify-center p-3"
                        )}
                    >
                        <LogOut className="shrink-0 w-5 h-5" />
                        {(!isCollapsed || isMobileOpen) && <span className="whitespace-nowrap">Đăng xuất</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}