'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Users, ArrowLeft, FileText, CheckCircle2,
    XCircle, Award, Briefcase, Mail, Phone,
    GraduationCap, Building2, GitCommitHorizontal, ChevronDown, ChevronUp,
    DollarSign, Clock, MapPin, Search, Filter, Trash2, Globe, AlertTriangle, Eye
} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import CandidateSkillsModal from '@/components/candidates/CandidateSkillsModal';
import JobDetailsContent from '@/components/jobs/JobDetailsContent';

const CV_STATUSES = [
    { value: 'Mới', label: 'Mới', color: 'bg-blue-100 text-blue-700' },
    { value: 'Đang xem xét', label: 'Đang xem xét', color: 'bg-amber-100 text-amber-700' },
    { value: 'Phỏng vấn', label: 'Phỏng vấn', color: 'bg-purple-100 text-purple-700' },
    { value: 'Đề nghị (Offer)', label: 'Đề nghị (Offer)', color: 'bg-indigo-100 text-indigo-700' },
    { value: 'Trúng tuyển', label: 'Trúng tuyển', color: 'bg-emerald-100 text-emerald-700' },
    { value: 'Từ chối', label: 'Từ chối', color: 'bg-rose-100 text-rose-700' },
];

export default function JobLeaderboardPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.id as string;

    const [jobInfo, setJobInfo] = useState<any>(null);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [showJobDetails, setShowJobDetails] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const [editingNote, setEditingNote] = useState<{ id: string, currentNote: string } | null>(null);
    const [noteInput, setNoteInput] = useState('');
    const [selectedCandidateForSkills, setSelectedCandidateForSkills] = useState<any>(null);

    const fetchRanking = useCallback(async () => {
        try {
            const res = await api.get(`/jobs/${jobId}/ranking`);
            setJobInfo(res.data.job_info);
            setCandidates(res.data.leaderboard);
        } catch (error) {
            toast.error("Không thể tải bảng xếp hạng!");
            router.push('/jobs');
        } finally {
            setIsLoading(false);
        }
    }, [jobId, router]);

    useEffect(() => {
        fetchRanking();
    }, [fetchRanking]);

    const handleStatusChange = async (appId: string, newStatus: string) => {
        try {
            await api.patch(`/cv/applications/${appId}`, { status: newStatus });
            toast.success("Cập nhật trạng thái thành công");
            setCandidates(prev => prev.map(cv => cv.id === appId ? { ...cv, status: newStatus } : cv));
        } catch (error) {
            toast.error("Lỗi khi cập nhật trạng thái");
        }
    };

    const handleRemoveFromJob = async (appId: string, filename: string) => {
        if (!confirm(`Bạn có chắc chắn muốn gỡ CV ${filename} khỏi chiến dịch này? (CV gốc vẫn sẽ được giữ lại trong Kho Talent Pool)`)) return;
        try {
            await api.delete(`/cv/applications/${appId}`);
            toast.success("Đã gỡ CV khỏi chiến dịch!");
            setCandidates(prev => prev.filter(cv => cv.id !== appId));
        } catch (error) {
            toast.error("Lỗi khi gỡ CV");
        }
    };

    const handleSaveNote = async () => {
        if (!editingNote) return;
        try {
            await api.patch(`/cv/applications/${editingNote.id}`, { note: noteInput });
            if (noteInput.trim() === '') toast.success("Đã xóa trắng ghi chú");
            else toast.success("Đã lưu ghi chú!");

            setCandidates(prev => prev.map(cv => {
                if (cv.id === editingNote.id) return { ...cv, note: noteInput };
                return cv;
            }));

            setEditingNote(null);
            setNoteInput('');
        } catch (error) {
            toast.error("Lỗi khi lưu ghi chú");
        }
    };

    const filteredCandidates = candidates.filter(cv => {
        const matchesSearch = cv.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cv.candidate_info?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || cv.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatCurrency = (val: number | null | undefined) => {
        if (!val) return 'Thỏa thuận';
        return new Intl.NumberFormat('vi-VN').format(val);
    };

    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="max-w-350 mx-auto pb-20 space-y-6">
            {/* HEADER & JOB DETAILS */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <button onClick={() => router.push('/jobs')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 font-bold mb-3 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Danh sách chiến dịch
                        </button>
                        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">{jobInfo?.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {jobInfo?.company_name}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {jobInfo?.location?.city || 'Việt Nam'}</span>
                            <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                                {jobInfo?.work_mode} • {jobInfo?.job_level}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                        <button onClick={() => setShowJobDetails(!showJobDetails)} className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300 transition-colors">
                            {showJobDetails ? 'Đóng chi tiết JD' : 'Xem chi tiết JD'}
                            {showJobDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* KHU VỰC CHI TIẾT JOB */}
                {showJobDetails && (
                    <JobDetailsContent jobInfo={jobInfo} />
                )}
            </div>

            {/* BẢNG XẾP HẠNG */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-900/20">
                    <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2"><Award className="w-5 h-5 text-amber-500" /> Bảng xếp hạng AI ({filteredCandidates.length})</h2>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Tìm tên CV, Email..." className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="relative min-w-35">
                            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium outline-none appearance-none cursor-pointer focus:border-blue-500 dark:text-white" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                                <option value="All">Tất cả trạng thái</option>
                                {CV_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {filteredCandidates.length === 0 ? (
                    <div className="p-16 text-center text-slate-500 font-medium">Chưa có ứng viên nào. Hãy vào <strong className="text-blue-500 cursor-pointer" onClick={() => router.push('/candidates')}>Kho Hồ Sơ</strong> để đối chiếu ứng viên với chiến dịch này!</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                    <th className="p-4 pl-6 w-12 text-center">Top</th>
                                    <th className="p-4 w-1/4">Thông tin Liên hệ</th>
                                    <th className="p-4 w-1/4">Học vấn & Kỹ năng</th>
                                    <th className="p-4 w-48 text-right">AI Score</th>
                                    <th className="p-4 pr-6 w-40 text-center">Quản lý</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {filteredCandidates.map((cv, index) => {
                                    const score = cv.ai_score?.total_score || 0;
                                    const breakdown = cv.ai_score?.score_breakdown || {};
                                    const skillExp = cv.candidate_info?.skill_experience || {};

                                    let rankColor = "bg-slate-100 text-slate-600";
                                    if (statusFilter === 'All') {
                                        if (index === 0) rankColor = "bg-amber-100 text-amber-600 border border-amber-200 shadow-sm";
                                        if (index === 1) rankColor = "bg-slate-200 text-slate-700 border border-slate-300 shadow-sm";
                                        if (index === 2) rankColor = "bg-orange-100 text-orange-600 border border-orange-200 shadow-sm";
                                    }

                                    return (
                                        <tr key={cv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                            {/* CỘT 1: Hạng */}
                                            <td className="p-4 pl-6 text-center"><div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-black text-sm ${rankColor}`}>{statusFilter === 'All' ? `#${index + 1}` : '-'}</div></td>

                                            {/* CỘT 2: Thông tin & Social Links */}
                                            <td className="p-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 mt-1"><FileText className="w-4 h-4" /></div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1" title={cv.filename}>{cv.filename}</p>
                                                            {cv.note && <span title={cv.note} className="text-amber-500 cursor-help"><FileText className="w-3.5 h-3.5" /></span>}
                                                        </div>
                                                        <div className="space-y-1.5 mt-1">
                                                            {cv.candidate_info?.email && (
                                                                <a href={`mailto:${cv.candidate_info.email}`} className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1.5 w-max">
                                                                    <Mail className="w-3 h-3 shrink-0" /> {cv.candidate_info.email}
                                                                </a>
                                                            )}
                                                            {cv.candidate_info?.phone && (
                                                                <a href={`tel:${cv.candidate_info.phone.replace(/[^0-9+]/g, '')}`} className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1.5 w-max">
                                                                    <Phone className="w-3 h-3 shrink-0" /> {cv.candidate_info.phone}
                                                                </a>
                                                            )}
                                                            {cv.candidate_info?.linkedin && (
                                                                <a href={cv.candidate_info.linkedin.startsWith('http') ? cv.candidate_info.linkedin : `https://${cv.candidate_info.linkedin}`} target="_blank" rel="noreferrer" className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1.5 w-max">
                                                                    <Users className="w-3 h-3 shrink-0" />
                                                                    <span className="truncate max-w-45">{cv.candidate_info.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
                                                                </a>
                                                            )}
                                                            {cv.candidate_info?.github && (
                                                                <a href={cv.candidate_info.github.startsWith('http') ? cv.candidate_info.github : `https://${cv.candidate_info.github}`} target="_blank" rel="noreferrer" className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1.5 w-max">
                                                                    <GitCommitHorizontal className="w-3 h-3 shrink-0" />
                                                                    <span className="truncate max-w-45">{cv.candidate_info.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
                                                                </a>
                                                            )}
                                                            {cv.candidate_info?.portfolio && cv.candidate_info.portfolio.length > 0 && cv.candidate_info.portfolio.map((link: string, i: number) => (
                                                                <a key={i} href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noreferrer" className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1.5 w-max">
                                                                    <Globe className="w-3 h-3 shrink-0" />
                                                                    <span className="truncate max-w-45">{link.replace(/^https?:\/\/(www\.)?/, '')}</span>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* CỘT 3: Kỹ năng & Kinh nghiệm */}
                                            <td className="p-4">
                                                <div className="space-y-2 mb-2">
                                                    <div className="flex items-center gap-2 text-xs"><GraduationCap className="w-3 h-3 text-slate-400" /> <span className="font-semibold text-slate-700 dark:text-slate-200">{cv.candidate_info?.education_level || 'Không đề cập'}</span></div>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <Briefcase className="w-3 h-3 text-slate-400" />
                                                        <span className="font-semibold text-slate-700 dark:text-slate-200">{cv.candidate_info?.years_of_experience || 0} năm KN</span>
                                                    </div>

                                                    {/* NÚT MỞ MODAL XEM CHI TIẾT */}
                                                    <button
                                                        onClick={() => setSelectedCandidateForSkills(cv)}
                                                        className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 px-2 py-1.5 rounded-md transition-colors w-max mt-1"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" /> Xem chi tiết Kỹ năng
                                                    </button>
                                                </div>
                                                <div className="flex flex-wrap gap-1 max-h-12 overflow-y-auto custom-scrollbar">
                                                    {cv.ai_score?.matched_skills?.map((skill: string, idx: number) => <span key={idx} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-bold uppercase"><CheckCircle2 className="w-2 h-2 inline mr-1" />{skill}</span>)}
                                                    {cv.ai_score?.missing_required_skills?.map((skill: string, idx: number) => <span key={idx} className="px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[9px] font-bold uppercase opacity-75"><XCircle className="w-2 h-2 inline mr-1" />{skill}</span>)}
                                                </div>
                                            </td>

                                            {/* CỘT 4: Điểm AI */}
                                            <td className="p-4 pr-6">
                                                {/* HIỂN THỊ CẢNH BÁO PHẠT NẾU CÓ */}
                                                {breakdown.penalty_score > 0 && (
                                                    <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-rose-500 mb-1" title="CV quá sơ sài, hệ thống tự động trừ điểm">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        Bị phạt trừ {breakdown.penalty_score}đ
                                                    </div>
                                                )}
                                                <div className="text-right mb-1"><span className={`text-xl font-black ${score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>{score.toFixed(1)}</span><span className="text-[10px] text-slate-400 font-bold ml-1">/100</span></div>
                                                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                                                    <div className="flex flex-col gap-0.5 text-[8px] font-bold text-slate-500"><div className="flex justify-between"><span>K.NĂNG</span><span>{breakdown.skills_score?.toFixed(0) || 0}</span></div><div className="w-full h-1 bg-slate-100 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, breakdown.skills_score || 0)}%` }}></div></div></div>
                                                    <div className="flex flex-col gap-0.5 text-[8px] font-bold text-slate-500"><div className="flex justify-between"><span>N.NGHĨA</span><span>{breakdown.nlp_score?.toFixed(0) || 0}</span></div><div className="w-full h-1 bg-slate-100 rounded-full"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, breakdown.nlp_score || 0)}%` }}></div></div></div>
                                                    <div className="flex flex-col gap-0.5 text-[8px] font-bold text-slate-500"><div className="flex justify-between"><span>K.NGHIỆM</span><span>{breakdown.experience_score?.toFixed(0) || 0}</span></div><div className="w-full h-1 bg-slate-100 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, breakdown.experience_score || 0)}%` }}></div></div></div>
                                                    <div className="flex flex-col gap-0.5 text-[8px] font-bold text-slate-500"><div className="flex justify-between"><span>H.VẤN</span><span>{breakdown.education_score?.toFixed(0) || 0}</span></div><div className="w-full h-1 bg-slate-100 rounded-full"><div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, breakdown.education_score || 0)}%` }}></div></div></div>
                                                </div>
                                            </td>

                                            {/* CỘT 5: Quản lý */}
                                            <td className="p-4 pr-6 text-center">
                                                <div className="flex flex-col items-end gap-2">
                                                    <select className={`text-xs font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer appearance-none text-center border-none shadow-sm transition-colors ${CV_STATUSES.find(s => s.value === (cv.status || 'Mới'))?.color || 'bg-slate-100 text-slate-700'}`} value={cv.status || 'Mới'} onChange={(e) => handleStatusChange(cv.id, e.target.value)}>
                                                        {CV_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                                    </select>

                                                    {/* NÚT GỠ KHỎI JOB */}
                                                    <button onClick={() => handleRemoveFromJob(cv.id, cv.filename)} className="text-[10px] flex items-center gap-1 font-bold text-slate-400 hover:text-rose-600 px-2 py-1 rounded hover:bg-rose-50 transition-colors">
                                                        <Trash2 className="w-3 h-3" /> Gỡ khỏi Job
                                                    </button>

                                                    <button onClick={() => { setEditingNote({ id: cv.id, currentNote: cv.note || '' }); setNoteInput(cv.note || ''); }} className="text-[10px] flex items-center gap-1 font-bold text-slate-400 hover:text-blue-600 px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                                                        <FileText className="w-3 h-3" /> Ghi chú
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL GHI CHÚ */}
            {editingNote && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-500" /> {editingNote.currentNote ? 'Thay đổi ghi chú' : 'Thêm Ghi chú'}
                        </h3>
                        <textarea rows={4} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm mb-4 resize-none focus:border-blue-500 transition-colors" placeholder="Nhập đánh giá, ghi chú phỏng vấn..." value={noteInput} onChange={e => setNoteInput(e.target.value)}></textarea>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setEditingNote(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl">Hủy</button>
                            <button onClick={handleSaveNote} className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl">Lưu lại</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL KỸ NĂNG */}
            <CandidateSkillsModal
                isOpen={!!selectedCandidateForSkills}
                onClose={() => setSelectedCandidateForSkills(null)}
                candidate={selectedCandidateForSkills}
            />
        </div>
    );
}