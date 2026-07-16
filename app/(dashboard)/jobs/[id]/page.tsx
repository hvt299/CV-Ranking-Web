'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft, FileText,
    Award, Briefcase, Mail, Phone,
    Building2, GitCommitHorizontal, ChevronDown, ChevronUp,
    Clock, MapPin, Search, Filter, Trash2, AlertTriangle, Eye, LayoutList, Kanban, Send
} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import CandidateSkillsModal from '@/components/candidates/CandidateSkillsModal';
import JobDetailsContent from '@/components/jobs/JobDetailsContent';
import CandidateKanban from '@/components/candidates/CandidateKanban';
import DocumentViewer from '@/components/ui/DocumentViewer';
import { ApplicationStatus } from '@/types';

const CV_STATUSES = [
    { value: ApplicationStatus.NEW, label: 'Mới nộp', color: 'bg-blue-100 text-blue-700' },
    { value: ApplicationStatus.REVIEWING, label: 'Đang xem xét', color: 'bg-amber-100 text-amber-700' },
    { value: ApplicationStatus.INTERVIEW, label: 'Phỏng vấn', color: 'bg-purple-100 text-purple-700' },
    { value: ApplicationStatus.OFFERED, label: 'Đề nghị (Offer)', color: 'bg-indigo-100 text-indigo-700' },
    { value: ApplicationStatus.HIRED, label: 'Trúng tuyển', color: 'bg-emerald-100 text-emerald-700' },
    { value: ApplicationStatus.REJECTED, label: 'Từ chối', color: 'bg-rose-100 text-rose-700' },
    { value: ApplicationStatus.WITHDRAWN, label: 'Đã rút hồ sơ', color: 'bg-slate-100 text-slate-500' },
];

export default function JobLeaderboardPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.id as string;

    const [jobInfo, setJobInfo] = useState<any>(null);
    const [companyInfo, setCompanyInfo] = useState<any>(null);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [showJobDetails, setShowJobDetails] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [suitabilityFilter, setSuitabilityFilter] = useState('All');
    const [sortBy, setSortBy] = useState('score_high');

    const [editingNote, setEditingNote] = useState<{ id: string } | null>(null);
    const [noteInput, setNoteInput] = useState('');
    const [selectedCandidateForSkills, setSelectedCandidateForSkills] = useState<any>(null);

    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
    const [previewFile, setPreviewFile] = useState<{ url: string, name: string, appId: string } | null>(null);
    const [emailModalData, setEmailModalData] = useState<any>(null);

    const [expandedInsights, setExpandedInsights] = useState<Record<string, boolean>>({});

    const fetchRanking = useCallback(async () => {
        try {
            const res = await api.get(`/jobs/${jobId}/ranking`);
            setJobInfo(res.data.job_info);
            setCandidates(res.data.leaderboard);
            if (res.data.company_info) setCompanyInfo(res.data.company_info);
        } catch (error) {
            toast.error("Không thể tải danh sách ứng viên!");
            router.push('/jobs');
        } finally {
            setIsLoading(false);
        }
    }, [jobId, router]);

    useEffect(() => {
        fetchRanking();
    }, [fetchRanking]);

    const handleStatusChange = async (appId: string, newStatus: string, candidateInfo?: any) => {
        if (newStatus === ApplicationStatus.INTERVIEW) {
            setEmailModalData({ appId, newStatus, ...candidateInfo });
            return;
        }
        await executeStatusUpdate(appId, newStatus);
    };

    const executeStatusUpdate = async (appId: string, newStatus: string) => {
        try {
            await api.patch(`/cv/applications/${appId}`, { status: newStatus });
            toast.success("Cập nhật trạng thái thành công");
            setCandidates(prev => prev.map(cv => cv.id === appId ? { ...cv, status: newStatus } : cv));
            setEmailModalData(null);
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Lỗi khi cập nhật trạng thái");
        }
    };

    const handleViewCV = async (cv: any) => {
        const fileUrl = cv.cv_snapshot?.file_url || cv.file_url;
        const filename = cv.cv_snapshot?.filename || cv.filename;
        setPreviewFile({ url: fileUrl, name: filename, appId: cv.id });

        if (!cv.is_viewed) {
            try {
                await api.patch(`/apply/applications/${cv.id}/view`);
                setCandidates(prev => prev.map(c => c.id === cv.id ? { ...c, is_viewed: true } : c));
            } catch (e) {
                console.error("Lỗi đánh dấu đã xem", e);
            }
        }
    };

    const handleRemoveFromJob = async (appId: string, filename: string) => {
        if (!confirm(`Bạn có chắc chắn muốn gỡ CV ${filename} khỏi chiến dịch này?`)) return;
        try {
            await api.delete(`/cv/applications/${appId}`);
            toast.success("Đã gỡ CV khỏi chiến dịch!");
            setCandidates(prev => prev.filter(cv => cv.id !== appId));
        } catch (error: any) {
            toast.error("Lỗi khi gỡ CV");
        }
    };

    const handleSaveNote = async () => {
        if (!editingNote || !noteInput.trim()) return toast.error("Vui lòng nhập nội dung!");
        try {
            await api.patch(`/cv/applications/${editingNote.id}`, { note_to_add: noteInput });
            toast.success("Đã thêm ghi chú mới!");
            setCandidates(prev => prev.map(cv => cv.id === editingNote.id ? { ...cv, notes: [...(cv.notes || []), noteInput] } : cv));
            setEditingNote(null);
            setNoteInput('');
        } catch (error: any) {
            toast.error("Lỗi khi lưu ghi chú");
        }
    };

    const toggleInsightExpand = (id: string) => {
        setExpandedInsights(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const getSubScoreClass = (val: number) => {
        if (val >= 80) return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
        if (val >= 50) return 'bg-amber-50 text-amber-600 border border-amber-100';
        return 'bg-rose-50 text-rose-600 border border-rose-100';
    };

    const getScoreTheme = (score: number) => {
        if (score >= 80) return { ring: 'text-emerald-500', bg: 'text-emerald-100', border: 'border-emerald-500', badge: 'bg-emerald-100 text-emerald-700', label: 'Phù hợp' };
        if (score >= 50) return { ring: 'text-amber-500', bg: 'text-amber-100', border: 'border-amber-500', badge: 'bg-amber-100 text-amber-700', label: 'Tạm ổn' };
        return { ring: 'text-rose-500', bg: 'text-rose-100', border: 'border-rose-500', badge: 'bg-rose-100 text-rose-700', label: 'Chưa đạt' };
    };

    const filteredCandidates = candidates.filter(cv => {
        const snapshot = cv.cv_snapshot || {};
        const cInfo = snapshot.candidate_info || {};
        const filename = snapshot.filename || '';

        const matchesSearch = filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cInfo.email && cInfo.email.toLowerCase().includes(searchTerm.toLowerCase()));

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
        ...c,
        filename: c.cv_snapshot?.filename || c.filename,
        file_url: c.cv_snapshot?.file_url || c.file_url,
        candidate_info: c.cv_snapshot?.candidate_info || c.candidate_info,
    }));

    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="max-w-7xl mx-auto pb-20 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <button onClick={() => router.push('/jobs')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 font-bold mb-3 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Danh sách chiến dịch
                        </button>
                        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">{jobInfo?.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {companyInfo?.name || jobInfo?.company_name || 'Công ty của tôi'}</span>
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

                {showJobDetails && <JobDetailsContent jobInfo={jobInfo} />}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col 2xl:flex-row justify-between items-start 2xl:items-center gap-4 bg-slate-50/50 dark:bg-slate-900/20">
                    <div className="flex items-center gap-4 w-full 2xl:w-auto justify-between 2xl:justify-start">
                        <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                            <Award className="w-5 h-5 text-amber-500" /> CV Ứng tuyển ({filteredCandidates.length})
                        </h2>
                        <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md flex items-center gap-1 text-xs font-bold transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`}>
                                <LayoutList className="w-4 h-4" /> Danh sách
                            </button>
                            <button onClick={() => setViewMode('kanban')} className={`p-1.5 rounded-md flex items-center gap-1 text-xs font-bold transition-colors ${viewMode === 'kanban' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`}>
                                <Kanban className="w-4 h-4" /> Kanban
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-start 2xl:justify-end gap-3 w-full 2xl:w-auto">
                        <div className="relative grow sm:grow-0-48">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Tìm tên, Email..." className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>

                        <div className="relative min-w-42.5 grow sm:grow-0">
                            <select className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium outline-none cursor-pointer focus:border-blue-500 dark:text-white" value={suitabilityFilter} onChange={e => setSuitabilityFilter(e.target.value)}>
                                <option value="All">Hiển thị tất cả CV</option>
                                <option value="Suitable">Chỉ hiển thị CV Phù hợp</option>
                            </select>
                        </div>

                        <div className="relative min-w-40 grow sm:grow-0">
                            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium outline-none appearance-none cursor-pointer focus:border-blue-500 dark:text-white" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                                <option value="All">Tất cả trạng thái</option>
                                {CV_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                        </div>

                        <div className="relative min-w-37.5 grow sm:grow-0">
                            <select className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium outline-none cursor-pointer focus:border-blue-500 dark:text-white" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                <option value="score_high">Điểm cao nhất</option>
                                <option value="score_low">Điểm thấp nhất</option>
                                <option value="newest">Mới nhất</option>
                                <option value="oldest">Cũ nhất</option>
                            </select>
                        </div>
                    </div>
                </div>

                {filteredCandidates.length === 0 ? (
                    <div className="p-16 text-center text-slate-500 font-medium">Chưa có ứng viên nào. Hãy vào <strong className="text-blue-500 cursor-pointer hover:underline" onClick={() => router.push('/candidates')}>Kho Hồ Sơ</strong> để đối chiếu ứng viên với chiến dịch này!</div>
                ) : (
                    viewMode === 'kanban' ? (
                        <div className="p-4 bg-slate-100/50 dark:bg-slate-900 h-full min-h-150">
                            <CandidateKanban
                                candidates={kanbanCandidates}
                                onStatusChange={(id, status) => {
                                    const cv = candidates.find(c => c.id === id);
                                    handleStatusChange(id, status, cv);
                                }}
                                onPreviewCV={(url, name) => handleViewCV({ id: candidates.find(c => c.cv_snapshot?.file_url === url || c.file_url === url)?.id, file_url: url, filename: name })}
                            />
                        </div>
                    ) : (
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                            {filteredCandidates.map((cv) => {
                                const snapshot = cv.cv_snapshot || {};
                                const cInfo = snapshot.candidate_info || {};
                                const score = cv.ai_score?.total_score || 0;
                                const breakdown = cv.ai_score?.score_breakdown || {};
                                const notes = cv.notes || [];
                                const isViewed = cv.is_viewed;
                                const filename = snapshot.filename || cv.filename || 'CV Không tên';

                                const aiSentences = cv.ai_score?.top_contributing_sentences || [];
                                const fullInsightText = aiSentences.length > 0
                                    ? aiSentences.join(' ')
                                    : 'Hồ sơ có nhiều điểm kỹ năng tương đồng với yêu cầu công việc.';

                                const isExpanded = expandedInsights[cv.id];
                                const isLongText = fullInsightText.length > 150;
                                const displayText = (isLongText && !isExpanded) ? fullInsightText.substring(0, 150) + '...' : fullInsightText;

                                const theme = getScoreTheme(score);
                                const radius = 20;
                                const strokeDasharray = 2 * Math.PI * radius;
                                const strokeDashoffset = strokeDasharray - (score / 100) * strokeDasharray;

                                return (
                                    <div key={cv.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
                                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start xl:items-center">

                                            <div className="xl:col-span-4 flex items-start gap-4">
                                                <div className="flex flex-col items-center gap-2 shrink-0">
                                                    <div className="relative">
                                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl border-2 ${isViewed ? 'bg-slate-100 text-slate-500 border-slate-200' : `${theme.bg} ${theme.border} ${theme.ring}`}`}>
                                                            {filename.charAt(0).toUpperCase()}
                                                        </div>
                                                        {!isViewed && <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>}
                                                    </div>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0 ${isViewed ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-700'}`}>
                                                        {isViewed ? 'Đã xem' : 'Chưa xem'}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-slate-800 dark:text-white mb-2 leading-tight" title={filename}>{filename}</h3>
                                                    <div className="space-y-1.5">
                                                        {cInfo.email && <a href={`mailto:${cInfo.email}`} className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1.5 truncate"><Mail className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{cInfo.email}</span></a>}
                                                        {cInfo.phone && <a href={`tel:${cInfo.phone}`} className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1.5 truncate"><Phone className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{cInfo.phone}</span></a>}
                                                        <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate"><Clock className="w-3.5 h-3.5 shrink-0" /> Nộp lúc: {new Date(cv.applied_at?.$date || cv.applied_at || Date.now()).toLocaleDateString('vi-VN')}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="xl:col-span-6 flex flex-col xl:flex-row items-start gap-4 border-t xl:border-t-0 xl:border-l border-slate-100 dark:border-slate-700 pt-4 xl:pt-0 xl:pl-6 h-full">
                                                <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                                                    <div className="relative w-14 h-14">
                                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
                                                            <circle cx="24" cy="24" r="20" className={`stroke-current ${theme.bg}`} strokeWidth="4" fill="transparent" />
                                                            <circle cx="24" cy="24" r="20" className={`stroke-current ${theme.ring}`} strokeWidth="4" fill="transparent" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
                                                        </svg>
                                                        <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-white">
                                                            {score.toFixed(0)}%
                                                        </div>
                                                    </div>
                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${theme.badge}`}>{theme.label}</span>
                                                </div>

                                                <div className="flex-1 w-full min-w-0">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                                                            <span className={`px-2 py-1 rounded ${getSubScoreClass(breakdown.skills_score || 0)}`}>Kỹ năng: {breakdown.skills_score?.toFixed(0)}</span>
                                                            <span className={`px-2 py-1 rounded ${getSubScoreClass(breakdown.nlp_score || 0)}`}>Ngữ nghĩa: {breakdown.nlp_score?.toFixed(0)}</span>
                                                            <span className={`px-2 py-1 rounded ${getSubScoreClass(breakdown.experience_score || 0)}`}>K.Nghiệm: {breakdown.experience_score?.toFixed(0)}</span>
                                                            <span className={`px-2 py-1 rounded ${getSubScoreClass(breakdown.education_score || 0)}`}>Học vấn: {breakdown.education_score?.toFixed(0)}</span>
                                                        </div>
                                                        <button onClick={() => setSelectedCandidateForSkills(cv)} className="text-[10px] text-blue-600 font-bold hover:underline shrink-0 ml-2">Chi tiết</button>
                                                    </div>

                                                    <div className="bg-amber-50/70 dark:bg-slate-900/50 p-3 rounded-lg border border-amber-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2 relative">
                                                        <span className="text-amber-500 shrink-0 mt-0.5">💡</span>
                                                        <div className="flex-1">
                                                            <p className="italic text-justify leading-relaxed whitespace-pre-line">{displayText}</p>
                                                            {isLongText && (
                                                                <button onClick={() => toggleInsightExpand(cv.id)} className="text-[10px] text-amber-600 font-bold hover:underline mt-1">
                                                                    {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {breakdown.fraud_analysis?.detected && (
                                                        <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1 mt-2"><AlertTriangle className="w-3 h-3" /> Cảnh báo: CV có dấu hiệu nhồi nhét từ khóa (Bị trừ {breakdown.penalty_score}đ)</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="xl:col-span-2 flex flex-row xl:flex-col justify-between items-center xl:items-end border-t xl:border-t-0 xl:border-l border-slate-100 dark:border-slate-700 pt-4 xl:pt-0 xl:pl-6 h-full w-full">
                                                <select
                                                    className={`w-1/2 xl:w-full text-xs font-bold px-3 py-2 rounded-xl outline-none cursor-pointer text-center transition-colors ${CV_STATUSES.find(s => s.value === (cv.status || ApplicationStatus.NEW))?.color || 'bg-slate-100 text-slate-700'}`}
                                                    value={cv.status || ApplicationStatus.NEW}
                                                    onChange={(e) => handleStatusChange(cv.id, e.target.value, cv)}
                                                >
                                                    {CV_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                                </select>

                                                <div className="flex items-center gap-1 mt-0 xl:mt-auto">
                                                    <button onClick={() => handleViewCV(cv)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Xem file">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => { setEditingNote({ id: cv.id }); setNoteInput(''); }} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors relative" title="Ghi chú nội bộ">
                                                        <FileText className="w-4 h-4" />
                                                        {notes.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full"></span>}
                                                    </button>
                                                    <button onClick={() => handleRemoveFromJob(cv.id, filename)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Gỡ khỏi Job">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                )}
            </div>

            {/* MODALS */}
            {emailModalData && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <Send className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-center mb-2">Gửi Email Mời Phỏng Vấn</h3>
                        <p className="text-sm text-center text-slate-500 mb-6">Bạn đang chuyển CV này sang vòng phỏng vấn. Bạn có muốn cấu hình gửi email tự động không?</p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    toast.error("Form nhập lịch sẽ được ráp ở file Modal riêng!");
                                }}
                                className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700"
                            >
                                Cấu hình Lịch & Gửi Email
                            </button>
                            <button
                                onClick={() => executeStatusUpdate(emailModalData.appId, emailModalData.newStatus)}
                                className="w-full py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600"
                            >
                                Bỏ qua, chỉ đổi trạng thái
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editingNote && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-500" /> Thêm ghi chú</h3>
                        <textarea rows={4} value={noteInput} onChange={e => setNoteInput(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm mb-4 resize-none" placeholder="Nhập ghi chú..."></textarea>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setEditingNote(null)} className="px-4 py-2 font-bold text-slate-500">Hủy</button>
                            <button onClick={handleSaveNote} className="px-5 py-2 font-bold text-white bg-blue-600 rounded-xl">Lưu</button>
                        </div>
                    </div>
                </div>
            )}

            <CandidateSkillsModal isOpen={!!selectedCandidateForSkills} onClose={() => setSelectedCandidateForSkills(null)} candidate={{ ...selectedCandidateForSkills, extracted_skills: selectedCandidateForSkills?.cv_snapshot?.extracted_skills || selectedCandidateForSkills?.extracted_skills }} />
            {previewFile && <DocumentViewer url={previewFile.url} filename={previewFile.name} onClose={() => setPreviewFile(null)} />}
        </div>
    );
}