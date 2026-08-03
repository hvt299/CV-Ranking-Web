'use client';

import Link from 'next/link';
import { MapPin, Briefcase, Heart, Send } from 'lucide-react';
import { Job } from '@/types';
import { formatSalaryRange } from '@/utils/format';
import { useApplyModal } from '@/context/ApplyModalContext';

interface PublicJob extends Partial<Job> {
    company_name?: string;
    company_logo?: string;
}

interface JobCardProps {
    job: PublicJob;
}

export default function JobCard({ job }: JobCardProps) {
    const { openApplyModal } = useApplyModal();
    const isExpired = Boolean(job.deadline && new Date(job.deadline).getTime() < Date.now());

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
            <Link href={`/companies/${job.company_id}`} className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-white border border-slate-100 dark:border-slate-800 rounded-lg flex items-center justify-center overflow-hidden hover:opacity-80 transition-opacity">
                {job.company_logo ? (
                    <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-contain p-1" />
                ) : (
                    <div className="w-full h-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400 text-xl">
                        {job.company_name?.charAt(0) || 'C'}
                    </div>
                )}
            </Link>

            {/* Khối 2: Nội dung chính (Giữa) */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                    {/* Tên Job */}
                    <Link href={`/careers/${job.id}`} className="block mb-1">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" title={job.title}>
                            {job.title}
                        </h3>
                    </Link>

                    {/* Tên Công ty */}
                    <Link href={`/companies/${job.company_id}`} className="block mb-3">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-1 hover:text-slate-700 dark:hover:text-slate-300 transition-colors" title={job.company_name}>
                            {job.company_name || 'Công ty Ẩn danh'}
                        </p>
                    </Link>

                    {/* Metadata (Lương, Địa điểm, Cấp bậc) */}
                    <div className="flex flex-wrap gap-2 text-xs font-semibold mb-3">
                        {/* Lương */}
                        <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-md">
                            {formatSalaryRange(job.salary)}
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
            <div className="flex sm:flex-col items-center justify-between sm:justify-start gap-3 shrink-0 sm:w-35 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-4 mt-3 sm:mt-0">

                {/* Nút Ứng tuyển */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openApplyModal(job.id!, job.title);
                    }}
                    disabled={isExpired}
                    className="flex-1 sm:w-full w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm font-bold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/20"
                >
                    <Send className="w-4 h-4" /> {isExpired ? 'Hết hạn' : 'Ứng tuyển'}
                </button>

                <div className="flex items-center gap-2 w-full justify-end sm:justify-center">
                    {/* Nút Lưu (Thả tim) */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // TODO: Toggle Trạng thái Lưu
                        }}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        title="Lưu tin tuyển dụng"
                    >
                        <Heart className="w-4 h-4" />
                    </button>

                    {/* Cập nhật thời gian */}
                    {job.deadline && (
                        <span className="text-[10px] font-bold text-slate-400 sm:text-center w-full block truncate sm:block">
                            Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}