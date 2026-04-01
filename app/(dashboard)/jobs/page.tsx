'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Plus, Search, Edit2, Trash2,
    ExternalLink, Briefcase, Calendar, Users, Building2, MapPin
} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Job {
    id: string;
    title: string;
    company_name: string;
    work_mode: string;
    required_skills: { name: string; weight: number; min_years: number }[];
    created_at: string;
    status: string;
}

export default function JobsListPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

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
        if (!confirm("Cảnh báo: Xóa chiến dịch này sẽ xóa toàn bộ CV bên trong. Bạn chắc chứ?")) return;
        try {
            await api.delete(`/jobs/${id}`);
            toast.success("Đã xóa chiến dịch thành công");
            setJobs(jobs.filter(job => job.id !== id));
        } catch (error) {
            toast.error("Lỗi khi xóa chiến dịch");
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Chiến dịch tuyển dụng</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Quản lý các Job Description và đánh giá ứng viên</p>
                </div>
                <Link
                    href="/jobs/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30"
                >
                    <Plus className="w-5 h-5" /> Tạo chiến dịch mới
                </Link>
            </div>

            {/* Bộ lọc */}
            <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên Job hoặc Công ty..."
                        className="w-full pl-12 pr-4 py-3 bg-transparent outline-none text-slate-700 dark:text-white font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Danh sách */}
            {isLoading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
            ) : filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredJobs.map((job) => (
                        <div key={job.id} className="group bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all flex flex-col justify-between h-full">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-lg">
                                        {job.status || 'OPEN'}
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/jobs/edit/${job.id}`} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-amber-600"><Edit2 className="w-4 h-4" /></Link>
                                        <button onClick={() => handleDelete(job.id)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-2 line-clamp-1">{job.title}</h3>
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                        <Building2 className="w-4 h-4" /> {job.company_name}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                        <MapPin className="w-4 h-4" /> {job.work_mode}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                    <Calendar className="w-4 h-4" /> {new Date(job.created_at).toLocaleDateString('vi-VN')}
                                </div>
                                <Link href={`/jobs/${job.id}`} className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 px-4 py-2 rounded-xl transition-colors">
                                    Mở Leaderboard <ExternalLink className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-slate-500">Chưa có chiến dịch nào. Hãy tạo mới nhé!</div>
            )}
        </div>
    );
}