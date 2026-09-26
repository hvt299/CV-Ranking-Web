'use client';

import Link from 'next/link';
import { Building2, Calendar, ChevronRight, Briefcase } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { ROUTES } from '@/constants/routes';

interface RecentApplicationsProps {
    applications: any[];
}

export default function RecentApplications({ applications }: RecentApplicationsProps) {
    const recentApps = applications.slice(0, 5);

    return (
        <div className="bg-card-bg rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 md:p-8 border-b border-border flex items-center justify-between bg-background/40">
                <div>
                    <h2 className="text-xl font-black text-text mb-1">Hoạt động gần đây</h2>
                    <p className="text-sm font-medium text-text-muted">Trạng thái các hồ sơ bạn vừa nộp</p>
                </div>

                <Link href={ROUTES.APPLICANT_APPLICATIONS} className="hidden sm:flex items-center gap-1 text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-xl">
                    Xem tất cả <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="p-6 md:p-8 flex-1">
                {recentApps.length > 0 ? (
                    <div className="space-y-4">
                        {recentApps.map((app) => {
                            const appliedDate = app.applied_at?.$date || app.applied_at;
                            const formattedDate = appliedDate ? new Date(appliedDate).toLocaleDateString('vi-VN') : 'Không rõ';

                            return (
                                <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-background/60 border border-border hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm transition-all group">
                                    <div className="flex-1 min-w-0">
                                        <Link href={ROUTES.PUBLIC_JOB_DETAIL(app.job_id)} target="_blank" className="font-bold text-text text-base truncate block group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                            {app.job_title || 'Vị trí đang cập nhật'}
                                        </Link>

                                        <div className="flex flex-wrap items-center gap-3 mt-2">
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
                                                <Building2 className="w-3.5 h-3.5 shrink-0 text-text-subtle" />
                                                <span className="truncate max-w-45">{app.company_name || 'Công ty ẩn danh'}</span>
                                            </div>

                                            <div className="hidden sm:block w-1 h-1 rounded-full bg-border"></div>

                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
                                                <Calendar className="w-3.5 h-3.5 shrink-0 text-text-subtle" />
                                                <span>{formattedDate}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t border-border sm:border-0 pt-3 sm:pt-0">
                                        <StatusBadge status={app.status || 'new'} />

                                        <Link href={ROUTES.PUBLIC_JOB_DETAIL(app.job_id)} target="_blank" className="sm:hidden p-2 bg-background rounded-lg shadow-sm border border-border text-text-muted">
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-full min-h-62.5 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 border border-border">
                            <Briefcase className="w-8 h-8 text-text-subtle" />
                        </div>

                        <p className="text-text font-bold mb-1">Chưa có hoạt động nào</p>
                        <p className="text-sm text-text-muted max-w-sm">Bạn chưa nộp hồ sơ cho chiến dịch nào. Hãy bắt đầu tìm kiếm cơ hội ngay!</p>

                        <Link href={ROUTES.PUBLIC_JOBS} className="mt-5 px-6 py-2.5 bg-primary-600 text-white font-bold rounded-xl text-sm transition-colors hover:bg-primary-700 shadow-md shadow-primary-500/20">
                            Khám phá việc làm
                        </Link>
                    </div>
                )}
            </div>

            {recentApps.length > 0 && (
                <div className="p-4 border-t border-border sm:hidden bg-background/40">
                    <Link href={ROUTES.APPLICANT_APPLICATIONS} className="flex items-center justify-center gap-1.5 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors w-full py-3 bg-card-bg rounded-xl border border-border shadow-sm">
                        Xem tất cả lịch sử
                    </Link>
                </div>
            )}
        </div>
    );
}