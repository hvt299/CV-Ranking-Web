'use client';

import { useState, useEffect } from 'react';
import { Users, Target, Zap, ShieldCheck, TrendingUp, Award, Rocket } from 'lucide-react';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuth } from '@/context/AuthContext';

const CORE_VALUES = [
    {
        icon: Zap,
        title: 'Tốc độ & Hiệu quả',
        description: 'Tự động hóa mọi quy trình thủ công, giúp nhà tuyển dụng và ứng viên kết nối với nhau chỉ trong chớp mắt nhờ sức mạnh của AI.'
    },
    {
        icon: ShieldCheck,
        title: 'Minh bạch & Công bằng',
        description: 'Loại bỏ định kiến vô thức trong tuyển dụng. AI đánh giá hồ sơ hoàn toàn dựa trên năng lực, kinh nghiệm và độ tương thích với JD.'
    },
    {
        icon: TrendingUp,
        title: 'Không ngừng Đổi mới',
        description: 'Liên tục cập nhật các mô hình ngôn ngữ lớn (LLM) và thuật toán Vector hóa mới nhất để mang lại độ chính xác cao nhất.'
    },
    {
        icon: Users,
        title: 'Lấy Con người làm Trung tâm',
        description: 'Công nghệ sinh ra để phục vụ con người. Mọi tính năng của ATS System đều được thiết kế dựa trên trải nghiệm thực tế của người dùng.'
    }
];

export default function AboutPage() {
    const { isAuthenticated, user } = useAuth();
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
            <div className="relative pt-32 pb-16 md:pt-40 md:pb-20 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#0a0a0a]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-200 dark:border-blue-800/50">
                        <Rocket className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        Tái định nghĩa <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-400">Tuyển dụng</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto">
                        Chúng tôi xây dựng ATS System với khát vọng ứng dụng AI để tạo ra một thị trường lao động công bằng, minh bạch và hiệu quả hơn.
                    </p>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 md:py-24 space-y-20">

                {/* Section: Câu chuyện */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                            Câu chuyện của chúng tôi
                        </h2>
                        <div className="prose prose-slate font-sans dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            <p>
                                Ra đời từ nhận thức về những điểm nghẽn trong quy trình tuyển dụng truyền thống: HR quá tải với hàng ngàn CV rác, ứng viên tài năng bị bỏ lọt do lọc từ khóa thủ công, và thời gian chờ đợi kéo dài gây mệt mỏi cho cả đôi bên.
                            </p>
                            <p>
                                ATS System được phát triển với sự kết hợp đột phá giữa Hệ thống cơ sở dữ liệu Vector (Vector Database) và Mô hình Ngôn ngữ Lớn (LLM). Chúng tôi không chỉ tìm kiếm từ khóa, chúng tôi <strong className="text-blue-600 dark:text-blue-400">hiểu ngữ nghĩa</strong> đằng sau từng câu chữ trong hồ sơ của bạn.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 font-sans">
                        <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                            <h3 className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">98%</h3>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Độ chính xác AI Matching</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                            <h3 className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">10k+</h3>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Ứng viên tin dùng</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                            <h3 className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">500+</h3>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Doanh nghiệp đối tác</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                            <h3 className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">24/7</h3>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Hệ thống vận hành</p>
                        </div>
                    </div>
                </div>

                {/* Section: Sứ mệnh & Tầm nhìn */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
                    <div className="bg-blue-50 dark:bg-blue-500/5 p-8 md:p-12 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-blue-500/20">
                            <Target className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Sứ mệnh</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            Trao quyền cho mọi doanh nghiệp và cá nhân tiếp cận công nghệ tuyển dụng AI tiên tiến nhất. Tối ưu hóa chi phí, thời gian và công sức, đưa đúng người, vào đúng việc.
                        </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/30 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800">
                        <div className="w-12 h-12 bg-slate-800 dark:bg-slate-700 text-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                            <Award className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Tầm nhìn</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            Trở thành nền tảng lõi (Core Platform) dẫn dắt thị trường Công nghệ Nhân sự (HR Tech) tại Việt Nam và khu vực Đông Nam Á trong thập kỷ tới.
                        </p>
                    </div>
                </div>

                {/* Section: Giá trị cốt lõi */}
                <div className="font-sans">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">Giá trị cốt lõi</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Kim chỉ nam trong mọi quyết định phát triển sản phẩm của đội ngũ ATS System.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {CORE_VALUES.map((val, idx) => {
                            const Icon = val.icon;
                            return (
                                <div key={idx} className="bg-white dark:bg-[#0a0a0a] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:-translate-y-1 transition-transform duration-300">
                                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{val.title}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{val.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </main>

            <PublicFooter />
        </div>
    );
}