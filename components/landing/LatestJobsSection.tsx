'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ChevronRight, ChevronLeft, MapPin, Building2, DollarSign } from 'lucide-react';
import { Job } from '@/types';
import { formatSalaryRange } from '@/utils/format';

interface LatestJobsSectionProps {
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

const LatestJobItem = ({ job }: { job: Partial<Job> & { company_name?: string, company_logo?: string } }) => (
    <Link
        href={`/careers/${job.id}`}
        className="group flex items-center gap-4 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-md hover:shadow-blue-500/5"
    >
        {/* Logo */}
        <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-1 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            {job.company_logo ? (
                <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-contain" />
            ) : (
                <Building2 className="w-6 h-6 text-slate-300" />
            )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 py-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                {job.title}
            </h3>

            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate mb-2">
                {job.company_name || 'Công ty Ẩn danh'}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                    <DollarSign className="w-3.5 h-3.5" /> {formatSalaryRange(job.salary)}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                {(job.location?.province_name || job.location?.country) && (
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-0.5 truncate max-w-25">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                            {job.location.country && job.location.country !== 'Việt Nam' ? job.location.country : job.location.province_name}
                        </span>
                    </span>
                )}
            </div>
        </div>

        {/* Mũi tên điều hướng */}
        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
    </Link>
);

export default function LatestJobsSection({ jobs }: LatestJobsSectionProps) {
    const latestJobs = jobs.slice(0, 9);

    if (!latestJobs || latestJobs.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-white dark:bg-[#0a0a0a] transition-colors font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                            Khám phá{' '}
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">
                                Việc Làm Mới Nhất
                            </span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
                            Cập nhật liên tục hàng ngàn cơ hội từ các doanh nghiệp hàng đầu.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                            <span>Sắp xếp theo:</span>
                            <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                                <option value="latest">Mới nhất</option>
                                <option value="salary_desc">Lương cao nhất</option>
                            </select>
                        </div>
                        <Link href="/careers" className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors bg-blue-50 dark:bg-blue-900/20 px-5 py-2.5 rounded-full">
                            Xem tất cả <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {latestJobs.map((job) => (
                        <motion.div key={job.id} variants={itemVariants}>
                            <LatestJobItem job={job} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Slider Phân trang */}
                <div className="mt-10 flex items-center justify-center gap-4">
                    <button className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
                        <span className="text-blue-600 dark:text-blue-400">1</span> / 50 trang
                    </div>
                    <button className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}