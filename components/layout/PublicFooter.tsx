'use client';

import { Hexagon } from 'lucide-react';
import Link from 'next/link';

export default function PublicFooter() {
    return (
        <footer className="border-t border-border dark:border-slate-800 bg-background dark:bg-slate-950 pt-20 pb-10 px-6 transition-colors">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="w-10 h-10 bg-linear-to-br from-primary-600 to-primary-800 rounded-button flex items-center justify-center shadow-card-hover group-hover:scale-105 transition-transform">
                            <Hexagon className="w-6 h-6 text-white" fill="currentColor" />
                        </div>
                        <span className="text-xl font-black text-text dark:text-white tracking-tight">ATS<span className="text-primary-600">SYSTEM</span></span>
                    </div>
                    <p className="text-text-muted dark:text-slate-400 text-sm max-w-sm leading-relaxed font-medium">
                        Nền tảng Quản trị Tuyển dụng Ứng dụng Trí tuệ Nhân tạo. Giúp doanh nghiệp tìm đúng người, giúp ứng viên tìm đúng việc.
                    </p>
                </div>

                {/* FIX: Cấu trúc lại Sitemap đồng bộ */}
                <div>
                    <h4 className="font-bold text-text dark:text-white mb-4">Dành cho Ứng viên</h4>
                    <ul className="space-y-3 text-sm text-text-muted dark:text-slate-400 font-medium">
                        <li><Link href="/careers" className="hover:text-primary-600 dark:hover:text-blue-400 transition-colors">Việc làm mới nhất</Link></li>
                        <li><Link href="/companies" className="hover:text-primary-600 dark:hover:text-blue-400 transition-colors">Danh sách công ty</Link></li>
                        <li><Link href="#" className="hover:text-primary-600 dark:hover:text-blue-400 transition-colors">Cẩm nang nghề nghiệp</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-text dark:text-white mb-4">Doanh nghiệp</h4>
                    <ul className="space-y-3 text-sm text-text-muted dark:text-slate-400 font-medium">
                        <li><Link href="#" className="hover:text-primary-600 dark:hover:text-blue-400 transition-colors">Sản phẩm & Tính năng</Link></li>
                        <li><Link href="/pricing" className="hover:text-primary-600 dark:hover:text-blue-400 transition-colors">Bảng giá dịch vụ</Link></li>
                        <li><Link href="#" className="hover:text-primary-600 dark:hover:text-blue-400 transition-colors">Hỗ trợ khách hàng</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-text dark:text-white mb-4">Về ATS System</h4>
                    <ul className="space-y-3 text-sm text-text-muted dark:text-slate-400 font-medium">
                        <li><Link href="#" className="hover:text-primary-600 dark:hover:text-blue-400 transition-colors">Về chúng tôi</Link></li>
                        <li><Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Điều khoản dịch vụ</Link></li>
                        <li><Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Chính sách bảo mật</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-600 border-t border-border dark:border-slate-800 pt-8 font-medium">
                <p>© 2026 ATS System. Bảo lưu mọi quyền.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <a href="#" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">Twitter</a>
                    <a href="#" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">LinkedIn</a>
                    <a href="#" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">GitHub</a>
                </div>
            </div>
        </footer>
    );
}