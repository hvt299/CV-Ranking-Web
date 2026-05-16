'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import NotificationToast from '@/components/ui/NotificationToast';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const pathname = usePathname();
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        setMounted(true);
    }, []);

    const authRoutes = ['/login', '/register', '/verify', '/forgot-password', '/reset-password', '/'];
    const isAuthPage = authRoutes.includes(pathname);

    if (!mounted) return null;

    if (isAuthPage) {
        return <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a]">{children}</div>;
    }

    const role = user?.role || 'applicant';
    const isApplicant = role === 'applicant';

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">

            {/* ================= 1. RENDER ĐỘNG SIDEBAR ================= */}
            <Sidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            {/* ================= 2. KHUNG MAIN CONTENT ================= */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-65'}`}>

                {/* ================= 3. RENDER ĐỘNG HEADER ================= */}
                <Header setIsMobileOpen={setIsMobileOpen} />

                {/* ================= 4. NỘI DUNG TRANG CHÍNH ================= */}
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>

            {/* ================= 5. TOAST NOTIFICATION DÙNG CHUNG ================= */}
            <NotificationToast />
        </div>
    );
}