'use client';

import { X, FileText, Download, Mail, Phone, Briefcase, Award, Calendar, Lightbulb, User, AlertTriangle } from 'lucide-react';
import { ApplicationStatus } from '@/types';

interface DocumentViewerProps {
    url: string;
    filename?: string;
    candidate?: any;
    jobTitle?: string;
    onClose: () => void;
    onStatusChange?: (status: string) => void;
}

const CV_STATUSES = [
    { value: ApplicationStatus.NEW, label: 'Mới nộp', color: 'bg-blue-100 text-blue-700' },
    { value: ApplicationStatus.REVIEWING, label: 'Đang xem xét', color: 'bg-amber-100 text-amber-700' },
    { value: ApplicationStatus.INTERVIEW, label: 'Phỏng vấn', color: 'bg-purple-100 text-purple-700' },
    { value: ApplicationStatus.OFFERED, label: 'Đề nghị (Offer)', color: 'bg-indigo-100 text-indigo-700' },
    { value: ApplicationStatus.HIRED, label: 'Trúng tuyển', color: 'bg-emerald-100 text-emerald-700' },
    { value: ApplicationStatus.REJECTED, label: 'Từ chối', color: 'bg-rose-100 text-rose-700' },
    { value: ApplicationStatus.WITHDRAWN, label: 'Đã rút hồ sơ', color: 'bg-slate-100 text-slate-500' },
];

export default function DocumentViewer({ url, filename = 'Tài liệu', candidate, jobTitle, onClose, onStatusChange }: DocumentViewerProps) {
    const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(`${url}?t=${Date.now()}`)}&embedded=true`;

    const cInfo = candidate?.cv_snapshot?.candidate_info || candidate?.candidate_info || {};
    const score = candidate?.ai_score?.total_score || 0;
    const isSuitable = score >= 50;

    const appliedDate = candidate?.applied_at?.$date || candidate?.applied_at;
    const formattedDate = appliedDate ? new Date(appliedDate).toLocaleDateString('vi-VN') : 'Không rõ';

    const getSubScoreClass = (val: number) => {
        if (val >= 80) return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
        if (val >= 50) return 'bg-amber-50 text-amber-600 border border-amber-100';
        return 'bg-rose-50 text-rose-600 border border-rose-100';
    };

    const getScoreTheme = (score: number) => {
        if (score >= 80) return { ring: 'text-emerald-500', bg: 'text-emerald-100', border: 'border-emerald-500', badge: 'bg-emerald-100 text-emerald-700', label: 'Phù hợp' };
        if (score >= 50) return { ring: 'text-amber-500', bg: 'text-amber-100', border: 'border-amber-500', badge: 'bg-amber-100 text-amber-700', label: 'Tạm ổn' };
        return { ring: 'text-rose-500', bg: 'text-rose-100', border: 'border-rose-500', badge: 'bg-rose-100 text-rose-700', label: 'Chưa đạt' };
    };

    const getPenaltyReasons = (cvInfo: any, breakdown: any) => {
        const reasons = [];

        const fraudReasons = breakdown?.fraud_analysis?.reasons || [];
        if (fraudReasons.length > 0) {
            const translated = fraudReasons.map((r: string) => {
                if (r === 'Keyword stuffing') return 'Nhồi nhét từ khóa';
                if (r === 'White text') return 'Chèn chữ tàng hình (màu trắng)';
                if (r.includes('Tiny font') || r.includes('Very small font')) return 'Dùng font chữ siêu nhỏ';
                if (r === 'Hidden flag') return 'Cố tình ẩn chữ (Hidden text)';
                if (r === 'Outside page') return 'Chèn chữ ngoài lề trang';
                return r;
            });
            reasons.push(...translated);
        } else if (breakdown?.fraud_analysis?.detected) {
            reasons.push('Có dấu hiệu gian lận CV');
        }

        const yoe = cvInfo?.years_of_experience || 0;
        const hops = cvInfo?.job_hops || 1;
        const gaps = cvInfo?.gap_months || 0;

        if (yoe > 0 && (yoe / Math.max(hops, 1)) < 0.8) {
            reasons.push("Nhảy việc quá nhiều");
        }
        if (gaps > 12) {
            reasons.push(`Khoảng trống sự nghiệp dài (${gaps} tháng)`);
        }

        return reasons.length > 0 ? reasons.join(' + ') : 'Vi phạm tiêu chí hệ thống';
    };

    return (
        <div className="fixed inset-0 z-100 flex bg-slate-900/90 backdrop-blur-md p-4 sm:p-6 gap-4 animate-in fade-in duration-200">

            {/* CỘT TRÁI: IFRAME HIỂN THỊ CV */}
            <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                {/* Header của iFrame */}
                <div className="flex items-center justify-between bg-slate-800 p-3 sm:p-4 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1">{filename}</h3>
                            <p className="text-xs text-slate-400">Xem trước tài liệu</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors"
                            title="Mở file gốc / Tải về"
                        >
                            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Tải về</span>
                        </a>

                        {/* ĐÃ SỬA: Bỏ xl:hidden nếu không có ai_score để nút X luôn hiện ở trang Talent Pool */}
                        <button
                            onClick={onClose}
                            className={`p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-xl transition-colors ${candidate?.ai_score ? 'xl:hidden' : ''}`}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* iFrame Container */}
                <div className="flex-1 w-full relative">
                    <div className="absolute inset-0 flex items-center justify-center -z-10 bg-slate-100 dark:bg-slate-800">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                    </div>
                    <iframe
                        src={viewerUrl}
                        className="w-full h-full border-none relative z-10 bg-white"
                        title="Document Preview"
                    />
                </div>
            </div>

            {/* CỘT PHẢI: THÔNG TIN ỨNG VIÊN (Chỉ hiển thị khi mở từ một Chiến dịch và đã có điểm AI) */}
            {candidate?.ai_score && (
                <div className="hidden xl:flex w-100 shrink-0 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex-col overflow-hidden">

                    {/* Close Button cho Cột Phải */}
                    <div className="flex justify-end p-4 pb-0">
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto flex-1 space-y-6">
                        {/* 1. Header Profile */}
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 border-2 border-blue-200 flex items-center justify-center font-black text-2xl shrink-0">
                                {filename.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-800 dark:text-white leading-tight mb-1">{filename}</h2>
                                <div className="space-y-1.5 mt-2 text-sm text-slate-600 dark:text-slate-400">
                                    {cInfo.email && <div className="flex items-center gap-2 truncate"><Mail className="w-4 h-4 shrink-0" /> {cInfo.email}</div>}
                                    {cInfo.phone && <div className="flex items-center gap-2 truncate"><Phone className="w-4 h-4 shrink-0" /> {cInfo.phone}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

                        {/* 2. Campaign Info */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chiến dịch ứng tuyển</h4>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                                    <Briefcase className="w-4 h-4" /> {jobTitle || 'Chiến dịch tổng hợp'}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Calendar className="w-4 h-4" /> Ngày nộp: {formattedDate}
                                </div>
                            </div>
                        </div>

                        {/* 3. ĐÁNH GIÁ AI & 4 THÔNG SỐ */}
                        {candidate?.ai_score && (
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                    <Award className="w-4 h-4" /> Phân tích AI
                                </h4>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 space-y-4">

                                    {/* Tổng điểm đồng bộ */}
                                    {(() => {
                                        const theme = getScoreTheme(score);
                                        return (
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-12 h-12">
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
                                                    <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-white">
                                                        {score.toFixed(0)}%
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`font-bold text-sm ${theme.ring}`}>
                                                        {theme.label}
                                                    </span>
                                                    <span className="text-[11px] text-slate-500 font-medium">Mức độ tương thích với JD</span>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* 4 Thông số con */}
                                    {(() => {
                                        const breakdown = candidate.ai_score.score_breakdown || {};
                                        return (
                                            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                                                <span className={`px-2 py-1.5 rounded flex justify-between ${getSubScoreClass(breakdown.skills_score || 0)}`}>
                                                    Kỹ năng <span>{breakdown.skills_score?.toFixed(0)}</span>
                                                </span>
                                                <span className={`px-2 py-1.5 rounded flex justify-between ${getSubScoreClass(breakdown.nlp_score || 0)}`}>
                                                    Ngữ nghĩa <span>{breakdown.nlp_score?.toFixed(0)}</span>
                                                </span>
                                                <span className={`px-2 py-1.5 rounded flex justify-between ${getSubScoreClass(breakdown.experience_score || 0)}`}>
                                                    Kinh nghiệm <span>{breakdown.experience_score?.toFixed(0)}</span>
                                                </span>
                                                <span className={`px-2 py-1.5 rounded flex justify-between ${getSubScoreClass(breakdown.education_score || 0)}`}>
                                                    Học vấn <span>{breakdown.education_score?.toFixed(0)}</span>
                                                </span>
                                            </div>
                                        );
                                    })()}

                                    {/* Cảnh báo Phạt (Động) */}
                                    {(candidate.ai_score.score_breakdown?.penalty_score > 0 || (candidate.ai_score.score_breakdown?.fraud_analysis?.reasons && candidate.ai_score.score_breakdown.fraud_analysis.reasons.length > 0)) && (
                                        <div className="bg-rose-50 dark:bg-rose-900/20 p-2.5 rounded-lg border border-rose-100 dark:border-rose-800 flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-rose-600 dark:text-rose-400 leading-relaxed">
                                                <strong className="block font-bold">Cảnh báo rủi ro: Bị trừ {candidate.ai_score.score_breakdown?.penalty_score}đ</strong>
                                                {getPenaltyReasons(cInfo, candidate.ai_score.score_breakdown)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 4. CV INSIGHTS (GẠCH ĐẦU DÒNG) */}
                        {candidate?.ai_score?.top_contributing_sentences && candidate.ai_score.top_contributing_sentences.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                    <Lightbulb className="w-4 h-4" /> Điểm sáng hồ sơ
                                </h4>
                                <div className="bg-amber-50/70 dark:bg-slate-800/50 p-4 rounded-xl border border-amber-100 dark:border-slate-700">
                                    <ul className="list-disc pl-4 space-y-2 text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed">
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
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trạng thái CV</h4>
                                <p className="text-xs text-slate-500 mb-2">Thực hiện đánh giá sẽ giúp hệ thống tối ưu tốt hơn cho chiến dịch.</p>
                                <select
                                    className="w-full text-sm font-bold px-4 py-3 rounded-xl outline-none cursor-pointer border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    value={candidate?.status || ApplicationStatus.NEW}
                                    onChange={(e) => onStatusChange(e.target.value)}
                                >
                                    {CV_STATUSES.map(s => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}