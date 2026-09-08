'use client';

import { ROUTES } from '@/constants/routes';
import { Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CompanyMarqueeProps {
    companies: any[];
    onSelectCompany?: (companyName: string) => void;
}

export default function CompanyMarquee({
    companies,
    onSelectCompany,
}: CompanyMarqueeProps) {
    const router = useRouter();

    if (!companies || companies.length === 0) return null;

    return (
        <section className="py-10 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 transition-colors">
            <div className="max-w-7xl mx-auto px-6 overflow-hidden flex flex-col items-center">

                {/* Tiêu đề */}
                <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-8">
                    Được tin dùng bởi các doanh nghiệp
                </p>

                {/* Danh sách logo */}
                <div className="flex gap-8 md:gap-12 items-center justify-center flex-wrap">
                    {companies.slice(0, 10).map((company, index) => {
                        const companyId = company?.id || null;
                        const companyName = company?.name || 'Công ty';
                        const logoUrl = company?.logo_url || null;

                        return (
                            <button
                                key={companyId || index}
                                type="button"
                                title={companyName}
                                aria-label={companyName}
                                onClick={() => {
                                    if (companyId) {
                                        router.push(
                                            ROUTES.PUBLIC_COMPANY_DETAIL(companyId)
                                        );
                                    } else if (onSelectCompany) {
                                        onSelectCompany(companyName);
                                    }
                                }}
                                className="group w-32 h-20 md:w-40 md:h-24 flex items-center justify-center rounded-xl opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-105">
                                {logoUrl ? (
                                    <img
                                        src={logoUrl}
                                        alt={companyName}
                                        title={companyName}
                                        className="max-w-full max-h-full w-auto h-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                                        onError={(e) => {
                                            console.error('Không thể tải logo:',logoUrl);
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div
                                        title={companyName}
                                        className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                                        <Building2 className="w-7 h-7" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}