'use client';

import { useEffect, useState } from 'react';
import { ChevronUp, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function FloatingActions() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };

        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className="fixed bottom-5 right-1 z-50 sm:bottom-6 sm:right-3">
            <div className="flex w-14 flex-col items-center overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-1.5 shadow-xl shadow-slate-900/10 backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/95 dark:shadow-black/20">
                {/* Scroll To Top */}
                <button
                    type="button"
                    onClick={scrollToTop}
                    title="Lên đầu trang"
                    aria-label="Lên đầu trang"
                    className={`group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-all duration-300 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400 ${showScrollTop ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-90 opacity-25'}`}
                >
                    <ChevronUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />

                    <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 sm:block">
                        Lên đầu trang
                    </span>
                </button>

                {/* Divider */}
                <div className="my-1 h-px w-7 bg-slate-200 dark:bg-slate-700" />

                {/* Support */}
                <Link
                    href="/support"
                    title="Hỗ trợ"
                    aria-label="Hỗ trợ"
                    className="group relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-primary-600 to-primary-800 text-white shadow-md shadow-primary-500/25 transition-all duration-300 hover:scale-[1.04] hover:shadow-lg hover:shadow-primary-500/30"
                >
                    <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-linear-to-r from-transparent via-white/25 to-transparent transition-all duration-700 group-hover:left-[130%]" />

                    <MessageCircle className="relative z-10 h-5 w-5 stroke-[2.2]" />

                    <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 sm:block">
                        Hỗ trợ
                    </span>
                </Link>
            </div>
        </div>
    );
}