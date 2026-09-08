'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, MapPin, Briefcase, Calendar, Edit2, Share2, MoreHorizontal, Flame, Eye, Users, Bookmark, BookmarkCheck } from 'lucide-react';
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

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const isClosed = jobInfo.status === 'closed';
    const isExpired = jobInfo.deadline && new Date(jobInfo.deadline).getTime() < new Date().getTime();
    const isActive = !isClosed && !isExpired;

    const statusBadge = getJobBadgeConfig(isActive, isClosed);
    const hotBadge = JOB_BADGE_CONFIG.hot;

    const handleShare = async () => {
        if (!jobInfo?.id) return;

        const link = `${window.location.origin}${ROUTES.PUBLIC_JOB_DETAIL(jobInfo.id)}`;

        try {
            await navigator.clipboard.writeText(link);
            toast.success('Đã sao chép link công việc!');
            setIsMenuOpen(false);
        } catch {
            toast.error('Không thể sao chép link.');
        }
    };

    const handleSave = () => {
        // TODO: Gọi API lưu/bỏ lưu job của HR tại đây.
        const nextSavedState = !isSaved;

        setIsSaved(nextSavedState);
        setIsMenuOpen(false);

        toast.success(
            nextSavedState
                ? 'Đã lưu công việc vào danh sách theo dõi.'
                : 'Đã bỏ lưu công việc.'
        );
    };

    const fullAddress = jobInfo.location?.country && jobInfo.location.country !== 'Việt Nam'
        ? [jobInfo.location.street_address, jobInfo.location.country].filter(Boolean).join(', ')
        : [jobInfo.location?.street_address, jobInfo.location?.ward_name, jobInfo.location?.district_name, jobInfo.location?.province_name].filter(Boolean).join(', ');

    const viewCount = jobInfo.view_count || 0;
    const saveCount = jobInfo.save_count || 0;
    const applicationCount = jobInfo.num_applications || 0;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-visible">
            {/* =====================================================
                TOP BAR
            ====================================================== */}
            <div className="px-5 sm:px-6 pt-5 sm:pt-6">
                <div className="flex items-center justify-between gap-4">
                    {/* Back */}
                    <button onClick={() => router.push(ROUTES.HR_JOBS)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 font-bold transition-colors w-fit">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Danh sách chiến dịch</span>
                    </button>

                    {/* Actions */}
                    <div className="relative shrink-0">
                        <button onClick={() => setIsMenuOpen((prev) => !prev)} className={`p-2.5 rounded-xl transition-colors ${isMenuOpen ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-500 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400'}`} title="Thao tác">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-52 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-dropdown overflow-hidden">
                                <div className="p-1.5">
                                    <Link href={ROUTES.HR_JOB_EDIT(jobInfo.id)} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <Edit2 className="w-4 h-4 text-slate-400" />
                                        <span>Chỉnh sửa</span>
                                    </Link>

                                    <button onClick={handleSave} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        {isSaved ? <BookmarkCheck className="w-4 h-4 text-primary-500" /> : <Bookmark className="w-4 h-4 text-amber-500" />}
                                        <span>{isSaved ? 'Bỏ lưu công việc' : 'Lưu công việc'}</span>
                                    </button>

                                    <button onClick={handleShare} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <Share2 className="w-4 h-4 text-primary-500" />
                                        <span>Chia sẻ công việc</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* =====================================================
                MAIN JOB INFO
            ====================================================== */}
            <div className="px-5 sm:px-6 pt-5 pb-5">
                {/* Title + Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white leading-tight">{jobInfo.title}</h1>

                    <div className="flex items-center gap-2 shrink-0">
                        {/* Status */}
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                            {statusBadge.label}
                        </span>

                        {/* Hot */}
                        {jobInfo.is_hot && (
                            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${hotBadge.bg} ${hotBadge.text} ${hotBadge.border} ${hotBadge.glow}`}>
                                <Flame className="w-3 h-3" />
                                {hotBadge.label}
                            </span>
                        )}
                    </div>
                </div>

                {/* Meta information */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 mt-4">
                    {/* Company */}
                    <span className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{companyInfo?.name || jobInfo.company_name || 'Công ty của tôi'}</span>
                    </span>

                    <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />

                    {/* Location */}
                    <span className="flex items-center gap-1.5 min-w-0 max-w-full sm:max-w-72" title={fullAddress}>
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">
                            {jobInfo.location?.country && jobInfo.location.country !== 'Việt Nam'
                                ? jobInfo.location.country
                                : [jobInfo.location?.district_name, jobInfo.location?.province_name].filter(Boolean).join(', ') || 'Việt Nam'}
                        </span>
                    </span>

                    <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />

                    {/* Work mode + level */}
                    <span className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{jobInfo.work_mode} • {jobInfo.job_level}</span>
                    </span>
                </div>
            </div>

            {/* =====================================================
                STATS / HIRING INFO
            ====================================================== */}
            <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30 px-5 sm:px-6 py-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Dates */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Đăng: {new Date(jobInfo.created_at || Date.now()).toLocaleDateString('vi-VN')}</span>
                        </div>

                        <span className="text-slate-300 dark:text-slate-600">→</span>

                        <span className={isExpired ? 'text-rose-500' : ''}>
                            Hạn nộp: {jobInfo.deadline ? new Date(jobInfo.deadline).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                        </span>
                    </div>

                    {/* Statistics */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Views */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300" title="Số lượt xem công việc">
                            <Eye className="w-3.5 h-3.5 text-primary-500" />
                            <span>{viewCount.toLocaleString('vi-VN')}</span>
                            <span className="text-slate-400 font-medium">lượt xem</span>
                        </div>

                        {/* Applications */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300" title="Số hồ sơ ứng tuyển">
                            <Users className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{applicationCount.toLocaleString('vi-VN')}</span>
                            <span className="text-slate-400 font-medium">ứng tuyển</span>
                        </div>

                        {/* Saves */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300" title="Số lượt lưu công việc">
                            <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                            <span>{saveCount.toLocaleString('vi-VN')}</span>
                            <span className="text-slate-400 font-medium">lượt lưu</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}