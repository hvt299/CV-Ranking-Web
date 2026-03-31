'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';
import Header from '@/components/shared/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    const isAuthPage = pathname === '/login' || pathname === '/register';

    if (isAuthPage) {
        return <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a]">{children}</div>;
    }

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Nội dung bên phải tự động giãn Margin theo Sidebar */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-65'}`}>
                <Header />
                {/* overflow-x-hidden để tránh vỡ layout trên mobile */}
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}