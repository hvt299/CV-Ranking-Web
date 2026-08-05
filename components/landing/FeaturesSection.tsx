'use client';

import { motion, Variants } from 'framer-motion';
import { BrainCircuit, FileSearch, Zap, ShieldCheck } from 'lucide-react';

const FEATURES = [
    { icon: BrainCircuit, title: "AI Scoring Matrix", desc: "Chấm điểm CV đa chiều bằng mô hình LLM tiên tiến, đối chiếu chính xác với JD không thiên vị." },
    { icon: FileSearch, title: "Anti-Stuffing System", desc: "Tự động phát hiện và trừ điểm các hồ sơ cố tình nhồi nhét từ khóa, font chữ trắng hoặc tàng hình." },
    { icon: Zap, title: "Smart Parsing", desc: "Bóc tách chính xác Học vấn, Số năm kinh nghiệm và Kỹ năng chỉ trong 10 giây từ file PDF/DOCX." },
    { icon: ShieldCheck, title: "Bảo mật chuẩn Enterprise", desc: "Dữ liệu ứng viên và doanh nghiệp được mã hóa đầu cuối, tuân thủ các tiêu chuẩn bảo mật khắt khe nhất." }
];

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function FeaturesSection() {
    return (
        <section
            id="features"
            className="py-32 px-6 relative scroll-mt-20 bg-slate-50 dark:bg-[#070707] transition-colors"
        >
            <div className="max-w-7xl mx-auto">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="mb-16">
                    <motion.h2
                        variants={fadeUp}
                        className="text-3xl md:text-5xl font-black text-slate-900 dark:text-slate-100 mb-4"
                    >
                        Tuyển dụng.
                        <span className="text-slate-400 dark:text-slate-500">
                            {" "}Nhưng thông minh hơn.
                        </span>
                    </motion.h2>
                    <motion.p
                        variants={fadeUp}
                        className="text-slate-600 dark:text-slate-300 text-lg max-w-xl font-medium"
                    >
                        Hệ thống ATS của chúng tôi cung cấp bộ công cụ toàn diện giúp tiết kiệm 80% thời gian sàng lọc hồ sơ.
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {FEATURES.map((feat, i) => (
                        <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                            className="p-8 md:p-10 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm dark:shadow-black/30 hover:shadow-xl dark:hover:shadow-blue-900/10 hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300 group"
                        >
                            <div
                                className="w-12 h-12 bg-blue-50 dark:bg-blue-500/15 border border-blue-100 dark:border-blue-400/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm dark:shadow-blue-900/20"
                            >
                                <feat.icon className="w-6 h-6" />
                            </div>
                            <h3
                                className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3"
                            >{feat.title}</h3>
                            <p
                                className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium"
                            >{feat.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}