'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import NotificationToast from '@/components/ui/NotificationToast';
import { useAuth } from '@/context/AuthContext';
import { Hexagon } from 'lucide-react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { loading } = useAuth();

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    const authRoutes = ['/login', '/register', '/verify', '/forgot-password', '/reset-password', '/'];
    const isAuthPage = authRoutes.includes(pathname);

    if (!mounted) return null;

    if (loading) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-slate-50 dark:bg-[#050505]">
                <div className="relative flex flex-col items-center">
                    {/* Vòng sáng tỏa ra phía sau (Glow Effect) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-500/20 blur-xl rounded-full animate-pulse" />

                    {/* Logo ATS xoay / nhịp thở */}
                    <div className="relative w-16 h-16 flex items-center justify-center mb-6">
                        <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-800 rounded-2xl" />
                        <div className="absolute inset-0 border-4 border-blue-600 rounded-2xl border-t-transparent border-b-transparent animate-spin" />
                        <Hexagon className="w-8 h-8 text-blue-600 animate-pulse" fill="currentColor" />
                    </div>

                    <h2 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">
                        ATS<span className="text-blue-600">SYSTEM</span>
                    </h2>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 animate-pulse">
                        Đang xác thực phiên đăng nhập...
                    </p>
                </div>
            </div>
        );
    }

    if (isAuthPage) {
        return <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a]">{children}</div>;
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">

            {/* ================= 1. RENDER ĐỘNG SIDEBAR ================= */}
            <Sidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            {/* ================= 2. KHUNG MAIN CONTENT ================= */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">

                {/* ================= 3. RENDER ĐỘNG HEADER ================= */}
                <Header setIsMobileOpen={setIsMobileOpen} />

                {/* ================= 4. NỘI DUNG TRANG CHÍNH ================= */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
                    {children}
                </main>

            </div>

            {/* ================= 5. TOAST NOTIFICATION DÙNG CHUNG ================= */}
            <NotificationToast />
        </div>
    );
}