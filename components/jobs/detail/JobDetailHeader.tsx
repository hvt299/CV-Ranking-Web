'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, MapPin, Briefcase, Calendar, Edit2, Share2, MoreHorizontal } from 'lucide-react';
import { Job } from '@/types';

interface JobDetailHeaderProps {
    jobInfo: Job;
    companyInfo: any;
}

export default function JobDetailHeader({ jobInfo, companyInfo }: JobDetailHeaderProps) {
    const router = useRouter();

    const isClosed = jobInfo.status === 'closed';
    const isExpired = jobInfo.deadline && new Date(jobInfo.deadline).getTime() < new Date().getTime();
    const isActive = !isClosed && !isExpired;

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
            {/* Nút Quay lại & Breadcrumb */}
            <button
                onClick={() => router.push('/jobs')}
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
                        {/* Status Badge */}
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shrink-0 ${isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                            isClosed ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' :
                                'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                            }`}>
                            {isActive ? '• Đang mở' : isClosed ? 'Đã đóng' : 'Hết hạn'}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400 mt-3">
                        <span className="flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            {companyInfo?.name || jobInfo.company_name || 'Công ty của tôi'}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>

                        <span className="flex items-center gap-1.5 truncate max-w-50" title={jobInfo.location?.province_name || 'Việt Nam'}>
                            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="truncate">
                                {jobInfo.location?.country && jobInfo.location.country !== 'Việt Nam' ? jobInfo.location.country : (jobInfo.location?.province_name || 'Việt Nam')}
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
                        href={`/jobs/edit/${jobInfo.id}`}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-colors flex items-center gap-2"
                    >
                        <Edit2 className="w-4 h-4" /> <span className="hidden sm:inline">Chỉnh sửa</span>
                    </Link>
                    <button className="px-4 py-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40 text-sm font-bold rounded-xl transition-colors flex items-center gap-2">
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