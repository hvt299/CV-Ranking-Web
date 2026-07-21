import { Hexagon } from 'lucide-react';

export default function GlobalLoading() {
    return (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-slate-50/80 dark:bg-[#050505]/80 backdrop-blur-md">
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
                    Đang tải dữ liệu, vui lòng đợi...
                </p>
            </div>
        </div>
    );
}