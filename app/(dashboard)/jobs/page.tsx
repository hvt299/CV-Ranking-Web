'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Plus, Search, Edit2, Trash2,
    ExternalLink, Briefcase, Calendar, Users, Building2, MapPin, Filter
} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Job {
    id: string;
    title: string;
    company_name: string;
    work_mode: string;
    job_level: string;
    status: string;
    created_at: string;
}

export default function JobsListPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('All');
    const [filterMode, setFilterMode] = useState('All');

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/jobs');
            setJobs(res.data);
        } catch (error) {
            toast.error("Không thể tải danh sách công việc");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Cảnh báo: Xóa chiến dịch này sẽ xóa TOÀN BỘ CV bên trong. Bạn chắc chứ?")) return;
        try {
            await api.delete(`/jobs/${id}`);
            toast.success("Đã xóa chiến dịch và CV liên quan");
            setJobs(jobs.filter(job => job.id !== id));
        } catch (error) {
            toast.error("Lỗi khi xóa chiến dịch");
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchLevel = filterLevel === 'All' || job.job_level === filterLevel;
        const matchMode = filterMode === 'All' || job.work_mode === filterMode;

        return matchSearch && matchLevel && matchMode;
    });

    return (
        <div className="space-y-6 max-w-350 mx-auto pb-20">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Chiến dịch tuyển dụng</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Quản lý các Job Description và phễu ứng viên.</p>
                </div>
                <Link
                    href="/jobs/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30"
                >
                    <Plus className="w-5 h-5" /> Tạo chiến dịch mới
                </Link>
            </div>

            {/* BỘ LỌC (FILTERS) */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo Tên vị trí hoặc Công ty..."
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-700 dark:text-white font-medium focus:border-blue-500 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-4">
                    <div className="relative min-w-40">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none cursor-pointer focus:border-blue-500"
                            value={filterLevel}
                            onChange={(e) => setFilterLevel(e.target.value)}
                        >
                            <option value="All">Tất cả Cấp bậc</option>
                            <option value="Intern">Intern (Thực tập)</option>
                            <option value="Fresher">Fresher</option>
                            <option value="Junior">Junior</option>
                            <option value="Middle">Middle</option>
                            <option value="Senior">Senior</option>
                            <option value="Manager">Manager</option>
                        </select>
                    </div>
                    <div className="relative min-w-40">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none cursor-pointer focus:border-blue-500"
                            value={filterMode}
                            onChange={(e) => setFilterMode(e.target.value)}
                        >
                            <option value="All">Tất cả Hình thức</option>
                            <option value="Onsite">Onsite</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* DANH SÁCH JOB CARDS */}
            {isLoading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
            ) : filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.map((job) => (
                        <div key={job.id} className="group bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all flex flex-col justify-between h-full relative overflow-hidden">
                            {/* Dải màu trạng thái */}
                            <div className={`absolute top-0 left-0 w-full h-1 ${job.status === 'closed' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>

                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${job.status === 'closed' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                        {job.status === 'closed' ? 'ĐÃ ĐÓNG' : 'ĐANG MỞ'}
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/jobs/edit/${job.id}`} className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 rounded-md text-slate-400 hover:text-amber-600 transition-colors" title="Chỉnh sửa"><Edit2 className="w-4 h-4" /></Link>
                                        <button onClick={() => handleDelete(job.id)} className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 rounded-md text-slate-400 hover:text-rose-600 transition-colors" title="Xóa chiến dịch"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>

                                <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-3 line-clamp-2 leading-tight" title={job.title}>{job.title}</h3>

                                <div className="space-y-2.5 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                        <Building2 className="w-4 h-4 text-slate-400" /> {job.company_name}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                        <MapPin className="w-4 h-4 text-slate-400" /> {job.work_mode} • {job.job_level}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                    <Calendar className="w-3.5 h-3.5" /> {new Date(job.created_at).toLocaleDateString('vi-VN')}
                                </div>
                                <Link href={`/jobs/${job.id}`} className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 px-4 py-2 rounded-xl transition-colors">
                                    Mở Leaderboard <ExternalLink className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300">Không tìm thấy chiến dịch nào</h3>
                    <p className="text-sm text-slate-500 mt-1">Hãy thử thay đổi bộ lọc hoặc tạo chiến dịch mới nhé.</p>
                </div>
            )}
        </div>
    );
}