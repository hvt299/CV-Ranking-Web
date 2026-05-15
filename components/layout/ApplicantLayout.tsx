'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import ApplicantSidebar from '@/components/shared/ApplicantSidebar';
import ApplicantHeader from '@/components/shared/ApplicantHeader';
import NotificationToast from '@/components/shared/NotificationToast';

export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const pathname = usePathname();

    const authRoutes = ['/login', '/register', '/verify', '/forgot-password', '/reset-password'];
    const isAuthPage = authRoutes.includes(pathname);

    if (isAuthPage) {
        return <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a]">{children}</div>;
    }

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
            {/* Sidebar */}
            <ApplicantSidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            {/* Main content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-65'}`}>
                {/* Header */}
                <ApplicantHeader setIsMobileOpen={setIsMobileOpen} />

                {/* Main content area */}
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>
            
            {/* Toast Notifications */}
            <NotificationToast />
        </div>
    );
}