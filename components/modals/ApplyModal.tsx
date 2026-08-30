'use client';

import { useState, useEffect } from 'react';
import { X, FileText, Send, Loader2, ShieldCheck, UploadCloud, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api-client';
import { applicationService } from '@/features/application/application.service';
import { ROUTES } from '@/constants/routes';

interface ApplyModalProps {
    jobId: string;
    jobTitle: string;
    onClose: () => void;
}

export default function ApplyModal({ jobId, jobTitle, onClose }: ApplyModalProps) {
    const [cvList, setCvList] = useState<any[]>([]);
    const [isLoadingCvs, setIsLoadingCvs] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedCvId, setSelectedCvId] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [agreeRules, setAgreeRules] = useState(false);

    useEffect(() => {
        const fetchCVs = async () => {
            try {
                const res = await apiClient.get('/apply/library');
                const cvData = res.data?.data || res.data || [];
                setCvList(Array.isArray(cvData) ? cvData : []);
            } catch (error) {
            } finally {
                setIsLoadingCvs(false);
            }
        };
        fetchCVs();
    }, []);

    const handleSubmit = async () => {
        if (!selectedCvId) return toast.error('Vui lòng chọn CV từ thư viện để ứng tuyển!');
        if (!agreeRules) return toast.error('Vui lòng xác nhận đồng ý với cam kết bảo mật!');

        setIsSubmitting(true);
        try {
            const res = await applicationService.applyForJob(jobId, {
                cv_document_id: selectedCvId,
                cover_letter: coverLetter
            });
            toast.success(res.message || 'Hồ sơ của bạn đã được gửi thành công!');
            onClose();
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Có lỗi xảy ra khi nộp hồ sơ. Vui lòng thử lại!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4 pt-4 pb-20 sm:p-0">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in"
                onClick={!isSubmitting ? onClose : undefined}
            />

            {/* Modal Panel */}
            <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <Send className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            Ứng tuyển vị trí
                        </h2>
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1 line-clamp-1">{jobTitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">

                    {/* Khối 1: Chọn CV */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-500" />
                            1. Chọn CV ứng tuyển <span className="text-rose-500">*</span>
                        </label>

                        {isLoadingCvs ? (
                            <div className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-500">
                                <Loader2 className="w-4 h-4 animate-spin" /> Đang tải thư viện CV...
                            </div>
                        ) : cvList.length > 0 ? (
                            <div className="relative">
                                <select
                                    value={selectedCvId}
                                    onChange={e => setSelectedCvId(e.target.value)}
                                    className="w-full pl-4 pr-10 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-slate-700 dark:text-slate-200 appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Vui lòng chọn CV đã tải lên</option>
                                    {cvList.map(cv => (
                                        <option key={cv.id} value={cv.id}>{cv.display_name || cv.filename}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 border border-dashed border-rose-200 dark:border-rose-900/50 rounded-xl bg-rose-50/50 dark:bg-rose-500/10 flex flex-col items-center justify-center text-center gap-2">
                                <UploadCloud className="w-6 h-6 text-rose-400" />
                                <p className="text-sm font-medium text-rose-600 dark:text-rose-400">Bạn chưa có CV nào trong hệ thống.</p>
                                <a href={ROUTES.APPLICANT_CV_LIBRARY} target="_blank" className="text-xs font-bold text-blue-600 hover:underline">
                                    Mở Thư viện CV để tải lên
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Khối 2: Thư giới thiệu (Cover Letter) */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-slate-500" />
                                2. Thư giới thiệu (Tùy chọn)
                            </span>
                            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Khuyên dùng</span>
                        </label>
                        <textarea
                            placeholder="Kính gửi Nhà tuyển dụng, tôi viết thư này để ứng tuyển..."
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 dark:text-slate-200 resize-none placeholder:text-slate-400 leading-relaxed"
                            rows={4}
                        />
                    </div>

                    {/* Khối 3: Checkbox Cảnh báo */}
                    <div className="bg-amber-50/50 dark:bg-amber-500/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="agree-rules"
                                checked={agreeRules}
                                onChange={(e) => setAgreeRules(e.target.checked)}
                                className="mt-1 w-4 h-4 accent-amber-600 dark:accent-amber-500 rounded cursor-pointer shrink-0"
                            />
                            <label htmlFor="agree-rules" className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer select-none">
                                <strong className="text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
                                    3. Cam kết & Cảnh báo an toàn
                                </strong>
                                Tôi đồng ý cho phép nền tảng sử dụng <b>AI để phân tích và chấm điểm</b> CV. Đồng thời, tôi đã đọc và hiểu cảnh báo về các hành vi <b>lừa đảo tuyển dụng</b> (yêu cầu nạp tiền, tải app, nộp phí giữ chỗ...). Hệ thống sẽ không chịu trách nhiệm cho các giao dịch tài chính phát sinh ngoài nền tảng.
                            </label>
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !selectedCvId || !agreeRules}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 w-full sm:w-auto"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Đang nộp...</>
                        ) : (
                            <><Send className="w-4 h-4" /> Xác nhận ứng tuyển</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}