'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Check, ChevronDown, ChevronUp, FileText, Lightbulb, UploadCloud, X } from 'lucide-react';
import toast from 'react-hot-toast';

const RichTextEditor = dynamic(() => import('@/components/shared/RichTextEditor'), {
    ssr: false,
    loading: () => <div className="h-52 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl border border-slate-200 dark:border-slate-700" />
});

interface Step3Props {
    formData: any;
    setFormData: (data: any) => void;
}

type EditorTab = 'description' | 'requirements' | 'benefits' | 'other_info';

const EDITOR_TABS: { id: EditorTab; label: string; required?: boolean }[] = [
    { id: 'description', label: 'Mô tả công việc', required: true },
    { id: 'requirements', label: 'Yêu cầu ứng viên', required: true },
    { id: 'benefits', label: 'Quyền lợi' },
    { id: 'other_info', label: 'Thông tin khác' }
];

const FIELD_META: Record<EditorTab, { title: string; description: string; placeholder: string; tips: string[] }> = {
    description: {
        title: 'Mô tả công việc',
        description: 'Mô tả vai trò, trách nhiệm chính và những công việc ứng viên sẽ thực hiện.',
        placeholder: 'Ví dụ: Phát triển và duy trì các ứng dụng web bằng React/Next.js...',
        tips: ['Trách nhiệm chính', 'Công việc hằng ngày', 'KPI hoặc mục tiêu', 'Người quản lý trực tiếp']
    },
    requirements: {
        title: 'Yêu cầu ứng viên',
        description: 'Nêu những yêu cầu thực sự cần thiết cho vị trí để AI có thể đánh giá CV chính xác hơn.',
        placeholder: 'Ví dụ: Có từ 2 năm kinh nghiệm phát triển Frontend...',
        tips: ['Kinh nghiệm', 'Kỹ năng chuyên môn', 'Ngoại ngữ', 'Bằng cấp / chứng chỉ']
    },
    benefits: {
        title: 'Quyền lợi',
        description: 'Các chế độ, phúc lợi và những giá trị ứng viên nhận được khi gia nhập công ty.',
        placeholder: 'Ví dụ: Lương tháng 13, bảo hiểm đầy đủ, review lương định kỳ...',
        tips: ['Mức lương / thưởng', 'Bảo hiểm', 'Ngày phép', 'Đào tạo và phát triển']
    },
    other_info: {
        title: 'Thông tin khác',
        description: 'Các thông tin bổ sung như địa điểm, thời gian, hình thức làm việc hoặc quy trình tuyển dụng.',
        placeholder: 'Nhập thêm thông tin nếu cần...',
        tips: ['Địa điểm', 'Thời gian làm việc', 'Hình thức làm việc', 'Quy trình tuyển dụng']
    }
};

function isRichTextEmpty(html?: string) {
    if (!html) return true;

    const text = html
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<\/p>/gi, ' ')
        .replace(/<\/li>/gi, ' ')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&#160;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/\s+/g, ' ')
        .trim();

    return text.length === 0;
}

function getFileName(url?: string) {
    if (!url) return '';

    try {
        return decodeURIComponent(url.split('/').pop()?.split('?')[0] || '');
    } catch {
        return url.split('/').pop()?.split('?')[0] || '';
    }
}

export default function Step3JD({ formData, setFormData }: Step3Props) {
    const [activeTab, setActiveTab] = useState<EditorTab>('description');
    const [showTips, setShowTips] = useState(true);

    const tabStatus = useMemo(() => {
        return EDITOR_TABS.reduce((acc, tab) => {
            acc[tab.id] = !isRichTextEmpty(formData?.[tab.id]);
            return acc;
        }, {} as Record<EditorTab, boolean>);
    }, [formData]);

    const requiredTabs = EDITOR_TABS.filter((tab) => tab.required);

    const completedRequiredCount = requiredTabs.filter((tab) => tabStatus[tab.id]).length;

    const requiredCompletionPercent = requiredTabs.length
        ? Math.round((completedRequiredCount / requiredTabs.length) * 100)
        : 0;

    const completedOptionalCount = EDITOR_TABS.filter((tab) => !tab.required && tabStatus[tab.id]).length;

    const updateField = (field: EditorTab, value: string) => {
        setFormData({
            ...formData,
            [field]: value
        });
    };

    const handleTabChange = (tab: EditorTab) => {
        setActiveTab(tab);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const extension = file.name.split('.').pop()?.toLowerCase();

        if (!['pdf', 'doc', 'docx'].includes(extension || '')) {
            toast.error('Vui lòng chọn file PDF, DOC hoặc DOCX.');
            event.target.value = '';
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error('Dung lượng file tối đa là 10MB.');
            event.target.value = '';
            return;
        }

        setFormData({
            ...formData,
            jd_file_name: file.name
        });

        toast.success('Đã chọn file JD.');
    };

    const handleRemoveFile = () => {
        setFormData({
            ...formData,
            jd_file_url: '',
            jd_file_name: ''
        });

        toast.success('Đã xóa file JD.');
    };

    const activeTabMeta = FIELD_META[activeTab];
    const activeTabRequired = EDITOR_TABS.find((tab) => tab.id === activeTab)?.required;
    const activeTabCompleted = tabStatus[activeTab];

    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-5">
                <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                        <FileText className="w-5 h-5" />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            Nội dung JD
                        </h2>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Cung cấp thông tin để AI phân tích và khớp CV ứng viên chính xác hơn.
                        </p>
                    </div>
                </div>

                {/* REQUIRED COMPLETION */}
                <div className="hidden sm:block w-48">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-slate-500">
                            Nội dung bắt buộc
                        </span>

                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            {completedRequiredCount}/{requiredTabs.length}
                        </span>
                    </div>

                    <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${requiredCompletionPercent === 100
                                    ? 'bg-emerald-500'
                                    : 'bg-blue-600'
                                }`}
                            style={{ width: `${requiredCompletionPercent}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-slate-400">
                            {requiredCompletionPercent === 100
                                ? 'Đã hoàn tất nội dung bắt buộc'
                                : 'Cần hoàn thiện 2 mục bắt buộc'}
                        </span>

                        {completedOptionalCount > 0 && (
                            <span className="text-[10px] text-slate-400">
                                +{completedOptionalCount} tùy chọn
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* JD CONTENT */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                {/* TABS */}
                <div className="flex overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40">
                    {EDITOR_TABS.map((tab) => {
                        const active = activeTab === tab.id;
                        const completed = tabStatus[tab.id];

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex-1 min-w-fit px-5 py-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${active
                                        ? 'border-blue-600 text-blue-700 bg-white dark:bg-slate-900 dark:text-blue-400'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {tab.label}

                                    {completed && (
                                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                                        </span>
                                    )}

                                    {tab.required && !completed && (
                                        <span className="text-rose-500">*</span>
                                    )}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ACTIVE MODULE */}
                <div className="p-4 sm:p-6">
                    {/* SECTION HEADER */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-800 dark:text-white">
                                    {activeTabMeta.title}
                                </h3>

                                {activeTabRequired && (
                                    <span className="text-rose-500">*</span>
                                )}

                                {activeTabCompleted && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 text-[10px] font-bold">
                                        <Check className="w-3 h-3" />
                                        Đã nhập
                                    </span>
                                )}
                            </div>

                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                                {activeTabMeta.description}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowTips((value) => !value)}
                            className="hidden sm:flex shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                        >
                            <Lightbulb className="w-4 h-4" />
                            Gợi ý
                            {showTips ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                            )}
                        </button>
                    </div>

                    {/* TIPS */}
                    {showTips && (
                        <div className="mb-4 flex flex-wrap gap-2">
                            {activeTabMeta.tips.map((tip) => (
                                <span
                                    key={tip}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 text-[11px] font-medium"
                                >
                                    <span className="w-1 h-1 rounded-full bg-blue-500" />
                                    {tip}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* EDITOR */}
                    <RichTextEditor
                        key={activeTab}
                        value={formData?.[activeTab] || ''}
                        onChange={(value: string) => updateField(activeTab, value)}
                        placeholder={activeTabMeta.placeholder}
                    />

                    {/* FOOTER */}
                    <div className="flex items-center justify-between mt-2 px-1">
                        <span className="text-[11px] text-slate-400">
                            {activeTabRequired
                                ? 'Nội dung này bắt buộc'
                                : 'Nội dung này không bắt buộc'}
                        </span>

                        <span
                            className={`text-[11px] font-medium ${activeTabCompleted
                                    ? 'text-emerald-500'
                                    : activeTabRequired
                                        ? 'text-rose-400'
                                        : 'text-slate-400'
                                }`}
                        >
                            {activeTabCompleted
                                ? '✓ Đã nhập'
                                : activeTabRequired
                                    ? 'Chưa nhập'
                                    : 'Có thể bỏ qua'}
                        </span>
                    </div>
                </div>
            </div>

            {/* MOBILE COMPLETION */}
            <div className="sm:hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Nội dung bắt buộc
                        </p>

                        <p className="text-[10px] text-slate-400 mt-0.5">
                            Mô tả công việc + Yêu cầu ứng viên
                        </p>
                    </div>

                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {completedRequiredCount}/{requiredTabs.length}
                    </span>
                </div>

                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${requiredCompletionPercent === 100
                                ? 'bg-emerald-500'
                                : 'bg-blue-600'
                            }`}
                        style={{ width: `${requiredCompletionPercent}%` }}
                    />
                </div>
            </div>

            {/* JD FILE */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                                File JD gốc
                            </h3>

                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                Tùy chọn
                            </span>
                        </div>

                        <p className="text-xs text-slate-400 mt-1">
                            Đính kèm file PDF hoặc Word nếu bạn có JD gốc.
                        </p>
                    </div>
                </div>

                {!formData?.jd_file_name && !formData?.jd_file_url ? (
                    <label className="group flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 transition-all hover:border-blue-400 hover:bg-blue-50/30 dark:border-slate-700 dark:bg-slate-800/30 dark:hover:border-blue-700 dark:hover:bg-blue-900/10">
                        <UploadCloud className="mb-2 h-7 w-7 text-slate-400 transition-colors group-hover:text-blue-500" />

                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                            Chọn file JD
                        </span>

                        <span className="mt-1 text-[11px] text-slate-400">
                            PDF, DOC, DOCX · Tối đa 10MB
                        </span>

                        <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                        />
                    </label>
                ) : (
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900/50 dark:bg-emerald-900/10">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm dark:bg-slate-800 dark:text-emerald-400">
                            <FileText className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                                {formData?.jd_file_name || getFileName(formData?.jd_file_url)}
                            </p>

                            <p className="mt-0.5 text-[11px] text-emerald-600 dark:text-emerald-400">
                                Đã chọn file JD
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white hover:text-rose-500 dark:hover:bg-slate-800"
                            aria-label="Xóa file JD"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                <p className="mt-3 text-[11px] text-slate-400">
                    File gốc có thể được sử dụng để đối chiếu hoặc hỗ trợ AI phân tích JD.
                </p>
            </div>
        </div>
    );
}