'use client';

import { X, FileText, Download, Mail, Phone, Briefcase, Award, Calendar, Lightbulb, AlertTriangle } from 'lucide-react';
import { ApplicationStatus } from '@/types';
import { APPLICATION_STATUS_CONFIG } from '@/constants/application.constants';
import { getScoreTheme, getSubScoreClass, getPenaltyReasons } from '@/utils/score';

interface DocumentViewerProps {
    url: string;
    filename?: string;
    candidate?: any;
    jobTitle?: string;
    onClose: () => void;
    onStatusChange?: (status: string) => void;
}

export default function DocumentViewer({ url, filename = 'Tài liệu', candidate, jobTitle, onClose, onStatusChange }: DocumentViewerProps) {
    const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(`${url}?t=${Date.now()}`)}&embedded=true`;

    const cInfo = candidate?.cv_snapshot?.candidate_info || candidate?.candidate_info || {};
    const score = candidate?.ai_score?.total_score || 0;

    const appliedDate = candidate?.applied_at?.$date || candidate?.applied_at;
    const formattedDate = appliedDate ? new Date(appliedDate).toLocaleDateString('vi-VN') : 'Không rõ';

    return (
        <div className="fixed inset-0 z-250 flex bg-slate-900/90 dark:bg-black/90 backdrop-blur-md p-4 sm:p-6 gap-4 animate-in fade-in duration-200">

            {/* CỘT TRÁI: IFRAME HIỂN THỊ CV */}
            <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
                {/* Header của iFrame */}
                <div className="flex items-center justify-between bg-slate-800 p-3 sm:p-4 border-b border-slate-700 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary-500/20 text-primary-400 rounded-xl">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1">{filename}</h3>
                            <p className="text-xs text-slate-400 font-medium">Bản xem trước tài liệu PDF/DOCX</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-colors"
                            title="Mở file gốc / Tải về"
                        >
                            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Tải về</span>
                        </a>

                        {/* Nếu không có ai_score (Tức là Applicant đang xem), nút X sẽ hiện ở đây */}
                        <button
                            onClick={onClose}
                            className={`p-2 bg-slate-700 hover:bg-rose-500 text-slate-300 hover:text-white rounded-xl transition-colors ${candidate?.ai_score ? 'xl:hidden' : ''}`}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* iFrame Container */}
                <div className="flex-1 w-full relative">
                    <div className="absolute inset-0 flex flex-col items-center justify-center -z-10 bg-slate-100 dark:bg-slate-900">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-300 border-t-primary-500 mb-2"></div>
                        <p className="text-sm font-medium text-slate-500">Đang tải tài liệu...</p>
                    </div>
                    <iframe
                        src={viewerUrl}
                        className="w-full h-full border-none relative z-10 bg-white"
                        title="Document Preview"
                    />
                </div>
            </div>

            {/* CỘT PHẢI: THÔNG TIN ỨNG VIÊN (Dành cho HR / Dashboard) */}
            {candidate?.ai_score && (
                <div className="hidden xl:flex w-100 shrink-0 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 flex-col overflow-hidden">

                    {/* Close Button cho Cột Phải */}
                    <div className="flex justify-end p-4 pb-0">
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-xl transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
                        {/* 1. Header Profile */}
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 flex items-center justify-center font-black text-2xl shrink-0">
                                {filename.charAt(0).toUpperCase()}
                            </div>
                            <div className="pt-1">
                                <h2 className="text-lg font-black text-slate-800 dark:text-white leading-tight mb-1">{candidate.candidate_info?.full_name || filename}</h2>
                                <div className="space-y-1.5 mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                                    {cInfo.email && <div className="flex items-center gap-2 truncate"><Mail className="w-4 h-4 shrink-0 text-slate-400" /> {cInfo.email}</div>}
                                    {cInfo.phone && <div className="flex items-center gap-2 truncate"><Phone className="w-4 h-4 shrink-0 text-slate-400" /> {cInfo.phone}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

                        {/* 2. Campaign Info */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Chiến dịch ứng tuyển</h4>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                                    <Briefcase className="w-4 h-4 text-primary-500" /> {jobTitle || 'Chiến dịch tổng hợp'}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                    <Calendar className="w-4 h-4" /> Ngày nộp: {formattedDate}
                                </div>
                            </div>
                        </div>

                        {/* 3. ĐÁNH GIÁ AI & 4 THÔNG SỐ */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Award className="w-4 h-4 text-amber-500" /> Phân tích AI
                            </h4>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-5">

                                {/* Tổng điểm đồng bộ */}
                                {(() => {
                                    const theme = getScoreTheme(score);
                                    return (
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-14 h-14">
                                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
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
                                                <div className="absolute inset-0 flex items-center justify-center font-black text-sm text-slate-700 dark:text-white">
                                                    {score.toFixed(0)}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`font-black text-base ${theme.ring}`}>
                                                    {theme.label}
                                                </span>
                                                <span className="text-[11px] text-slate-500 font-bold mt-0.5">Tương thích với JD</span>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* 4 Thông số con */}
                                {(() => {
                                    const breakdown = candidate.ai_score.score_breakdown || {};
                                    return (
                                        <div className="grid grid-cols-2 gap-2.5 text-[11px] font-bold">
                                            <span className={`px-3 py-2 rounded-xl flex justify-between items-center ${getSubScoreClass(breakdown.skills_score || 0)}`}>
                                                Kỹ năng <span className="text-sm">{breakdown.skills_score?.toFixed(0)}</span>
                                            </span>
                                            <span className={`px-3 py-2 rounded-xl flex justify-between items-center ${getSubScoreClass(breakdown.nlp_score || 0)}`}>
                                                Ngữ nghĩa <span className="text-sm">{breakdown.nlp_score?.toFixed(0)}</span>
                                            </span>
                                            <span className={`px-3 py-2 rounded-xl flex justify-between items-center ${getSubScoreClass(breakdown.experience_score || 0)}`}>
                                                Kinh nghiệm <span className="text-sm">{breakdown.experience_score?.toFixed(0)}</span>
                                            </span>
                                            <span className={`px-3 py-2 rounded-xl flex justify-between items-center ${getSubScoreClass(breakdown.education_score || 0)}`}>
                                                Học vấn <span className="text-sm">{breakdown.education_score?.toFixed(0)}</span>
                                            </span>
                                        </div>
                                    );
                                })()}

                                {/* Cảnh báo Phạt (Động) */}
                                {(candidate.ai_score.score_breakdown?.penalty_score > 0 || (candidate.ai_score.score_breakdown?.fraud_analysis?.reasons && candidate.ai_score.score_breakdown.fraud_analysis.reasons.length > 0)) && (
                                    <div className="bg-error-50 dark:bg-error-900/20 p-3.5 rounded-xl border border-error-200 dark:border-error-800/50 flex items-start gap-2.5">
                                        <AlertTriangle className="w-5 h-5 text-error-500 shrink-0" />
                                        <div className="text-xs text-error-700 dark:text-error-400 leading-relaxed font-medium">
                                            <strong className="block font-black mb-1">Cảnh báo rủi ro: Bị trừ {candidate.ai_score.score_breakdown?.penalty_score}đ</strong>
                                            {getPenaltyReasons(cInfo, candidate.ai_score.score_breakdown)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 4. CV INSIGHTS */}
                        {candidate?.ai_score?.top_contributing_sentences && candidate.ai_score.top_contributing_sentences.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Lightbulb className="w-4 h-4 text-warning-500" /> Điểm sáng hồ sơ
                                    <span className="px-1.5 py-0.5 rounded-sm text-[9px] font-black bg-linear-to-r from-amber-500 to-orange-500 text-white uppercase tracking-widest shadow-sm ml-1">Pro</span>
                                </h4>
                                <div className="bg-warning-50/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-warning-100 dark:border-slate-800">
                                    <ul className="list-disc pl-4 space-y-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 italic leading-relaxed">
                                        {candidate.ai_score.top_contributing_sentences.map((sentence: string, idx: number) => (
                                            <li key={idx}>{sentence}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

                        {/* 5. Trạng thái ứng viên */}
                        {onStatusChange && (
                            <div className="space-y-3">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Cập nhật trạng thái</h4>
                                <p className="text-xs font-medium text-slate-500 mb-2">Thực hiện đánh giá để báo kết quả cho ứng viên.</p>
                                <select
                                    className="w-full text-sm font-bold px-4 py-3 rounded-xl outline-none cursor-pointer border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none"
                                    value={candidate?.status || ApplicationStatus.NEW}
                                    onChange={(e) => onStatusChange(e.target.value)}
                                >
                                    {Object.values(APPLICATION_STATUS_CONFIG).map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}