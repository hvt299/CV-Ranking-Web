'use client';

import { useRouter } from 'next/navigation';
import { Building2, MapPin, Users, Star, Eye, BriefcaseIcon } from 'lucide-react';
import { Company } from '@/types';

interface CompanyCardProps {
    company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/companies/${company.id}`)}
            className="cursor-pointer group bg-white dark:bg-text rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 shadow-sm overflow-hidden flex flex-col h-full relative"
        >
            {/* Banner Công ty */}
            <div className="h-32 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                {company.banner_url ? (
                    <img src={company.banner_url} alt={`Banner ${company.name}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent blur-xl" />
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[12px_12px]" />
                        <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-600 relative z-10" />
                    </div>
                )}
            </div>

            {/* Thông tin chính */}
            <div className="p-6 pt-0 flex-1 flex flex-col">
                {/* Logo nổi lên trên Banner */}
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border-4 border-white dark:border-text shadow-sm -mt-8 mb-3 flex items-center justify-center overflow-hidden relative z-10 shrink-0">
                    {company.logo_url ? (
                        <img src={company.logo_url} alt={`Logo ${company.name}`} className="w-full h-full object-contain p-1" />
                    ) : (
                        <Building2 className="w-6 h-6 text-slate-400" />
                    )}
                </div>

                <h3 className="text-xl font-bold text-slate-800 dark:text-white line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
                    {company.name}
                </h3>

                <div className="space-y-2 mt-2 mb-6 flex-1">
                    {company.industry && (
                        <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                            <BriefcaseIcon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{company.industry}</span>
                        </div>
                    )}

                    {(company.location?.full_address_snapshot || company.location?.province_name || company.location?.country) && (
                        <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium" title={company.location.full_address_snapshot}>
                            <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2 leading-relaxed">
                                {company.location.full_address_snapshot || (company.location.country && company.location.country !== 'Việt Nam'
                                    ? company.location.country
                                    : company.location.province_name)}
                            </span>
                        </div>
                    )}

                    {company.size && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                            <Users className="w-4 h-4 text-blue-400 shrink-0" />
                            <span>Quy mô: {company.size}</span>
                        </div>
                    )}
                </div>

                {/* Footer Card: Rating & View */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                        <Star className={`w-4 h-4 ${company.avg_rating > 0 ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                        {company.avg_rating > 0 ? (
                            <span>{company.avg_rating.toFixed(1)} <span className="font-medium">({company.review_count} đánh giá)</span></span>
                        ) : (
                            <span className="font-medium">Chưa có đánh giá</span>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        <span>{(company.view_count || 0).toLocaleString()} view</span>
                    </div>
                </div>
            </div>
        </div>
    );
}