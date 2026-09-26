'use client';

import { FileText, Sparkles, X, Target, CheckCircle2, Eye, MessageSquareText } from 'lucide-react';
import InterviewEmailModal from '@/components/candidates/InterviewEmailModal';
import CandidateSkillsModal from '@/components/candidates/CandidateSkillsModal';
import DocumentViewer from '@/components/shared/DocumentViewer';

interface JobDetailModalsProps {
    editingNote: { id: string } | null;
    setEditingNote: (val: { id: string } | null) => void;
    noteInput: string;
    setNoteInput: (val: string) => void;
    handleSaveNote: () => void;

    interviewQuestions: { appId: string, questions: any[] } | null;
    setInterviewQuestions: (val: any) => void;

    emailModalData: any;
    setEmailModalData: (val: any) => void;
    executeStatusUpdate: (appId: string, newStatus: string, emailData?: any) => void;

    selectedCandidateForSkills: any;
    setSelectedCandidateForSkills: (val: any) => void;

    previewFile: { url: string, name: string, appId: string } | null;
    setPreviewFile: (val: any) => void;
    candidates: any[];
    jobTitle?: string;
    handleStatusChange: (appId: string, newStatus: string, candidateInfo?: any) => void;
}

export default function JobDetailModals({
    editingNote,
    setEditingNote,
    noteInput,
    setNoteInput,
    handleSaveNote,
    interviewQuestions,
    setInterviewQuestions,
    emailModalData,
    setEmailModalData,
    executeStatusUpdate,
    selectedCandidateForSkills,
    setSelectedCandidateForSkills,
    previewFile,
    setPreviewFile,
    candidates,
    jobTitle,
    handleStatusChange,
}: JobDetailModalsProps) {
    return (
        <>
            {/* =========================================================
                1. INTERVIEW EMAIL
            ========================================================= */}
            {emailModalData && (
                <InterviewEmailModal
                    isOpen={!!emailModalData}
                    onClose={() => setEmailModalData(null)}
                    candidateName={emailModalData.filename || 'Ứng viên'}
                    onConfirm={(data) =>
                        executeStatusUpdate(
                            emailModalData.appId,
                            emailModalData.newStatus,
                            data
                        )
                    }
                />
            )}

            {/* =========================================================
                2. INTERNAL NOTE
            ========================================================= */}
            {editingNote && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[3px]">
                    <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/10 dark:border-slate-700 dark:bg-slate-900">

                        {/* Header */}
                        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                                    <MessageSquareText className="h-5 w-5" />
                                </div>

                                <div>
                                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                                        Ghi chú nội bộ
                                    </h3>

                                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                        Ghi chú này chỉ dành cho đội ngũ tuyển dụng.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setEditingNote(null)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                aria-label="Đóng"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Nội dung ghi chú
                            </label>

                            <textarea
                                rows={5}
                                autoFocus
                                value={noteInput}
                                onChange={(e) => setNoteInput(e.target.value)}
                                placeholder="Ví dụ: Ứng viên có kinh nghiệm tốt nhưng cần xác nhận khả năng giao tiếp..."
                                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm leading-relaxed text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-950"
                            />

                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-[11px] text-slate-400">
                                    Chỉ thành viên trong hệ thống có thể xem.
                                </span>

                                <span className="text-[11px] font-medium text-slate-400">
                                    {noteInput.length} ký tự
                                </span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/40">
                            <button
                                type="button"
                                onClick={() => setEditingNote(null)}
                                className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            >
                                Hủy
                            </button>

                            <button
                                type="button"
                                onClick={handleSaveNote}
                                className="rounded-xl bg-primary-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-primary-600/20 transition-all hover:bg-primary-700 hover:shadow-md"
                            >
                                Lưu ghi chú
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================
                3. AI INTERVIEW QUESTIONS
            ========================================================= */}
            {interviewQuestions && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
                    <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 dark:border-slate-700 dark:bg-slate-900">

                        {/* Header */}
                        <div className="shrink-0 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-start justify-between gap-4 px-6 py-5">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                                        <Sparkles className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-black text-slate-900 dark:text-white">
                                                Bộ câu hỏi phỏng vấn
                                            </h3>

                                            <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-bold text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                                                AI
                                            </span>
                                        </div>

                                        <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                            Các câu hỏi được tạo dựa trên điểm mạnh, điểm yếu
                                            và mức độ phù hợp của ứng viên với JD.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setInterviewQuestions(null)}
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                    aria-label="Đóng"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Meta bar */}
                            <div className="flex items-center gap-4 bg-slate-50 px-6 py-2.5 dark:bg-slate-950/50">
                                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                    <Target className="h-3.5 w-3.5 text-primary-500" />
                                    Tập trung vào điểm cần xác minh
                                </div>

                                <div className="h-3 w-px bg-slate-200 dark:bg-slate-700" />

                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                                    {interviewQuestions.questions.length} câu hỏi
                                </span>
                            </div>
                        </div>

                        {/* Questions */}
                        <div className="flex-1 overflow-y-auto bg-slate-50/70 p-5 custom-scrollbar dark:bg-slate-950/40">
                            <div className="space-y-3">
                                {interviewQuestions.questions.map((q: any, index: number) => (
                                    <div
                                        key={index}
                                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                                    >
                                        {/* Question */}
                                        <div className="flex gap-4">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-[10px] font-black text-white dark:bg-white dark:text-slate-900">
                                                Q{String(index + 1).padStart(2, '0')}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-sm font-bold leading-6 text-slate-900 dark:text-white">
                                                    {q.question}
                                                </h4>

                                                {/* Reason */}
                                                <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/70 p-3.5 dark:border-amber-900/30 dark:bg-amber-500/5">
                                                    <div className="mb-1.5 flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-amber-700 dark:text-amber-400">
                                                        <Target className="h-3.5 w-3.5" />
                                                        Mục đích hỏi
                                                    </div>

                                                    <p className="text-xs leading-5 text-amber-800/80 dark:text-amber-300/80">
                                                        {q.reason}
                                                    </p>
                                                </div>

                                                {/* Evaluation */}
                                                <div className="mt-2 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3.5 dark:border-emerald-900/30 dark:bg-emerald-500/5">
                                                    <div className="mb-1.5 flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Gợi ý đánh giá
                                                    </div>

                                                    <p className="text-xs leading-5 text-emerald-800/80 dark:text-emerald-300/80">
                                                        {q.suggested_answer}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="shrink-0 border-t border-slate-200 bg-white px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center justify-between">
                                <p className="text-[11px] text-slate-400">
                                    Hãy dùng câu hỏi như khung tham khảo trong buổi phỏng vấn.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => setInterviewQuestions(null)}
                                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                                >
                                    Đã hiểu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================
                4. CANDIDATE SKILLS
            ========================================================= */}
            <CandidateSkillsModal
                isOpen={!!selectedCandidateForSkills}
                onClose={() => setSelectedCandidateForSkills(null)}
                showMissingSkills
                candidate={{
                    ...selectedCandidateForSkills,
                    extracted_skills:
                        selectedCandidateForSkills?.cv_snapshot?.extracted_skills ||
                        selectedCandidateForSkills?.extracted_skills,
                }}
            />

            {/* =========================================================
                5. DOCUMENT VIEWER
            ========================================================= */}
            {previewFile && (
                <DocumentViewer
                    url={previewFile.url}
                    filename={previewFile.name}
                    candidate={candidates.find(
                        (c) => c.id === previewFile.appId
                    )}
                    jobTitle={jobTitle}
                    onClose={() => setPreviewFile(null)}
                    onStatusChange={(newStatus) => {
                        const cv = candidates.find(
                            (c) => c.id === previewFile.appId
                        );

                        if (cv) {
                            handleStatusChange(
                                cv.id,
                                newStatus,
                                cv
                            );
                        }
                    }}
                />
            )}
        </>
    );
}