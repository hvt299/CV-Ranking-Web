'use client';

import { useState, useEffect } from 'react';
import { Headset, Mail, Phone, MapPin, Send, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuth } from '@/context/AuthContext';

const FAQS = [
    {
        question: 'ATS System chấm điểm CV như thế nào?',
        answer: 'Hệ thống sử dụng NLP (Xử lý ngôn ngữ tự nhiên) để đọc hiểu CV của bạn, sau đó chuyển đổi thành Vector. Thuật toán AI sẽ tính toán độ tương đồng (Cosine Similarity) giữa Vector của CV và Vector của mô tả công việc (JD) để đưa ra thang điểm chính xác nhất, không dựa trên việc đếm từ khóa cứng nhắc.'
    },
    {
        question: 'Thông tin cá nhân của tôi có được bảo mật không?',
        answer: 'Hoàn toàn bảo mật. Dữ liệu của bạn được mã hóa và lưu trữ an toàn. Tệp CV chỉ được gửi đến Nhà tuyển dụng khi và chỉ khi bạn chủ động bấm nút "Ứng tuyển". Chúng tôi tuân thủ nghiêm ngặt Chính sách bảo mật đã công bố.'
    },
    {
        question: 'Làm thế nào để tài khoản công ty được xác thực (KYC)?',
        answer: 'Doanh nghiệp cần cung cấp Mã số thuế hợp lệ và hình ảnh Giấy phép đăng ký kinh doanh trong phần Cài đặt Tài khoản. Đội ngũ kiểm duyệt của ATS System sẽ tiến hành đối chiếu với cổng thông tin quốc gia và xác duyệt trong vòng 2-4 giờ làm việc.'
    },
    {
        question: 'Tôi có thể tải lên bao nhiêu CV trong thư viện?',
        answer: 'Đối với tài khoản ứng viên (Miễn phí), bạn có thể tải lên và lưu trữ tối đa 5 phiên bản CV khác nhau để linh hoạt ứng tuyển cho nhiều vị trí chuyên môn biệt lập.'
    }
];

export default function SupportPage() {
    const { isAuthenticated, user } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(0);

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
                        <Headset className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        Trung tâm <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-400">Hỗ trợ</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto">
                        Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn 24/7.
                    </p>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 md:py-24 space-y-20 font-sans">

                {/* Thông tin liên hệ nhanh (3 Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Phone className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Gọi cho chúng tôi</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">Hỗ trợ nhanh trong giờ hành chính</p>
                        <a href="tel:1900000000" className="text-blue-600 dark:text-blue-400 font-black text-xl hover:underline">1900 000 000</a>
                    </div>

                    <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Gửi Email</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">Phản hồi trong vòng 24 giờ</p>
                        <a href="mailto:support@atssystem.vn" className="text-blue-600 dark:text-blue-400 font-black text-lg hover:underline">support@atssystem.vn</a>
                    </div>

                    <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Trụ sở chính</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">Tầng 7, Tòa nhà ATSSYSTEM Tower</p>
                        <p className="text-slate-800 dark:text-slate-200 font-bold text-sm">Đà Nẵng, Việt Nam</p>
                    </div>
                </div>

                {/* Khu vực FAQ và Contact Form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                    {/* FAQ Accordion */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Câu hỏi thường gặp</h2>
                        </div>
                        <div className="space-y-4">
                            {FAQS.map((faq, index) => (
                                <div key={index} className="bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                                    >
                                        <span className="font-bold text-slate-800 dark:text-slate-200 pr-4">{faq.question}</span>
                                        {openFaq === index ? (
                                            <ChevronUp className="w-5 h-5 text-blue-500 shrink-0" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                                        )}
                                    </button>
                                    {openFaq === index && (
                                        <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white dark:bg-slate-900/50 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        {/* Box blur trang trí nhẹ */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Gửi tin nhắn cho chúng tôi</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-8">Điền thông tin vào mẫu bên dưới, chuyên viên hỗ trợ sẽ liên hệ lại với bạn.</p>

                        <form className="space-y-5 relative z-10" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                                    <input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-text border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 dark:text-white transition-colors placeholder:text-slate-400" placeholder="Nguyễn Văn A" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email <span className="text-red-500">*</span></label>
                                    <input type="email" className="w-full px-4 py-3 bg-slate-50 dark:bg-text border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 dark:text-white transition-colors placeholder:text-slate-400" placeholder="name@email.com" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Chủ đề <span className="text-red-500">*</span></label>
                                <select className="w-full px-4 py-3 bg-slate-50 dark:bg-text border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 dark:text-white transition-colors">
                                    <option value="">-- Chọn chủ đề hỗ trợ --</option>
                                    <option value="technical">Hỗ trợ kỹ thuật / Báo lỗi</option>
                                    <option value="billing">Thanh toán & Gói cước</option>
                                    <option value="kyc">Xác thực doanh nghiệp (KYC)</option>
                                    <option value="other">Vấn đề khác</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nội dung chi tiết <span className="text-red-500">*</span></label>
                                <textarea rows={4} className="w-full px-4 py-3 bg-slate-50 dark:bg-text border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 dark:text-white transition-colors resize-none placeholder:text-slate-400" placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."></textarea>
                            </div>
                            <button type="button" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-blue-500/20 mt-2">
                                Gửi yêu cầu <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                </div>

            </main>

            <PublicFooter />
        </div>
    );
}