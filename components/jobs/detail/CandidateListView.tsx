'use client';

import { Mail, Phone, Clock, Lightbulb, AlertTriangle, Sparkles, MailOpen, Eye, FileText, Trash2 } from 'lucide-react';
import { ApplicationStatus } from '@/types';
import { APPLICATION_STATUS_CONFIG } from "@/constants/application.constants";
import { getPenaltyReasons, getScoreTheme, getSubScoreClass } from '@/utils/score';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { getTierBadgeConfig } from '@/utils/tier-colors';

interface CandidateListViewProps {
    candidates: any[];
    expandedInsights: Record<string, boolean>;
    isGeneratingInterview: string | null;
    onStatusChange: (id: string, status: string, cv: any) => void;
    onToggleView: (cv: any) => void;
    onViewCV: (cv: any) => void;
    onAddNote: (id: string) => void;
    onRemoveFromJob: (id: string, filename: string) => void;
    onToggleInsightExpand: (id: string) => void;
    onViewSkills: (cv: any) => void;
    onGenerateQuestions: (cv: any) => void;
}

export default function CandidateListView({
    candidates, expandedInsights, isGeneratingInterview,
    onStatusChange, onToggleView, onViewCV, onAddNote, onRemoveFromJob,
    onToggleInsightExpand, onViewSkills, onGenerateQuestions
}: CandidateListViewProps) {

    // Kéo thông tin Plan để lấy linh hoạt tên gói mở khóa tính năng (Pro/Enterprise)
    const { data: plansRes } = useSubscriptionPlans('hr');
    const unlockInterviewPlan = plansRes?.data?.find((p: any) => p.tier_level >= 2); // Ví dụ: Gói Pro
    const unlockInterviewPlanName = unlockInterviewPlan?.name || 'Pro';
    const badgeConfig = getTierBadgeConfig(unlockInterviewPlan?.tier_level || 2);

    return (
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 space-y-4 animate-in fade-in">
            {candidates.map((cv) => {
                const snapshot = cv.cv_snapshot || {};
                const cInfo = snapshot.candidate_info || {};
                const score = cv.ai_score?.total_score || 0;
                const breakdown = cv.ai_score?.score_breakdown || {};
                const notes = cv.notes || [];
                const isViewed = cv.is_viewed;
                const filename = snapshot.filename || cv.filename || 'CV Không tên';

                const aiSentences = cv.ai_score?.top_contributing_sentences || [];
                const isExpanded = expandedInsights[cv.id];
                const theme = getScoreTheme(score);
                const radius = 20;
                const strokeDasharray = 2 * Math.PI * radius;
                const strokeDashoffset = strokeDasharray - (score / 100) * strokeDasharray;

                return (
                    <div key={cv.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all group">
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start xl:items-center">

                            {/* CỘT 1: THÔNG TIN CƠ BẢN */}
                            <div className="xl:col-span-4 flex items-start gap-4">
                                <div className="flex flex-col items-center gap-2 shrink-0">
                                    <div className="relative">
                                        <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-black text-2xl shrink-0 transition-colors ${isViewed ? 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700' : 'bg-primary-50 text-primary-600 border-primary-200 dark:bg-primary-900/30 dark:border-primary-800'}`}>
                                            {filename.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0 transition-colors ${isViewed ? 'bg-slate-100 text-slate-500 dark:bg-slate-800' : 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400'}`}>
                                        {isViewed ? 'Đã xem' : 'Chưa xem'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-800 dark:text-white mb-2 leading-tight group-hover:text-primary-600 transition-colors" title={filename}>{filename}</h3>
                                    <div className="space-y-1.5">
                                        {cInfo.email && <a href={`mailto:${cInfo.email}`} className="text-xs text-slate-500 hover:text-primary-600 flex items-center gap-1.5 truncate"><Mail className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{cInfo.email}</span></a>}
                                        {cInfo.phone && <a href={`tel:${cInfo.phone}`} className="text-xs text-slate-500 hover:text-primary-600 flex items-center gap-1.5 truncate"><Phone className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{cInfo.phone}</span></a>}
                                        <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate"><Clock className="w-3.5 h-3.5 shrink-0" /> Nộp lúc: {new Date(cv.applied_at?.$date || cv.applied_at || Date.now()).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* CỘT 2: AI SCORING & INSIGHTS */}
                            <div className="xl:col-span-6 flex flex-col xl:flex-row items-start gap-4 border-t xl:border-t-0 xl:border-l border-slate-100 dark:border-slate-700 pt-4 xl:pt-0 xl:pl-6 h-full">
                                <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                                    <div className="relative w-14 h-14">
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
                                            <circle cx="24" cy="24" r="20" className={`stroke-current ${theme.bg}`} strokeWidth="4" fill="transparent" />
                                            <circle cx="24" cy="24" r="20" className={`stroke-current ${theme.ring}`} strokeWidth="4" fill="transparent" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-white">
                                            {score.toFixed(0)}%
                                        </div>
                                    </div>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${theme.badge}`}>{theme.label}</span>
                                </div>

                                <div className="flex-1 w-full min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                                            <span className={`px-2 py-1 rounded-md ${getSubScoreClass(breakdown.skills_score || 0)}`}>Kỹ năng: {breakdown.skills_score?.toFixed(0)}</span>
                                            <span className={`px-2 py-1 rounded-md ${getSubScoreClass(breakdown.nlp_score || 0)}`}>Ngữ nghĩa: {breakdown.nlp_score?.toFixed(0)}</span>
                                            <span className={`px-2 py-1 rounded-md ${getSubScoreClass(breakdown.experience_score || 0)}`}>Kinh nghiệm: {breakdown.experience_score?.toFixed(0)}</span>
                                            <span className={`px-2 py-1 rounded-md ${getSubScoreClass(breakdown.education_score || 0)}`}>Học vấn: {breakdown.education_score?.toFixed(0)}</span>
                                        </div>
                                        <button onClick={() => onViewSkills(cv)} className="text-[10px] text-primary-600 dark:text-primary-400 font-bold hover:underline shrink-0 ml-2">Chi tiết</button>
                                    </div>

                                    {aiSentences.length > 0 && (
                                        <div className="bg-amber-50/70 dark:bg-slate-900/50 p-3 rounded-lg border border-amber-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2 relative">
                                            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />

                                            <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest shadow-sm shrink-0 mt-0.5 border ${badgeConfig.bg} ${badgeConfig.text} ${badgeConfig.border}`}>
                                                {unlockInterviewPlanName.replace('HR ', '')}
                                            </span>

                                            <div className="flex-1">
                                                <ul className="list-disc pl-4 space-y-1.5">
                                                    {aiSentences
                                                        .slice(0, isExpanded ? undefined : 2)
                                                        .map((sentence: string, idx: number) => (
                                                            <li key={idx} className="italic text-justify leading-relaxed">
                                                                {sentence}
                                                            </li>
                                                        ))}
                                                </ul>

                                                {aiSentences.length > 2 && (
                                                    <button
                                                        onClick={() => onToggleInsightExpand(cv.id)}
                                                        className="text-[10px] text-amber-600 font-bold hover:underline mt-2 inline-block"
                                                    >
                                                        {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {(breakdown.penalty_score > 0 || (breakdown.fraud_analysis?.reasons && breakdown.fraud_analysis.reasons.length > 0)) && (
                                        <div className="bg-rose-50 dark:bg-rose-900/20 p-2.5 rounded-lg border border-rose-100 dark:border-rose-800 flex items-start gap-2 mt-2">
                                            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-rose-600 dark:text-rose-400 leading-relaxed">
                                                <strong className="block font-bold">Cảnh báo rủi ro: Bị trừ {breakdown.penalty_score || 0}đ</strong>
                                                {getPenaltyReasons(cInfo, breakdown)}
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-3 flex justify-between items-center">
                                        <button
                                            onClick={() => onGenerateQuestions(cv)}
                                            disabled={isGeneratingInterview === cv.id}
                                            className="flex items-center gap-1.5 text-[11px] font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/40 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                                        >
                                            {isGeneratingInterview === cv.id ? (
                                                <><span className="animate-spin w-3 h-3 border-2 border-primary-600 border-t-transparent rounded-full"></span> Đang phân tích...</>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-3.5 h-3.5" />
                                                    {cv.ai_interview_questions ? 'Xem lại bộ câu hỏi phỏng vấn bằng AI' : 'Sinh câu hỏi AI phỏng vấn bằng (2 Credits)'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* CỘT 3: ACTIONS & STATUS */}
                            <div className="xl:col-span-2 flex flex-row xl:flex-col justify-between items-center xl:items-end border-t xl:border-t-0 xl:border-l border-slate-100 dark:border-slate-700 pt-4 xl:pt-0 xl:pl-6 h-full w-full">
                                <select
                                    className={`w-1/2 xl:w-full text-xs font-bold px-3 py-2 rounded-xl outline-none cursor-pointer text-center transition-colors ${APPLICATION_STATUS_CONFIG[cv.status as ApplicationStatus]?.color || 'bg-slate-100 text-slate-700'}`}
                                    value={cv.status || ApplicationStatus.NEW}
                                    onChange={(e) => onStatusChange(cv.id, e.target.value, cv)}
                                >
                                    {Object.values(APPLICATION_STATUS_CONFIG).map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                </select>

                                <div className="flex items-center gap-1 mt-0 xl:mt-auto">
                                    <button onClick={() => onToggleView(cv)} className={`p-2 rounded-lg transition-colors ${isViewed ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800' : 'text-primary-500 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/30'}`} title={isViewed ? "Đánh dấu chưa xem" : "Đánh dấu đã xem"}>
                                        {isViewed ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                                    </button>
                                    <button onClick={() => onViewCV(cv)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors" title="Mở xem CV gốc">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => onAddNote(cv.id)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors relative" title="Ghi chú nội bộ">
                                        <FileText className="w-4 h-4" />
                                        {notes.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full"></span>}
                                    </button>
                                    <button onClick={() => onRemoveFromJob(cv.id, filename)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors" title="Gỡ khỏi Job">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                );
            })}
        </div>
    );
}