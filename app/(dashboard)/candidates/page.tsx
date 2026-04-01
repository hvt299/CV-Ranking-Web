'use client';

import { useState, useEffect } from 'react';
import { Search, FileText, Mail, Phone, GraduationCap, Briefcase, Building2, Calendar, Filter, GitCommitHorizontal } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

export default function TalentPoolPage() {
    const [candidates, setCandidates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAllCVs = async () => {
            try {
                const res = await api.get('/cv/all');
                setCandidates(res.data);
            } catch (error) {
                console.error("Lỗi khi tải kho hồ sơ", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllCVs();
    }, []);

    const filteredCandidates = candidates.filter(cv => {
        const term = searchTerm.toLowerCase();
        const inName = cv.filename?.toLowerCase().includes(term);
        const inEmail = cv.candidate_info?.email?.toLowerCase().includes(term);
        const inSkills = cv.extracted_skills?.some((skill: string) => skill.toLowerCase().includes(term));
        return inName || inEmail || inSkills;
    });

    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="max-w-350 mx-auto pb-20 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white">Kho hồ sơ</h1>
                    <p className="text-slate-500 mt-1">Lưu trữ toàn bộ CV từ tất cả các chiến dịch.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="relative w-full md:w-1/2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm theo Tên, Email hoặc Kỹ năng (VD: React, Python)..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm focus:border-blue-500 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                <th className="p-4 pl-6">Ứng viên</th>
                                <th className="p-4">Học vấn & Kinh nghiệm</th>
                                <th className="p-4 w-1/3">Kỹ năng AI bóc tách</th>
                                <th className="p-4 pr-6">Nguồn Chiến dịch</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {filteredCandidates.map((cv) => (
                                <tr key={cv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 mt-1"><FileText className="w-4 h-4" /></div>
                                            <div>
                                                <p className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1 mb-1">{cv.filename}</p>
                                                <div className="space-y-1">
                                                    {cv.candidate_info?.email && <a href={`mailto:${cv.candidate_info.email}`} className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors"><Mail className="w-3 h-3" /> {cv.candidate_info.email}</a>}
                                                    {cv.candidate_info?.phone && <a href={`tel:${cv.candidate_info.phone.replace(/[^0-9+]/g, '')}`} className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors"><Phone className="w-3 h-3" /> {cv.candidate_info.phone}</a>}
                                                    {cv.candidate_info?.github && (
                                                        <a href={cv.candidate_info.github.startsWith('http') ? cv.candidate_info.github : `https://${cv.candidate_info.github}`}
                                                            target="_blank" rel="noreferrer"
                                                            className="text-[11px] text-slate-500 hover:text-blue-600 hover:underline flex items-center gap-1.5 transition-colors">
                                                            <GitCommitHorizontal className="w-3 h-3" /> {cv.candidate_info.github}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs"><GraduationCap className="w-3 h-3 text-slate-400" /> <span className="font-semibold text-slate-700">{cv.candidate_info?.education_level || 'Không đề cập'}</span></div>
                                            <div className="flex items-center gap-2 text-xs"><Briefcase className="w-3 h-3 text-slate-400" /> <span className="font-semibold text-slate-700">{cv.candidate_info?.years_of_experience || 0} năm KN</span></div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {cv.extracted_skills?.slice(0, 5).map((skill: string, idx: number) => (
                                                <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold uppercase border border-slate-200 dark:border-slate-600">
                                                    {skill}
                                                </span>
                                            ))}

                                            {cv.extracted_skills?.length > 5 && (
                                                <span
                                                    className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-[10px] font-bold border border-blue-200 dark:border-blue-500/20 cursor-help"
                                                    title={cv.extracted_skills.slice(5).join(', ')}
                                                >
                                                    +{cv.extracted_skills.length - 5} kỹ năng khác
                                                </span>
                                            )}

                                            {(!cv.extracted_skills || cv.extracted_skills.length === 0) && (
                                                <span className="text-xs text-slate-400 italic">Không tìm thấy kỹ năng</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 pr-6">
                                        <div className="flex flex-col gap-2">
                                            <Link href={`/jobs/${cv.job_id}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg w-fit transition-colors">
                                                <Building2 className="w-3 h-3" /> {cv.job_title}
                                            </Link>
                                            <span className={`flex items-center gap-1 text-[10px] font-bold uppercase ${cv.job_deadline && new Date(cv.job_deadline).getTime() < new Date().getTime()
                                                    ? 'text-rose-400'
                                                    : 'text-slate-400'
                                                }`}>
                                                <Calendar className="w-3 h-3" />
                                                {cv.job_deadline
                                                    ? `Hạn nộp: ${new Date(cv.job_deadline).toLocaleDateString('vi-VN')}`
                                                    : 'Không thời hạn'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredCandidates.length === 0 && <div className="p-10 text-center text-slate-500 font-medium">Không tìm thấy ứng viên phù hợp.</div>}
                </div>
            </div>
        </div>
    );
}