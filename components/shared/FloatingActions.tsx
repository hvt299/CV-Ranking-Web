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

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
                @media (prefers-reduced-motion: no-preference) {
                    @keyframes support-ripple {
                        0% { transform: scale(1); opacity: 0.45; }
                        70% { transform: scale(1.8); opacity: 0; }
                        100% { transform: scale(1.8); opacity: 0; }
                    }
                    .animate-support-ripple {
                        animation: support-ripple 3s cubic-bezier(0, 0, 0.2, 1) infinite;
                    }
                    .animate-support-ripple-delayed {
                        animation: support-ripple 3s cubic-bezier(0, 0, 0.2, 1) infinite;
                        animation-delay: 1.5s;
                    }
                }
            `}} />
            <div className="fixed bottom-5 right-4 z-50 flex flex-col items-center gap-3 sm:bottom-6 sm:right-6">
                {/* Support Button */}
                <Link
                    href="/support"
                    title="Hỗ trợ"
                    aria-label="Hỗ trợ"
                    className="group relative flex h-13 w-13 items-center justify-center rounded-full border border-blue-400/30 bg-linear-to-br from-blue-500 via-blue-600 to-violet-600 text-white shadow-xl shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40"
                >
                    {/* Ripple 1 */}
                    <span className="pointer-events-none absolute inset-0 -z-10 rounded-full border-2 border-blue-500 animate-support-ripple" />
                    {/* Ripple 2 */}
                    <span className="pointer-events-none absolute inset-0 -z-10 rounded-full border-2 border-blue-500 animate-support-ripple-delayed" />

                    <MessageCircle className="relative h-6 w-6 stroke-[2.2]" />

                    <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 sm:block">
                        Hỗ trợ
                    </span>
                </Link>

                {/* Scroll To Top */}
                {showScrollTop && (
                    <button
                        type="button"
                        onClick={scrollToTop}
                        title="Lên đầu trang"
                        aria-label="Lên đầu trang"
                        className="group flex h-11 w-11 items-center justify-center rounded-full border border-blue-200 bg-white text-blue-600 shadow-lg shadow-blue-500/15 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50 hover:shadow-xl hover:shadow-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-400 dark:hover:border-blue-500/50 dark:hover:bg-slate-800"
                    >
                        <ChevronUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
                    </button>
                )}
            </div>
        </>
    );
}