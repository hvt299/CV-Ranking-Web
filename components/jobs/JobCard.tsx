'use client';

import Link from 'next/link';
import {
    MapPin,
    Briefcase,
    Heart,
    Send,
    Building2,
    DollarSign,
    Share2,
    Clock,
    Flame,
    GraduationCap,
    Timer,
} from 'lucide-react';
import { Job } from '@/types';
import { formatSalaryRange, getDeadlineCountdown } from '@/utils/format';
import toast from 'react-hot-toast';
import { useUIStore } from '@/store/useUIStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ROUTES } from '@/constants/routes';
import { JOB_BADGE_CONFIG } from '@/utils/tier-colors';

interface PublicJob extends Partial<Job> {
    company_name?: string;
    company_logo?: string;
}

interface JobCardProps {
    job: PublicJob;
    viewMode: 'list' | 'grid';
}

export default function JobCard({ job, viewMode }: JobCardProps) {
    const { openApplyModal } = useUIStore();
    const { user } = useAuthStore();

    const isExpired = Boolean(
        job.deadline &&
        new Date(job.deadline).getTime() < Date.now()
    );

    const statusBadge = isExpired
        ? JOB_BADGE_CONFIG.expired
        : JOB_BADGE_CONFIG.active;

    const hotBadge = JOB_BADGE_CONFIG.hot;

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!job?.id) return;

        const link = `${window.location.origin}${ROUTES.PUBLIC_JOB_DETAIL(job.id)}`;

        navigator.clipboard.writeText(link);
        toast.success('Đã sao chép link công việc!');
    };

    const handleApply = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (user && user.role !== 'applicant') {
            toast.error(
                'Tài khoản Nhà tuyển dụng không thể ứng tuyển. Vui lòng đổi tài khoản!',
                { id: 'role_error' }
            );
            return;
        }

        if (!job.id || !job.title) {
            toast.error('Dữ liệu công việc chưa sẵn sàng, vui lòng thử lại!', {
                id: 'job_data_error',
            });
            return;
        }

        openApplyModal(job.id, job.title);
    };

    const CompanyLogo = () => (
        <Link
            href={ROUTES.PUBLIC_COMPANY_DETAIL(job.company_id!)}
            onClick={(e) => e.stopPropagation()}
            className={`relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-white shadow-sm dark:border-slate-800 sm:h-20 sm:w-20 ${job.company_logo
                ? 'bg-white'
                : 'bg-slate-50 dark:bg-slate-800'
                }`}
        >
            {job.company_logo ? (
                <img
                    src={job.company_logo}
                    alt={job.company_name || 'Company'}
                    className="h-full w-full object-contain p-1.5"
                    loading="lazy"
                />
            ) : (
                <Building2 className="h-8 w-8 text-slate-300" />
            )}
        </Link>
    );

    const JobInfo = () => (
        <div className="min-w-0 flex-1">
            {/* Status + HOT */}
            <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                <span
                    className={`flex items-center gap-1 rounded-md border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                >
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${statusBadge.dot || ''
                            }`}
                    />
                    {statusBadge.label}
                </span>

                {job.is_hot && !isExpired && (
                    <span
                        className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${hotBadge.bg} ${hotBadge.text} ${hotBadge.border} ${hotBadge.glow}`}
                    >
                        <Flame className="h-3 w-3" />
                        {hotBadge.label}
                    </span>
                )}
            </div>

            {/* Title */}
            <Link
                href={ROUTES.PUBLIC_JOB_DETAIL(job.id!)}
                className="group/title block mb-1.5"
            >
                <h3
                    className="line-clamp-2 text-base font-bold leading-tight text-slate-900 transition-colors group-hover/title:text-primary-600 dark:text-white dark:group-hover/title:text-primary-400 sm:text-lg"
                    title={job.title}
                >
                    {job.title}
                </h3>
            </Link>

            {/* Company */}
            <Link
                href={ROUTES.PUBLIC_COMPANY_DETAIL(job.company_id!)}
                onClick={(e) => e.stopPropagation()}
                className="mb-3 block"
            >
                <p
                    className="line-clamp-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                    title={job.company_name}
                >
                    {job.company_name || 'Công ty Ẩn danh'}
                </p>
            </Link>

            {/* Main Metadata */}
            <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs font-bold">
                {/* Salary */}
                <span className="flex min-w-0 max-w-full items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1.5 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <DollarSign className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                        {formatSalaryRange(job.salary)}
                    </span>
                </span>

                {/* Location */}
                {(job.location?.province_name || job.location?.country) && (
                    <span
                        className="flex max-w-37.5 items-center gap-1 truncate rounded-md bg-slate-100 px-2.5 py-1.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        title={
                            [
                                job.location?.street_address,
                                job.location?.ward_name,
                                job.location?.district_name,
                                job.location?.province_name,
                            ]
                                .filter(Boolean)
                                .join(', ') || undefined
                        }
                    >
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                        <span className="truncate">
                            {job.location.country &&
                                job.location.country !== 'Việt Nam'
                                ? job.location.country
                                : job.location.province_name || 'Toàn quốc'}
                        </span>
                    </span>
                )}

                {/* Job Level */}
                {job.job_level && (
                    <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        <Briefcase className="h-3.5 w-3.5 shrink-0 text-primary-500" />
                        <span className="truncate">{job.job_level}</span>
                    </span>
                )}
            </div>

            {/* Additional Metadata */}
            <div className="mb-3 grid grid-cols-1 gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 sm:grid-cols-2">
                {job.work_mode && (
                    <div className="flex min-w-0 items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span className="truncate">{job.work_mode}</span>
                    </div>
                )}

                {job.employment_type && (
                    <div className="flex min-w-0 items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                        <span className="truncate">
                            {job.employment_type}
                        </span>
                    </div>
                )}

                <div className="flex min-w-0 items-center gap-1.5">
                    <Timer className="h-3.5 w-3.5 shrink-0 text-violet-500" />
                    <span className="truncate">
                        {job.min_yoe
                            ? `Tối thiểu ${job.min_yoe} năm kinh nghiệm`
                            : 'Không yêu cầu kinh nghiệm'}
                    </span>
                </div>

                {job.education?.min_level && (
                    <div className="flex min-w-0 items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                        <span className="truncate">
                            {job.education.min_level}
                        </span>
                    </div>
                )}
            </div>

            {/* Deadline */}
            <div
                className={`mb-3 flex items-center gap-1.5 text-[11px] font-bold ${isExpired
                    ? 'text-rose-500'
                    : 'text-amber-600 dark:text-amber-500'
                    }`}
            >
                <Clock className="h-3.5 w-3.5 shrink-0" />

                <span className="truncate">
                    Hạn nộp:{' '}
                    {job.deadline
                        ? getDeadlineCountdown(job.deadline)
                        : 'Không thời hạn'}
                </span>
            </div>

            {/* Skills */}
            {job.required_skills && job.required_skills.length > 0 && (
                <div className="flex max-h-7 flex-wrap gap-1.5 overflow-hidden">
                    {job.required_skills
                        .slice(0, 4)
                        .map((skill: any, index: number) => (
                            <span
                                key={index}
                                className="max-w-27.5 truncate rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                                title={
                                    typeof skill === 'string'
                                        ? skill
                                        : skill.name
                                }
                            >
                                {typeof skill === 'string'
                                    ? skill
                                    : skill.name}
                            </span>
                        ))}

                    {job.required_skills.length > 4 && (
                        <span className="flex items-center px-1 text-[10px] font-bold text-slate-400">
                            +{job.required_skills.length - 4}
                        </span>
                    )}
                </div>
            )}
        </div>
    );

    const ActionButtons = ({ grid = false }: { grid?: boolean }) => (
        <div
            className={
                grid
                    ? 'mt-5 w-full border-t border-slate-100 pt-4 dark:border-slate-800'
                    : 'mt-3 flex shrink-0 flex-row justify-center gap-2 sm:mt-0 sm:w-36 sm:flex-col sm:border-l sm:border-slate-100 sm:pl-4 sm:pt-0 dark:sm:border-slate-800'
            }
        >
            {/* Apply */}
            <button
                onClick={handleApply}
                disabled={isExpired}
                className={`w-full rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${isExpired
                    ? 'cursor-not-allowed bg-slate-300 text-slate-500 dark:bg-slate-700'
                    : 'bg-primary-600 text-white shadow-sm shadow-primary-500/20 hover:bg-primary-700'
                    } flex items-center justify-center gap-1.5`}
            >
                <Send className="h-4 w-4" />
                {isExpired ? 'Hết hạn' : 'Ứng tuyển'}
            </button>

            {/* Save + Share */}
            <div
                className={`flex w-full items-center gap-2 ${grid ? 'mt-3' : ''
                    }`}
            >
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    className="group/btn flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white py-2.5 text-slate-400 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-rose-500/20 dark:hover:bg-rose-500/10"
                    title="Lưu tin tuyển dụng"
                    type="button"
                >
                    <Heart className="h-4 w-4 transition-colors group-hover/btn:fill-rose-500/20" />
                </button>

                <button
                    onClick={handleShare}
                    className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white py-2.5 text-slate-400 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-primary-500/20 dark:hover:bg-primary-500/10"
                    title="Chia sẻ công việc"
                    type="button"
                >
                    <Share2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );

    return (
        <div
            className={`group/card relative overflow-visible rounded-2xl border bg-white font-sans shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 dark:bg-slate-900 ${viewMode === 'grid'
                ? 'p-4'
                : 'flex gap-4 p-4'
                } ${job.is_hot && !isExpired
                    ? 'border-orange-200/70 border-t-4 border-t-orange-500 hover:border-orange-300 dark:border-slate-800 dark:border-t-orange-500 dark:hover:border-orange-500/40'
                    : 'border-slate-200 border-t-4 border-t-primary-500 hover:border-primary-300 dark:border-slate-800 dark:border-t-primary-500 dark:hover:border-primary-500'
                }`}
        >
            {viewMode === 'grid' ? (
                <>
                    {/* GRID */}
                    <div className="flex min-w-0 items-start gap-4">
                        <CompanyLogo />
                        <JobInfo />
                    </div>

                    <ActionButtons grid />
                </>
            ) : (
                <>
                    {/* LIST */}
                    <CompanyLogo />

                    <JobInfo />

                    <ActionButtons />
                </>
            )}
        </div>
    );
}