'use client';

import { useState } from 'react';
import { Send, X, Calendar, MapPin, Link as LinkIcon, MessageSquare, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface InterviewEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { send_email: boolean, interview_schedule?: any }) => void;
    candidateName: string;
}

export default function InterviewEmailModal({ isOpen, onClose, onConfirm, candidateName }: InterviewEmailModalProps) {
    const [sendEmail, setSendEmail] = useState(true);
    const [formData, setFormData] = useState({
        interview_time: '',
        location: '',
        meeting_link: '',
        message: ''
    });

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (sendEmail) {
            if (!formData.interview_time.trim() || !formData.location.trim()) {
                toast.error("Vui lòng điền Thời gian và Địa điểm phỏng vấn!");
                return;
            }
            onConfirm({
                send_email: true,
                interview_schedule: formData
            });
        } else {
            onConfirm({ send_email: false });
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">

                {/* HEADER */}
                <div className="bg-purple-50 dark:bg-purple-500/10 p-6 border-b border-purple-100 dark:border-purple-500/20 relative shrink-0">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white shadow-sm transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 text-purple-600 border border-purple-200 dark:border-slate-700 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                        <Send className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white">Lên lịch Phỏng vấn</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Cấu hình thư mời tự động gửi đến <strong>{candidateName}</strong></p>
                </div>

                {/* BODY (Scrollable) */}
                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                    {/* TOOGLE SEND EMAIL */}
                    <label className="flex items-start gap-3 cursor-pointer p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-300 transition-colors">
                        <input
                            type="checkbox"
                            className="mt-1 w-4 h-4 accent-purple-600 rounded"
                            checked={sendEmail}
                            onChange={(e) => setSendEmail(e.target.checked)}
                        />
                        <div>
                            <span className="block text-sm font-bold text-slate-800 dark:text-white">Gửi email thông báo tự động</span>
                            <span className="block text-xs text-slate-500 mt-0.5">Hệ thống sẽ dùng mẫu template chuyên nghiệp để gửi qua hòm thư của ứng viên.</span>
                        </div>
                    </label>

                    {/* FORM LỊCH */}
                    {sendEmail && (
                        <div className="space-y-4 animate-in slide-in-from-top-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800/50">
                                <AlertCircle className="w-4 h-4" /> Vui lòng kiểm tra kỹ thông tin trước khi gửi.
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    <Calendar className="w-4 h-4 text-purple-500" /> Thời gian <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="VD: 14:00 - Thứ Tư, 20/10/2026"
                                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm focus:border-purple-500 dark:text-white"
                                    value={formData.interview_time}
                                    onChange={(e) => setFormData({ ...formData, interview_time: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    <MapPin className="w-4 h-4 text-purple-500" /> Địa điểm / Hình thức <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="VD: Tầng 3, Tòa nhà X / Phỏng vấn Online"
                                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm focus:border-purple-500 dark:text-white"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    <LinkIcon className="w-4 h-4 text-purple-500" /> Link tham gia (Tùy chọn)
                                </label>
                                <input
                                    type="url"
                                    placeholder="VD: https://meet.google.com/xyz"
                                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm focus:border-purple-500 dark:text-white"
                                    value={formData.meeting_link}
                                    onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    <MessageSquare className="w-4 h-4 text-purple-500" /> Ghi chú thêm (Tùy chọn)
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="VD: Bạn nhớ mang theo laptop và ăn mặc lịch sự nhé..."
                                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm focus:border-purple-500 resize-none dark:text-white"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors">
                        Hủy bỏ
                    </button>
                    <button onClick={handleSubmit} className="px-6 py-2.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center gap-2">
                        Xác nhận {sendEmail && '& Gửi Mail'}
                    </button>
                </div>

            </div>
        </div>
    );
}