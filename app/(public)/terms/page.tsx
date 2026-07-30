'use client';

import { useState, useEffect } from 'react';
import { FileText, CheckSquare, Layers, UserCheck, Shield, AlertTriangle, ChevronRight } from 'lucide-react';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuth } from '@/context/AuthContext';

const SECTIONS = [
    { id: 'acceptance', title: '1. Chấp nhận Điều khoản', icon: CheckSquare },
    { id: 'services', title: '2. Mô tả Dịch vụ', icon: Layers },
    { id: 'responsibilities', title: '3. Trách nhiệm Người dùng', icon: UserCheck },
    { id: 'ip', title: '4. Sở hữu Trí tuệ', icon: Shield },
    { id: 'liability', title: '5. Giới hạn Trách nhiệm', icon: AlertTriangle },
];

export default function TermsPage() {
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
            const scrollPosition = window.scrollY + 200; // Offset cho header

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
                top: element.offsetTop - 120, // Offset trừ hao Header
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            {/* Khối Hero Banner Tích hợp Pattern */}
            <div className="relative pt-32 pb-16 md:pt-40 md:pb-20 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#0a0a0a]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-200 dark:border-blue-800/50">
                        <FileText className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        Điều khoản <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-400">Dịch vụ</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto">
                        Các quy định và thỏa thuận khi sử dụng nền tảng tuyển dụng bằng Trí tuệ nhân tạo của ATS System. Cập nhật lần cuối: 01/08/2026.
                    </p>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-12 md:py-20 flex flex-col lg:flex-row gap-12">
                {/* Mục lục bám dính (Sidebar) */}
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

                    <section id="acceptance" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><CheckSquare className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">1. Chấp nhận Điều khoản</h2>
                        </div>
                        <p className="mb-4">Bằng việc truy cập, đăng ký tài khoản và sử dụng Hệ thống ATS System (sau đây gọi tắt là "Hệ thống"), bạn xác nhận đã đọc, hiểu rõ và đồng ý tuân thủ toàn bộ các Điều khoản dịch vụ này.</p>
                        <p>Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản, vui lòng ngay lập tức ngừng sử dụng dịch vụ của chúng tôi.</p>
                    </section>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    <section id="services" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><Layers className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">2. Mô tả Dịch vụ</h2>
                        </div>
                        <p className="mb-4">ATS System là nền tảng kết nối Ứng viên và Nhà tuyển dụng thông qua việc áp dụng Trí tuệ nhân tạo (AI) để phân tích, chấm điểm và đề xuất sự phù hợp giữa Hồ sơ (CV) và Yêu cầu công việc (JD).</p>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 space-y-4">
                            <div className="flex gap-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                <p><strong className="text-slate-900 dark:text-white">Đối với Ứng viên:</strong> Nền tảng cung cấp không gian tạo hồ sơ số, quản lý thư viện CV, tìm kiếm cơ hội nghề nghiệp và nộp đơn ứng tuyển nhanh chóng.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                <p><strong className="text-slate-900 dark:text-white">Đối với Doanh nghiệp:</strong> Cung cấp công cụ đăng tin, quản lý chiến dịch, phối hợp nhóm nhân sự (HR) và tự động xếp hạng ứng viên bằng hệ thống Vector Database kết hợp LLM.</p>
                            </div>
                        </div>
                    </section>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    <section id="responsibilities" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><UserCheck className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">3. Trách nhiệm của Người dùng</h2>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3 mt-6">3.1. Tính chính xác của dữ liệu</h3>
                        <p className="mb-4">Bạn cam kết mọi thông tin cung cấp cho Hệ thống (bao gồm thông tin cá nhân, hồ sơ học vấn, kinh nghiệm làm việc, tin tuyển dụng, giấy phép kinh doanh) là chính xác, trung thực và không vi phạm pháp luật.</p>

                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3 mt-6">3.2. Bảo mật Tài khoản</h3>
                        <p>Bạn tự chịu trách nhiệm bảo mật tài khoản cá nhân, mật khẩu và token truy cập của mình. Bất kỳ hành động thao tác nào xuất phát từ phiên đăng nhập của bạn sẽ được xem là do chính bạn thực hiện.</p>
                    </section>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    <section id="ip" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><Shield className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">4. Quyền Sở hữu Trí tuệ</h2>
                        </div>
                        <p>Toàn bộ nội dung nền tảng, thiết kế giao diện, mã nguồn, thuật toán chấm điểm AI, cơ sở dữ liệu Vector và nhận diện thương hiệu của ATS System đều là tài sản độc quyền của chúng tôi và được bảo vệ nghiêm ngặt bởi luật sở hữu trí tuệ tại Việt Nam và Quốc tế.</p>
                    </section>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    <section id="liability" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><AlertTriangle className="w-5 h-5" /></div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">5. Giới hạn Trách nhiệm</h2>
                        </div>
                        <p className="mb-4">Mặc dù ATS System sử dụng các công nghệ AI tiên tiến nhất để tối ưu hóa quá trình tuyển dụng, chúng tôi <strong className="text-blue-600 dark:text-blue-400">không đảm bảo tuyệt đối</strong> rằng ứng viên sẽ tìm được việc làm, hoặc nhà tuyển dụng sẽ tuyển được nhân sự hoàn hảo.</p>
                        <div className="p-5 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-slate-700 dark:text-slate-300 rounded-r-xl leading-relaxed">
                            Điểm số AI (AI Match Score) do hệ thống cung cấp chỉ mang tính chất tham khảo, giúp lược bỏ các hồ sơ rác và tiết kiệm thời gian. Quyết định tuyển dụng cuối cùng hoàn toàn thuộc về doanh nghiệp và các vòng phỏng vấn thực tế.
                        </div>
                    </section>

                </div>
            </main>

            <PublicFooter />
        </div>
    );
}