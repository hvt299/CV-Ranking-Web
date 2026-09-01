'use client';

import { useState, useEffect } from 'react';
import { X, Copy, Download, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { subscriptionService } from '@/features/subscription/subscription.service';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    checkoutData: any;
    initialCredits: number;
}

export default function CheckoutModal({ isOpen, onClose, onSuccess, checkoutData, initialCredits }: CheckoutModalProps) {
    // 10 phút = 600 giây
    const [timeLeft, setTimeLeft] = useState(600);
    const [isDownloading, setIsDownloading] = useState(false);

    // Xử lý đếm ngược và tự động đóng
    useEffect(() => {
        if (!isOpen) return;
        setTimeLeft(600); // Reset timer khi mở

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    toast.error('Đã hết thời gian thanh toán. Vui lòng tạo lại mã QR mới.');
                    onClose();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, onClose]);

    // Polling: Kiểm tra trạng thái thanh toán mỗi 5 giây
    useEffect(() => {
        if (!isOpen) return;

        const pollTimer = setInterval(async () => {
            try {
                // Gọi API lấy thông tin plan/credit mới nhất
                const res = await subscriptionService.getMyPlan();
                const currentCredits = res.data?.credits_remaining || 0;

                // Nếu credit tăng lên (Webhook Sepay đã xử lý xong), báo thành công
                if (currentCredits > initialCredits) {
                    clearInterval(pollTimer);
                    toast.success('Thanh toán thành công! Hệ thống đã cập nhật gói cước.');
                    onSuccess();
                }
            } catch (error) {
                console.error("Lỗi khi kiểm tra giao dịch:", error);
            }
        }, 5000);

        return () => clearInterval(pollTimer);
    }, [isOpen, initialCredits, onSuccess]);

    if (!isOpen || !checkoutData) return null;

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`Đã sao chép ${label}`);
    };

    const handleDownloadQR = async () => {
        try {
            setIsDownloading(true);
            const response = await fetch(checkoutData.qr_url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `QR_Thanh_Toan_${checkoutData.transfer_content}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast.error('Lỗi khi tải ảnh QR');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-200 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">

                {/* Header */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-black text-slate-800 dark:text-white">Thanh toán qua chuyển khoản ngân hàng</h3>
                    <div className="flex items-center gap-4">
                        <span className="text-rose-500 font-mono font-bold text-lg bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-lg">
                            {formatTime(timeLeft)}
                        </span>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white dark:bg-slate-800 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 shadow-sm">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Body (2 Cột) */}
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

                    {/* Cột Trái: QR Code */}
                    <div className="flex flex-col items-center">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 text-center">
                            Cách 1: Mở app ngân hàng / Ví điện tử và <span className="text-primary-600">quét mã QR</span>
                        </p>
                        <div className="w-64 h-64 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm relative mb-6">
                            <img src={checkoutData.qr_url} alt="VietQR" className="w-full h-full object-contain rounded-xl" />
                        </div>
                        <button
                            onClick={handleDownloadQR}
                            disabled={isDownloading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 font-bold rounded-xl transition-colors text-sm"
                        >
                            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            Tải ảnh QR
                        </button>

                        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-500">
                            Trạng thái: <Loader2 className="w-4 h-4 animate-spin text-primary-500" /> <span className="animate-pulse">Đang chờ thanh toán...</span>
                        </div>
                    </div>

                    {/* Cột Phải: Chuyển khoản thủ công */}
                    <div className="flex flex-col">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 text-center md:text-left">
                            Cách 2: Chuyển khoản <span className="text-primary-600">thủ công</span> theo thông tin
                        </p>

                        <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700/50">
                                <span className="text-sm text-slate-500 font-medium">Ngân hàng</span>
                                <span className="text-sm font-bold text-slate-800 dark:text-white">{checkoutData.bank_name}</span>
                            </div>

                            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700/50">
                                <span className="text-sm text-slate-500 font-medium">Thụ hưởng</span>
                                <span className="text-sm font-bold text-slate-800 dark:text-white uppercase">{checkoutData.account_name}</span>
                            </div>

                            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700/50">
                                <span className="text-sm text-slate-500 font-medium">Số tài khoản</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-black text-primary-600">{checkoutData.bank_account}</span>
                                    <button onClick={() => handleCopy(checkoutData.bank_account, 'Số tài khoản')} className="p-1.5 text-slate-400 hover:text-primary-600 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700/50">
                                <span className="text-sm text-slate-500 font-medium">Số tiền</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-black text-slate-800 dark:text-white">{checkoutData.amount.toLocaleString('vi-VN')} ₫</span>
                                    <button onClick={() => handleCopy(checkoutData.amount.toString(), 'Số tiền')} className="p-1.5 text-slate-400 hover:text-primary-600 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500 font-medium">Nội dung CK</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded">{checkoutData.transfer_content}</span>
                                    <button onClick={() => handleCopy(checkoutData.transfer_content, 'Nội dung CK')} className="p-1.5 text-slate-400 hover:text-primary-600 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 p-4 rounded-xl flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-800 dark:text-amber-400 font-medium">
                                Lưu ý: Vui lòng giữ nguyên nội dung chuyển khoản <strong className="font-black">{checkoutData.transfer_content}</strong> để hệ thống tự động xác nhận đơn hàng của bạn.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}