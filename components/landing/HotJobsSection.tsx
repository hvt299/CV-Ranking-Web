'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Flame, ChevronRight, ChevronLeft, MapPin, Building2, DollarSign } from 'lucide-react';
import { Job } from '@/types';
import { formatSalaryRange } from '@/utils/format';

interface HotJobsSectionProps {
    jobs: Job[];
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

const HotJobItem = ({ job }: { job: Partial<Job> & { company_name?: string, company_logo?: string } }) => (
    <Link
        href={`/careers/${job.id}`}
        className="group block relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-orange-100 dark:border-orange-500/20 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-orange-500/10 overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 blur-2xl group-hover:bg-orange-500/20 transition-colors pointer-events-none" />

        <div className="relative z-10 flex gap-4">
            {/* Logo */}
            <div className="w-16 h-16 rounded-xl bg-white border border-slate-100 dark:border-slate-800 p-1 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                {job.company_logo ? (
                    <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-contain" />
                ) : (
                    <Building2 className="w-8 h-8 text-slate-300" />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {job.title}
                    </h3>
                    <span className="flex items-center gap-1 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] font-black px-2 py-0.5 rounded-full uppercase shrink-0">
                        <Flame className="w-3 h-3" /> Hot
                    </span>
                </div>

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate mb-3">
                    {job.company_name || 'Công ty Ẩn danh'}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-xs font-bold mt-auto">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
                        <DollarSign className="w-3.5 h-3.5" /> {formatSalaryRange(job.salary)}
                    </span>
                    {(job.location?.province_name || job.location?.country) && (
                        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md truncate max-w-30">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">
                                {job.location.country && job.location.country !== 'Việt Nam' ? job.location.country : job.location.province_name}
                            </span>
                        </span>
                    )}
                </div>
            </div>
        </div>
    </Link>
);

export default function HotJobsSection({ jobs }: HotJobsSectionProps) {
    const hotJobs = jobs.filter(job => job.is_hot).slice(0, 6);

    if (!hotJobs || hotJobs.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-slate-50 dark:bg-[#050505] transition-colors font-sans border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                            Cơ hội{' '}
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-rose-500">
                                Việc Làm Hot
                            </span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
                            Những vị trí có mức đãi ngộ tốt nhất đang chờ đón bạn.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                            <span>Sắp xếp theo:</span>
                            <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 outline-none focus:border-orange-500">
                                <option value="default">Mặc định</option>
                                <option value="salary_desc">Lương cao nhất</option>
                                <option value="latest">Mới cập nhật</option>
                            </select>
                        </div>
                        <Link href="/careers?is_hot=true" className="hidden md:flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors bg-orange-50 dark:bg-orange-500/10 px-5 py-2.5 rounded-full">
                            Xem tất cả <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    {hotJobs.map((job) => (
                        <motion.div key={job.id} variants={itemVariants}>
                            <HotJobItem job={job} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Slider Phân trang */}
                <div className="mt-10 flex items-center justify-center gap-4">
                    <button className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-500/10 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
                        <span className="text-orange-600 dark:text-orange-500">1</span> / 10 trang
                    </div>
                    <button className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-500/10 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}