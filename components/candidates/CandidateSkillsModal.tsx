import React from 'react';
import {
    X,
    CheckCircle2,
    AlertCircle,
    User,
    Briefcase
} from 'lucide-react';

interface CandidateSkillsModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidate: any;
}

export default function CandidateSkillsModal({
    isOpen,
    onClose,
    candidate
}: CandidateSkillsModalProps) {
    if (!isOpen || !candidate) return null;

    const skillExp = candidate.candidate_info?.skill_experience || {};
    const extractedSkills = candidate.extracted_skills || [];
    const missingSkills = candidate.ai_score?.missing_required_skills || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">

                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-200 p-5 dark:border-slate-700">
                    <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30">
                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                {candidate.candidate_info?.full_name ||
                                    candidate.filename}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Phân tích kỹ năng từ CV
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Stats */}
                <div className="flex gap-3 border-b border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/40">
                    <div className="flex flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                        <div>
                            <p className="text-xs text-slate-500">
                                Kỹ năng phát hiện
                            </p>
                            <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                {extractedSkills.length}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                        <AlertCircle className="h-8 w-8 text-rose-500" />
                        <div>
                            <p className="text-xs text-slate-500">
                                Kỹ năng còn thiếu
                            </p>
                            <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                {missingSkills.length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-6 overflow-y-auto p-5">

                    {/* Skills */}
                    <div>
                        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            Kỹ năng phát hiện
                        </h3>

                        {extractedSkills.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-slate-300 py-8 text-center text-sm text-slate-500 dark:border-slate-700">
                                Không tìm thấy kỹ năng trong CV.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {extractedSkills.map((skill: string) => (
                                    <div
                                        key={skill}
                                        className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-md bg-slate-100 p-2 dark:bg-slate-800">
                                                <Briefcase className="h-4 w-4 text-slate-500" />
                                            </div>

                                            <span className="font-medium capitalize text-slate-800 dark:text-slate-200">
                                                {skill}
                                            </span>
                                        </div>

                                        <span className="rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                            {skillExp[skill] ?? 0} năm
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Missing skills */}
                    {missingSkills.length > 0 && (
                        <div>
                            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400">
                                <AlertCircle className="h-4 w-4" />
                                Kỹ năng còn thiếu
                            </h3>

                            <div className="flex flex-wrap gap-2">
                                {missingSkills.map((skill: string) => (
                                    <span
                                        key={skill}
                                        className="rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-300"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t border-slate-200 p-4 dark:border-slate-700">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}