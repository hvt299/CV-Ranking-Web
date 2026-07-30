'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Hexagon, Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden selection:bg-primary-500/30 transition-colors">
            {/* Background Grid & Glows */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50 dark:opacity-20 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary-500/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center text-center px-6"
            >
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl flex items-center justify-center mb-8 shadow-sm backdrop-blur-md transition-colors">
                    <Search className="w-10 h-10 text-primary-500" />
                </div>

                <h1 className="text-7xl md:text-9xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
                    4<span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-primary-500 dark:from-primary-400 dark:to-primary-300">0</span>4
                </h1>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                    Không tìm thấy trang
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto mb-10 leading-relaxed">
                    Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không thể truy cập. Hệ thống ATS không thể định tuyến yêu cầu này.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link
                        href="/careers"
                        className="px-6 py-3.5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm backdrop-blur-md"
                    >
                        <Search className="w-4 h-4" /> Khám phá việc làm
                    </Link>

                    <Link
                        href="/"
                        className="px-6 py-3.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        <Home className="w-4 h-4" /> Về trang chủ
                    </Link>
                </div>
            </motion.div>

            {/* Footer Branding */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-50 pointer-events-none">
                <Hexagon className="w-4 h-4 text-slate-500" fill="currentColor" />
                <span className="text-sm font-black text-slate-500 tracking-tight">ATS<span className="text-slate-400">SYSTEM</span></span>
            </div>
        </div>
    );
}