'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import {
    ArrowRight,
    MapPin,
    Building2,
    DollarSign,
    Clock,
    Briefcase,
    Flame,
    Users,
    Calendar
} from 'lucide-react';
import { Job } from '@/types';

interface HotJobsSectionProps {
    jobs: Job[];
    onScrollToJobs: () => void;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

export default function HotJobsSection({ jobs, onScrollToJobs }: HotJobsSectionProps) {
    if (!jobs || jobs.length === 0) return null;

    return (
        <section id="hot-jobs" className="py-32 px-6 relative">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                            Cơ hội{' '}
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-rose-500">
                                Việc Làm Hot
                            </span>
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                            Những vị trí có mức đãi ngộ tốt nhất đang mở tuyển.
                        </p>
                    </div>

                    <button
                        onClick={onScrollToJobs}
                        className="hidden md:flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        Xem tất cả <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {jobs.map((job) => {
                        const isClosedManually = job.status === 'closed';
                        const isExpired =
                            job.deadline &&
                            new Date(job.deadline).getTime() < Date.now();

                        let badgeColor = 'bg-emerald-50 text-emerald-600';
                        let statusText = 'ĐANG MỞ';

                        if (isClosedManually) {
                            badgeColor = 'bg-rose-50 text-rose-600';
                            statusText = 'ĐÃ ĐÓNG';
                        } else if (isExpired) {
                            badgeColor = 'bg-amber-50 text-amber-600';
                            statusText = 'HẾT HẠN';
                        }

                        return (
                            <motion.div
                                key={job.id}
                                variants={cardVariants}
                                className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl hover:border-blue-400 dark:hover:border-slate-600 shadow-sm hover:shadow-xl transition-all flex flex-col h-full relative group overflow-hidden"
                            >
                                {/* Glow */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 dark:bg-orange-500/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                {/* Ribbon */}
                                <div className="absolute -right-12 top-6 bg-linear-to-r from-rose-500 to-orange-500 text-white text-[10px] font-black py-1 w-40 text-center shadow-lg rotate-45 z-10 tracking-widest uppercase pointer-events-none opacity-90 flex items-center justify-center gap-1">
                                    <Flame className="w-3 h-3" />
                                    HOT
                                </div>

                                <div className="relative z-20 flex flex-col flex-1">
                                    {/* Status */}
                                    <div
                                        className={`inline-flex w-fit mb-4 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${badgeColor}`}
                                    >
                                        {statusText}
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-bold text-xl pr-20 leading-tight line-clamp-2 text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {job.title}
                                    </h3>

                                    <div className="space-y-3 mt-3 mb-6">
                                        {/* Company */}
                                        <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300 font-bold">
                                            <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                            <span className="line-clamp-2">
                                                {job.company_name}
                                            </span>
                                        </div>

                                        {/* Location + Salary */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                                <MapPin className="w-4 h-4 text-slate-400" />
                                                {job.location?.city || 'Việt Nam'}
                                            </div>

                                            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-black bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                                                <DollarSign className="w-4 h-4" />
                                                {job.salary?.min_salary &&
                                                    job.salary?.max_salary
                                                    ? `${new Intl.NumberFormat(
                                                        'vi-VN'
                                                    ).format(
                                                        job.salary.min_salary /
                                                        1000000
                                                    )} - ${new Intl.NumberFormat(
                                                        'vi-VN'
                                                    ).format(
                                                        job.salary.max_salary /
                                                        1000000
                                                    )} Tr`
                                                    : 'Thỏa thuận'}
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-1">
                                                <Briefcase className="w-3 h-3" />
                                                {job.job_level}
                                            </span>

                                            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-1 border border-blue-100 dark:border-blue-800/50">
                                                <Clock className="w-3 h-3" />
                                                {job.employment_type} •{' '}
                                                {job.work_mode}
                                            </span>

                                            <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-1 border border-purple-100 dark:border-purple-800/50">
                                                <Users className="w-3 h-3" />
                                                SL: {job.headcount || 1}
                                            </span>

                                            <span className="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-1.5 rounded-md text-[11px] font-bold border border-amber-100 dark:border-amber-800/50">
                                                KN:{' '}
                                                {job.min_yoe != null
                                                    ? `${job.min_yoe} năm`
                                                    : 'Không yêu cầu'}
                                            </span>
                                        </div>

                                        {/* Skills */}
                                        <div className="flex flex-wrap gap-2">
                                            {job.required_skills
                                                ?.slice(0, 3)
                                                .map((skill: any, i: number) => (
                                                    <span
                                                        key={i}
                                                        className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1.5 rounded-md text-[11px] font-bold border border-purple-100 dark:border-purple-800/50"
                                                    >
                                                        {typeof skill === 'string'
                                                            ? skill
                                                            : skill.name}
                                                    </span>
                                                ))}

                                            {job.required_skills &&
                                                job.required_skills.length >
                                                3 && (
                                                    <span className="text-[11px] font-bold text-slate-500 px-2 py-1.5">
                                                        +
                                                        {job.required_skills
                                                            .length - 3}
                                                    </span>
                                                )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 mt-auto relative z-20">
                                    <div
                                        className={`flex items-center gap-1.5 text-xs font-bold ${isExpired
                                                ? 'text-amber-500'
                                                : 'text-slate-500'
                                            }`}
                                    >
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>
                                            {job.deadline
                                                ? `Hạn nộp: ${new Date(
                                                    job.deadline
                                                ).toLocaleDateString('vi-VN')}`
                                                : 'Không thời hạn'}
                                        </span>
                                    </div>

                                    <Link
                                        href={`/jobs/${job.id}`}
                                        className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 px-4 py-2 rounded-xl transition-colors"
                                    >
                                        Chi tiết
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}