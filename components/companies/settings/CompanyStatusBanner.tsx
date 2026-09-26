'use client';

import { COMPANY_STATUS_CONFIG } from '@/constants/company.constants';

export default function CompanyStatusBanner({ status }: { status: string }) {
    const config = COMPANY_STATUS_CONFIG[status] || COMPANY_STATUS_CONFIG['default'];
    const Icon = config.icon;

    return (
        <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-between border border-slate-200 dark:border-slate-700 shadow-inner">
            <div>
                <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-1">Trạng thái Doanh nghiệp</p>
                <p className="text-xs text-slate-500 font-medium">Chỉ công ty Đã duyệt mới được phép xuất bản chiến dịch Job.</p>
            </div>
            <span className={`px-4 py-2 rounded-xl text-sm font-black flex items-center gap-1.5 shadow-sm ${config.color}`}>
                <Icon className="w-4 h-4" /> {config.label}
            </span>
        </div>
    );
}