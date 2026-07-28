'use client';

import { Building2 } from 'lucide-react';

interface CompanyMarqueeProps {
    companies: string[];
    onSelectCompany: (companyName: string) => void;
}

export default function CompanyMarquee({ companies, onSelectCompany }: CompanyMarqueeProps) {
    if (!companies || companies.length === 0) return null;

    return (
        <section className="py-10 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 transition-colors">
            <div className="max-w-7xl mx-auto px-6 overflow-hidden flex flex-col items-center">
                <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-8">
                    Được tin dùng bởi các doanh nghiệp
                </p>
                <div className="flex gap-12 items-center justify-center flex-wrap opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {companies.slice(0, 10).map((c, i) => (
                        <button
                            key={i}
                            onClick={() => onSelectCompany(c)}
                            className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <Building2 className="w-6 h-6" /> {c}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}