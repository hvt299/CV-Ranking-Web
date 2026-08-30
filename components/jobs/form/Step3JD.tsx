'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { FileText, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';

const RichTextEditor = dynamic(() => import('@/components/shared/RichTextEditor'), {
    ssr: false,
    loading: () => <div className="h-64 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl border border-slate-200 dark:border-slate-700"></div>
});

interface Step3Props {
    formData: any;
    setFormData: (data: any) => void;
}

export default function Step3JD({ formData, setFormData }: Step3Props) {
    const [activeTab, setActiveTab] = useState<'description' | 'requirements' | 'benefits' | 'other_info'>('description');

    const editorTabs = [
        { id: 'description', label: 'Mô tả công việc (*)' },
        { id: 'requirements', label: 'Yêu cầu ứng viên (*)' },
        { id: 'benefits', label: 'Quyền lợi' },
        { id: 'other_info', label: 'Thông tin khác' }
    ];

    const isTabEmpty = (field: string) => {
        return !formData[field] || formData[field] === '<p></p>';
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    <FileText className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Nội dung Chi tiết (JD)</h2>
                    <p className="text-xs text-slate-500 mt-1">Dữ liệu gốc để AI phân tích và khớp nối CV ứng viên.</p>
                </div>
            </div>

            {/* Block 1: Khung Editor Đa Tab */}
            <div className="bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                    {/* Dải Menu Tabs */}
                    <div className="flex overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                        {editorTabs.map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-5 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${activeTab === tab.id
                                    ? 'border-blue-600 text-blue-700 dark:text-blue-400 bg-white dark:bg-slate-900'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {tab.label}
                                {/* Cảnh báo chấm đỏ nếu trường bắt buộc quên chưa nhập */}
                                {(tab.id === 'description' || tab.id === 'requirements') && isTabEmpty(tab.id) && (
                                    <span className="ml-1 text-rose-500 font-black">*</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Khu vực Nhập liệu */}
                    <div className="p-4 min-h-75 bg-white dark:bg-slate-900">
                        {activeTab === 'description' && (
                            <div className="animate-in fade-in">
                                <RichTextEditor value={formData.description} onChange={(val: string) => setFormData({ ...formData, description: val })} placeholder="Mô tả chi tiết các nhiệm vụ chính của công việc..." />
                            </div>
                        )}
                        {activeTab === 'requirements' && (
                            <div className="animate-in fade-in">
                                <RichTextEditor value={formData.requirements} onChange={(val: string) => setFormData({ ...formData, requirements: val })} placeholder="Yêu cầu về kỹ năng, kinh nghiệm, thái độ..." />
                            </div>
                        )}
                        {activeTab === 'benefits' && (
                            <div className="animate-in fade-in">
                                <RichTextEditor value={formData.benefits} onChange={(val: string) => setFormData({ ...formData, benefits: val })} placeholder="Bảo hiểm, thưởng, chế độ nghỉ phép, văn hóa công ty..." />
                            </div>
                        )}
                        {activeTab === 'other_info' && (
                            <div className="animate-in fade-in">
                                <RichTextEditor value={formData.other_info} onChange={(val: string) => setFormData({ ...formData, other_info: val })} placeholder="Thời gian, địa điểm phỏng vấn, quy trình tuyển dụng..." />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Block 2: Upload File JD Gốc */}
            <div className="bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">File JD Gốc (PDF/Word) - Tùy chọn đính kèm</label>
                <div className="flex items-center gap-4">
                    <label className="cursor-pointer flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm group">
                        <div className="flex flex-col items-center">
                            <UploadCloud className="w-8 h-8 text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
                            <span className="text-sm text-slate-500 font-medium">Bấm hoặc kéo thả file JD gốc lên đây</span>
                        </div>
                        <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => {
                            toast.success("Đã ghi nhận file. Chức năng upload đang hoàn thiện.");
                        }} />
                    </label>
                </div>
                {formData.jd_file_url && <p className="text-xs text-emerald-500 mt-2 font-bold">Đã đính kèm: {formData.jd_file_url.split('/').pop()}</p>}
            </div>
        </div>
    );
}