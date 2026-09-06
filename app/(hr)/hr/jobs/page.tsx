'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Plus, Search, Edit2, Trash2, Briefcase, Calendar,
    MapPin, Filter, Clock, Users, ArrowUpRight, Flame,
    CheckSquare, X, ChevronLeft, ChevronRight, Check, Activity
} from 'lucide-react';
import { useJobList, useJobRanking } from '@/features/job/useJob';
import { JOB_LEVELS, EMPLOYMENT_TYPES, WORK_MODES } from '@/constants/job.constants';
import { ROUTES } from '@/constants/routes';
import { useSubscription } from '@/hooks/useSubscription';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { getJobBadgeConfig, JOB_BADGE_CONFIG } from '@/utils/tier-colors';

function JobCardItem({ job, deleteJob, isSelected, onToggleSelect }: { job: any, deleteJob: (id: string) => void, isSelected: boolean, onToggleSelect: (id: string) => void }) {
    const { candidates, isLoading: isRankingLoading } = useJobRanking(job.id);
    const applicantCount = candidates.length;

    const isClosed = job.status === 'closed';
    const isExpired = job.deadline && new Date(job.deadline).getTime() < new Date().getTime();
    const isActive = !isClosed && !isExpired;

    const statusBadge = getJobBadgeConfig(isActive, isClosed);
    const hotBadge = JOB_BADGE_CONFIG.hot;

    return (
        <div className={`bg-white dark:bg-slate-900 p-5 rounded-3xl border transition-all flex flex-col group relative overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary-500/10 ${isSelected ? 'border-primary-500 ring-1 ring-primary-500' : 'border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600'}`}>

            {/* Status Header & Hot Badge & Checkbox */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onToggleSelect(job.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors z-10 ${isSelected
                            ? 'bg-primary-600 border-primary-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 hover:border-primary-400 bg-white dark:bg-slate-800'
                            }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <div className="flex items-center gap-2">
                        <span
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                            {statusBadge.label}
                        </span>

                        {job.is_hot && (
                            <span
                                className={`flex items-center gap-1 ${hotBadge.bg} ${hotBadge.text} ${hotBadge.border} px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${hotBadge.glow}`}
                            >
                                <Flame className="w-3 h-3" />
                                {hotBadge.label}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={ROUTES.HR_JOB_EDIT(job.id)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors" title="Chỉnh sửa">
                        <Edit2 className="w-4 h-4" />
                    </Link>
                    <button onClick={() => deleteJob(job.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors" title="Xóa chiến dịch">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Info */}
            <Link href={ROUTES.HR_JOB_DETAIL(job.id)} className="block flex-1 group/title mb-4">
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

                <Link href={ROUTES.HR_JOB_DETAIL(job.id)} className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 dark:group-hover:bg-primary-900/30 transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}

export default function JobsListPage() {
    const { jobs, isLoading, deleteJob } = useJobList();

    // Lấy thông tin gói cước của HR để tính toán số lượng Job đang mở / Tối đa
    const { data: myPlanRes } = useSubscription();
    const { data: plansRes } = useSubscriptionPlans('hr');
    const currentPlanCode = myPlanRes?.data?.current_plan_code || 'hr_free';
    const currentPlan = plansRes?.data?.find((p: any) => p.plan_code === currentPlanCode);
    const maxActiveJobs = currentPlan?.features?.max_active_jobs || 1;

    // Đếm số lượng Job đang ở trạng thái OPEN
    const activeJobsCount = jobs.filter(job => job.status === 'open' && (!job.deadline || new Date(job.deadline).getTime() > new Date().getTime())).length;

    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterMode, setFilterMode] = useState('');

    const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;

    const filteredJobs = jobs.filter(job => {
        const matchSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchLevel = filterLevel === '' || job.job_level === filterLevel;
        const matchType = filterType === '' || job.employment_type === filterType;
        const matchMode = filterMode === '' || job.work_mode === filterMode;
        return matchSearch && matchLevel && matchType && matchMode;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterLevel, filterType, filterMode]);

    const paginatedJobs = filteredJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(filteredJobs.length / pageSize);

    const handleToggleSelect = (jobId: string) => {
        setSelectedJobIds(prev => prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]);
    };

    const handleSelectAll = (jobIds: string[]) => {
        if (selectedJobIds.length === jobIds.length) setSelectedJobIds([]);
        else setSelectedJobIds(jobIds);
    };

    const handleBatchDelete = async () => {
        if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedJobIds.length} chiến dịch này? Toàn bộ CV bên trong cũng sẽ bị xóa!`)) return;

        const deletePromises = selectedJobIds.map(id => deleteJob(id));
        await Promise.all(deletePromises);
        setSelectedJobIds([]);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
            {/* KHỐI 1: HEADER & ACTIONS */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex-1">
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Chiến dịch Tuyển dụng</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Quản lý các Job Description và phễu ứng viên của doanh nghiệp.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                    {/* Hiển thị hạn mức Số lượng Chiến dịch */}
                    <div className="bg-info-50 dark:bg-info-500/10 border border-info-100 dark:border-info-500/20 p-2.5 pr-4 rounded-2xl flex items-center gap-3 transition-colors">
                        <div className="w-10 h-10 bg-info-100 dark:bg-info-500/20 text-info-600 dark:text-info-500 flex items-center justify-center rounded-xl shrink-0">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-info-600 dark:text-info-500 uppercase tracking-wider mb-0.5">Chiến dịch đang mở</p>
                            <p className="text-sm font-black text-info-700 dark:text-info-100">
                                <span className={activeJobsCount >= maxActiveJobs ? "text-error-600 dark:text-error-500" : ""}>{activeJobsCount}</span> / {maxActiveJobs} chiến dịch
                            </p>
                        </div>
                    </div>

                    {/* Nút Tạo chiến dịch bị vô hiệu hóa nếu quá hạn mức */}
                    {activeJobsCount >= maxActiveJobs ? (
                        <div className="relative group cursor-not-allowed">
                            <button
                                disabled
                                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-sm font-bold rounded-xl transition-all shadow-sm"
                            >
                                <Plus className="w-4 h-4" /> Tạo chiến dịch mới
                            </button>
                            {/* Tooltip báo lỗi */}
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                Đã đạt giới hạn gói cước
                            </div>
                        </div>
                    ) : (
                        <Link
                            href={ROUTES.HR_JOB_CREATE}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-primary-500/20 shrink-0"
                        >
                            <Plus className="w-4 h-4" /> Tạo chiến dịch mới
                        </Link>
                    )}
                </div>
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

            {/* HEADER KẾT QUẢ & CHỌN TẤT CẢ */}
            <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-4">
                <div className="flex items-center justify-between px-2">
                    <div>
                        {filteredJobs.length > 0 && (
                            <button
                                onClick={() => handleSelectAll(filteredJobs.map(j => j.id))}
                                className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors"
                            >
                                <div
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selectedJobIds.length === filteredJobs.length && filteredJobs.length > 0
                                        ? 'bg-primary-600 border-primary-600 text-white'
                                        : 'border-slate-300 dark:border-slate-600'
                                        }`}
                                >
                                    {selectedJobIds.length === filteredJobs.length && filteredJobs.length > 0 && (
                                        <CheckSquare className="w-3.5 h-3.5" />
                                    )}
                                </div>
                                Chọn tất cả
                            </button>
                        )}
                    </div>

                    <div className="text-sm font-medium text-slate-500">
                        Đã tìm thấy{' '}
                        <span className="text-primary-600 font-bold">
                            {filteredJobs.length}
                        </span>{' '}
                        chiến dịch
                    </div>
                </div>
            </div>

            {/* KHỐI 3: DANH SÁCH JOB CARDS */}
            {isLoading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
            ) : paginatedJobs.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedJobs.map((job) => (
                            <JobCardItem
                                key={job.id}
                                job={job}
                                deleteJob={deleteJob}
                                isSelected={selectedJobIds.includes(job.id)}
                                onToggleSelect={handleToggleSelect}
                            />
                        ))}
                    </div>

                    {/* THÀNH PHẦN PHÂN TRANG (PAGINATION) */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-800">
                            <p className="text-sm font-medium text-slate-500">
                                Hiển thị <span className="font-bold text-slate-800 dark:text-white">{(currentPage - 1) * pageSize + 1}</span> đến <span className="font-bold text-slate-800 dark:text-white">{Math.min(currentPage * pageSize, filteredJobs.length)}</span> trong số <span className="font-bold text-slate-800 dark:text-white">{filteredJobs.length}</span> kết quả
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${currentPage === page ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
                        <Briefcase className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white">Chưa có chiến dịch nào</h3>
                    <p className="text-sm text-slate-500 mt-1 mb-6 text-center max-w-sm">Không tìm thấy kết quả hoặc bạn chưa tạo chiến dịch nào.</p>
                </div>
            )}

            {/* FLOATING BATCH ACTION BAR CHO JOBS */}
            {selectedJobIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white px-6 py-4 rounded-2xl shadow-xl shadow-primary-500/10 border border-slate-200 dark:border-slate-800 flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                {selectedJobIds.length}
                            </div>
                            <span className="text-sm font-medium whitespace-nowrap">Job đang chọn</span>
                        </div>
                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
                        <div className="flex gap-2">
                            <button onClick={handleBatchDelete} className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-600 rounded-xl text-sm font-bold transition-colors whitespace-nowrap text-rose-600 dark:text-rose-400">
                                <Trash2 className="w-4 h-4" /> Xóa tất cả
                            </button>
                            <button onClick={() => setSelectedJobIds([])} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-white ml-2" title="Bỏ chọn">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}