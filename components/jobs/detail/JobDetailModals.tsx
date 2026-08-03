'use client';

import { FileText, Sparkles } from 'lucide-react';
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
    editingNote, setEditingNote, noteInput, setNoteInput, handleSaveNote,
    interviewQuestions, setInterviewQuestions,
    emailModalData, setEmailModalData, executeStatusUpdate,
    selectedCandidateForSkills, setSelectedCandidateForSkills,
    previewFile, setPreviewFile, candidates, jobTitle, handleStatusChange
}: JobDetailModalsProps) {
    return (
        <>
            {/* 1. Modal Gửi Email Phỏng Vấn */}
            {emailModalData && (
                <InterviewEmailModal
                    isOpen={!!emailModalData}
                    onClose={() => setEmailModalData(null)}
                    candidateName={emailModalData.filename || 'Ứng viên'}
                    onConfirm={(data) => executeStatusUpdate(emailModalData.appId, emailModalData.newStatus, data)}
                />
            )}

            {/* 2. Modal Thêm Ghi Chú Nội Bộ */}
            {editingNote && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary-500" /> Thêm ghi chú nội bộ
                        </h3>
                        <textarea
                            rows={4}
                            value={noteInput}
                            onChange={e => setNoteInput(e.target.value)}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm mb-4 resize-none"
                            placeholder="Nhập ghi chú..."
                        ></textarea>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setEditingNote(null)} className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">Hủy</button>
                            <button onClick={handleSaveNote} className="px-5 py-2 font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30">Lưu ghi chú</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Modal Câu Hỏi Phỏng Vấn AI */}
            {interviewQuestions && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-700">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-primary-50/50 dark:bg-slate-900/50">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-primary-500" /> Bộ câu hỏi thực chiến
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">Được AI phân tích chuyên sâu dựa trên điểm yếu của CV so với JD</p>
                            </div>
                            <button onClick={() => setInterviewQuestions(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-colors">Đóng</button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50 dark:bg-slate-900 custom-scrollbar">
                            {interviewQuestions.questions.map((q: any, index: number) => (
                                <div key={index} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative group">
                                    <div className="absolute top-4 left-4 w-8 h-8 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-black rounded-xl flex items-center justify-center">Q{index + 1}</div>
                                    <div className="pl-12">
                                        <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-2">{q.question}</h4>
                                        <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 text-xs p-3 rounded-xl mb-3 border border-rose-100 dark:border-rose-800/30">
                                            <strong className="block mb-1">🎯 Mục đích hỏi:</strong>{q.reason}
                                        </div>
                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs p-3 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                                            <strong className="block mb-1">✅ Gợi ý đánh giá:</strong>{q.suggested_answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 4. Modal Xem Kỹ Năng Ứng Viên */}
            <CandidateSkillsModal
                isOpen={!!selectedCandidateForSkills}
                onClose={() => setSelectedCandidateForSkills(null)}
                candidate={{ ...selectedCandidateForSkills, extracted_skills: selectedCandidateForSkills?.cv_snapshot?.extracted_skills || selectedCandidateForSkills?.extracted_skills }}
            />

            {/* 5. Modal Xem Tài Liệu (Document Viewer) */}
            {previewFile && (
                <DocumentViewer
                    url={previewFile.url}
                    filename={previewFile.name}
                    candidate={candidates.find(c => c.id === previewFile.appId)}
                    jobTitle={jobTitle}
                    onClose={() => setPreviewFile(null)}
                    onStatusChange={(newStatus) => {
                        const cv = candidates.find(c => c.id === previewFile.appId);
                        if (cv) handleStatusChange(cv.id, newStatus, cv);
                    }}
                />
            )}
        </>
    );
}