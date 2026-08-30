'use client';

import {
    Mail, Phone, Clock, GraduationCap, Briefcase, FolderOutput, Eye,
    FileText, Trash2, AlertTriangle, GitCommitHorizontal, Globe, ExternalLink, Check
} from 'lucide-react';
import { CV } from '@/types';

interface CandidateListViewProps {
    candidates: CV[];
    selectedIds: string[];
    onToggleSelect: (id: string) => void;
    onMapToJob: (cvId: string) => void;
    onViewSkills: (cv: CV) => void;
    onPreviewCV: (url: string, name: string) => void;
    onDeleteCV: (cvId: string, filename: string) => void;
}

export default function CandidateListView({ candidates, selectedIds, onToggleSelect, onMapToJob, onViewSkills, onPreviewCV, onDeleteCV }: CandidateListViewProps) {
    return (
        <div className="space-y-4 animate-in fade-in">
            {candidates.map((cv) => {
                const cInfo = cv.candidate_info || {};
                const rawFilename = cv.filename || 'Ứng viên';
                const cleanName = cInfo.full_name || rawFilename.split('-TopCV')[0].replace(/-/g, ' ');

                const rawSkills = cv.extracted_skills || [];
                const skills = rawSkills.map((s: any) => typeof s === 'string' ? s : s.name).filter(Boolean);
                const hasRedFlag = cInfo.fraud_analysis?.detected === true;

                const isSelected = selectedIds.includes(cv.id);

                return (
                    <div key={cv.id} className={`bg-white dark:bg-slate-900 p-5 rounded-3xl border transition-all group flex flex-col xl:flex-row gap-6 items-start xl:items-center relative overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary-500/10 ${isSelected ? 'border-primary-500 ring-1 ring-primary-500' : 'border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600'}`}>

                        {/* Cột 1: Selection, Avatar & Info */}
                        <div className="flex items-center gap-4 xl:w-1/3 min-w-0">
                            {/* Checkbox Tròn */}
                            <button
                                onClick={() => onToggleSelect(cv.id)}
                                className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors z-10 ${isSelected
                                    ? 'bg-primary-600 border-primary-600 text-white'
                                    : 'border-slate-300 dark:border-slate-600 hover:border-primary-400 bg-white dark:bg-slate-800'
                                    }`}>
                                {isSelected && <Check className="w-3.5 h-3.5" />}
                            </button>

                            <div className="relative shrink-0">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl bg-linear-to-br from-primary-100 to-primary-200 text-primary-700 border border-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 dark:border-primary-700/50 shadow-sm">
                                    {cleanName.charAt(0).toUpperCase()}
                                </div>
                                {hasRedFlag && (
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm" title="Phát hiện dấu hiệu bất thường">
                                        <AlertTriangle className="w-3.5 h-3.5 text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1.5 truncate group-hover:text-primary-600 transition-colors" title={cleanName}>
                                    {cleanName}
                                </h3>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                                    {cInfo.email && (
                                        <a href={`mailto:${cInfo.email}`} className="text-xs font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1.5 truncate">
                                            <Mail className="w-3.5 h-3.5" /> <span className="truncate max-w-37.5">{cInfo.email}</span>
                                        </a>
                                    )}
                                    {cInfo.phone && (
                                        <a href={`tel:${cInfo.phone}`} className="text-xs font-medium text-slate-500 hover:text-primary-600 flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5" /> {cInfo.phone}
                                        </a>
                                    )}
                                </div>
                                {(cInfo.github || cInfo.linkedin) && (
                                    <div className="flex items-center gap-3 mt-2">
                                        {cInfo.github && (
                                            <a href={`https://${cInfo.github.replace('https://', '')}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 transition-colors">
                                                <GitCommitHorizontal className="w-3.5 h-3.5" /> GitHub <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                        {cInfo.linkedin && (
                                            <a href={`https://${cInfo.linkedin.replace('https://', '')}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-400 hover:text-blue-600 flex items-center gap-1 transition-colors">
                                                <Globe className="w-3.5 h-3.5" /> LinkedIn <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cột 2: Chỉ số tóm tắt */}
                        <div className="flex flex-row gap-3 xl:w-1/4 w-full pl-10 xl:pl-0">
                            <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col justify-center">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Briefcase className="w-3 h-3" /> Kinh nghiệm</span>
                                <span className="text-sm font-black text-slate-700 dark:text-slate-200">{cInfo.years_of_experience || 0} năm</span>
                            </div>
                            <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col justify-center">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Học vấn</span>
                                <span className="text-sm font-black text-slate-700 dark:text-slate-200 truncate" title={cInfo.education_level}>{cInfo.education_level || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Cột 3: Kỹ năng nổi bật */}
                        <div className="xl:w-1/4 w-full flex flex-col justify-center pl-10 xl:pl-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Top Kỹ năng (AI Trích xuất)</p>
                            <div className="flex flex-wrap gap-1.5">
                                {skills.slice(0, 4).map((skillName: string, idx: number) => (
                                    <span key={idx} className="px-2.5 py-1 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm">
                                        {skillName}
                                    </span>
                                ))}
                                {skills.length > 4 && (
                                    <span
                                        className="px-2.5 py-1 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-black border border-primary-200 dark:border-primary-500/20 cursor-pointer hover:bg-primary-100 transition-colors shadow-sm"
                                        onClick={() => onViewSkills(cv)}
                                    >
                                        +{skills.length - 4}
                                    </span>
                                )}
                                {skills.length === 0 && <span className="text-xs text-slate-400 italic">Chưa phân tích được</span>}
                            </div>
                        </div>

                        {/* Cột 4: Thao tác */}
                        <div className="flex flex-row xl:flex-col justify-between items-center xl:items-end gap-3 w-full xl:w-auto ml-auto pl-10 xl:pl-0">
                            <button onClick={() => onMapToJob(cv.id)} className="w-full xl:w-auto whitespace-nowrap flex items-center justify-center gap-1.5 text-xs font-bold bg-primary-600 text-white px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20">
                                <FolderOutput className="w-4 h-4" /> Đưa vào chiến dịch
                            </button>

                            <div className="flex items-center gap-1">
                                <div className="text-[10px] text-slate-400 font-medium mr-2 hidden sm:flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {new Date(cv.created_at || Date.now()).toLocaleDateString('vi-VN')}
                                </div>
                                {cv.file_url && (
                                    <button onClick={() => onPreviewCV(cv.file_url!, cv.filename)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-xl transition-colors" title="Xem CV gốc">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                )}
                                <button onClick={() => onViewSkills(cv)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-colors" title="Xem chi tiết phân tích">
                                    <FileText className="w-4 h-4" />
                                </button>
                                <button onClick={() => onDeleteCV(cv.id, cv.filename)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors" title="Xóa vĩnh viễn">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                    </div>
                );
            })}
        </div>
    );
}