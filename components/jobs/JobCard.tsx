'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Briefcase, Heart, Send, Building2, DollarSign, Share2 } from 'lucide-react';
import { Job } from '@/types';
import { formatSalaryRange, getCountdownParts } from '@/utils/format';
import toast from 'react-hot-toast';
import { useUIStore } from '@/store/useUIStore';
import { ROUTES } from '@/constants/routes';

interface PublicJob extends Partial<Job> {
    company_name?: string;
    company_logo?: string;
}

interface JobCardProps {
    job: PublicJob;
}

export default function JobCard({ job }: JobCardProps) {
    const { openApplyModal } = useUIStore();
    const isExpired = Boolean(job.deadline && new Date(job.deadline).getTime() < Date.now());

    const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number, isExpired: boolean } | null>(null);
    const [showCountdownToggle, setShowCountdownToggle] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!job.deadline || isExpired) return;
        const update = () => setTimeLeft(getCountdownParts(job.deadline!));
        update();
        const intv = setInterval(update, 1000);
        return () => clearInterval(intv);
    }, [job.deadline, isExpired]);

    useEffect(() => {
        if (!job.deadline || isExpired) return;
        const toggleIntv = setInterval(() => {
            setShowCountdownToggle(prev => !prev);
        }, 10000);
        return () => clearInterval(toggleIntv);
    }, [job.deadline, isExpired]);

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!job?.id) return;
        const link = `${window.location.origin}${ROUTES.PUBLIC_JOB_DETAIL(job.id)}`;
        navigator.clipboard.writeText(link);
        toast.success('Đã sao chép link công việc!');
    };

    return (
        <div className={`relative bg-white dark:bg-slate-900 border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group font-sans flex flex-col sm:flex-row p-4 gap-4 ${job.is_hot
            ? 'border-orange-200 dark:border-orange-500/30 hover:border-orange-400 dark:hover:border-orange-500'
            : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500'
            }`}>
            {/* Nếu là Job Hot -> Decor nhẹ viền trái */}
            {job.is_hot && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-l-xl"></div>
            )}

            {/* Khối 1: Logo Công ty (Bên trái) */}
            <Link href={ROUTES.PUBLIC_COMPANY_DETAIL(job.company_id!)} className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center overflow-hidden p-1 hover:opacity-80 transition-opacity">
                {job.company_logo ? (
                    <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-contain" />
                ) : (
                    <Building2 className="w-8 h-8 text-slate-300" />
                )}
            </Link>

            {/* Khối 2: Nội dung chính (Giữa) */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                    {/* Tên Job */}
                    <Link href={ROUTES.PUBLIC_JOB_DETAIL(job.id!)} className="block mb-1">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" title={job.title}>
                            {job.title}
                        </h3>
                    </Link>

                    {/* Tên Công ty */}
                    <Link href={ROUTES.PUBLIC_COMPANY_DETAIL(job.company_id!)} className="block mb-3">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-1 hover:text-slate-700 dark:hover:text-slate-300 transition-colors" title={job.company_name}>
                            {job.company_name || 'Công ty Ẩn danh'}
                        </p>
                    </Link>

                    {/* Metadata (Lương, Địa điểm, Cấp bậc) */}
                    <div className="flex flex-wrap gap-2 text-xs font-bold mb-3">
                        {/* Lương */}
                        <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-md">
                            <DollarSign className="w-3.5 h-3.5" /> {formatSalaryRange(job.salary)}
                        </span>

                        {/* Địa điểm */}
                        {(job.location?.province_name || job.location?.country) && (
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md flex items-center gap-1 max-w-37.5 truncate" title={job.location.province_name}>
                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                {job.location.country && job.location.country !== 'Việt Nam'
                                    ? job.location.country
                                    : job.location.province_name}
                            </span>
                        )}

                        {/* Cấp bậc/Kinh nghiệm */}
                        {job.job_level && (
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md flex items-center gap-1">
                                <Briefcase className="w-3.5 h-3.5 shrink-0" /> {job.job_level}
                            </span>
                        )}
                    </div>
                </div>

                {/* Kỹ năng (Tags) */}
                <div className="flex flex-wrap gap-1.5 overflow-hidden h-5.5">
                    {job.required_skills?.slice(0, 4).map((skill: any, i: number) => (
                        <span key={i} className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded truncate max-w-25">
                            {typeof skill === 'string' ? skill : skill.name}
                        </span>
                    ))}
                    {(job.required_skills?.length || 0) > 4 && (
                        <span className="text-[10px] font-bold text-slate-400 flex items-center">
                            +{job.required_skills!.length - 4}
                        </span>
                    )}
                </div>
            </div>

            {/* Khối 3: Hành động (Bên phải) */}
            <div
                className="flex flex-col justify-center shrink-0 sm:w-44 sm:min-h-23 sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-4 mt-3 sm:mt-0"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {job.deadline && !isExpired && showCountdownToggle && !isHovered ? (

                    /* UI ĐỒNG HỒ SỐ */
                    <div className="w-full h-full flex items-center justify-center animate-in fade-in duration-300">
                        <div className="w-full mx-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl py-3 px-3 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300">
                            <span className="block text-center text-[10px] font-bold text-slate-500 mb-2">
                                Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}
                            </span>

                            {timeLeft && !timeLeft.isExpired && (
                                <div
                                    className="flex items-center justify-center gap-1 w-full"
                                    suppressHydrationWarning
                                >
                                    {/* Ngày */}
                                    <div className="flex flex-col items-center">
                                        <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 w-7 h-8 flex items-center justify-center rounded-lg text-sm font-black shadow-sm">
                                            {String(timeLeft.d).padStart(2, '0')}
                                        </div>
                                        <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase">
                                            Ngày
                                        </span>
                                    </div>

                                    <span className="text-blue-300 dark:text-blue-500/60 font-black text-sm">
                                        :
                                    </span>

                                    {/* Giờ */}
                                    <div className="flex flex-col items-center">
                                        <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 w-7 h-8 flex items-center justify-center rounded-lg text-sm font-black shadow-sm">
                                            {String(timeLeft.h).padStart(2, '0')}
                                        </div>
                                        <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase">
                                            Giờ
                                        </span>
                                    </div>

                                    <span className="text-blue-300 dark:text-blue-500/60 font-black text-sm">
                                        :
                                    </span>

                                    {/* Phút */}
                                    <div className="flex flex-col items-center">
                                        <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 w-7 h-8 flex items-center justify-center rounded-lg text-sm font-black shadow-sm">
                                            {String(timeLeft.m).padStart(2, '0')}
                                        </div>
                                        <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase">
                                            Phút
                                        </span>
                                    </div>

                                    <span className="text-blue-300 dark:text-blue-500/60 font-black text-sm">
                                        :
                                    </span>

                                    {/* Giây */}
                                    <div className="flex flex-col items-center">
                                        <div className="bg-blue-600 text-white w-7 h-8 flex items-center justify-center rounded-lg text-sm font-black shadow-md shadow-blue-500/30">
                                            {String(timeLeft.s).padStart(2, '0')}
                                        </div>
                                        <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase">
                                            Giây
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                ) : (

                    /* UI CỤM NÚT HÀNH ĐỘNG */
                    <div className="flex flex-col gap-2 w-full h-full justify-center animate-in fade-in duration-300">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openApplyModal(job.id!, job.title);
                            }}
                            disabled={isExpired}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm font-bold py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/20"
                        >
                            <Send className="w-4 h-4" />
                            {isExpired ? 'Hết hạn' : 'Ứng tuyển'}
                        </button>

                        <div className="flex items-center gap-2 w-full">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                className="flex-1 py-2 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                                title="Lưu tin tuyển dụng"
                            >
                                <Heart className="w-4 h-4" />
                            </button>

                            <button
                                onClick={handleShare}
                                className="flex-1 py-2 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                                title="Chia sẻ công việc"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}