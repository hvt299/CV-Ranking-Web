'use client';

import { useState, useEffect } from 'react';
import { FileText, Briefcase, CheckCircle2, XCircle } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
    'Mới': 'bg-blue-100 text-blue-700',
    'Đang xem xét': 'bg-amber-100 text-amber-700',
    'Phỏng vấn': 'bg-purple-100 text-purple-700',
    'Đề nghị (Offer)': 'bg-indigo-100 text-indigo-700',
    'Trúng tuyển': 'bg-emerald-100 text-emerald-700',
    'Từ chối': 'bg-rose-100 text-rose-700',
};

export default function MyApplicationsPage() {
    const [apps, setApps] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/apply/my-applications')
            .then(res => setApps(res.data))
            .catch(() => toast.error('Không thể tải danh sách hồ sơ'))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 pb-20 space-y-6">
            <div>
                <h1 className="text-3xl font-black text-slate-800 dark:text-white">Hồ sơ đã nộp</h1>
                <p className="text-slate-500 mt-1">Theo dõi trạng thái ứng tuyển của bạn</p>
            </div>

            {apps.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Bạn chưa nộp hồ sơ nào. <a href="/apply" className="text-blue-600 font-bold hover:underline">Tìm việc ngay</a></p>
                </div>
            ) : (
                <div className="space-y-4">
                    {apps.map(app => {
                        const score = app.ai_score?.total_score || 0;
                        const statusColor = STATUS_COLORS[app.status] || 'bg-slate-100 text-slate-700';
                        return (
                            <div key={app.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 dark:text-white">{app.job_title}</h3>
                                            <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1">
                                                <FileText className="w-3.5 h-3.5" /> {app.filename}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                Nộp lúc: {new Date(app.submitted_at).toLocaleString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* AI Score */}
                                        <div className="text-center">
                                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">AI Score</p>
                                            <span className={`text-2xl font-black ${score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                                                {score.toFixed(1)}
                                            </span>
                                            <span className="text-xs text-slate-400">/100</span>
                                        </div>

                                        {/* Status */}
                                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${statusColor}`}>
                                            {app.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Skills breakdown */}
                                {app.ai_score?.matched_skills?.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Kỹ năng phù hợp</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {app.ai_score.matched_skills.map((s: string, i: number) => (
                                                <span key={i} className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" />{s}
                                                </span>
                                            ))}
                                            {app.ai_score.missing_required_skills?.map((s: string, i: number) => (
                                                <span key={i} className="text-[11px] font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded flex items-center gap-1 opacity-75">
                                                    <XCircle className="w-3 h-3" />{s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
