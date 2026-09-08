'use client';

import { useState } from 'react';
import { Award, Search, LayoutList, Kanban } from 'lucide-react';
import apiClient from '@/lib/api-client';
import toast from 'react-hot-toast';
import { ApplicationStatus } from '@/types';
import { useCredits } from '@/hooks/useCredits';
import { APPLICATION_STATUS_CONFIG } from "@/constants/application.constants";
import CandidateListView from './CandidateListView';
import CandidateKanban from '@/components/candidates/CandidateKanban';
import JobDetailModals from './JobDetailModals';

interface TabCandidatesProps {
    candidates: any[];
    setCandidates: (val: any) => void;
    jobTitle?: string;
}

export default function TabCandidates({ candidates, setCandidates, jobTitle }: TabCandidatesProps) {
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
    const { checkCredits, invalidateCredits } = useCredits();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [suitabilityFilter, setSuitabilityFilter] = useState('All');
    const [sortBy, setSortBy] = useState('score_high');
    const [expandedInsights, setExpandedInsights] = useState<Record<string, boolean>>({});
    const [editingNote, setEditingNote] = useState<{ id: string } | null>(null);
    const [noteInput, setNoteInput] = useState('');
    const [selectedCandidateForSkills, setSelectedCandidateForSkills] = useState<any>(null);
    const [previewFile, setPreviewFile] = useState<{ url: string, name: string, appId: string } | null>(null);
    const [emailModalData, setEmailModalData] = useState<any>(null);
    const [isGeneratingInterview, setIsGeneratingInterview] = useState<string | null>(null);
    const [interviewQuestions, setInterviewQuestions] = useState<{ appId: string, questions: any[] } | null>(null);

    const filteredCandidates = candidates.filter(cv => {
        const snapshot = cv.cv_snapshot || {};
        const cInfo = snapshot.candidate_info || {};
        const filename = snapshot.filename || '';

        const matchesSearch = filename.toLowerCase().includes(searchTerm.toLowerCase()) || (cInfo.email && cInfo.email.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'All' || cv.status === statusFilter;
        const matchesSuitability = suitabilityFilter === 'All' || (cv.ai_score?.total_score || 0) >= 50;

        return matchesSearch && matchesStatus && matchesSuitability;
    }).sort((a, b) => {
        if (sortBy === 'score_high') return (b.ai_score?.total_score || 0) - (a.ai_score?.total_score || 0);
        if (sortBy === 'score_low') return (a.ai_score?.total_score || 0) - (b.ai_score?.total_score || 0);
        const dateA = new Date(a.applied_at?.$date || a.applied_at || 0).getTime();
        const dateB = new Date(b.applied_at?.$date || b.applied_at || 0).getTime();
        if (sortBy === 'newest') return dateB - dateA;
        if (sortBy === 'oldest') return dateA - dateB;
        return 0;
    });

    const kanbanCandidates = filteredCandidates.map(c => ({
        ...c, filename: c.cv_snapshot?.filename || c.filename, file_url: c.cv_snapshot?.file_url || c.file_url, candidate_info: c.cv_snapshot?.candidate_info || c.candidate_info,
    }));

    const handleStatusChange = async (appId: string, newStatus: string, candidateInfo?: any) => {
        if (newStatus === ApplicationStatus.INTERVIEW) {
            setEmailModalData({ appId, newStatus, ...candidateInfo });
            return;
        }
        await executeStatusUpdate(appId, newStatus);
    };

    const executeStatusUpdate = async (appId: string, newStatus: string, emailData?: any) => {
        try {
            const payload: any = { status: newStatus };
            if (emailData) {
                payload.send_email = emailData.send_email || false;
                if (emailData.interview_schedule) payload.interview_schedule = emailData.interview_schedule;
            }
            await apiClient.patch(`/cv/applications/${appId}`, payload);
            toast.success("Cập nhật trạng thái thành công");
            setCandidates((prev: any[]) => prev.map(cv => cv.id === appId ? { ...cv, status: newStatus } : cv));
            setEmailModalData(null);
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Lỗi khi cập nhật trạng thái");
        }
    };

    const handleToggleView = async (cv: any) => {
        const newStatus = !cv.is_viewed;
        try {
            await apiClient.patch(`/cv/applications/${cv.id}/view`, { is_viewed: newStatus });
            setCandidates((prev: any[]) => prev.map(c => c.id === cv.id ? { ...c, is_viewed: newStatus } : c));
            toast.success(newStatus ? "Đã đánh dấu Đã xem" : "Đã đánh dấu Chưa xem");
        } catch (e) {
            toast.error("Lỗi cập nhật trạng thái");
        }
    };

    const handleViewCV = async (cv: any) => {
        const fileUrl = cv.cv_snapshot?.file_url || cv.file_url;
        const filename = cv.cv_snapshot?.filename || cv.filename;
        setPreviewFile({ url: fileUrl, name: filename, appId: cv.id });

        if (!cv.is_viewed) {
            try {
                await apiClient.patch(`/cv/applications/${cv.id}/view`, { is_viewed: true });
                setCandidates((prev: any[]) => prev.map(c => c.id === cv.id ? { ...c, is_viewed: true } : c));
            } catch (e) {
                console.error("Lỗi đánh dấu đã xem", e);
            }
        }
    };

    const handleRemoveFromJob = async (appId: string, filename: string) => {
        if (!confirm(`Gỡ CV ${filename} khỏi chiến dịch này?`)) return;
        try {
            await apiClient.delete(`/cv/applications/${appId}`);
            toast.success("Đã gỡ CV khỏi chiến dịch!");
            setCandidates((prev: any[]) => prev.filter(cv => cv.id !== appId));
        } catch (error: any) {
            toast.error("Lỗi khi gỡ CV");
        }
    };

    const handleSaveNote = async () => {
        if (!editingNote || !noteInput.trim()) return toast.error("Vui lòng nhập nội dung!");
        try {
            await apiClient.patch(`/cv/applications/${editingNote.id}`, { note_to_add: noteInput });
            toast.success("Đã thêm ghi chú mới!");
            setCandidates((prev: any[]) => prev.map(cv => cv.id === editingNote.id ? { ...cv, notes: [...(cv.notes || []), noteInput] } : cv));
            setEditingNote(null);
            setNoteInput('');
        } catch (error: any) {
            toast.error("Lỗi khi lưu ghi chú");
        }
    };

    const handleGenerateInterviewQuestions = async (cv: any) => {
        if (cv.ai_interview_questions) {
            setInterviewQuestions({ appId: cv.id, questions: cv.ai_interview_questions });
            return;
        }

        if (!checkCredits(2, 'Sinh câu hỏi phỏng vấn bằng AI')) return;

        setIsGeneratingInterview(cv.id);
        try {
            const res = await apiClient.get(`/cv/applications/${cv.id}/ai-interview`);
            setInterviewQuestions({ appId: cv.id, questions: res.data.data });
            toast.success("AI đã sinh câu hỏi thành công!");
            invalidateCredits();
            setCandidates((prev: any[]) => prev.map(c => c.id === cv.id ? { ...c, ai_interview_questions: res.data.data } : c));
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Lỗi khi sinh câu hỏi phỏng vấn");
        } finally {
            setIsGeneratingInterview(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* THANH CÔNG CỤ */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
                            <Award className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-base font-black text-slate-800 dark:text-white sm:text-lg">Bảng xếp hạng ứng viên</h2>
                            <p className="mt-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">{filteredCandidates.length} ứng viên phù hợp với bộ lọc</p>
                        </div>
                    </div>

                    <div className="grid w-full grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800 lg:w-auto">
                        <button onClick={() => setViewMode('list')} className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all sm:text-sm ${viewMode === 'list' ? 'bg-white text-primary-600 shadow-sm dark:bg-slate-700 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}>
                            <LayoutList className="h-4 w-4" />
                            Danh sách
                        </button>
                        <button onClick={() => setViewMode('kanban')} className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all sm:text-sm ${viewMode === 'kanban' ? 'bg-white text-primary-600 shadow-sm dark:bg-slate-700 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}>
                            <Kanban className="h-4 w-4" />
                            Kanban
                        </button>
                    </div>
                </div>

                <div className="grid gap-3 p-4 sm:p-5 xl:grid-cols-12">
                    <div className="relative xl:col-span-5">
                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Tìm kiếm tên ứng viên, email..." className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium outline-none transition-colors placeholder:font-normal focus:border-primary-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 xl:col-span-7">
                        <select className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium outline-none transition-colors focus:border-primary-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900" value={suitabilityFilter} onChange={e => setSuitabilityFilter(e.target.value)}>
                            <option value="All">Tất cả mức độ</option>
                            <option value="Suitable">Chỉ CV phù hợp (≥50đ)</option>
                        </select>

                        <select className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium outline-none transition-colors focus:border-primary-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            <option value="All">Tất cả trạng thái</option>
                            {Object.values(APPLICATION_STATUS_CONFIG).map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>

                        <select className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium outline-none transition-colors focus:border-primary-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                            <option value="score_high">Điểm AI: Giảm dần</option>
                            <option value="score_low">Điểm AI: Tăng dần</option>
                            <option value="newest">Ngày nộp: Mới nhất</option>
                            <option value="oldest">Ngày nộp: Cũ nhất</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* DANH SÁCH / KANBAN */}
            {filteredCandidates.length === 0 ? (
                <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                    Chưa có ứng viên nào đáp ứng bộ lọc.
                </div>
            ) : viewMode === 'kanban' ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/50 sm:p-4">
                    <CandidateKanban candidates={kanbanCandidates} onStatusChange={(id, status) => handleStatusChange(id, status, candidates.find(c => c.id === id))} onPreviewCV={(url, name) => handleViewCV({ id: candidates.find(c => c.cv_snapshot?.file_url === url || c.file_url === url)?.id, file_url: url, filename: name })} />
                </div>
            ) : (
                <div className="w-full">
                    <CandidateListView candidates={filteredCandidates} expandedInsights={expandedInsights} isGeneratingInterview={isGeneratingInterview} onStatusChange={handleStatusChange} onToggleView={handleToggleView} onViewCV={handleViewCV} onAddNote={(id) => { setEditingNote({ id }); setNoteInput(''); }} onRemoveFromJob={handleRemoveFromJob} onToggleInsightExpand={(id) => setExpandedInsights(prev => ({ ...prev, [id]: !prev[id] }))} onViewSkills={setSelectedCandidateForSkills} onGenerateQuestions={handleGenerateInterviewQuestions} />
                </div>
            )}

            <JobDetailModals editingNote={editingNote} setEditingNote={setEditingNote} noteInput={noteInput} setNoteInput={setNoteInput} handleSaveNote={handleSaveNote} interviewQuestions={interviewQuestions} setInterviewQuestions={setInterviewQuestions} emailModalData={emailModalData} setEmailModalData={setEmailModalData} executeStatusUpdate={executeStatusUpdate} selectedCandidateForSkills={selectedCandidateForSkills} setSelectedCandidateForSkills={setSelectedCandidateForSkills} previewFile={previewFile} setPreviewFile={setPreviewFile} candidates={candidates} jobTitle={jobTitle} handleStatusChange={handleStatusChange} />
        </div>
    );
}