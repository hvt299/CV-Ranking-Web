'use client';

import Counter from '@/components/ui/Counter';

const STATS = [
    { label: "Ứng viên hoạt động", value: 12500, suffix: "+" },
    { label: "Doanh nghiệp tin dùng", value: 450, suffix: "+" },
    { label: "Việc làm đang mở", value: 3200, suffix: "+" },
    { label: "Tỷ lệ kết nối thành công", value: 98, suffix: "%" },
];

export default function StatsSection() {
    return (
        <section className="py-24 px-6 bg-blue-600 dark:bg-blue-900 border-y border-blue-700 dark:border-blue-950 transition-colors">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
                {STATS.map((stat, i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                        {/* Ép chữ số thành màu trắng */}
                        <div className="text-white">
                            <Counter value={stat.value} suffix={stat.suffix} />
                        </div>
                        <span className="text-sm font-bold text-blue-100 dark:text-blue-200 mt-2 uppercase tracking-wider">
                            {stat.label}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}