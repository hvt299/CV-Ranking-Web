'use client';

import { useState, useEffect } from 'react';
import {
    Search, GraduationCap, Briefcase, UploadCloud, FolderOutput,
    LayoutList, LayoutGrid, X, Trash2, CheckSquare, ChevronLeft, ChevronRight, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { useTheme } from "next-themes";

import CandidateListView from '@/components/candidates/pool/CandidateListView';
import CandidateGridView from '@/components/candidates/pool/CandidateGridView';
import CandidateSkillsModal from '@/components/candidates/CandidateSkillsModal';
import DocumentViewer from '@/components/shared/DocumentViewer';

import { CV } from '@/types';
import { useTalentPool } from '@/features/candidate/useCandidate';
import { EDUCATION_LEVELS, EXPERIENCE_RANGES } from '@/constants/job.constants';
import { useSubscription } from '@/hooks/useSubscription';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';

export default function TalentPoolPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const customSelectStyles = {
        control: (base: any, state: any) => ({
            ...base, background: 'transparent', borderColor: state.isFocused ? '#3b82f6' : (isDark ? '#334155' : '#e2e8f0'),
            borderRadius: '0.75rem', padding: '4px', boxShadow: 'none', fontSize: '0.875rem'
        }),
        menu: (base: any) => ({
            ...base, zIndex: 9999, fontSize: '0.875rem', backgroundColor: isDark ? '#1e293b' : '#ffffff',
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`
        }),
        option: (base: any, state: any) => ({
            ...base, cursor: 'pointer', backgroundColor: state.isFocused ? (isDark ? '#334155' : '#f1f5f9') : 'transparent',
            color: isDark ? '#f8fafc' : '#1e293b'
        }),
        singleValue: (base: any) => ({ ...base, color: isDark ? '#f8fafc' : '#1e293b' })
    };

    const {
        candidates, jobs, isLoading, isUploading, uploadProgress, isMapping,
        uploadFiles, deleteCV, mapCvToJob, mapMultipleCvsToJob
    } = useTalentPool();

    // Lấy thông tin gói cước của HR để hiển thị hạn mức Parse CV
    const { data: myPlanRes } = useSubscription();
    const { data: plansRes } = useSubscriptionPlans('hr');
    const currentPlanCode = myPlanRes?.data?.current_plan_code || 'hr_free';
    const currentPlan = plansRes?.data?.find((p: any) => p.plan_code === currentPlanCode);
    const maxCvParses = currentPlan?.features?.max_cv_parses_per_month || 20;

    const [searchTerm, setSearchTerm] = useState('');
    const [filterEducation, setFilterEducation] = useState('');
    const [filterExperience, setFilterExperience] = useState('');

    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [selectedCvIds, setSelectedCvIds] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = viewMode === 'grid' ? 12 : 10;

    const [showMapModal, setShowMapModal] = useState(false);
    const [isBatchMapping, setIsBatchMapping] = useState(false);
    const [targetCvIdForSingle, setTargetCvIdForSingle] = useState<string | null>(null);
    const [selectedJobId, setSelectedJobId] = useState<string>('');

    const [selectedCandidateForSkills, setSelectedCandidateForSkills] = useState<CV | null>(null);
    const [previewFile, setPreviewFile] = useState<{ url: string, name: string } | null>(null);

    useEffect(() => {
        const savedView = localStorage.getItem('cv_pool_view_mode') as 'list' | 'grid';
        if (savedView) setViewMode(savedView);
        setMounted(true);
    }, []);

    const toggleViewMode = (mode: 'list' | 'grid') => {
        setViewMode(mode);
        setCurrentPage(1);
        localStorage.setItem('cv_pool_view_mode', mode);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await uploadFiles(e.target.files);
        e.target.value = '';
    };

    const handleToggleSelect = (cvId: string) => {
        setSelectedCvIds(prev => prev.includes(cvId) ? prev.filter(id => id !== cvId) : [...prev, cvId]);
    };

    const handleSelectAll = (cvIds: string[]) => {
        if (selectedCvIds.length === cvIds.length) setSelectedCvIds([]);
        else setSelectedCvIds(cvIds);
    };

    const openSingleMap = (cvId: string) => {
        setTargetCvIdForSingle(cvId);
        setIsBatchMapping(false);
        setShowMapModal(true);
    };

    const openBatchMap = () => {
        setIsBatchMapping(true);
        setShowMapModal(true);
    };

    const handleConfirmMap = async () => {
        if (!selectedJobId) {
            toast.error("Vui lòng chọn một chiến dịch!");
            return;
        }

        let success: boolean | string = false;

        if (isBatchMapping) {
            success = await mapMultipleCvsToJob(selectedCvIds, selectedJobId);
            if (success === true) setSelectedCvIds([]);
        } else {
            success = await mapCvToJob(targetCvIdForSingle!, selectedJobId);
        }

        if (success === true) {
            setShowMapModal(false);
            setSelectedJobId('');
            setTargetCvIdForSingle(null);
        }
    };

    const jobOptions = jobs.map(job => ({
        value: job.id,
        label: `${job.title} (${job.company_name || 'Công ty'})`
    }));

    const filteredCandidates = candidates.filter(cv => {
        const term = searchTerm.toLowerCase();
        const cInfo = cv.candidate_info || {};
        const yoe = cInfo.years_of_experience || 0;
        const edu = cInfo.education_level || '';

        const matchSearch = cv.filename?.toLowerCase().includes(term) ||
            cInfo.email?.toLowerCase().includes(term) ||
            (cv.extracted_skills || []).some((s) => s.name?.toLowerCase().includes(term));

        let matchEdu = true;
        if (filterEducation && filterEducation !== 'Không yêu cầu') {
            matchEdu = edu.includes(filterEducation);
        }

        let matchExp = true;
        if (filterExperience) {
            if (['none', 'intern', 'fresher'].includes(filterExperience)) {
                matchExp = yoe < 1;
            } else {
                const [minStr, maxStr] = filterExperience.split('-');
                const min = Number(minStr);
                const max = Number(maxStr);
                if (max) matchExp = yoe >= min && yoe <= max;
                else matchExp = yoe >= min;
            }
        }

        return matchSearch && matchEdu && matchExp;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterEducation, filterExperience]);

    const paginatedCandidates = filteredCandidates.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(filteredCandidates.length / pageSize);

    if (!mounted) return null;

    if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div></div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            {/* HEADER & VIEW TOGGLE */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex-1">
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Kho hồ sơ</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Lưu trữ tập trung. Phân tích 1 lần, ứng tuyển nhiều dự án.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                    {/* Hiển thị hạn mức Parse CV theo chuẩn UI/UX */}
                    <div className="bg-info-50 dark:bg-info-500/10 border border-info-100 dark:border-info-500/20 p-2.5 pr-4 rounded-2xl flex items-center gap-3 transition-colors">
                        <div className="w-10 h-10 bg-info-100 dark:bg-info-500/20 text-info-600 dark:text-info-500 flex items-center justify-center rounded-xl shrink-0">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-info-600 dark:text-info-500 uppercase tracking-wider mb-0.5">Hạn mức Parse CV</p>
                            <p className="text-sm font-black text-info-700 dark:text-info-100">
                                Tối đa {maxCvParses} CV / tháng
                            </p>
                        </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl shrink-0 border border-slate-200 dark:border-slate-700/50">
                        <button
                            onClick={() => toggleViewMode('list')}
                            className={`p-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            <LayoutList className="w-4 h-4" /> <span className="hidden sm:inline">Danh sách</span>
                        </button>
                        <button
                            onClick={() => toggleViewMode('grid')}
                            className={`p-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            <LayoutGrid className="w-4 h-4" /> <span className="hidden sm:inline">Lưới</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* KHU VỰC UPLOAD CHUNG */}
            <div className="bg-primary-50/50 dark:bg-primary-900/10 border-2 border-dashed border-primary-200 dark:border-primary-800/50 rounded-3xl p-6 text-center relative hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group">
                <input type="file" multiple accept=".pdf,.docx" onChange={handleFileUpload} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                {isUploading ? (
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white">Đang tải và Bóc tách NLP...</h3>
                        <p className="text-xs text-slate-500 font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl px-3 py-1 shadow-sm">Tiến độ: {uploadProgress.current} / {uploadProgress.total} file</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                        <UploadCloud className="w-8 h-8 text-primary-500 mb-1 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-slate-800 dark:text-white">Kéo thả CV mới vào Kho (Nhiều file cùng lúc)</h3>
                        <p className="text-slate-500 text-xs font-medium">Hệ thống tự bóc tách dữ liệu. Hỗ trợ .PDF, .DOCX (Tối đa 5MB/file)</p>
                    </div>
                )}
            </div>

            {/* THANH TÌM KIẾM & BỘ LỌC TỐI GIẢN THEO CHUẨN JOB */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm theo Tên, Email hoặc Kỹ năng..."
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-slate-700 dark:text-white text-sm font-medium focus:border-primary-500 transition-colors shadow-sm placeholder:font-normal"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                    <div className="relative min-w-42.5 flex-1">
                        <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            className="w-full pl-10 pr-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none cursor-pointer focus:border-primary-500 shadow-sm"
                            value={filterEducation}
                            onChange={(e) => setFilterEducation(e.target.value)}
                        >
                            <option value="">Tất cả học vấn</option>
                            {EDUCATION_LEVELS.map(level => (
                                <option key={level.value} value={level.value}>{level.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative min-w-45 flex-1">
                        <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            className="w-full pl-10 pr-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-bold text-slate-600 dark:text-slate-300 appearance-none cursor-pointer focus:border-primary-500 shadow-sm"
                            value={filterExperience}
                            onChange={(e) => setFilterExperience(e.target.value)}
                        >
                            {EXPERIENCE_RANGES.map(exp => (
                                <option key={exp.value} value={exp.value}>{exp.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* HEADER KẾT QUẢ & CHECKBOX CHỌN ALL */}
            <div className="flex items-center justify-between px-2 pt-5 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                    {filteredCandidates.length > 0 && (
                        <button
                            onClick={() => handleSelectAll(filteredCandidates.map(c => c.id))}
                            className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors"
                        >
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selectedCvIds.length === filteredCandidates.length && filteredCandidates.length > 0 ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                                {selectedCvIds.length === filteredCandidates.length && filteredCandidates.length > 0 && <CheckSquare className="w-3.5 h-3.5" />}
                            </div>
                            Chọn tất cả
                        </button>
                    )}
                </div>
                <div className="text-sm font-medium text-slate-500">
                    Đã tìm thấy <span className="text-primary-600 font-bold">{filteredCandidates.length}</span> hồ sơ
                </div>
            </div>

            {/* KHU VỰC RENDER GIAO DIỆN (LIST HOẶC GRID) */}
            {filteredCandidates.length === 0 && !isLoading ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                    <p className="text-slate-500 font-medium">Chưa có hồ sơ nào khớp với tìm kiếm của bạn.</p>
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <CandidateGridView
                            candidates={paginatedCandidates}
                            selectedIds={selectedCvIds}
                            onToggleSelect={handleToggleSelect}
                            onMapToJob={openSingleMap}
                            onViewSkills={setSelectedCandidateForSkills}
                            onPreviewCV={(url, name) => setPreviewFile({ url, name })}
                            onDeleteCV={deleteCV}
                        />
                    ) : (
                        <CandidateListView
                            candidates={paginatedCandidates}
                            selectedIds={selectedCvIds}
                            onToggleSelect={handleToggleSelect}
                            onMapToJob={openSingleMap}
                            onViewSkills={setSelectedCandidateForSkills}
                            onPreviewCV={(url, name) => setPreviewFile({ url, name })}
                            onDeleteCV={deleteCV}
                        />
                    )}

                    {/* THÀNH PHẦN PHÂN TRANG (PAGINATION) */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-800">
                            <p className="text-sm font-medium text-slate-500">
                                Hiển thị <span className="font-bold text-slate-800 dark:text-white">{(currentPage - 1) * pageSize + 1}</span> đến <span className="font-bold text-slate-800 dark:text-white">{Math.min(currentPage * pageSize, filteredCandidates.length)}</span> trong số <span className="font-bold text-slate-800 dark:text-white">{filteredCandidates.length}</span> kết quả
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${currentPage === page ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* FLOATING BATCH ACTION BAR CHO CANDIDATES */}
            {selectedCvIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white px-6 py-4 rounded-2xl shadow-xl shadow-primary-500/10 border border-slate-200 dark:border-slate-800 flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                {selectedCvIds.length}
                            </div>
                            <span className="text-sm font-medium whitespace-nowrap">CV đang chọn</span>
                        </div>
                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
                        <div className="flex gap-2">
                            <button onClick={openBatchMap} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold transition-colors whitespace-nowrap">
                                <FolderOutput className="w-4 h-4" /> Đưa vào chiến dịch
                            </button>
                            <button onClick={() => {
                                toast.error('Tính năng xóa hàng loạt sẽ được cập nhật ở phiên bản tới!');
                            }} className="flex items-center gap-2 px-4 py-2 border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl text-sm font-bold transition-colors">
                                <Trash2 className="w-4 h-4" /> Xóa tất cả
                            </button>
                            <button onClick={() => setSelectedCvIds([])} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-white ml-2" title="Bỏ chọn">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: GHÉP CV VÀO JOB */}
            {showMapModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                            <FolderOutput className="w-5 h-5 text-primary-500" />
                            {isBatchMapping ? `Ghép ${selectedCvIds.length} CV vào Chiến dịch` : 'Chọn chiến dịch'}
                        </h3>
                        <p className="text-sm text-slate-500 mb-6">Hệ thống sẽ đối chiếu và chấm điểm AI các CV này dựa trên yêu cầu của chiến dịch bạn chọn.</p>

                        <div className="mb-6 relative z-50">
                            <Select
                                options={jobOptions}
                                styles={customSelectStyles}
                                placeholder="Tìm kiếm hoặc chọn chiến dịch..."
                                isClearable
                                noOptionsMessage={() => "Không tìm thấy chiến dịch nào"}
                                value={jobOptions.find(o => o.value === selectedJobId) || null}
                                onChange={(val) => setSelectedJobId(val?.value || '')}
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => { setShowMapModal(false); setTargetCvIdForSingle(null); }}
                                disabled={isMapping}
                                className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmMap}
                                disabled={isMapping || !selectedJobId}
                                className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 disabled:opacity-70 transition-all"
                            >
                                {isMapping ? (
                                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Đang xử lý AI...</>
                                ) : (
                                    'Xác nhận Ghép'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedCandidateForSkills && (
                <CandidateSkillsModal
                    isOpen={!!selectedCandidateForSkills}
                    onClose={() => setSelectedCandidateForSkills(null)}
                    candidate={selectedCandidateForSkills}
                />
            )}
            {previewFile && (
                <DocumentViewer
                    url={previewFile.url}
                    filename={previewFile.name}
                    onClose={() => setPreviewFile(null)}
                />
            )}
        </div>
    );
}