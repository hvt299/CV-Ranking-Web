'use client';

import { useState } from 'react';
import { Bot, FileText, Briefcase, AlertTriangle, CheckCircle2, XCircle, ChevronDown, Award, Sparkles, Target, Zap, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import { applicationService } from '@/features/application/application.service';
import { useExploreJobs } from '@/features/application/useApplication';
import { getScoreTheme, getPenaltyReasons } from '@/utils/score';

export default function SelfScorePage() {
    const { jobs, cvLibrary: cvs, isLoading: isLoadingData } = useExploreJobs();

    const [selectedJob, setSelectedJob] = useState('');
    const [selectedCv, setSelectedCv] = useState('');
    const [isScoring, setIsScoring] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleScore = async () => {
        if (!selectedJob || !selectedCv) {
            toast.error('Vui lòng chọn cả Job và CV!');
            return;
        }

        setIsScoring(true);
        setResult(null);
        try {
            const aiScore = await applicationService.selfScore(selectedJob, selectedCv);
            setTimeout(() => {
                setResult(aiScore);
                setIsScoring(false);
                toast.success('Phân tích hoàn tất!');
            }, 1500);
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Lỗi khi chấm điểm. Vui lòng thử lại sau.');
            setIsScoring(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin h-10 w-10 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
            {/* INLINE STYLES FOR SCANNING ANIMATION */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scan-laser {
                    0% { top: -10%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 110%; opacity: 0; }
                }
                @keyframes slide-right {
                    0% { left: -50%; }
                    100% { left: 150%; }
                }
                .animate-scan-laser { animation: scan-laser 2s linear infinite; }
                .animate-slide-right { animation: slide-right 1.5s ease-in-out infinite; }
            `}} />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mb-10">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Tự đánh giá năng lực</h1>
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-linear-to-r from-amber-500 to-orange-500 text-white uppercase tracking-widest shadow-md">
                            Pro
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sử dụng trí tuệ nhân tạo để đối chiếu CV của bạn với JD. Phân tích điểm mạnh, yếu và khả năng trúng tuyển.</p>
                </div>
            </div>

            {/* BỐ CỤC 2 CỘT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* CỘT TRÁI: FORM (5 cols) */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 lg:sticky lg:top-24">
                    <div className="space-y-6">
                        {/* BƯỚC 1: CHỌN JOB */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-primary-500" /> 1. Chọn vị trí muốn ứng tuyển
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedJob} onChange={e => setSelectedJob(e.target.value)}
                                    className="w-full pl-4 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-semibold text-slate-700 dark:text-slate-200 appearance-none cursor-pointer transition-all"
                                >
                                    <option value="" disabled>Vui lòng chọn vị trí</option>
                                    {jobs.map(j => (
                                        <option key={j.id} value={j.id}>{j.title} ({j.company_name})</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </div>
                            </div>
                        </div>

                        {/* BƯỚC 2: CHỌN CV */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary-500" /> 2. Chọn CV từ Thư viện
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedCv} onChange={e => setSelectedCv(e.target.value)}
                                    className="w-full pl-4 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-semibold text-slate-700 dark:text-slate-200 appearance-none cursor-pointer transition-all"
                                >
                                    <option value="" disabled>Vui lòng chọn CV</option>
                                    {cvs.map(c => (
                                        <option key={c.id} value={c.id}>{c.display_name || c.filename}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={handleScore} disabled={isScoring || !selectedJob || !selectedCv}
                                className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-primary-500/20 transition-all active:scale-[0.98]"
                            >
                                {isScoring ? (
                                    <><div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> Đang phân tích...</>
                                ) : (
                                    <><Sparkles className="w-5 h-5" /> Bắt đầu phân tích AI</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: ANIMATION & RESULTS (7 cols) */}
                <div className="lg:col-span-7">

                    {/* TRẠNG THÁI: CHƯA PHÂN TÍCH */}
                    {!isScoring && !result && (
                        <div className="h-full min-h-100 flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-sm">
                            <div className="relative w-32 h-32 mb-6 mx-auto">
                                <div className="absolute inset-0 bg-primary-500/10 blur-xl rounded-full"></div>
                                <Bot className="w-full h-full text-slate-300 dark:text-slate-700 relative z-10" strokeWidth={1} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Chưa có dữ liệu phân tích</h3>
                            <p className="text-slate-500 font-medium max-w-sm mx-auto">Hãy chọn việc làm và CV ở cột bên trái, sau đó nhấn "Bắt đầu phân tích" để AI thực hiện công việc của mình.</p>
                        </div>
                    )}

                    {/* TRẠNG THÁI: ĐANG PHÂN TÍCH (ANIMATION QUÉT CV VÀ JD) */}
                    {isScoring && (
                        <div className="h-full min-h-100 flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-sm relative overflow-hidden">
                            <div className="absolute inset-0 bg-primary-500/5 animate-pulse"></div>

                            <div className="flex items-center justify-center w-full max-w-md relative z-10 gap-4 sm:gap-8">
                                {/* CV Doc */}
                                <div className="w-20 h-28 sm:w-24 sm:h-32 bg-slate-50 dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
                                    <FileText className="w-10 h-10 text-primary-500 mb-2" />
                                    <span className="text-[10px] font-bold text-slate-400">YOUR CV</span>
                                    {/* Laser scan line */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-primary-400 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan-laser" />
                                </div>

                                {/* Connection Line */}
                                <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 relative overflow-hidden rounded-full">
                                    <div className="absolute top-0 left-0 h-full w-1/3 bg-linear-to-r from-transparent via-primary-500 to-transparent animate-slide-right" />
                                </div>

                                {/* Job Description */}
                                <div className="w-20 h-28 sm:w-24 sm:h-32 bg-slate-50 dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
                                    <Briefcase className="w-10 h-10 text-indigo-500 mb-2" />
                                    <span className="text-[10px] font-bold text-slate-400">JOB REQ</span>
                                    {/* Laser scan line with delay */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-scan-laser" style={{ animationDelay: '0.5s' }} />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-10 mb-2">Đang phân tích dữ liệu...</h3>
                            <p className="text-slate-500 font-medium">AI đang trích xuất ngữ nghĩa và đối chiếu kỹ năng.</p>
                        </div>
                    )}

                    {/* TRẠNG THÁI: KẾT QUẢ PHÂN TÍCH */}
                    {!isScoring && result && (() => {
                        const score = result.total_score || 0;
                        const theme = getScoreTheme(score);
                        const breakdown = result.score_breakdown || {};

                        return (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm animate-in slide-in-from-bottom-4 duration-500">

                                <div className="flex items-center gap-2 mb-8 justify-center pb-6 border-b border-slate-100 dark:border-slate-800">
                                    <Award className={`w-6 h-6 ${theme.ring}`} />
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Báo Cáo Phân Tích</h3>
                                </div>

                                {/* Khối Gauge & Các chỉ số */}
                                <div className="flex flex-col md:flex-row gap-10 items-center justify-center mb-8">

                                    {/* Vòng tròn Điểm */}
                                    <div className="text-center shrink-0">
                                        <div className="relative w-40 h-40 mx-auto">
                                            <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 48 48">
                                                <circle cx="24" cy="24" r="20" className={`stroke-current ${theme.bg}`} strokeWidth="4" fill="transparent" />
                                                <circle
                                                    cx="24" cy="24" r="20"
                                                    className={`stroke-current ${theme.ring}`}
                                                    strokeWidth="4" fill="transparent"
                                                    strokeDasharray={2 * Math.PI * 20}
                                                    strokeDashoffset={(2 * Math.PI * 20) - (score / 100) * (2 * Math.PI * 20)}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className={`text-4xl font-black ${theme.ring}`}>{score.toFixed(0)}</span>
                                                <span className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${theme.ring}`}>{theme.label}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4 Thanh Bar chi tiết */}
                                    <div className="w-full max-w-sm space-y-3">
                                        <ScoreRow icon={Target} label="Kỹ năng chuyên môn" score={breakdown.skills_score} colorClass="text-info-600 bg-info-100" />
                                        <ScoreRow icon={Zap} label="Độ khớp Ngữ nghĩa (AI)" score={breakdown.nlp_score} colorClass="text-primary-600 bg-primary-100" />
                                        <ScoreRow icon={Briefcase} label="Kinh nghiệm làm việc" score={breakdown.experience_score} colorClass="text-warning-600 bg-warning-100" />
                                        <ScoreRow icon={GraduationCap} label="Trình độ Học vấn" score={breakdown.education_score} colorClass="text-success-600 bg-success-100" />
                                    </div>
                                </div>

                                {/* Missing & Matched Skills */}
                                <div className="space-y-6 mb-8">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <h4 className="text-sm font-black flex items-center gap-2 mb-3 text-success-600 dark:text-success-400">
                                            <CheckCircle2 className="w-4 h-4" /> Điểm cộng của bạn
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {result.matched_skills && result.matched_skills.length > 0 ? (
                                                result.matched_skills.map((s: string, i: number) => (
                                                    <span key={i} className="px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm">
                                                        {s}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs font-medium text-slate-400 italic">Chưa tìm thấy kỹ năng khớp hoàn toàn.</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <h4 className="text-sm font-black flex items-center gap-2 mb-3 text-error-600 dark:text-error-400">
                                            <XCircle className="w-4 h-4" /> Kỹ năng cần bổ sung
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {result.missing_required_skills && result.missing_required_skills.length > 0 ? (
                                                result.missing_required_skills.map((s: string, i: number) => (
                                                    <span key={i} className="px-3 py-1.5 bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400 rounded-lg text-xs font-bold border border-error-200 dark:border-error-800/50">
                                                        {s}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs font-medium text-success-500">Bạn đã đáp ứng đủ các kỹ năng bắt buộc của công việc này!</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Cảnh báo Penalty */}
                                {(breakdown.penalty_score > 0 || (breakdown.fraud_analysis?.reasons && breakdown.fraud_analysis.reasons.length > 0)) && (
                                    <div className="p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800/50 rounded-2xl flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-error-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-error-700 dark:text-error-400 mb-1">
                                                Cảnh báo rủi ro: Bị trừ {breakdown.penalty_score} điểm.
                                            </p>
                                            <p className="text-xs font-medium text-error-600 dark:text-error-500 leading-relaxed">
                                                {getPenaltyReasons({}, breakdown) || 'Hệ thống phát hiện dấu hiệu bất thường trong CV của bạn (vd: Font chữ ẩn, màu nền trùng lặp).'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                            </div>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}

function ScoreRow({ icon: Icon, label, score, colorClass }: { icon: any, label: string, score: number, colorClass: string }) {
    const safeScore = score || 0;
    return (
        <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
            </div>
            <div className={`px-2.5 py-1 rounded-lg text-xs font-black ${colorClass}`}>
                {safeScore.toFixed(0)}
            </div>
        </div>
    );
}