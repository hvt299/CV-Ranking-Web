'use client';

import { useState } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Mail, Phone, Eye, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ApplicationStatus } from '@/types';
import { KANBAN_COLUMNS } from '@/constants/application.constants';

interface CandidateKanbanProps {
    candidates: any[];
    onStatusChange: (appId: string, newStatus: string) => void;
    onPreviewCV: (url: string, filename: string) => void;
}

const getPenaltyReasons = (cvInfo: any, breakdown: any) => {
    const reasons = [];
    const fraudReasons = breakdown?.fraud_analysis?.reasons || [];

    if (fraudReasons.length > 0) {
        const translated = fraudReasons.map((r: string) => {
            if (r === 'Keyword stuffing') return 'Nhồi nhét từ khóa';
            if (r === 'White text') return 'Chữ màu trắng';
            if (r.includes('Tiny font') || r.includes('Very small font')) return 'Font chữ siêu nhỏ';
            if (r === 'Hidden flag') return 'Ẩn chữ (Hidden text)';
            if (r === 'Outside page') return 'Chữ ngoài lề';
            return r;
        });
        reasons.push(...translated);
    } else if (breakdown?.fraud_analysis?.detected) {
        reasons.push('Có dấu hiệu gian lận');
    }

    const yoe = cvInfo?.years_of_experience || 0;
    const hops = cvInfo?.job_hops || 1;
    const gaps = cvInfo?.gap_months || 0;

    if (yoe > 0 && (yoe / Math.max(hops, 1)) < 0.8) reasons.push('Nhảy việc quá nhiều');
    if (gaps > 12) reasons.push(`Khoảng trống (${gaps} tháng)`);

    return reasons.length > 0 ? reasons.join(' + ') : 'Vi phạm tiêu chí';
};

/* ---------- Card kéo được ---------- */
function CandidateCard({
    cv,
    column,
    onPreviewCV,
}: {
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
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`bg-white dark:bg-slate-800 p-4 mb-3 rounded-xl border-l-4 ${column.borderColor} shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md cursor-grab active:cursor-grabbing touch-none`}
        >
            <CandidateCardContent
                cv={cv}
                score={score}
                isHigh={isHigh}
                isMed={isMed}
                hasPenalty={hasPenalty}
                breakdown={breakdown}
                onPreviewCV={onPreviewCV}
            />
        </div>
    );
}

/* ---------- Nội dung card (dùng chung cho card thật & DragOverlay) ---------- */
function CandidateCardContent({
    cv,
    score,
    isHigh,
    isMed,
    hasPenalty,
    breakdown,
    onPreviewCV,
}: {
    cv: any;
    score: number;
    isHigh: boolean;
    isMed: boolean;
    hasPenalty: boolean;
    breakdown: any;
    onPreviewCV: (url: string, filename: string) => void;
}) {
    return (
        <>
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1" title={cv.filename}>
                    {cv.filename}
                </h4>
                <span className={`text-sm font-black shrink-0 ml-2 ${isHigh ? 'text-emerald-600' : isMed ? 'text-amber-500' : 'text-rose-500'}`}>
                    {score.toFixed(0)} <span className="text-[10px] text-slate-400 font-normal">/100</span>
                </span>
            </div>

            <div className="space-y-1 mb-3">
                {cv.candidate_info?.email && (
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {cv.candidate_info.email}
                    </p>
                )}
                {cv.candidate_info?.phone && (
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {cv.candidate_info.phone}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-2 mb-3 max-h-12 overflow-y-hidden">
                {cv.ai_score?.matched_skills?.slice(0, 3).map((skill: string, i: number) => (
                    <span key={i} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-bold">
                        <CheckCircle2 className="w-2 h-2 inline mr-1" />
                        {skill}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                {hasPenalty ? (
                    <span
                        className="text-[10px] font-bold text-rose-500 flex items-center gap-1 cursor-help truncate max-w-35"
                        title={`Bị trừ ${breakdown.penalty_score || 0}đ\nLý do: ${getPenaltyReasons(cv.candidate_info, breakdown)}`}
                    >
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                            Trừ {breakdown.penalty_score || 0}đ ({getPenaltyReasons(cv.candidate_info, breakdown)})
                        </span>
                    </span>
                ) : (
                    <span></span>
                )}

                {cv.file_url && (
                    <button
                        onClick={() => onPreviewCV(cv.file_url, cv.filename)}
                        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors shrink-0"
                        title="Xem CV gốc"
                    >
                        <Eye className="w-3.5 h-3.5" /> Xem trước
                    </button>
                )}
            </div>
        </>
    );
}

/* ---------- Cột (Droppable) ---------- */
function KanbanColumn({
    column,
    candidates,
    onPreviewCV,
}: {
    column: (typeof KANBAN_COLUMNS)[number];
    candidates: any[];
    onPreviewCV: (url: string, filename: string) => void;
}) {
    const { setNodeRef, isOver } = useDroppable({ id: column.id });

    return (
        <div className="shrink-0 w-80 flex flex-col bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 max-h-full">
            {/* Header */}
            <div className={`p-3 m-2 rounded-xl font-bold text-sm flex justify-between items-center ${column.headerBg}`}>
                <span>{column.label}</span>
                <span className="bg-white/50 px-2 py-0.5 rounded-lg text-xs">{candidates.length}</span>
            </div>

            {/* Vùng thả */}
            <div
                ref={setNodeRef}
                className={`flex-1 p-2 overflow-y-auto custom-scrollbar transition-colors rounded-b-2xl min-h-37.5 ${isOver ? 'bg-slate-100 dark:bg-slate-800' : ''
                    }`}
            >
                {candidates.map(cv => (
                    <CandidateCard key={cv.id} cv={cv} column={column} onPreviewCV={onPreviewCV} />
                ))}
            </div>
        </div>
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
        <>
            <style>{`
                .hide-scroll::-webkit-scrollbar { display: none; }
                .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {/* Board cuộn ngang + mỗi cột cuộn dọc */}
                <div className="flex gap-4 overflow-x-auto overflow-y-hidden items-start h-[calc(100vh-200px)] hide-scroll pb-2">
                    {KANBAN_COLUMNS.map(column => {
                        const columnCandidates = candidates.filter(c => (c.status || ApplicationStatus.NEW) === column.id);
                        return (
                            <KanbanColumn
                                key={column.id}
                                column={column}
                                candidates={columnCandidates}
                                onPreviewCV={onPreviewCV}
                            />
                        );
                    })}
                </div>

                {/* Bản "ma" đi theo con trỏ khi kéo — mượt hơn hẳn so với react-beautiful-dnd */}
                <DragOverlay>
                    {activeCv && activeColumn ? (
                        <div
                            className={`bg-white dark:bg-slate-800 p-4 rounded-xl border-l-4 ${activeColumn.borderColor} shadow-2xl w-80 rotate-2 cursor-grabbing`}
                        >
                            <CandidateCardContent
                                cv={activeCv}
                                score={activeCv.ai_score?.total_score || 0}
                                isHigh={(activeCv.ai_score?.total_score || 0) >= 80}
                                isMed={(activeCv.ai_score?.total_score || 0) >= 50 && (activeCv.ai_score?.total_score || 0) < 80}
                                hasPenalty={
                                    activeCv.ai_score?.score_breakdown?.penalty_score > 0 ||
                                    activeCv.ai_score?.score_breakdown?.fraud_analysis?.detected
                                }
                                breakdown={activeCv.ai_score?.score_breakdown || {}}
                                onPreviewCV={onPreviewCV}
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </>
    );
}