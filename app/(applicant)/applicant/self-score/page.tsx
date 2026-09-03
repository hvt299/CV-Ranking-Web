'use client';

import { useState } from 'react';
import { Bot, FileText, Briefcase, AlertTriangle, CheckCircle2, XCircle, ChevronDown, Award, Sparkles, Target, Zap, GraduationCap, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { applicationService } from '@/features/application/application.service';
import { useExploreJobs } from '@/features/application/useApplication';
import { getScoreTheme, getPenaltyReasons } from '@/utils/score';
import { useCredits } from '@/hooks/useCredits';
import { useSubscription } from '@/hooks/useSubscription';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import ProFeatureLock from '@/components/shared/ProFeatureLock';
import { ROUTES } from '@/constants/routes';

export default function SelfScorePage() {
    const { jobs, cvLibrary: cvs, isLoading: isLoadingData } = useExploreJobs();
    // Thay isPro bằng cờ feature và lấy thêm các hàm check/trừ credit
    const { canUseAiCvReview, checkCredits, invalidateCredits } = useCredits();

    // Lấy thông tin gói cước để hiển thị chính xác hạn mức
    const { data: myPlanRes } = useSubscription();
    const { data: plansRes } = useSubscriptionPlans('applicant');
    const currentPlanCode = myPlanRes?.data?.current_plan_code || 'app_free';
    const currentPlan = plansRes?.data?.find((p: any) => p.plan_code === currentPlanCode);
    const maxScoresPerDay = currentPlan?.features?.max_self_scores_per_day || 3;

    // Tìm gói cước linh hoạt để mở khóa AI Mentor (Không fix cứng tên gói)
    const unlockPlan = plansRes?.data?.find((p: any) => p.features?.can_use_ai_cv_review);
    const unlockPlanName = unlockPlan?.name ? unlockPlan.name.replace('App ', '') : 'Plus';

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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scan-laser { 0% { top: -10%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 110%; opacity: 0; } }
                @keyframes slide-right { 0% { left: -50%; } 100% { left: 150%; } }
                .animate-scan-laser { animation: scan-laser 2s linear infinite; }
                .animate-slide-right { animation: slide-right 1.5s ease-in-out infinite; }
            `}} />

            {/* Header & Hạn mức (Quota) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mb-10">
                <div className="flex-1">
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Tự đánh giá năng lực</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sử dụng trí tuệ nhân tạo để đối chiếu CV của bạn với JD. Phân tích điểm mạnh, yếu và khả năng trúng tuyển.</p>
                </div>
                <div className="shrink-0 bg-info-50 dark:bg-info-500/10 border border-info-100 dark:border-info-500/20 p-3 rounded-2xl flex items-center gap-4 transition-colors">
                    <div className="w-10 h-10 bg-info-100 dark:bg-info-500/20 text-info-600 dark:text-info-500 flex items-center justify-center rounded-xl">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-info-600 dark:text-info-500 uppercase tracking-wider mb-0.5">Hạn mức theo gói</p>
                        <p className="text-sm font-black text-info-700 dark:text-info-100">
                            {maxScoresPerDay} lượt / ngày <span className="text-[10px] font-bold text-info-600 dark:text-info-500 ml-1 uppercase">(Reset 00:00)</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* BỐ CỤC 2 CỘT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                {/* CỘT TRÁI: FORM (Đã gỡ bỏ sticky để không bị trôi lơ lửng) */}
                <div className="lg:col-span-5 h-full bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
                    <div className="space-y-6 flex-1 flex flex-col">
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

                        <div className="mt-auto space-y-5 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="p-4 bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 rounded-2xl">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 shrink-0 rounded-xl bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                                        <Target className="w-4 h-4" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-black text-slate-800 dark:text-white mb-1">
                                            AI sẽ đánh giá những gì?
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Độ khớp kỹ năng, kinh nghiệm, học vấn, mức độ phù hợp ngữ nghĩa
                                            và các dấu hiệu bất thường trong CV.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-1">
                                <span className="text-xs font-semibold text-slate-400">
                                    Còn lại hôm nay
                                </span>
                                <span className="text-xs font-black text-primary-600 dark:text-primary-400">
                                    {maxScoresPerDay} lượt
                                </span>
                            </div>

                            <button
                                onClick={handleScore}
                                disabled={isScoring || !selectedJob || !selectedCv}
                                className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-primary-500/20 transition-all active:scale-[0.98]"
                            >
                                {isScoring ? (
                                    <>
                                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                        Đang phân tích...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Bắt đầu phân tích AI
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: ANIMATION & RESULTS */}
                <div className="lg:col-span-7 h-full">
                    {!isScoring && !result && (
                        <div className="min-h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-sm">
                            <div className="relative w-32 h-32 mb-6 mx-auto">
                                <div className="absolute inset-0 bg-primary-500/10 blur-xl rounded-full"></div>
                                <Bot className="w-full h-full text-slate-300 dark:text-slate-700 relative z-10" strokeWidth={1} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Chưa có dữ liệu phân tích</h3>
                            <p className="text-slate-500 font-medium max-w-sm mx-auto">Hãy chọn việc làm và CV ở cột bên trái, sau đó nhấn "Bắt đầu phân tích" để AI thực hiện công việc của mình.</p>
                        </div>
                    )}

                    {isScoring && (
                        <div className="min-h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-sm relative overflow-hidden">
                            <div className="absolute inset-0 bg-primary-500/5 animate-pulse"></div>

                            <div className="flex items-center justify-center w-full max-w-md relative z-10 gap-4 sm:gap-8">
                                <div className="w-20 h-28 sm:w-24 sm:h-32 bg-slate-50 dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
                                    <FileText className="w-10 h-10 text-primary-500 mb-2" />
                                    <span className="text-[10px] font-bold text-slate-400">YOUR CV</span>
                                    <div className="absolute top-0 left-0 w-full h-1 bg-primary-400 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan-laser" />
                                </div>
                                <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 relative overflow-hidden rounded-full">
                                    <div className="absolute top-0 left-0 h-full w-1/3 bg-linear-to-r from-transparent via-primary-500 to-transparent animate-slide-right" />
                                </div>
                                <div className="w-20 h-28 sm:w-24 sm:h-32 bg-slate-50 dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
                                    <Briefcase className="w-10 h-10 text-blue-500 mb-2" />
                                    <span className="text-[10px] font-bold text-slate-400">JOB REQ</span>
                                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-scan-laser" style={{ animationDelay: '0.5s' }} />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-10 mb-2">Đang phân tích dữ liệu...</h3>
                            <p className="text-slate-500 font-medium">AI đang trích xuất ngữ nghĩa và đối chiếu kỹ năng.</p>
                        </div>
                    )}

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

                                    <div className="w-full max-w-sm space-y-3">
                                        <ScoreRow icon={Target} label="Kỹ năng chuyên môn" score={breakdown.skills_score} colorClass="text-info-600 bg-info-100" />
                                        <ScoreRow icon={Zap} label="Độ khớp Ngữ nghĩa (AI)" score={breakdown.nlp_score} colorClass="text-primary-600 bg-primary-100" />
                                        <ScoreRow icon={Briefcase} label="Kinh nghiệm làm việc" score={breakdown.experience_score} colorClass="text-warning-600 bg-warning-100" />
                                        <ScoreRow icon={GraduationCap} label="Trình độ Học vấn" score={breakdown.education_score} colorClass="text-success-600 bg-success-100" />
                                    </div>
                                </div>

                                {/* Missing & Matched Skills (Luôn hiển thị) */}
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

                                {/* Cảnh báo Penalty (Luôn hiển thị) */}
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

                                {/* Khu vực AI Mentor (Mồi nhử bị làm mờ nếu không có cờ canUseAiCvReview) */}
                                <div className="relative mt-8">
                                    {!canUseAiCvReview && (
                                        <ProFeatureLock
                                            title="Mở khóa AI Mentor"
                                            description={`Biết điểm yếu là chưa đủ. Nâng cấp gói ${unlockPlanName} để AI hướng dẫn bạn cách viết lại từng câu chữ, chèn keyword chuẩn ATS và tăng 80% tỷ lệ trúng tuyển.`}
                                            requiredTierName={unlockPlanName}
                                            requiredTierLevel={unlockPlan?.tier_level || 1}
                                        />
                                    )}

                                    <div className={`bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 ${!canUseAiCvReview ? 'filter blur-[6px] pointer-events-none select-none opacity-40' : ''}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-lg font-black flex items-center gap-2 text-primary-600 dark:text-primary-400">
                                                <Bot className="w-6 h-6" /> AI Mentor: Hướng dẫn khắc phục chi tiết
                                            </h4>
                                            {/* Nút chuẩn bị cho luồng API thực tế (Trừ Credit) */}
                                            {canUseAiCvReview && (
                                                <button
                                                    onClick={() => {
                                                        // Tạm thời mô phỏng check credit, giả sử cost = 1
                                                        if (checkCredits(1, 'AI Mentor - Sửa lỗi CV')) {
                                                            toast.success('Hợp lệ! Chức năng gọi API AI Mentor đang được tích hợp.');
                                                            // Sau này gọi API xong nhớ gọi: invalidateCredits();
                                                        }
                                                    }}
                                                    className="px-4 py-1.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                                                >
                                                    <Sparkles className="w-3.5 h-3.5" /> Nhận phân tích chuyên sâu (1 Credit)
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                                                <p className="font-bold text-sm text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4 text-amber-500" /> Tối ưu hóa Mô tả kinh nghiệm
                                                </p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                    Thay vì viết chung chung, hãy sử dụng cấu trúc [Hành động] + [Kết quả] + [Công cụ]. Ví dụ: "Sử dụng ReactJS để tối ưu hóa hiệu suất ứng dụng, giảm 30% thời gian tải trang."
                                                </p>
                                            </div>
                                            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                                                <p className="font-bold text-sm text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4 text-amber-500" /> Bổ sung Keyword chuẩn ATS
                                                </p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                    Hệ thống nhận thấy bạn đang thiếu các keyword quan trọng mà JD yêu cầu. Khuyến nghị chèn thêm các từ khóa: <strong className="text-slate-800 dark:text-white">Microservices, Docker, CI/CD</strong> vào phần kỹ năng chuyên môn.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* BANNER MỒI NHỬ GLOBAL (Chỉ hiển thị khi người dùng không có cờ canUseAiCvReview, xuất hiện kể cả khi chưa chấm điểm) */}
            {!canUseAiCvReview && (
                <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-primary-200 dark:border-primary-800/50 shadow-sm hover:shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                            <Sparkles className="w-6 h-6 text-warning-500" /> Mở khóa AI Mentor: Sửa CV theo thời gian thực
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
                            Khám phá tiềm năng trúng tuyển của bạn. Nâng cấp gói <strong className="text-slate-800 dark:text-slate-200">{unlockPlanName}</strong> để AI phân tích chuyên sâu từng câu chữ, gợi ý cách viết lại và chèn keyword chuẩn ATS giúp tăng 80% cơ hội qua vòng hồ sơ.
                        </p>
                    </div>
                    <Link href={ROUTES.APPLICANT_BILLING} className="relative z-10 shrink-0 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-md shadow-primary-500/20 transition-all">
                        Nâng cấp ngay
                    </Link>
                </div>
            )}
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