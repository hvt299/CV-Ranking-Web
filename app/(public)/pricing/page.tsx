'use client';

import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Zap, HelpCircle, Loader2, Building2, User } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuthStore } from '@/store/useAuthStore';
import { subscriptionService } from '@/features/subscription/subscription.service';
import { useSubscription } from '@/hooks/useSubscription';
import { ROUTES } from '@/constants/routes';

export default function PricingPage() {
    const { isAuthenticated, user } = useAuthStore();
    const [isScrolled, setIsScrolled] = useState(false);
    const [audience, setAudience] = useState<'hr' | 'applicant'>('hr');
    const { data: myPlan } = useSubscription();

    const { data: plansRes, isLoading } = useQuery({
        queryKey: ['subscription-plans', audience],
        queryFn: () => subscriptionService.getPlans(audience),
    });

    const plans = plansRes?.data || [];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const formatPrice = (price: number) => {
        if (price === 0) return 'Miễn phí';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className="font-sans min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            <div className="relative pt-32 pb-16 md:pt-40 md:pb-24 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#0a0a0a]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary-200 dark:border-primary-800/50">
                        <CreditCard className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        Bảng giá <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-primary-400">Dịch vụ</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto">
                        Lựa chọn gói cước phù hợp với nhu cầu của bạn.
                    </p>

                    {/* Bộ lọc Đối tượng */}
                    <div className="mt-8 inline-flex items-center p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <button
                            onClick={() => setAudience('hr')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${audience === 'hr' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            <Building2 className="w-4 h-4" /> Nhà tuyển dụng
                        </button>
                        <button
                            onClick={() => setAudience('applicant')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${audience === 'applicant' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            <User className="w-4 h-4" /> Ứng viên
                        </button>
                    </div>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 -mt-16 relative z-20">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
                        <p className="text-slate-500 font-medium">Đang tải bảng giá...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                        {plans.map((plan: any) => {
                            const isHighlighted = !!plan.badge;
                            // [MỚI] So khớp gói hiện tại thông qua API myPlan. Phải check data bên trong myPlanRes
                            const isCurrentPlan = myPlan?.data?.current_plan_code === plan.plan_code;

                            return (
                                <div key={plan.id} className={`relative flex flex-col h-full bg-white dark:bg-[#0a0a0a] rounded-3xl p-6 shadow-sm transition-all duration-300 ${isHighlighted ? 'border-2 border-amber-400 shadow-primary-500/10 md:-translate-y-2' : 'border border-slate-200 dark:border-slate-800'}`}>
                                    {isHighlighted && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-md whitespace-nowrap">
                                            <Zap className="w-3 h-3" /> {plan.badge}
                                        </div>
                                    )}

                                    <div className="mb-6 text-center border-b border-slate-100 dark:border-slate-800 pb-6">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">{plan.name}</h3>
                                        <p className="text-xs text-slate-500 mb-4 min-h-8">{plan.description || ''}</p>

                                        <div className="flex flex-col items-center justify-center gap-1">
                                            {plan.original_price > plan.current_price && (
                                                <span className="text-sm text-slate-400 line-through">
                                                    {formatPrice(plan.original_price)}
                                                </span>
                                            )}
                                            <span className="text-3xl font-black text-slate-900 dark:text-white">
                                                {formatPrice(plan.current_price)}
                                            </span>
                                            <span className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1">
                                                {(!plan.billing_cycle_days || plan.billing_cycle_days === 0)
                                                    ? 'Vĩnh viễn'
                                                    : `/ ${plan.billing_cycle_days} ngày`}
                                            </span>
                                        </div>
                                    </div>

                                    <ul className="space-y-3 mb-8 flex-1">
                                        {plan.display_features?.map((featureText: string, index: number) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                                    {featureText}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {isCurrentPlan ? (
                                        <button disabled className="w-full py-3 rounded-xl font-bold flex items-center justify-center transition-colors text-sm bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed">
                                            Đang sử dụng
                                        </button>
                                    ) : (
                                        <Link href={isAuthenticated ? `/${audience}/settings/billing?plan=${plan.plan_code}` : ROUTES.REGISTER}
                                            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition-colors text-sm ${isHighlighted ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-500/20' : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}`}>
                                            {isAuthenticated ? 'Chọn gói này' : 'Bắt đầu ngay'}
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="mt-20 text-center">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-2">
                        <HelpCircle className="w-5 h-5 text-blue-500" /> Cần hỗ trợ tùy chỉnh?
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 font-medium mb-6 text-sm">
                        Liên hệ với chúng tôi để thiết kế gói dịch vụ linh hoạt theo quy mô của bạn.
                    </p>
                    <Link href={ROUTES.SUPPORT} className="inline-flex px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Liên hệ Đội ngũ tư vấn
                    </Link>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}