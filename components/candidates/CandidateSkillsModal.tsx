import { X, CheckCircle2, AlertCircle, User, Briefcase, PlusCircle, Globe, Award, Target, FileText } from 'lucide-react';

interface CandidateSkillsModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidate: any;
    showMissingSkills?: boolean;
}

export default function CandidateSkillsModal({
    isOpen,
    onClose,
    candidate,
    showMissingSkills = false
}: CandidateSkillsModalProps) {
    if (!isOpen || !candidate) return null;

    const info = candidate.candidate_info || candidate.cv_snapshot?.candidate_info || {};
    const skillExp = info.skill_experience || {};
    const languages = info.languages || [];
    const certifications = info.certifications || [];
    const displayName = candidate.display_name || candidate.filename || info.full_name || 'Ứng viên';
    
    // Skills evaluated against JD
    const skillDetails = candidate.ai_score?.skill_details || [];
    
    // Additional skills candidate has that were not in JD
    const evaluatedSkillNames = new Set(skillDetails.map((s: any) => s.skill.toLowerCase()));
    const otherSkills = Object.entries(skillExp).filter(([skill]) => !evaluatedSkillNames.has(skill.toLowerCase()));

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in">
            <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-border bg-card-bg shadow-2xl animate-in zoom-in-95">

                {/* Header */}
                <div className="flex items-start justify-between border-b border-border p-5 sm:p-6 bg-background">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 shrink-0">
                            <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>

                        <div>
                            <h2 className="text-xl font-black text-text line-clamp-1">
                                {displayName}
                            </h2>
                            <p className="mt-1 text-sm font-medium text-text-subtle">
                                Phân tích năng lực (Skills, Ngoại ngữ, Chứng chỉ)
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-text-subtle transition hover:bg-surface-hover hover:text-text"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content - Grid Layout */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-slate-900/20 p-5 sm:p-6">
                    <div className={`grid grid-cols-1 ${skillDetails.length > 0 ? 'lg:grid-cols-2' : ''} gap-6 lg:gap-8`}>
                        
                        {/* LEFT COLUMN: Data Extracted from CV */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-border pb-2">
                                <FileText className="w-5 h-5 text-primary-500" />
                                <h3 className="text-base font-black uppercase tracking-wider text-text">
                                    Dữ liệu trích xuất từ CV
                                </h3>
                            </div>

                            {/* Skills */}
                            <div>
                                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                                    <Briefcase className="w-4 h-4 text-slate-500" />
                                    Năng lực chuyên môn (Skills)
                                </h4>
                                {Object.keys(skillExp).length > 0 ? (
                                    <div className={`grid grid-cols-1 ${skillDetails.length > 0 ? 'sm:grid-cols-2' : 'sm:grid-cols-3 lg:grid-cols-4'} gap-3`}>
                                        {Object.entries(skillExp).map(([skill, years]) => (
                                            <div key={skill} className="flex items-center justify-between bg-background border border-border rounded-xl p-3 shadow-sm hover:border-primary-300 transition-colors">
                                                <span className="font-bold text-sm text-text truncate pr-2" title={skill}>{skill}</span>
                                                {Number(years) > 0 && (
                                                    <span className="shrink-0 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold px-2 py-1 rounded-md border border-primary-100 dark:border-primary-800">
                                                        {String(years)} năm
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-text-subtle italic bg-background border border-dashed border-border rounded-xl p-4 text-center">
                                        Không tìm thấy kỹ năng chuyên môn
                                    </div>
                                )}
                            </div>

                            <div className={`grid grid-cols-1 ${skillDetails.length > 0 ? '' : 'sm:grid-cols-2'} gap-6`}>
                                {/* Languages */}
                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                                        <Globe className="w-4 h-4 text-info-500" />
                                        Ngoại ngữ
                                    </h4>
                                    {languages.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {languages.map((lang: string, i: number) => (
                                                <span key={i} className="bg-info-50 dark:bg-info-500/10 text-info-700 dark:text-info-400 border border-info-200 dark:border-info-500/20 px-3 py-1.5 rounded-lg text-sm font-bold">
                                                    {lang}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-text-subtle italic bg-background border border-dashed border-border rounded-xl p-4 text-center">
                                            Không có dữ liệu ngoại ngữ
                                        </div>
                                    )}
                                </div>

                                {/* Certifications */}
                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                                        <Award className="w-4 h-4 text-warning-500" />
                                        Chứng chỉ
                                    </h4>
                                    {certifications.length > 0 ? (
                                        <div className="flex flex-col gap-2">
                                            {certifications.map((cert: string, i: number) => (
                                                <div key={i} className="flex items-center gap-3 bg-warning-50/50 dark:bg-warning-500/5 border border-warning-200 dark:border-warning-500/20 px-4 py-2.5 rounded-xl">
                                                    <Award className="w-4 h-4 text-warning-600 dark:text-warning-500 shrink-0" />
                                                    <span className="text-sm font-bold text-warning-900 dark:text-warning-100">{cert}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-text-subtle italic bg-background border border-dashed border-border rounded-xl p-4 text-center">
                                            Không có dữ liệu chứng chỉ
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: AI Evaluation */}
                        {skillDetails.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-4 border-b border-border pb-2">
                                    <Target className="w-5 h-5 text-success-500" />
                                    <h3 className="text-base font-black uppercase tracking-wider text-text">
                                        Đối chiếu với JD (Yêu cầu công việc)
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    {skillDetails.map((s: any, idx: number) => (
                                        <div key={idx} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-4 shadow-sm ${s.matched ? 'bg-success-50/50 dark:bg-success-500/5 border-success-200 dark:border-success-500/20' : 'bg-error-50/50 dark:bg-error-500/5 border-error-200 dark:border-error-500/20'}`}>
                                            <div className="flex items-start sm:items-center gap-3">
                                                <div className={`p-2 rounded-lg shrink-0 mt-0.5 sm:mt-0 ${s.matched ? 'bg-success-100 text-success-600 dark:bg-success-500/20 dark:text-success-400' : 'bg-error-100 text-error-600 dark:bg-error-500/20 dark:text-error-400'}`}>
                                                    {s.matched ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center flex-wrap gap-2">
                                                        <span className="font-bold text-base text-text">{s.skill}</span>
                                                        {s.is_knockout && (
                                                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-black bg-error-100 text-error-700 dark:bg-error-500/20 dark:text-error-400">
                                                                Bắt buộc
                                                            </span>
                                                        )}
                                                        {!s.matched && (
                                                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-black bg-error-100 text-error-700 dark:bg-error-500/20 dark:text-error-400">
                                                                Chưa có
                                                            </span>
                                                        )}
                                                    </div>
                                                    {s.years_experience > 0 && (
                                                        <p className="text-sm font-semibold text-text-subtle mt-0.5">
                                                            Phát hiện KN: {s.years_experience} năm
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {s.matched && s.confidence > 0 && (
                                                <div className="shrink-0 text-right sm:text-center px-3 py-1.5 bg-background border border-border rounded-lg">
                                                    <p className="text-[10px] font-bold text-text-muted uppercase">Độ tin cậy</p>
                                                    <p className="text-sm font-black text-success-600 dark:text-success-400">{Math.round(s.confidence * 100)}%</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t border-border p-4 sm:p-5 bg-background">
                    <button
                        onClick={onClose}
                        className="rounded-xl bg-card-bg border border-border px-8 py-2.5 text-sm font-bold text-text transition-colors hover:bg-surface-hover shadow-sm"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}