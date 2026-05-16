import React from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CandidateSkillsModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidate: any;
}

export default function CandidateSkillsModal({ isOpen, onClose, candidate }: CandidateSkillsModalProps) {
    if (!isOpen || !candidate) return null;

    const skillExp = candidate.candidate_info?.skill_experience || {};
    const extractedSkills = candidate.extracted_skills || [];
    const missingSkills = candidate.ai_score?.missing_required_skills || [];

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[80vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                        Chi tiết Kỹ năng - {candidate.candidate_info?.full_name || candidate.filename}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body có thể cuộn */}
                <div className="p-5 overflow-y-auto custom-scrollbar">
                    {/* Danh sách kỹ năng và số năm */}
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Kỹ năng hệ thống bóc tách được
                    </h4>

                    {extractedSkills.length === 0 ? (
                        <p className="text-sm text-slate-500 italic mb-6">Không tìm thấy kỹ năng nào trong CV.</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {extractedSkills.map((skill: string) => (
                                <div key={skill} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize">{skill}</span>
                                    <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 rounded-md">
                                        {skillExp[skill] ? `${skillExp[skill]} năm` : '0 năm'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Danh sách kỹ năng thiếu */}
                    {missingSkills.length > 0 && (
                        <>
                            <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> Kỹ năng Job yêu cầu nhưng CV thiếu
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {missingSkills.map((skill: string) => (
                                    <span key={skill} className="text-xs font-medium px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-400 rounded-lg capitalize">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}