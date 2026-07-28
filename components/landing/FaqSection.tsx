'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
    { q: "Hệ thống AI chấm điểm dựa trên tiêu chí nào?", a: "AI của chúng tôi phân tích dựa trên 4 trọng số: Kỹ năng chuyên môn, Ngữ nghĩa văn cảnh (NLP), Kinh nghiệm làm việc và Trình độ học vấn." },
    { q: "Dữ liệu CV của tôi có được bảo mật không?", a: "Tuyệt đối. Chúng tôi sử dụng mã hóa AES-256 cho dữ liệu lưu trữ và TLS 1.3 cho dữ liệu truyền tải. Hồ sơ chỉ được chia sẻ khi bạn ứng tuyển." },
    { q: "Làm sao để đăng ký tài khoản Doanh nghiệp?", a: "Doanh nghiệp cần cung cấp Mã số thuế và Giấy phép kinh doanh. Đội ngũ Admin sẽ kiểm duyệt (KYC) trong vòng 24h làm việc." }
];

export default function FaqSection() {
    const [activeFaq, setActiveFaq] = useState<number | null>(0);

    return (
        <section className="py-32 px-6 bg-slate-50 dark:bg-[#050505] transition-colors">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center mb-12">Câu hỏi thường gặp</h2>
                <div className="space-y-4">
                    {FAQS.map((faq, i) => (
                        <div key={i} className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/30 shadow-sm transition-colors">
                            <button
                                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                className="w-full px-6 py-4 flex items-center justify-between font-bold text-slate-800 dark:text-white text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                {faq.q}
                                <ChevronDown className={`w-5 h-5 text-slate-400 dark:text-slate-500 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {activeFaq === i && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                        <p className="px-6 pb-4 text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">{faq.a}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}