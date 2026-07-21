'use client';

import { useState, useEffect } from 'react';
import { Bot, FileText, Briefcase, Play, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function SelfScorePage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [cvs, setCvs] = useState<any[]>([]);
    const [selectedJob, setSelectedJob] = useState('');
    const [selectedCv, setSelectedCv] = useState('');

    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isScoring, setIsScoring] = useState(false);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        Promise.all([
            api.get('/apply/jobs'),
            api.get('/apply/library')
        ]).then(([jobRes, cvRes]) => {
            setJobs(jobRes.data);
            setCvs(cvRes.data);
        }).catch(() => toast.error('Lỗi tải dữ liệu'))
            .finally(() => setIsLoadingData(false));
    }, []);

    const handleScore = async () => {
        if (!selectedJob || !selectedCv) {
            toast.error('Vui lòng chọn cả Job và CV!');
            return;
        }

        setIsScoring(true);
        setResult(null);
        try {
            const res = await api.post('/apply/self-score', {
                job_id: selectedJob,
                cv_document_id: selectedCv
            });
            setResult(res.data.ai_score);
            toast.success('Chấm điểm thử thành công!');
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Lỗi khi chấm điểm');
        } finally {
            setIsScoring(false);
        }
    };

    if (isLoadingData) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 pb-20 space-y-8">
            <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-black text-slate-800 dark:text-white">Công cụ Self-Score AI</h1>
                <p className="text-slate-500 max-w-xl mx-auto">Kiểm tra độ phù hợp của CV hiện tại với chiến dịch tuyển dụng trước khi quyết định nộp chính thức. (Kết quả này hoàn toàn bí mật).</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* BƯỚC 1: CHỌN JOB */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><Briefcase className="w-4 h-4" /> 1. Chọn vị trí muốn ứng tuyển</label>
                        <select
                            value={selectedJob} onChange={e => setSelectedJob(e.target.value)}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500"
                        >
                            <option value="">-- Chọn vị trí --</option>
                            {jobs.map(j => <option key={j.id} value={j.id}>{j.title} ({j.company_name})</option>)}
                        </select>
                    </div>

                    {/* BƯỚC 2: CHỌN CV */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><FileText className="w-4 h-4" /> 2. Chọn CV từ Thư viện</label>
                        <select
                            value={selectedCv} onChange={e => setSelectedCv(e.target.value)}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500"
                        >
                            <option value="">-- Chọn CV trong Thư viện --</option>
                            {cvs.map(c => <option key={c.id} value={c.id}>{c.display_name} ({c.filename})</option>)}
                        </select>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={handleScore} disabled={isScoring || !selectedJob || !selectedCv}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black rounded-2xl flex items-center justify-center gap-2 mx-auto w-full md:w-auto shadow-lg shadow-blue-500/30 transition-all"
                    >
                        {isScoring ? 'AI Đang Phân Tích...' : <><Play className="w-5 h-5 fill-white" /> Xem Kết Quả Phân Tích</>}
                    </button>
                </div>
            </div>

            {/* KẾT QUẢ AI */}
            {result && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 animate-in slide-in-from-bottom-4">
                    <h3 className="text-2xl font-black text-center mb-6">Kết Quả Đánh Giá</h3>

                    <div className="flex flex-col md:flex-row gap-8 items-center justify-center border-b border-slate-100 dark:border-slate-700 pb-8">
                        <div className="text-center">
                            <p className="text-slate-500 font-bold uppercase tracking-wider mb-2">Độ Phù Hợp Tổng Thể</p>
                            <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center border-8 ${result.total_score >= 80 ? 'border-emerald-500 text-emerald-600' : result.total_score >= 50 ? 'border-amber-500 text-amber-500' : 'border-rose-500 text-rose-500'}`}>
                                <span className="text-4xl font-black">{result.total_score.toFixed(1)}</span>
                            </div>
                        </div>

                        <div className="w-full max-w-sm space-y-4">
                            <ScoreBar label="Kỹ năng chuyên môn" score={result.score_breakdown.skills_score} color="bg-blue-500" />
                            <ScoreBar label="Phân tích Ngữ nghĩa (AI)" score={result.score_breakdown.nlp_score} color="bg-indigo-500" />
                            <ScoreBar label="Kinh nghiệm" score={result.score_breakdown.experience_score} color="bg-emerald-500" />
                            <ScoreBar label="Trình độ Học vấn" score={result.score_breakdown.education_score} color="bg-amber-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                        <div>
                            <h4 className="font-bold flex items-center gap-2 mb-4 text-emerald-600"><CheckCircle2 className="w-5 h-5" /> Kỹ năng đáp ứng</h4>
                            <div className="flex flex-wrap gap-2">
                                {result.matched_skills.map((s: string, i: number) => <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-200">{s}</span>)}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold flex items-center gap-2 mb-4 text-rose-600"><XCircle className="w-5 h-5" /> Kỹ năng còn thiếu</h4>
                            <div className="flex flex-wrap gap-2">
                                {result.missing_required_skills.length === 0 ? <span className="text-sm text-slate-500">Bạn đã đáp ứng đủ các kỹ năng bắt buộc!</span> : result.missing_required_skills.map((s: string, i: number) => <span key={i} className="px-3 py-1 bg-rose-50 text-rose-700 rounded-lg text-sm font-bold border border-rose-200 opacity-70">{s}</span>)}
                            </div>
                        </div>
                    </div>

                    {result.score_breakdown.penalty_score > 0 && (
                        <div className="mt-6 p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-sm font-bold flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div>
                                <p>Cảnh báo: Hồ sơ bị trừ {result.score_breakdown.penalty_score} điểm.</p>
                                <p className="text-xs font-normal mt-1 opacity-80">Do nghi ngờ chèn text ẩn (keyword stuffing) hoặc chuyển việc quá nhiều lần trong thời gian ngắn.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function ScoreBar({ label, score, color }: { label: string, score: number, color: string }) {
    return (
        <div>
            <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-600 dark:text-slate-400">{label}</span>
                <span>{score.toFixed(1)}/100</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${Math.min(100, score)}%` }}></div>
            </div>
        </div>
    );
}