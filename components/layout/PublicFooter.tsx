'use client';

import { ROUTES } from '@/constants/routes';
import { Hexagon } from 'lucide-react';
import Link from 'next/link';

export default function PublicFooter() {
    return (
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0a0a] pt-20 pb-10 px-6 transition-colors font-sans">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-16">

                {/* Brand Column (Spans 2 cols on Tablet/Desktop) */}
                <div className="sm:col-span-2 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-6 group cursor-pointer w-fit" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            <Hexagon className="w-6 h-6 text-white" fill="currentColor" />
                        </div>
                        <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                            ATS<span className="text-blue-600 dark:text-blue-400">SYSTEM</span>
                        </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed font-medium">
                        Nền tảng Quản trị Tuyển dụng Ứng dụng Trí tuệ Nhân tạo. Giải pháp tối ưu giúp doanh nghiệp tìm đúng người, và ứng viên tìm đúng việc chỉ trong chớp mắt.
                    </p>
                </div>

                {/* Sitemap Columns */}
                <div>
                    <h4 className="font-black text-slate-900 dark:text-white mb-5 uppercase tracking-wider text-xs">Dành cho Ứng viên</h4>
                    <ul className="space-y-3.5 text-sm text-slate-500 dark:text-slate-400 font-medium">
                        <li><Link href={ROUTES.PUBLIC_JOBS} className="hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1 inline-block transition-all">Việc làm mới nhất</Link></li>
                        <li><Link href={ROUTES.PUBLIC_COMPANIES} className="hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1 inline-block transition-all">Danh sách công ty</Link></li>
                        <li><Link href={ROUTES.BLOG} className="hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1 inline-block transition-all">Cẩm nang nghề nghiệp</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-black text-slate-900 dark:text-white mb-5 uppercase tracking-wider text-xs">Doanh nghiệp</h4>
                    <ul className="space-y-3.5 text-sm text-slate-500 dark:text-slate-400 font-medium">
                        <li><Link href="/features" className="hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1 inline-block transition-all">Sản phẩm & Tính năng</Link></li>
                        <li><Link href={ROUTES.PRICING} className="hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1 inline-block transition-all">Bảng giá dịch vụ</Link></li>
                        <li><Link href={ROUTES.SUPPORT} className="hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1 inline-block transition-all">Hỗ trợ khách hàng</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-black text-slate-900 dark:text-white mb-5 uppercase tracking-wider text-xs">Về ATS System</h4>
                    <ul className="space-y-3.5 text-sm text-slate-500 dark:text-slate-400 font-medium">
                        <li><Link href={ROUTES.ABOUT} className="hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1 inline-block transition-all">Về chúng tôi</Link></li>
                        <li><Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1 inline-block transition-all">Điều khoản dịch vụ</Link></li>
                        <li><Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1 inline-block transition-all">Chính sách bảo mật</Link></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-8 font-medium">
                <p>© 2026 ATS System. Bản quyền đã được bảo hộ.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">X (Twitter)</a>
                    <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Facebook</a>
                    <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">LinkedIn</a>
                    <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">GitHub</a>
                </div>
            </div>
        </footer>
    );
}