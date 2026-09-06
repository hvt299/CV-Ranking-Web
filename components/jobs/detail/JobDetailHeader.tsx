'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, MapPin, Briefcase, Calendar, Edit2, Share2, MoreHorizontal, Flame } from 'lucide-react';
import { Job } from '@/types';
import toast from 'react-hot-toast';
import { ROUTES } from '@/constants/routes';
import { JOB_BADGE_CONFIG, getJobBadgeConfig } from '@/utils/tier-colors';

interface JobDetailHeaderProps {
    jobInfo: Job;
    companyInfo: any;
}

export default function JobDetailHeader({ jobInfo, companyInfo }: JobDetailHeaderProps) {
    const router = useRouter();

    const isClosed = jobInfo.status === 'closed';
    const isExpired = jobInfo.deadline && new Date(jobInfo.deadline).getTime() < new Date().getTime();
    const isActive = !isClosed && !isExpired;

    const statusBadge = getJobBadgeConfig(isActive, isClosed);
    const hotBadge = JOB_BADGE_CONFIG.hot;

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!jobInfo?.id) return;
        const link = `${window.location.origin}${ROUTES.PUBLIC_JOB_DETAIL(jobInfo.id)}`;
        navigator.clipboard.writeText(link);
        toast.success('Đã sao chép link công việc!');
    };

    const fullAddress = jobInfo.location?.country && jobInfo.location.country !== 'Việt Nam'
        ? [jobInfo.location.street_address, jobInfo.location.country].filter(Boolean).join(', ')
        : [jobInfo.location?.street_address, jobInfo.location?.ward_name, jobInfo.location?.district_name, jobInfo.location?.province_name].filter(Boolean).join(', ');

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
            {/* Nút Quay lại & Breadcrumb */}
            <button
                onClick={() => router.push(ROUTES.HR_JOBS)}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 font-bold mb-4 transition-colors w-fit"
            >
                <ArrowLeft className="w-4 h-4" /> Danh sách chiến dịch
            </button>

            <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-6">
                {/* Thông tin Job */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white leading-tight">
                            {jobInfo.title}
                        </h1>
                        {/* Status Badge + Hot Badge */}
                        <div className="flex items-center gap-2 shrink-0">
                            <span
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                                {statusBadge.label}
                            </span>

                            {jobInfo.is_hot && (
                                <span
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${hotBadge.bg} ${hotBadge.text} ${hotBadge.border} ${hotBadge.glow}`}
                                >
                                    <Flame className="w-3 h-3" /> {hotBadge.label}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400 mt-3">
                        <span className="flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            {companyInfo?.name || jobInfo.company_name || 'Công ty của tôi'}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>

                        <span className="flex items-center gap-1.5 truncate max-w-72" title={fullAddress}>
                            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="truncate">
                                {jobInfo.location?.country && jobInfo.location.country !== 'Việt Nam'
                                    ? jobInfo.location.country
                                    : [jobInfo.location?.district_name, jobInfo.location?.province_name].filter(Boolean).join(', ') || 'Việt Nam'}
                            </span>
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>

                        <span className="flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            {jobInfo.work_mode} • {jobInfo.job_level}
                        </span>
                    </div>

                    {/* Hiring Period */}
                    <div className="flex items-center gap-2 mt-4 text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-800/50 w-fit px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Đăng: {new Date(jobInfo.created_at || jobInfo.created_at || Date.now()).toLocaleDateString('vi-VN')}</span>
                        <span className="mx-1 text-slate-300">→</span>
                        <span className={isExpired ? 'text-rose-500' : ''}>Hạn nộp: {jobInfo.deadline ? new Date(jobInfo.deadline).toLocaleDateString('vi-VN') : 'Không giới hạn'}</span>
                    </div>
                </div>

                {/* Hành động (Action Buttons) */}
                <div className="flex items-center gap-2 shrink-0">
                    <Link
                        href={ROUTES.HR_JOB_EDIT(jobInfo.id)}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-colors flex items-center gap-2"
                    >
                        <Edit2 className="w-4 h-4" /> <span className="hidden sm:inline">Chỉnh sửa</span>
                    </Link>
                    <button onClick={handleShare} className="px-4 py-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40 text-sm font-bold rounded-xl transition-colors flex items-center gap-2">
                        <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Chia sẻ</span>
                    </button>
                    <button className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 rounded-xl transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}