'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
        opacity: 1, y: 0, scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 }
    }
};

export default function HotJobsSection({ jobs, onScrollToJobs }: HotJobsSectionProps) {
    const router = useRouter();
    const hotJobs = jobs.filter(job => job.is_hot);

    if (!hotJobs || hotJobs.length === 0) return null;

    return (
        <section id="hot-jobs" className="py-24 px-6 relative bg-surface dark:bg-slate-900/30 transition-colors">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                            Cơ hội{' '}
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-rose-500">
                                Việc Làm Hot
                            </span>
                        </h2>
                        <p className="text-text-muted text-lg font-medium">
                            Những vị trí có mức đãi ngộ tốt nhất đang chờ đón bạn.
                        </p>
                    </div>

                    <Link
                        href="/careers"
                        className="hidden md:flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-colors bg-primary-50 dark:bg-blue-900/20 px-5 py-2.5 rounded-full"
                    >
                        Xem tất cả <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {hotJobs.map((job) => {
                        const isClosedManually = job.status === 'closed';
                        const isExpired = job.deadline && new Date(job.deadline).getTime() < Date.now();

                        let badgeColor = 'bg-success-100 text-success-700 dark:bg-emerald-900/40 dark:text-emerald-400';
                        let statusText = 'ĐANG MỞ TƯYỂN';

                        if (isClosedManually) {
                            badgeColor = 'bg-error-100 text-error-700 dark:bg-red-900/40 dark:text-red-400';
                            statusText = 'ĐÃ ĐÓNG';
                        } else if (isExpired) {
                            badgeColor = 'bg-warning-100 text-warning-700 dark:bg-amber-900/40 dark:text-amber-400';
                            statusText = 'HẾT HẠN';
                        }

                        return (
                            <motion.div
                                key={job.id}
                                variants={cardVariants}
                                onClick={() => router.push(`/careers/${job.id}`)}
                                className="cursor-pointer bg-white dark:bg-slate-900 border border-border p-7 rounded-4xl hover:border-hot-400 shadow-card hover:shadow-hot transition-all flex flex-col h-full relative group overflow-hidden"
                            >
                                {/* Glow Effect */}
                                <div className="absolute top-0 right-0 w-48 h-48 bg-hot-500/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                {/* Ribbon */}
                                <div className="absolute -right-12 top-6 bg-hot-500 text-white text-[11px] font-black py-1.5 w-40 text-center shadow-lg rotate-45 z-10 tracking-widest uppercase flex items-center justify-center gap-1">
                                    <Flame className="w-3.5 h-3.5" />
                                    HOT
                                </div>

                                <div className="relative z-20 flex flex-col flex-1">
                                    {/* Status */}
                                    <div className={`inline-flex w-fit mb-5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${badgeColor}`}>
                                        {statusText}
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-black text-xl pr-16 leading-tight line-clamp-2 text-text dark:text-white group-hover:text-hot-600 transition-colors">
                                        {job.title}
                                    </h3>

                                    <div className="space-y-4 mt-4 mb-8">
                                        {/* Company */}
                                        <div className="flex items-start gap-2 text-sm text-text-muted font-bold">
                                            <Building2 className="w-4.5 h-4.5 text-text-subtle shrink-0" />
                                            <span className="line-clamp-1">{job.company_name}</span>
                                        </div>

                                        {/* Location & Salary */}
                                        <div className="flex items-center gap-4 text-sm font-bold text-text">
                                            <div className="flex items-center gap-1.5 text-text-muted bg-surface-hover px-3 py-1.5 rounded-lg border border-border">
                                                <MapPin className="w-4 h-4" />
                                                {/* FIX: Thay thế city bằng province_name hoặc country */}
                                                {job.location?.country && job.location.country !== 'Việt Nam'
                                                    ? job.location.country
                                                    : (job.location?.province_name || 'Toàn quốc')}
                                            </div>

                                            <div className="flex items-center gap-1.5 text-success-600 bg-success-50 px-3 py-1.5 rounded-lg border border-success-100 dark:bg-success-900/30 dark:border-success-700/50">
                                                <DollarSign className="w-4 h-4" />
                                                {job.salary?.min_salary && job.salary?.max_salary
                                                    ? `${job.salary.min_salary / 1000000} - ${job.salary.max_salary / 1000000} Tr`
                                                    : 'Thỏa thuận'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-5 border-t border-border flex items-center justify-between gap-3 mt-auto relative z-20">
                                    <div className={`flex items-center gap-1.5 text-xs font-bold ${isExpired ? 'text-warning-500' : 'text-text-subtle'}`}>
                                        <Calendar className="w-4 h-4" />
                                        <span>{job.deadline ? `Hạn nộp: ${new Date(job.deadline).toLocaleDateString('vi-VN')}` : 'Không thời hạn'}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm font-bold text-text-subtle group-hover:text-hot-600 transition-colors">
                                        Xem chi tiết <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}