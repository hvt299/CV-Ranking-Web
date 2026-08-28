'use client';

import { useState, useEffect } from 'react';
import { Layers, Bot, ScanSearch, BarChart3, Fingerprint, Sparkles } from 'lucide-react';
import Link from 'next/link';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuthStore } from '@/store/useAuthStore';

const FEATURES = [
    {
        icon: Bot,
        title: 'Trí tuệ Nhân tạo (AI) NLP',
        description: 'Tạm biệt phương pháp lọc từ khóa thủ công. Mô hình Ngôn ngữ Lớn (LLM) của ATS System có khả năng "đọc hiểu" ngữ cảnh thực sự đằng sau từng câu văn trong CV ứng viên, nhận diện chính xác kinh nghiệm ẩn và kỹ năng chuyển đổi.',
        color: 'text-blue-500',
        bg: 'bg-blue-100 dark:bg-blue-500/10'
    },
    {
        icon: ScanSearch,
        title: 'Khớp nối Vector Database',
        description: 'CV và Mô tả công việc (JD) được nhúng (Embedding) thành các Vector toán học không gian đa chiều. Thuật toán Cosine Similarity sẽ tự động chấm điểm độ phù hợp chính xác đến 98%, giúp HR tìm ra ứng viên sáng giá nhất chỉ trong 1 giây.',
        color: 'text-indigo-500',
        bg: 'bg-indigo-100 dark:bg-indigo-500/10'
    },
    {
        icon: Fingerprint,
        title: 'Loại bỏ định kiến vô thức',
        description: 'Hệ thống AI được huấn luyện để phớt lờ các thông tin nhạy cảm về giới tính, độ tuổi, xuất thân hay hình ảnh cá nhân. Ứng viên được đánh giá và xếp hạng hoàn toàn dựa trên sự phù hợp về Năng lực và Kinh nghiệm.',
        color: 'text-emerald-500',
        bg: 'bg-emerald-100 dark:bg-emerald-500/10'
    },
    {
        icon: BarChart3,
        title: 'Báo cáo Phân tích Chuyên sâu',
        description: 'Cung cấp Dashboard toàn diện về Phễu tuyển dụng (Recruitment Funnel). Theo dõi thời gian trung bình tuyển dụng (Time-to-hire), Tỷ lệ chuyển đổi qua các vòng, giúp doanh nghiệp tối ưu hóa nguồn lực nhân sự.',
        color: 'text-rose-500',
        bg: 'bg-rose-100 dark:bg-rose-500/10'
    }
];

export default function FeaturesPage() {
    const { isAuthenticated, user } = useAuthStore();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="font-sans min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            {/* Khối Hero Banner */}
            <div className="relative pt-32 pb-16 md:pt-40 md:pb-24 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#0a0a0a]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-200 dark:border-blue-800/50">
                        <Layers className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        Sản phẩm & <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-400">Tính năng</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto">
                        Khám phá lõi công nghệ định hình tương lai của ngành nhân sự. Nhanh hơn, chính xác hơn và công bằng hơn.
                    </p>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 md:py-24 space-y-24">

                {/* Bento Grid Tính năng */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {FEATURES.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <div key={idx} className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-lg transition-all duration-300">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.bg} ${feature.color}`}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Khối Kêu gọi Hành động (CTA) */}
                <div className="bg-linear-to-br from-blue-700 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 rounded-3xl p-10 md:p-16 text-center border border-blue-500/30 shadow-xl shadow-blue-900/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

                    <div className="relative z-10">
                        <Sparkles className="w-12 h-12 text-blue-200 mx-auto mb-6" />
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                            Sẵn sàng nâng cấp quy trình tuyển dụng?
                        </h2>
                        <p className="text-blue-100 font-medium text-lg max-w-2xl mx-auto mb-10">
                            Bắt đầu trải nghiệm ATS System hoàn toàn miễn phí ngay hôm nay.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/register" className="px-8 py-4 bg-white text-blue-600 font-black rounded-xl hover:bg-slate-50 transition-colors shadow-lg">
                                Tạo tài khoản miễn phí
                            </Link>
                            <Link href="/pricing" className="px-8 py-4 bg-blue-700/50 dark:bg-blue-800/50 text-white font-bold rounded-xl hover:bg-blue-700 dark:hover:bg-blue-800 border border-blue-500 transition-colors">
                                Xem bảng giá
                            </Link>
                        </div>
                    </div>
                </div>

            </main>

            <PublicFooter />
        </div>
    );
}