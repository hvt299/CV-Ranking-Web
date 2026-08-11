'use client';

import { useState, useEffect } from 'react';
import Counter from '@/components/ui/Counter';
import { systemService } from '@/features/system/system.service';

export default function StatsSection() {
    const [stats, setStats] = useState([
        { label: "Ứng viên hoạt động", value: 0, suffix: "+" },
        { label: "Doanh nghiệp tin dùng", value: 0, suffix: "+" },
        { label: "Việc làm đang mở", value: 0, suffix: "+" },
        { label: "Tỷ lệ kết nối thành công", value: 98, suffix: "%" },
    ]);

    useEffect(() => {
        systemService.getStatistics()
            .then(data => {
                setStats([
                    { label: "Ứng viên hoạt động", value: data.total_candidates || 0, suffix: data.total_candidates > 10 ? "+" : "" },
                    { label: "Doanh nghiệp tin dùng", value: data.total_companies || 0, suffix: data.total_companies > 10 ? "+" : "" },
                    { label: "Việc làm đang mở", value: data.total_jobs || 0, suffix: data.total_jobs > 10 ? "+" : "" },
                    { label: "Tỷ lệ kết nối thành công", value: data.success_rate || 0, suffix: "%" },
                ]);
            })
            .catch(console.error);
    }, []);

    return (
        <section className="py-24 px-6 bg-blue-600 dark:bg-blue-950 border-y border-blue-700 dark:border-blue-900 transition-colors">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
                {stats.map((stat, i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                        <div className="text-white">
                            <Counter value={stat.value} suffix={stat.suffix} />
                        </div>
                        <span className="text-sm font-bold text-blue-100 dark:text-blue-200 mt-2 uppercase tracking-wider">{stat.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}