import { X, CheckCircle2, AlertCircle, User, Briefcase } from 'lucide-react';

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

    const skillExp = candidate.candidate_info?.skill_experience || {};
    const extractedSkills = candidate.extracted_skills || [];
    const missingSkills = candidate.ai_score?.missing_required_skills || [];
    const displayName = candidate.display_name || candidate.filename || 'Ứng viên';

    return (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in">
            <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl animate-in zoom-in-95">

                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-900">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 shrink-0">
                            <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>

                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white line-clamp-1">
                                {displayName}
                            </h2>
                            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                Chi tiết năng lực phân tích bởi AI
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Stats */}
                <div className="flex gap-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-6">
                    <div className="flex flex-1 items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
                        <div className="p-3 bg-success-50 dark:bg-success-500/10 rounded-xl">
                            <CheckCircle2 className="h-6 w-6 text-success-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Đã phát hiện
                            </p>
                            <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                                {extractedSkills.length} <span className="text-sm font-medium text-slate-400">kỹ năng</span>
                            </p>
                        </div>
                    </div>

                    {showMissingSkills && (
                        <div className="flex flex-1 items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
                            <div className="p-3 bg-error-50 dark:bg-error-500/10 rounded-xl">
                                <AlertCircle className="h-6 w-6 text-error-500" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Còn thiếu (So với JD)
                                </p>
                                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                                    {missingSkills.length} <span className="text-sm font-medium text-slate-400">kỹ năng</span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar p-6">

                    {/* Skills */}
                    <div>
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                            <CheckCircle2 className="h-5 w-5 text-success-500" />
                            Kỹ năng có trong CV
                        </h3>

                        {extractedSkills.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 py-10 text-center text-sm font-medium text-slate-500">
                                Hệ thống không tìm thấy kỹ năng nào trong CV.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {extractedSkills.map((skill: string) => (
                                    <div
                                        key={skill}
                                        className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 bg-white dark:bg-slate-800/50 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-2 shrink-0">
                                                <Briefcase className="h-4 w-4 text-slate-500" />
                                            </div>

                                            <span className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate" title={skill}>
                                                {skill}
                                            </span>
                                        </div>

                                        <span className="shrink-0 rounded-lg bg-primary-50 dark:bg-primary-900/30 px-2.5 py-1 text-xs font-bold text-primary-700 dark:text-primary-400 border border-primary-100 dark:border-primary-800/50 ml-2">
                                            {skillExp[skill] ?? 0} năm
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Missing skills */}
                    {showMissingSkills && missingSkills.length > 0 && (
                        <div>
                            <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-error-600 dark:text-error-400">
                                <AlertCircle className="h-5 w-5" />
                                Kỹ năng cần bổ sung
                            </h3>

                            <div className="flex flex-wrap gap-2">
                                {missingSkills.map((skill: string) => (
                                    <span
                                        key={skill}
                                        className="rounded-xl border border-error-200 dark:border-error-800/50 bg-error-50 dark:bg-error-900/20 px-4 py-2 text-sm font-bold text-error-700 dark:text-error-400"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 p-5 bg-slate-50 dark:bg-slate-900">
                    <button
                        onClick={onClose}
                        className="rounded-xl bg-slate-200 dark:bg-slate-800 px-6 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-300 dark:hover:bg-slate-700"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}