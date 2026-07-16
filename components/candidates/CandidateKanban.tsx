'use client';

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Mail, Phone, Eye, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ApplicationStatus } from '@/types';

const KANBAN_COLUMNS = [
    { id: ApplicationStatus.NEW, label: 'Mới nộp', borderColor: 'border-blue-500', headerBg: 'bg-blue-100 text-blue-700' },
    { id: ApplicationStatus.REVIEWING, label: 'Đang xem xét', borderColor: 'border-amber-500', headerBg: 'bg-amber-100 text-amber-700' },
    { id: ApplicationStatus.INTERVIEW, label: 'Phỏng vấn', borderColor: 'border-purple-500', headerBg: 'bg-purple-100 text-purple-700' },
    { id: ApplicationStatus.OFFERED, label: 'Đề nghị (Offer)', borderColor: 'border-indigo-500', headerBg: 'bg-indigo-100 text-indigo-700' },
    { id: ApplicationStatus.HIRED, label: 'Trúng tuyển', borderColor: 'border-emerald-500', headerBg: 'bg-emerald-100 text-emerald-700' },
    { id: ApplicationStatus.REJECTED, label: 'Từ chối', borderColor: 'border-rose-500', headerBg: 'bg-rose-100 text-rose-700' },
];

interface CandidateKanbanProps {
    candidates: any[];
    onStatusChange: (appId: string, newStatus: string) => void;
    onPreviewCV: (url: string, filename: string) => void;
}

export default function CandidateKanban({ candidates, onStatusChange, onPreviewCV }: CandidateKanbanProps) {
    const handleDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId) return;

        onStatusChange(draggableId, destination.droppableId);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar items-start h-[calc(100vh-250px)]">
                {KANBAN_COLUMNS.map(column => {
                    const columnCandidates = candidates.filter(c => (c.status || ApplicationStatus.NEW) === column.id);

                    return (
                        <div key={column.id} className="shrink-0 w-80 flex flex-col bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 max-h-full">
                            {/* Cột Header */}
                            <div className={`p-3 m-2 rounded-xl font-bold text-sm flex justify-between items-center ${column.headerBg}`}>
                                <span>{column.label}</span>
                                <span className="bg-white/50 px-2 py-0.5 rounded-lg text-xs">{columnCandidates.length}</span>
                            </div>

                            {/* Khu vực thả (Droppable) */}
                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex-1 p-2 overflow-y-auto custom-scrollbar transition-colors ${snapshot.isDraggingOver ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
                                    >
                                        {columnCandidates.map((cv, index) => {
                                            const score = cv.ai_score?.total_score || 0;
                                            const isHigh = score >= 80;
                                            const isMed = score >= 50 && score < 80;

                                            return (
                                                <Draggable key={cv.id} draggableId={cv.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`bg-white dark:bg-slate-800 p-4 mb-3 rounded-xl border-l-4 ${column.borderColor} shadow-sm ${snapshot.isDragging ? 'shadow-xl ring-2 ring-blue-500/50 opacity-90' : 'border border-slate-200 dark:border-slate-700 hover:shadow-md'}`}
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h4 className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1" title={cv.filename}>{cv.filename}</h4>
                                                                <span className={`text-sm font-black shrink-0 ml-2 ${isHigh ? 'text-emerald-600' : isMed ? 'text-amber-500' : 'text-rose-500'}`}>
                                                                    {score.toFixed(0)} <span className="text-[10px] text-slate-400 font-normal">/100</span>
                                                                </span>
                                                            </div>

                                                            <div className="space-y-1 mb-3">
                                                                {cv.candidate_info?.email && <p className="text-[11px] text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {cv.candidate_info.email}</p>}
                                                                {cv.candidate_info?.phone && <p className="text-[11px] text-slate-500 flex items-center gap-1"><Phone className="w-3 h-3" /> {cv.candidate_info.phone}</p>}
                                                            </div>

                                                            <div className="flex items-center gap-2 mb-3 max-h-12 overflow-y-hidden">
                                                                {cv.ai_score?.matched_skills?.slice(0, 3).map((skill: string, i: number) => (
                                                                    <span key={i} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-bold"><CheckCircle2 className="w-2 h-2 inline mr-1" />{skill}</span>
                                                                ))}
                                                            </div>

                                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                                                                {cv.ai_score?.score_breakdown?.penalty_score > 0 ? (
                                                                    <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1" title="Bị phạt trừ điểm do vi phạm quy tắc ATS"><AlertTriangle className="w-3 h-3" /> Phạt ATS</span>
                                                                ) : <span></span>}

                                                                {cv.file_url && (
                                                                    <button
                                                                        onClick={() => onPreviewCV(cv.file_url, cv.filename)}
                                                                        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                                                                        title="Xem CV gốc"
                                                                    >
                                                                        <Eye className="w-3.5 h-3.5" /> Xem trước
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    );
                })}
            </div>
        </DragDropContext>
    );
}