'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Mail, Phone, Eye, CheckCircle2, AlertTriangle, Users, GripVertical } from 'lucide-react';
import { ApplicationStatus } from '@/types';
import { KANBAN_COLUMNS } from '@/constants/application.constants';
import { getPenaltyReasons } from '@/utils/score';

interface CandidateKanbanProps {
    candidates: any[];
    onStatusChange: (appId: string, newStatus: string) => void;
    onPreviewCV: (url: string, filename: string) => void;
}

function CandidateCard({ cv, column, onPreviewCV }: {
    cv: any;
    column: (typeof KANBAN_COLUMNS)[number];
    onPreviewCV: (url: string, filename: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: cv.id,
        data: { status: column.id },
    });

    const score = cv.ai_score?.total_score || 0;
    const breakdown = cv.ai_score?.score_breakdown || {};
    const isHigh = score >= 80;
    const isMed = score >= 50 && score < 80;
    const hasPenalty = breakdown.penalty_score > 0 || breakdown.fraud_analysis?.detected;

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.35 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={`group relative bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 border-l-[3px] ${column.borderColor} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-grab active:cursor-grabbing touch-none`}>
            <CandidateCardContent cv={cv} score={score} isHigh={isHigh} isMed={isMed} hasPenalty={hasPenalty} breakdown={breakdown} onPreviewCV={onPreviewCV} />
        </div>
    );
}

function CandidateCardContent({ cv, score, isHigh, isMed, hasPenalty, breakdown, onPreviewCV }: {
    cv: any;
    score: number;
    isHigh: boolean;
    isMed: boolean;
    hasPenalty: boolean;
    breakdown: any;
    onPreviewCV: (url: string, filename: string) => void;
}) {
    const filename = cv.filename || 'CV Không tên';
    const email = cv.candidate_info?.email;
    const phone = cv.candidate_info?.phone;
    const skills = cv.ai_score?.matched_skills || [];

    return (
        <>
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0 text-sm font-black text-slate-500 dark:text-slate-300">
                    {filename.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate leading-tight" title={filename}>
                                {filename}
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                <GripVertical className="w-3 h-3" />
                                Kéo để chuyển
                            </p>
                        </div>

                        <div className={`shrink-0 px-2 py-1 rounded-lg text-center ${isHigh ? 'bg-success-50 dark:bg-success-500/10' : isMed ? 'bg-warning-50 dark:bg-warning-500/10' : 'bg-error-50 dark:bg-error-500/10'}`}>
                            <span className={`text-sm font-black leading-none ${isHigh ? 'text-success-600 dark:text-success-400' : isMed ? 'text-warning-600 dark:text-warning-400' : 'text-error-600 dark:text-error-400'}`}>
                                {score.toFixed(0)}
                            </span>
                            <span className="block text-[8px] font-bold text-slate-400 mt-0.5">
                                SCORE
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {(email || phone) && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 space-y-1.5">
                    {email && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 truncate">
                            <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                            <span className="truncate">{email}</span>
                        </p>
                    )}

                    {phone && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 truncate">
                            <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                            <span className="truncate">{phone}</span>
                        </p>
                    )}
                </div>
            )}

            {skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {skills.slice(0, 3).map((skill: string, i: number) => (
                        <span key={i} className="inline-flex items-center gap-1 max-w-full px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[9px] font-bold">
                            <CheckCircle2 className="w-2.5 h-2.5 text-success-500 shrink-0" />
                            <span className="truncate">{skill}</span>
                        </span>
                    ))}

                    {skills.length > 3 && (
                        <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[9px] font-bold">
                            +{skills.length - 3}
                        </span>
                    )}
                </div>
            )}

            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                {hasPenalty ? (
                    <div className="flex items-center gap-1.5 min-w-0 text-[10px] font-bold text-error-500 dark:text-error-400" title={`Bị trừ ${breakdown.penalty_score || 0}đ\nLý do: ${getPenaltyReasons(cv.candidate_info, breakdown)}`}>
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Trừ {breakdown.penalty_score || 0}đ</span>
                    </div>
                ) : (
                    <span className="text-[10px] text-slate-400 font-medium">
                        Hồ sơ hợp lệ
                    </span>
                )}

                {cv.file_url && (
                    <button onClick={(e) => { e.stopPropagation(); onPreviewCV(cv.file_url, filename); }} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40 text-[10px] font-bold transition-colors shrink-0">
                        <Eye className="w-3.5 h-3.5" />
                        Xem CV
                    </button>
                )}
            </div>
        </>
    );
}

function KanbanColumn({ column, candidates, onPreviewCV }: {
    column: (typeof KANBAN_COLUMNS)[number];
    candidates: any[];
    onPreviewCV: (url: string, filename: string) => void;
}) {
    const { setNodeRef, isOver } = useDroppable({ id: column.id });
    const Icon = column.icon;

    return (
        <section className={`w-85 shrink-0 h-full flex flex-col rounded-2xl border ${isOver ? column.columnHover : 'border-slate-200 dark:border-slate-700'} ${column.columnBg} transition-all duration-200 snap-start overflow-hidden`}>
            <header className="shrink-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200/80 dark:border-slate-700/80 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${column.color}`}>
                            <Icon className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                            <h3 className={`text-sm font-black truncate ${column.headerText}`}>
                                {column.label}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                Pipeline ứng viên
                            </p>
                        </div>
                    </div>

                    <span className={`min-w-8 h-8 px-2 rounded-xl flex items-center justify-center text-xs font-black ${column.color}`}>
                        {candidates.length}
                    </span>
                </div>
            </header>

            <div ref={setNodeRef} className={`flex-1 min-h-0 p-3 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950/40 transition-colors ${isOver ? 'bg-slate-100 dark:bg-slate-800/70' : ''}`}>
                {candidates.length > 0 ? (
                    <div className="space-y-3">
                        {candidates.map(cv => (
                            <CandidateCard key={cv.id} cv={cv} column={column} onPreviewCV={onPreviewCV} />
                        ))}
                    </div>
                ) : (
                    <div className={`min-h-40 h-full max-h-56 flex flex-col items-center justify-center rounded-xl border border-dashed ${isOver ? 'border-primary-300 bg-primary-50/40 dark:border-primary-700 dark:bg-primary-900/10' : 'border-slate-300 dark:border-slate-700'}`}>
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                            <Users className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                        </div>
                        <p className="text-[11px] font-bold text-slate-400">
                            Chưa có ứng viên
                        </p>
                        <p className="text-[9px] text-slate-400 mt-1">
                            Kéo hồ sơ vào đây
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default function CandidateKanban({ candidates, onStatusChange, onPreviewCV }: CandidateKanbanProps) {
    const [activeCv, setActiveCv] = useState<any | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 6 },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const cv = candidates.find(c => c.id === event.active.id);
        setActiveCv(cv || null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveCv(null);

        const { active, over } = event;

        if (!over) return;

        const sourceStatus = (active.data.current?.status as string) || ApplicationStatus.NEW;
        const destStatus = over.id as string;

        if (sourceStatus === destStatus) return;

        onStatusChange(active.id as string, destStatus);
    };

    const activeColumn = activeCv
        ? KANBAN_COLUMNS.find(c => c.id === (activeCv.status || ApplicationStatus.NEW))
        : null;

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="w-full h-[calc(100vh-420px)] min-h-125 overflow-x-auto overflow-y-hidden kanban-scroll snap-x snap-mandatory">
                <div className="flex gap-4 h-full min-w-max pr-2">
                    {KANBAN_COLUMNS.map(column => {
                        const columnCandidates = candidates.filter(c => (c.status || ApplicationStatus.NEW) === column.id);

                        return (
                            <KanbanColumn key={column.id} column={column} candidates={columnCandidates} onPreviewCV={onPreviewCV} />
                        );
                    })}
                </div>
            </div>

            <DragOverlay dropAnimation={null}>
                {activeCv && activeColumn ? (
                    <div className={`bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 border-l-[3px] ${activeColumn.borderColor} shadow-2xl w-85 rotate-1 cursor-grabbing`}>
                        <CandidateCardContent
                            cv={activeCv}
                            score={activeCv.ai_score?.total_score || 0}
                            isHigh={(activeCv.ai_score?.total_score || 0) >= 80}
                            isMed={(activeCv.ai_score?.total_score || 0) >= 50 && (activeCv.ai_score?.total_score || 0) < 80}
                            hasPenalty={activeCv.ai_score?.score_breakdown?.penalty_score > 0 || activeCv.ai_score?.score_breakdown?.fraud_analysis?.detected}
                            breakdown={activeCv.ai_score?.score_breakdown || {}}
                            onPreviewCV={onPreviewCV}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}