'use client';

import { motion } from 'framer-motion';

const WORKFLOW_STEPS = [
    { step: "01", title: "Tạo chiến dịch", desc: "HR tạo Job Description với các yêu cầu kỹ năng và thiết lập trọng số AI." },
    { step: "02", title: "AI Phân tích", desc: "Ứng viên nộp CV. Hệ thống bóc tách dữ liệu và chấm điểm tự động ngay lập tức." },
    { step: "03", title: "Kết nối", desc: "Leaderboard hiển thị ứng viên tốt nhất. HR gửi lịch phỏng vấn chỉ với 1 click." },
];

export default function WorkflowSection() {
    return (
        <section id="workflow" className="py-32 px-6 bg-white dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800 scroll-mt-20 transition-colors">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-16">Quy trình đơn giản. <br />Hiệu quả tối đa.</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px bg-slate-300 dark:bg-slate-800 z-0" />

                    {WORKFLOW_STEPS.map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 bg-white dark:bg-[#050505] border-2 border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center text-2xl font-black text-blue-600 dark:text-white mb-6 shadow-xl transition-colors">
                                {item.step}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{item.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}