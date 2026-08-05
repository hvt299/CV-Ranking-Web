'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';

export default function BottomCTA() {
    return (
        <section className="py-24 px-6 relative overflow-hidden bg-background dark:bg-slate-950">
            <div className="absolute inset-0 bg-linear-to-b from-blue-600/5 to-indigo-600/5 dark:from-blue-600/10 dark:to-indigo-600/10 pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center relative z-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-12 md:p-20 rounded-[3rem] shadow-xl transition-colors duration-300">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">Sẵn sàng nâng cấp <br /> hệ thống tuyển dụng?</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg font-medium">Tham gia cùng hàng nghìn doanh nghiệp và ứng viên đang sử dụng hệ thống ATS của chúng tôi mỗi ngày.</p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link href="/register" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-full transition-colors w-full sm:w-auto shadow-lg shadow-blue-500/30">
                        Đăng ký miễn phí
                    </Link>
                    <Link href="/contact" className="px-8 py-4 bg-transparent text-slate-800 dark:text-white font-black rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
                        <Play className="w-4 h-4 fill-slate-800 dark:fill-white" /> Xem Demo
                    </Link>
                </div>
            </div>
        </section>
    );
}