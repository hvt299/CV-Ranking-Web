'use client';

import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Zap, HelpCircle } from 'lucide-react';
import Link from 'next/link';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuthStore } from '@/store/useAuthStore';

// Dữ liệu Mock mô phỏng chính xác SubscriptionPlanDB Schema từ Backend
const MOCK_PLANS = [
    {
        id: 'plan_1',
        plan_code: 'free',
        name: 'Gói Cơ bản',
        price: 0,
        currency: 'VND',
        billing_cycle: 'monthly',
        features: { ai_credits: 50, max_active_jobs: 1, support: 'Email cơ bản', highlight: false }
    },
    {
        id: 'plan_2',
        plan_code: 'pro',
        name: 'Gói Chuyên nghiệp',
        price: 499000,
        currency: 'VND',
        billing_cycle: 'monthly',
        features: { ai_credits: 500, max_active_jobs: 10, support: 'Email & Live Chat', highlight: true }
    },
    {
        id: 'plan_3',
        plan_code: 'enterprise',
        name: 'Gói Doanh nghiệp',
        price: 1999000,
        currency: 'VND',
        billing_cycle: 'monthly',
        features: { ai_credits: -1, max_active_jobs: -1, support: 'Hỗ trợ 1:1 24/7', highlight: false }
    }
];

export default function PricingPage() {
    const { isAuthenticated, user } = useAuthStore();
    const [isScrolled, setIsScrolled] = useState(false);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hàm tiện ích format tiền và feature
    const formatPrice = (price: number) => {
        if (price === 0) return 'Miễn phí';
        const finalPrice = billingCycle === 'yearly' ? price * 10 : price; // Mua năm tính tiền 10 tháng
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalPrice);
    };

    const formatLimit = (value: number | string) => {
        if (value === -1) return 'Không giới hạn';
        return value;
    };

    return (
        <div className="font-sans min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            {/* Khối Hero Banner */}
            <div className="relative pt-32 pb-16 md:pt-40 md:pb-24 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#0a0a0a]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-200 dark:border-blue-800/50">
                        <CreditCard className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        Bảng giá <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-400">Dịch vụ</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto">
                        Đầu tư thông minh cho quy trình tuyển dụng. Thanh toán linh hoạt, minh bạch, không chi phí ẩn.
                    </p>

                    {/* Toggle Tháng/Năm */}
                    <div className="mt-10 flex items-center justify-center gap-4">
                        <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Hàng tháng</span>
                        <button
                            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                            className="w-14 h-8 bg-blue-600 rounded-full relative p-1 transition-colors"
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                        <span className={`text-sm font-bold flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                            Hàng năm <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Tiết kiệm 16%</span>
                        </span>
                    </div>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 -mt-16 relative z-20">
                {/* Bảng giá Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {MOCK_PLANS.map((plan) => {
                        const isHighlighted = plan.features.highlight;

                        return (
                            <div key={plan.id} className={`relative bg-white dark:bg-[#0a0a0a] rounded-3xl p-8 shadow-sm transition-all duration-300 ${isHighlighted ? 'border-2 border-blue-500 shadow-blue-500/10 md:-translate-y-4' : 'border border-slate-200 dark:border-slate-800'}`}>
                                {isHighlighted && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1">
                                        <Zap className="w-3.5 h-3.5" /> Khuyên dùng
                                    </div>
                                )}

                                <div className="mb-8 text-center border-b border-slate-100 dark:border-slate-800 pb-8">
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">{plan.name}</h3>
                                    <div className="flex items-end justify-center gap-1 mb-2">
                                        <span className="text-4xl font-black text-slate-900 dark:text-white">{formatPrice(plan.price)}</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                        {plan.price > 0 ? (billingCycle === 'yearly' ? '/năm (thanh toán 1 lần)' : '/tháng') : 'Trọn đời'}
                                    </p>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                            <strong className="text-slate-900 dark:text-white">{formatLimit(plan.features.ai_credits)}</strong> lượt chấm CV bằng AI
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                            <strong className="text-slate-900 dark:text-white">{formatLimit(plan.features.max_active_jobs)}</strong> chiến dịch tuyển dụng mở cùng lúc
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Hỗ trợ: <strong className="text-slate-900 dark:text-white">{plan.features.support}</strong></span>
                                    </li>
                                </ul>

                                <Link href="/register" className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center transition-colors ${isHighlighted ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20' : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}`}>
                                    Bắt đầu ngay
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {/* FAQ Mini */}
                <div className="mt-24 text-center">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center justify-center gap-2">
                        <HelpCircle className="w-6 h-6 text-blue-500" /> Cần hỗ trợ tùy chỉnh?
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 font-medium mb-6">
                        Nếu doanh nghiệp của bạn có nhu cầu tuyển dụng quy mô lớn, vui lòng liên hệ với chúng tôi để thiết kế gói dịch vụ riêng.
                    </p>
                    <Link href="/support" className="inline-flex px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Liên hệ Đội ngũ tư vấn
                    </Link>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}