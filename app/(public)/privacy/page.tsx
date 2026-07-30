'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Database, Cpu, Share2, Server, UserCog, ChevronRight } from 'lucide-react';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuth } from '@/context/AuthContext';

const SECTIONS = [
    { id: 'collection', title: '1. Thu thập Dữ liệu', icon: Database },
    { id: 'usage', title: '2. Sử dụng Dữ liệu & AI', icon: Cpu },
    { id: 'sharing', title: '3. Chia sẻ Thông tin', icon: Share2 },
    { id: 'storage', title: '4. Lưu trữ & Bảo vệ', icon: Server },
    { id: 'rights', title: '5. Quyền của Người dùng', icon: UserCog },
];

export default function PrivacyPolicyPage() {
    const { isAuthenticated, user } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Cập nhật mục lục khi cuộn trang
    useEffect(() => {
        const handleSpy = () => {
            const sections = SECTIONS.map(s => document.getElementById(s.id));
            const scrollPosition = window.scrollY + 200;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(SECTIONS[i].id);
                    break;
                }
            }
        };
        window.addEventListener('scroll', handleSpy);
        return () => window.removeEventListener('scroll', handleSpy);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 120,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            {/* Khối Hero Banner */}
            <div className="relative pt-32 pb-16 md:pt-40 md:pb-20 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#0a0a0a]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-200 dark:border-blue-800/50">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        Chính sách <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-400">Bảo mật</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto">
                        Cam kết tối thượng trong việc bảo vệ dữ liệu cá nhân của bạn trong kỷ nguyên Trí tuệ nhân tạo.
                    </p>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-12 md:py-20 flex flex-col lg:flex-row gap-12">
                {/* Mục lục bám dính */}
                <aside className="lg:w-72 shrink-0 relative">
                    <div className="sticky top-28 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                        <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Mục lục tài liệu</h3>
                        <nav className="space-y-1">
                            {SECTIONS.map((section) => {
                                const Icon = section.icon;
                                const isActive = activeSection === section.id;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                                                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-slate-400'}`} />
                                            {section.title}
                                        </div>
                                        {isActive && <ChevronRight className="w-4 h-4 text-blue-500" />}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* Nội dung chi tiết */}
                <div className="flex-1 bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm space-y-16 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">

                    <section id="collection" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><Database className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">1. Thu thập dữ liệu</h2>
                        </div>
                        <p className="mb-4">Hệ thống của chúng tôi chỉ thu thập các dữ liệu cần thiết phục vụ cho mục đích tuyển dụng và kết nối việc làm:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Thông tin định danh</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Họ tên, email liên lạc, số điện thoại, địa chỉ (tuỳ chọn).</p>
                            </div>
                            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Hồ sơ năng lực (CV)</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Tệp PDF CV, kinh nghiệm làm việc, bằng cấp, hệ thống kỹ năng.</p>
                            </div>
                        </div>
                    </section>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    <section id="usage" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><Cpu className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">2. Xử lý Dữ liệu bằng Trí tuệ Nhân tạo</h2>
                        </div>
                        <p className="mb-4">Bằng việc tải CV lên nền tảng, bạn cấp quyền cho hệ thống AI của chúng tôi xử lý hồ sơ thông qua các thuật toán:</p>
                        <ul className="list-none space-y-3 mt-4">
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                <span><strong>Xử lý ngôn ngữ tự nhiên (NLP):</strong> Trích xuất tự động các kỹ năng chuyên môn, số năm kinh nghiệm từ các đoạn văn bản trong CV.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                <span><strong>Vectorization:</strong> Chuyển đổi dữ liệu hồ sơ thành các vector toán học (nhúng) để tối ưu hóa thuật toán tìm kiếm tương đồng (Semantic Search).</span>
                            </li>
                        </ul>
                    </section>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    <section id="sharing" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><Share2 className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">3. Chia sẻ thông tin</h2>
                        </div>
                        <p className="mb-4">Chúng tôi cam kết <strong className="text-blue-600 dark:text-blue-400 uppercase">KHÔNG</strong> thương mại hóa dữ liệu cá nhân của bạn dưới bất kỳ hình thức nào. Dữ liệu chỉ được chia sẻ trong 2 kịch bản duy nhất:</p>

                        <div className="space-y-4 mt-4">
                            <div className="p-5 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-500/10 rounded-r-xl">
                                <p className="font-bold text-slate-900 dark:text-white mb-2">1. Với Doanh nghiệp tuyển dụng</p>
                                <p className="text-sm">Khi và chỉ khi bạn bấm nút "Ứng tuyển", Hồ sơ của bạn mới được cấp quyền truy cập cho Bộ phận HR của doanh nghiệp đó.</p>
                            </div>

                            <div className="p-5 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-500/10 rounded-r-xl">
                                <p className="font-bold text-slate-900 dark:text-white mb-2">2. Yêu cầu từ Cơ quan pháp luật</p>
                                <p className="text-sm">Khi có yêu cầu chính thức bằng văn bản từ các cơ quan bảo vệ pháp luật, tòa án hoặc cơ quan nhà nước có thẩm quyền theo quy định của pháp luật hiện hành.</p>
                            </div>
                        </div>
                    </section>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    <section id="storage" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><Server className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">4. Lưu trữ & Bảo vệ</h2>
                        </div>
                        <p>Dữ liệu của bạn được mã hóa 2 chiều (End-to-end Encryption) và lưu trữ an toàn trên các trung tâm dữ liệu đạt chứng chỉ bảo mật quốc tế. Các dữ liệu mang tính nhạy cảm như Mật khẩu luôn được băm (Hash) bằng các thuật toán mạnh nhất hiện nay, ngay cả quản trị viên hệ thống cũng không thể đọc được.</p>
                    </section>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    <section id="rights" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><UserCog className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">5. Quyền kiểm soát Dữ liệu</h2>
                        </div>
                        <p className="mb-4">Bạn là người chủ duy nhất của dữ liệu do mình cung cấp. Bạn được quyền:</p>
                        <ul className="list-none space-y-3 mt-4">
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                                <span>Chủ động ẩn hoặc xóa tệp CV khỏi thư viện cá nhân bất kỳ lúc nào.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                                <span>Yêu cầu Hủy toàn bộ tài khoản và xóa vĩnh viễn dữ liệu (Right to be Forgotten) thông qua mục Cài đặt Tài khoản.</span>
                            </li>
                        </ul>
                    </section>

                </div>
            </main>

            <PublicFooter />
        </div>
    );
}