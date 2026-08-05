'use client';

import {
    Mail, Phone, GraduationCap, Briefcase, FolderOutput, Eye, FileText,
    Trash2, AlertTriangle, MoreVertical, GitCommitHorizontal, Globe, Check
} from 'lucide-react';
import { CV } from '@/types';
import { useState, useRef, useEffect } from 'react';

interface CandidateGridViewProps {
    candidates: CV[];
    selectedIds: string[];
    onToggleSelect: (id: string) => void;
    onMapToJob: (cvId: string) => void;
    onViewSkills: (cv: CV) => void;
    onPreviewCV: (url: string, name: string) => void;
    onDeleteCV: (cvId: string, filename: string) => void;
}

export default function CandidateGridView({ candidates, selectedIds, onToggleSelect, onMapToJob, onViewSkills, onPreviewCV, onDeleteCV }: CandidateGridViewProps) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
            {candidates.map((cv) => {
                const cInfo = cv.candidate_info || {};
                const rawFilename = cv.filename || 'Ứng viên';
                const cleanName = cInfo.full_name || rawFilename.split('-TopCV')[0].replace(/-/g, ' ');

                const rawSkills = cv.extracted_skills || [];
                const skills = rawSkills.map((s: any) => typeof s === 'string' ? s : s.name).filter(Boolean);
                const hasRedFlag = cInfo.fraud_analysis?.detected === true;

                const isSelected = selectedIds.includes(cv.id);

                return (
                    <div key={cv.id} className={`bg-white dark:bg-slate-900 rounded-3xl border shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-all flex flex-col relative group overflow-hidden ${isSelected ? 'border-primary-500 ring-1 ring-primary-500' : 'border-slate-200 dark:border-slate-800 hover:border-primary-400'}`}>

                        {/* Status & Options (Top bar) */}
                        <div className="p-4 pb-0 flex justify-between items-start z-10">
                            {/* Nút Checkbox */}
                            <button
                                onClick={() => onToggleSelect(cv.id)}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected
                                    ? 'bg-primary-600 border-primary-600 text-white'
                                    : 'border-slate-300 dark:border-slate-600 hover:border-primary-400 bg-white dark:bg-slate-800'
                                    }`}>
                                {isSelected && <Check className="w-3.5 h-3.5" />}
                            </button>

                            <div className="relative">
                                <button onClick={() => setOpenMenuId(openMenuId === cv.id ? null : cv.id)} className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                    <MoreVertical className="w-4 h-4" />
                                </button>

                                {openMenuId === cv.id && (
                                    <div ref={menuRef} className="absolute right-0 top-8 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-10 animate-in fade-in zoom-in-95">
                                        {cv.file_url && (
                                            <button onClick={() => { onPreviewCV(cv.file_url!, cv.filename); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                <Eye className="w-4 h-4" /> Xem CV gốc
                                            </button>
                                        )}
                                        <button onClick={() => { onViewSkills(cv); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                            <FileText className="w-4 h-4" /> Chi tiết Phân tích
                                        </button>
                                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                                        <button onClick={() => { onDeleteCV(cv.id, cv.filename); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                                            <Trash2 className="w-4 h-4" /> Xóa vĩnh viễn
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="p-5 flex flex-col items-center text-center -mt-2">
                            <div className="relative mb-4">
                                <div className="w-20 h-20 rounded-3xl flex items-center justify-center font-black text-3xl bg-linear-to-br from-primary-100 to-primary-200 text-primary-700 border-4 border-white dark:border-slate-900 dark:from-primary-900/40 dark:to-primary-800/40 shadow-md">
                                    {cleanName.charAt(0).toUpperCase()}
                                </div>
                                {hasRedFlag && (
                                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-rose-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm" title="Dấu hiệu rủi ro">
                                        <AlertTriangle className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>

                            <h3 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-1 w-full" title={cleanName}>{cleanName}</h3>

                            {/* Liên hệ & Social */}
                            <div className="flex justify-center items-center gap-2 mt-2">
                                {cInfo.email && (
                                    <a href={`mailto:${cInfo.email}`} title={cInfo.email} className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                                        <Mail className="w-3.5 h-3.5" />
                                    </a>
                                )}
                                {cInfo.phone && (
                                    <a href={`tel:${cInfo.phone}`} title={cInfo.phone} className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                                        <Phone className="w-3.5 h-3.5" />
                                    </a>
                                )}
                                {cInfo.github && (
                                    <a href={`https://${cInfo.github.replace('https://', '')}`} target="_blank" rel="noreferrer" title="GitHub" className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                                        <GitCommitHorizontal className="w-3.5 h-3.5" />
                                    </a>
                                )}
                                {cInfo.linkedin && (
                                    <a href={`https://${cInfo.linkedin.replace('https://', '')}`} target="_blank" rel="noreferrer" title="LinkedIn" className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors">
                                        <Globe className="w-3.5 h-3.5" />
                                    </a>
                                )}
                            </div>

                            {/* Khối Chỉ số */}
                            <div className="grid grid-cols-2 gap-3 w-full mt-5">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col items-center justify-center">
                                    <Briefcase className="w-4 h-4 text-slate-400 mb-1" />
                                    <span className="text-xs font-black text-slate-700 dark:text-slate-200">{cInfo.years_of_experience || 0} năm</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col items-center justify-center">
                                    <GraduationCap className="w-4 h-4 text-slate-400 mb-1" />
                                    <span className="text-xs font-black text-slate-700 dark:text-slate-200 truncate w-full px-1">{cInfo.education_level || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Skills Tags */}
                        <div className="px-5 pb-4 flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Chuyên môn phân tích được</p>
                            <div className="flex flex-wrap gap-1.5">
                                {skills.slice(0, 4).map((skillName: string, idx: number) => (
                                    <span key={idx} className="px-2 py-1 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-[10px] font-bold uppercase border border-slate-200 dark:border-slate-700 shadow-sm">
                                        {skillName}
                                    </span>
                                ))}
                                {skills.length > 4 && (
                                    <span onClick={() => onViewSkills(cv)} className="px-2 py-1 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-md text-[10px] font-bold border border-primary-200 dark:border-primary-500/20 cursor-pointer hover:bg-primary-100 transition-colors shadow-sm">
                                        +{skills.length - 4}
                                    </span>
                                )}
                                {skills.length === 0 && <span className="text-xs text-slate-400 italic">Chưa có dữ liệu</span>}
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="p-5 pt-4 mt-auto border-t border-slate-100 dark:border-slate-800">
                            <button onClick={() => onMapToJob(cv.id)} className="w-full flex items-center justify-center gap-1.5 text-sm font-bold bg-primary-50 hover:bg-primary-600 text-primary-600 hover:text-white dark:bg-primary-900/20 dark:hover:bg-primary-600 border border-primary-200 dark:border-primary-800 px-4 py-3 rounded-xl transition-all shadow-sm">
                                <FolderOutput className="w-4 h-4" /> Đưa vào chiến dịch
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}