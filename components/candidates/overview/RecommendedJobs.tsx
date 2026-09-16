'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, DollarSign, Building2, ChevronRight, Briefcase } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { formatSalaryRange } from '@/utils/format';
import { ROUTES } from '@/constants/routes';

interface RecommendedJobsProps {
    profile: any;
}

export default function RecommendedJobs({ profile }: RecommendedJobsProps) {
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendedJobs = async () => {
            try {
                const res = await apiClient.get('/apply/jobs');
                const allJobs = res.data?.data || res.data || [];
                setJobs(Array.isArray(allJobs) ? allJobs.slice(0, 4) : []);
            } catch (error) {
                console.error('Lỗi khi tải danh sách việc làm gợi ý', error);
                setJobs([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendedJobs();
    }, [profile]);

    return (
        <div className="bg-card-bg rounded-3xl border border-border shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-border bg-linear-to-r from-primary-50 to-transparent dark:from-primary-900/10 dark:to-transparent">
                <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-5 h-5 text-warning-500 fill-warning-500" />
                    <h2 className="text-lg font-black text-text">Gợi ý cho bạn</h2>
                </div>
                <p className="text-xs font-medium text-text-muted">Dựa trên kỹ năng và hồ sơ của bạn</p>
            </div>

            <div className="p-6 flex-1">
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-600" />
                    </div>
                ) : jobs.length > 0 ? (
                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <Link key={job.id} href={ROUTES.PUBLIC_JOB_DETAIL(job.id)} target="_blank" className="block p-4 rounded-2xl bg-background/60 border border-border hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all group">
                                <h3 className="font-bold text-text text-sm mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                                    {job.title || 'Vị trí đang cập nhật'}
                                </h3>

                                <div className="space-y-2 mb-3">
                                    <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
                                        <Building2 className="w-3.5 h-3.5 shrink-0 text-text-subtle" />
                                        <span className="truncate">{job.company_name || 'Công ty ẩn danh'}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
                                        <MapPin className="w-3.5 h-3.5 shrink-0 text-text-subtle" />
                                        <span className="truncate">{job.location?.province_name || 'Địa điểm linh hoạt'}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs font-bold text-success-600 dark:text-success-400">
                                        <DollarSign className="w-3.5 h-3.5 shrink-0" />
                                        <span>{formatSalaryRange(job.salary)}</span>
                                    </div>
                                </div>

                                {Array.isArray(job.required_skills) && job.required_skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-auto">
                                        {job.required_skills.slice(0, 3).map((skill: string, idx: number) => (
                                            <span key={idx} className="px-2 py-1 bg-card-bg border border-border rounded-md text-[10px] font-bold text-text-muted shadow-sm">
                                                {skill}
                                            </span>
                                        ))}

                                        {job.required_skills.length > 3 && (
                                            <span className="px-2 py-1 bg-background border border-transparent rounded-md text-[10px] font-bold text-text-subtle">
                                                +{job.required_skills.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-8">
                        <div className="w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center mb-3">
                            <Briefcase className="w-7 h-7 text-text-subtle" />
                        </div>
                        <p className="text-sm font-bold text-text">Chưa có gợi ý</p>
                        <p className="text-xs text-text-muted mt-1 max-w-55">Cập nhật thêm kỹ năng để AI có thể gợi ý việc làm tốt nhất.</p>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-border bg-background/40">
                <Link href={ROUTES.PUBLIC_JOBS} className="flex items-center justify-center gap-1 text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                    Khám phá tất cả <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}