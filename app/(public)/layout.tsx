import PublicHeader from '@/components/layout/PublicHeader';
import { Hexagon } from 'lucide-react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#050505] transition-colors selection:bg-blue-500/30">
            {/* Header chuyên biệt cho Khách */}
            <PublicHeader />

            {/* Nội dung chính */}
            <main className="flex-1 flex flex-col relative">
                {children}
            </main>

            {/* Footer cơ bản */}
            <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0a0a] py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 opacity-50">
                        <Hexagon className="w-5 h-5 text-slate-500" fill="currentColor" />
                        <span className="font-black tracking-tight text-slate-500">ATS<span className="text-slate-400">SYSTEM</span></span>
                    </div>
                    <p className="text-sm font-medium text-slate-400">© 2026 ATS System. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}