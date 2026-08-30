'use client';

import { BrainCircuit, GraduationCap, Zap, CheckCircle2, User, Star } from 'lucide-react';
import { Job } from '@/types';

interface TabAIConfigProps {
    jobInfo: Job;
}

export default function TabAIConfig({ jobInfo }: TabAIConfigProps) {
    if (!jobInfo) return null;

    const aiWeights = {
        skills: Math.round((jobInfo.score_weights?.skills_weight || 0.4) * 100),
        nlp: Math.round((jobInfo.score_weights?.nlp_weight || 0.3) * 100),
        experience: Math.round((jobInfo.score_weights?.experience_weight || 0.2) * 100),
        education: Math.round((jobInfo.score_weights?.education_weight || 0.1) * 100)
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">

            {/* KHỐI 1: TRỌNG SỐ AI */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-blue-500" />
                    <h3 className="text-base font-black text-slate-800 dark:text-white tracking-wider">
                        Phân bổ Trọng số Thuật toán AI
                    </h3>
                    <span className="px-1.5 py-0.5 rounded-sm text-[9px] font-black bg-linear-to-r from-amber-500 to-orange-500 text-white uppercase tracking-widest shadow-sm ml-2">
                        Pro
                    </span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 h-1 bg-primary-500 transition-all" style={{ width: `${aiWeights.skills}%` }}></div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Kỹ năng</p>
                        <p className="text-3xl font-black text-primary-600 dark:text-primary-400">{aiWeights.skills}%</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all" style={{ width: `${aiWeights.nlp}%` }}></div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ngữ nghĩa</p>
                        <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{aiWeights.nlp}%</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all" style={{ width: `${aiWeights.experience}%` }}></div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Kinh nghiệm</p>
                        <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{aiWeights.experience}%</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 h-1 bg-amber-500 transition-all" style={{ width: `${aiWeights.education}%` }}></div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Học vấn</p>
                        <p className="text-3xl font-black text-amber-500">{aiWeights.education}%</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* KHỐI 2: KỸ NĂNG CHUYÊN MÔN */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary-500" />
                        <h3 className="text-base font-black text-slate-800 dark:text-white tracking-wider">
                            Kỹ năng Truy vấn (Vector)
                        </h3>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <div>
                            <p className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> KỸ NĂNG BẮT BUỘC (MUST-HAVE)</p>
                            {jobInfo.required_skills && jobInfo.required_skills.length > 0 ? (
                                <div className="space-y-2.5">
                                    {jobInfo.required_skills.map((skill: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{skill.name}</span>
                                            <div className="flex items-center gap-2 text-[10px] font-black">
                                                {(skill.min_years ?? 0) > 0 && <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-md">{skill.min_years} năm</span>}
                                                <span className="bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded-md">Trọng số: {skill.weight}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-sm italic text-slate-400">Không có yêu cầu.</p>}
                        </div>

                        <div>
                            <p className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500" /> KỸ NĂNG ƯU TIÊN (ĐIỂM CỘNG)</p>
                            {jobInfo.preferred_skills && jobInfo.preferred_skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {jobInfo.preferred_skills.map((skill: any, idx: number) => (
                                        <span key={idx} className="px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1.5">
                                            {skill.name} <span className="text-[10px] text-slate-400">({skill.weight})</span>
                                        </span>
                                    ))}
                                </div>
                            ) : <p className="text-sm italic text-slate-400">Không có yêu cầu.</p>}
                        </div>
                    </div>
                </div>

                {/* KHỐI 3: TIÊU CHÍ SÀNG LỌC */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-emerald-500" />
                        <h3 className="text-base font-black text-slate-800 dark:text-white tracking-wider">
                            Tiêu chí Sàng lọc cứng
                        </h3>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-sm font-medium text-slate-500">Kinh nghiệm tối thiểu</span>
                            <span className="text-sm font-bold text-slate-800 dark:text-white">{jobInfo.min_yoe} năm</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-sm font-medium text-slate-500">Giới tính</span>
                            <span className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1">
                                <User className="w-3.5 h-3.5 text-slate-400" /> {jobInfo.gender_requirement || 'Không yêu cầu'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-sm font-medium text-slate-500">Học vấn tối thiểu</span>
                            <span className="text-sm font-bold text-slate-800 dark:text-white">{jobInfo.education?.min_level || 'Không yêu cầu'}</span>
                        </div>

                        {jobInfo.education?.preferred_majors && jobInfo.education.preferred_majors.length > 0 && (
                            <div className="py-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="block text-sm font-medium text-slate-500 mb-2">Chuyên ngành ưu tiên</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {jobInfo.education.preferred_majors.map((major: string, idx: number) => (
                                        <span key={idx} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded-md">{major}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {jobInfo.languages && jobInfo.languages.length > 0 && (
                            <div className="py-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="block text-sm font-medium text-slate-500 mb-2">Ngoại ngữ</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {jobInfo.languages.map((lang: string, idx: number) => (
                                        <span key={idx} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 text-[11px] font-bold rounded-md">{lang}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {jobInfo.required_certifications && jobInfo.required_certifications.length > 0 && (
                            <div className="py-2">
                                <span className="block text-sm font-medium text-slate-500 mb-2">Chứng chỉ chuyên môn</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {jobInfo.required_certifications.map((cert: string, idx: number) => (
                                        <span key={idx} className="px-2.5 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/50 text-[11px] font-bold rounded-md">{cert}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}