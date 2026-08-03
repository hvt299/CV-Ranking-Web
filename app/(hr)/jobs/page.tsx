'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Plus, Search, Edit2, Trash2, Briefcase, Calendar,
    MapPin, Filter, Clock, Users, ArrowUpRight, Flame
} from 'lucide-react';
import { useJobList, useJobRanking } from '@/features/job/useJob';
import { JOB_LEVELS, EMPLOYMENT_TYPES, WORK_MODES } from '@/constants/job.constants';

function JobCardItem({ job, deleteJob }: { job: any, deleteJob: (id: string) => void }) {
    const { candidates, isLoading: isRankingLoading } = useJobRanking(job.id);
    const applicantCount = candidates.length;

    const isClosed = job.status === 'closed';
    const isExpired = job.deadline && new Date(job.deadline).getTime() < new Date().getTime();
    const isActive = !isClosed && !isExpired;

    return (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-xl hover:shadow-primary-500/10 transition-all flex flex-col group relative overflow-hidden">

            {/* Status Header & Hot Badge */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : isClosed ? 'bg-rose-500' : 'bg-amber-500'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-emerald-600' : isClosed ? 'text-rose-600' : 'text-amber-600'}`}>
                            {isActive ? 'Đang mở' : isClosed ? 'Đã đóng' : 'Hết hạn'}
                        </span>
                    </div>

                    {/* BADGE: JOB HOT */}
                    {job.is_hot && (
                        <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ml-1 shadow-sm">
                            <Flame className="w-3 h-3" /> Hot
                        </div>
                    )}
                </div>

                {/* Action Menu */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/jobs/edit/${job.id}`} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors" title="Chỉnh sửa">
                        <Edit2 className="w-4 h-4" />
                    </Link>
                    <button onClick={() => deleteJob(job.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors" title="Xóa chiến dịch">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Info */}
            <Link href={`/jobs/${job.id}`} className="block flex-1 group/title mb-4">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-2 leading-snug group-hover/title:text-primary-600 transition-colors" title={job.title}>
                    {job.title}
                </h3>
                <div className="flex items-center gap-3 mt-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.job_level}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.employment_type}</span>
                </div>
            </Link>

            {/* Footer Stats */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Ứng viên</span>
                        <span className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-primary-500" />
                            {isRankingLoading ? (
                                <span className="w-3 h-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin ml-1"></span>
                            ) : (
                                applicantCount
                            )}
                        </span>
                    </div>
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Hạn nộp</span>
                        <span className={`text-sm font-black flex items-center gap-1 ${isExpired ? 'text-amber-500' : 'text-slate-800 dark:text-white'}`}>
                            <Calendar className="w-3.5 h-3.5" />
                            {job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : 'N/A'}
                        </span>
                    </div>
                </div>

                <Link href={`/jobs/${job.id}`} className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 dark:group-hover:bg-primary-900/30 transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}

export default function JobsListPage() {
    const { jobs, isLoading, deleteJob } = useJobList();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterMode, setFilterMode] = useState('');

    const filteredJobs = jobs.filter(job => {
        const matchSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchLevel = filterLevel === '' || job.job_level === filterLevel;
        const matchType = filterType === '' || job.employment_type === filterType;
        const matchMode = filterMode === '' || job.work_mode === filterMode;
        return matchSearch && matchLevel && matchType && matchMode;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-20">
            {/* KHỐI 1: HEADER & ACTIONS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Chiến dịch Tuyển dụng</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Quản lý các Job Description và phễu ứng viên của doanh nghiệp.</p>
                </div>
                <Link
                    href="/jobs/create"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-primary-500/20"
                >
                    <Plus className="w-4 h-4" /> Tạo chiến dịch mới
                </Link>
            </div>

            {/* KHỐI 2: FILTER & SEARCH */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên chiến dịch..."
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-700 dark:text-white text-sm font-medium focus:border-primary-500 transition-colors shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-3">
                    <div className="relative min-w-35 flex-1">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            className="w-full pl-9 pr-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none cursor-pointer focus:border-primary-500 shadow-sm"
                            value={filterLevel}
                            onChange={(e) => setFilterLevel(e.target.value)}
                        >
                            <option value="">Tất cả Cấp bậc</option>
                            {JOB_LEVELS.map(level => <option key={level.value} value={level.value}>{level.label}</option>)}
                        </select>
                    </div>
                    <div className="relative min-w-35 flex-1">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            className="w-full pl-9 pr-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none cursor-pointer focus:border-primary-500 shadow-sm"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="">Tất cả Loại hình</option>
                            {EMPLOYMENT_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                        </select>
                    </div>
                    <div className="relative min-w-35 flex-1">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            className="w-full pl-9 pr-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none cursor-pointer focus:border-primary-500 shadow-sm"
                            value={filterMode}
                            onChange={(e) => setFilterMode(e.target.value)}
                        >
                            <option value="">Tất cả Hình thức</option>
                            {WORK_MODES.map(mode => <option key={mode.value} value={mode.value}>{mode.label}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* KHỐI 3: DANH SÁCH JOB CARDS */}
            {isLoading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
            ) : filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.map((job) => (
                        <JobCardItem key={job.id} job={job} deleteJob={deleteJob} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
                        <Briefcase className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white">Chưa có chiến dịch nào</h3>
                    <p className="text-sm text-slate-500 mt-1 mb-6 text-center max-w-sm">Bắt đầu thu hút nhân tài bằng cách tạo chiến dịch tuyển dụng đầu tiên của bạn.</p>
                    <Link href="/jobs/create" className="px-6 py-2.5 bg-primary-600 text-white font-bold text-sm rounded-xl hover:bg-primary-700 transition-colors">
                        + Tạo Job Mới
                    </Link>
                </div>
            )}
        </div>
    );
}