'use client';

import { useState } from 'react';
import { CreditCard, Zap, CheckCircle2, History, QrCode, Loader2, ShieldCheck } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query'; // Thêm useQueryClient
import toast from 'react-hot-toast';
import { useSubscription } from '@/hooks/useSubscription';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { subscriptionService } from '@/features/subscription/subscription.service';
import { useAuthStore } from '@/store/useAuthStore';
import CheckoutModal from '@/components/billing/CheckoutModal';

export default function HrBillingPage() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const { data: myPlanRes, isLoading: isMyPlanLoading } = useSubscription();
    const { data: plansRes, isLoading: isPlansLoading } = useSubscriptionPlans('hr');
    const { data: txRes, isLoading: isTxLoading } = useQuery({
        queryKey: ['transactions'],
        queryFn: () => subscriptionService.getTransactions()
    });

    const planInfo = myPlanRes?.data;
    const plans = plansRes?.data || [];
    const transactions = txRes?.data || [];

    const [checkoutData, setCheckoutData] = useState<any>(null);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [processingPlanCode, setProcessingPlanCode] = useState<string | null>(null);

    if (isMyPlanLoading || isPlansLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const handleSubscribe = async (plan: any) => {
        if (plan.current_price === 0) {
            toast.error('Gói miễn phí đã được kích hoạt mặc định.');
            return;
        }
        try {
            setProcessingPlanCode(plan.plan_code);
            const res = await subscriptionService.createCheckoutSession(plan.plan_code);
            setCheckoutData(res.data);
            setIsCheckoutModalOpen(true);
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Không thể tạo phiên thanh toán.');
        } finally {
            setProcessingPlanCode(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Quản lý Gói cước & Credit</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Nâng cấp không gian làm việc để mở khóa toàn bộ sức mạnh AI.</p>
                </div>
            </div>

            {/* TRẠNG THÁI */}
            <div className="bg-primary-50/50 dark:bg-primary-900/10 border-2 border-primary-200 dark:border-primary-800/50 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                <div className="relative z-5 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Gói Doanh nghiệp hiện tại</p>
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                            {planInfo?.current_plan || 'Đang tải...'}
                            {planInfo?.current_plan_code !== 'hr_free' && (
                                <ShieldCheck className="w-6 h-6 text-primary-500" />
                            )}
                        </h2>
                        {planInfo && (
                            <p className="text-sm font-medium text-slate-500 mt-2">
                                Thời hạn: <span className="font-bold text-slate-700 dark:text-slate-300">
                                    {planInfo.period_end ? new Date(planInfo.period_end).toLocaleDateString('vi-VN') : 'Vĩnh viễn'}
                                </span>
                            </p>
                        )}
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Credit AI khả dụng</p>
                        <div className="flex items-center gap-2">
                            <Zap className="w-8 h-8 text-amber-500" fill="currentColor" />
                            <h2 className="text-3xl font-black text-slate-800 dark:text-white">{planInfo?.credits_remaining || 0}</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* LƯỚI GÓI CƯỚC */}
            <div id="pricing-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map((plan: any) => {
                    const isCurrent = planInfo?.current_plan_code === plan.plan_code;
                    const isHighlighted = !!plan.badge;

                    return (
                        <div
                            key={plan.plan_code}
                            className={`relative p-6 rounded-3xl border-2 transition-all flex flex-col ${isCurrent ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 opacity-60' : isHighlighted ? 'border-amber-400 shadow-sm bg-white dark:bg-slate-900' : 'border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700 bg-white dark:bg-slate-900'}`}
                        >
                            {isHighlighted && !isCurrent && (
                                <div className="absolute -top-3 left-6 bg-linear-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                                    {plan.badge}
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-black text-slate-800 dark:text-white">{plan.name}</h3>
                                {isCurrent && <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2 py-1 rounded-md uppercase">Đang dùng</span>}
                            </div>

                            <div className="mb-4">
                                <p className="text-2xl font-black text-slate-800 dark:text-white">
                                    {plan.current_price === 0 ? 'Miễn phí' : plan.current_price.toLocaleString('vi-VN')} <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{plan.current_price > 0 && 'VNĐ'}</span>
                                </p>
                                <p className="text-sm text-slate-500 mt-1">/ {plan.billing_cycle_days === 0 ? 'Vĩnh viễn' : `${plan.billing_cycle_days} ngày`}</p>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {plan.display_features?.map((feat: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                                        <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" /> {feat}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(plan)}
                                disabled={isCurrent || processingPlanCode !== null}
                                className={`w-full py-2.5 rounded-xl font-bold text-sm flex justify-center items-center gap-2 transition-colors disabled:opacity-50 ${isCurrent ? 'bg-slate-200 dark:bg-slate-700 text-slate-500' : 'bg-primary-600 hover:bg-primary-700 text-white shadow-md'}`}
                            >
                                {isCurrent ? 'Đang sử dụng' : processingPlanCode === plan.plan_code ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý...</>
                                ) : 'Nâng cấp ngay'}
                            </button>
                        </div>
                    )
                })}
            </div>

            {/* SỔ CÁI GIAO DỊCH */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <History className="w-5 h-5 text-primary-500" /> Sổ cái Giao dịch (Ledger)
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 font-bold">
                            <tr>
                                <th className="p-4 pl-6">Thời gian</th>
                                <th className="p-4">Nội dung / Hành động</th>
                                <th className="p-4 text-center">Biến động Credit</th>
                                <th className="p-4 text-center pr-6">Số dư</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isTxLoading ? (
                                <tr><td colSpan={4} className="p-8 text-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td></tr>
                            ) : transactions.length > 0 ? (
                                transactions.map((tx: any) => {
                                    const isAddition = tx.credit_cost < 0;
                                    const displayCost = isAddition ? `+${Math.abs(tx.credit_cost)}` : `-${tx.credit_cost}`;

                                    return (
                                        <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                            <td className="p-4 pl-6 text-sm text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                                                {new Date(tx.created_at).toLocaleString('vi-VN')}
                                            </td>
                                            <td className="p-4 text-sm font-bold text-slate-800 dark:text-white">
                                                {tx.action_type.replace('UPGRADE_', 'Nâng cấp gói: ')}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-1 rounded-md text-xs font-black ${isAddition ? 'bg-success-50 text-success-600 dark:bg-success-500/10' : 'bg-error-50 text-error-600 dark:bg-error-500/10'}`}>
                                                    {displayCost}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center pr-6 font-black text-slate-700 dark:text-slate-200">
                                                {tx.balance_after}
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr><td colSpan={4} className="p-8 text-center text-slate-500 font-medium">Chưa có giao dịch nào phát sinh.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CheckoutModal
                isOpen={isCheckoutModalOpen}
                onClose={() => setIsCheckoutModalOpen(false)}
                checkoutData={checkoutData}
                initialCredits={planInfo?.credits_remaining || 0}
                onSuccess={() => {
                    setIsCheckoutModalOpen(false);
                    queryClient.invalidateQueries({ queryKey: ['my-subscription'] });
                    queryClient.invalidateQueries({ queryKey: ['transactions'] });
                }}
            />
        </div>
    );
}