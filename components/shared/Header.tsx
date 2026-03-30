'use client';

import { Search, Bell, Plus, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Header() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    return (
        <header className="h-20 bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10 transition-colors duration-300">
            {/* Thanh tìm kiếm tổng */}
            <div className="relative w-112.5">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Tìm kiếm ứng viên, vị trí, kỹ năng..."
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm focus:bg-white dark:focus:bg-[#1e293b] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-700 dark:text-slate-200 font-medium placeholder:font-normal placeholder:text-slate-400"
                />
            </div>

            {/* Hành động (Theme, Thông báo & Tạo mới) */}
            <div className="flex items-center gap-4">
                {/* Nút Toggle Theme */}
                {mounted && (
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-amber-400 transition-colors bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-full"
                        title="Chuyển đổi giao diện"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                )}

                {/* Nút Thông báo */}
                <button className="relative p-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-full">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-[#0f172a] rounded-full"></span>
                </button>

                {/* Nút Tạo mới */}
                <button className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-500/30 ml-2">
                    <Plus className="w-4 h-4 stroke-3" />
                    Tạo chiến dịch
                </button>
            </div>
        </header>
    );
}