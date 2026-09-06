'use client';

import { ROUTES } from '@/constants/routes';
import { Globe, Hexagon, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function PublicFooter() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [language, setLanguage] = useState<'VI' | 'EN'>('VI');

    useEffect(() => setMounted(true), []);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'VI' ? 'EN' : 'VI'));
    };

    return (
        <footer className="border-t border-slate-200 bg-white px-6 pb-10 pt-20 font-sans transition-colors dark:border-slate-800 dark:bg-[#0a0a0a]">
            <div className="mx-auto mb-16 grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-12">
                {/* Brand */}
                <div className="sm:col-span-2 lg:col-span-2">
                    <button
                        type="button"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="group mb-6 flex w-fit items-center gap-2"
                        aria-label="Về đầu trang"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-blue-800 shadow-md shadow-blue-500/20 transition-transform group-hover:scale-105">
                            <Hexagon
                                className="h-6 w-6 text-white"
                                fill="currentColor"
                            />
                        </div>

                        <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                            ATS<span className="text-blue-600 dark:text-blue-400">SYSTEM</span>
                        </span>
                    </button>

                    <p className="max-w-sm text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                        Nền tảng Quản trị Tuyển dụng Ứng dụng Trí tuệ Nhân tạo.
                        Giải pháp tối ưu giúp doanh nghiệp tìm đúng người, và
                        ứng viên tìm đúng việc chỉ trong chớp mắt.
                    </p>
                </div>

                {/* Candidate */}
                <div>
                    <h4 className="mb-5 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                        Dành cho Ứng viên
                    </h4>

                    <ul className="space-y-3.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <li>
                            <Link
                                href={ROUTES.PUBLIC_JOBS}
                                className="inline-block transition-all hover:translate-x-1 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                Việc làm mới nhất
                            </Link>
                        </li>

                        <li>
                            <Link
                                href={ROUTES.PUBLIC_COMPANIES}
                                className="inline-block transition-all hover:translate-x-1 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                Danh sách công ty
                            </Link>
                        </li>

                        <li>
                            <Link
                                href={ROUTES.BLOG}
                                className="inline-block transition-all hover:translate-x-1 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                Cẩm nang nghề nghiệp
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Business */}
                <div>
                    <h4 className="mb-5 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                        Doanh nghiệp
                    </h4>

                    <ul className="space-y-3.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <li>
                            <Link
                                href="/features"
                                className="inline-block transition-all hover:translate-x-1 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                Sản phẩm & Tính năng
                            </Link>
                        </li>

                        <li>
                            <Link
                                href={ROUTES.PRICING}
                                className="inline-block transition-all hover:translate-x-1 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                Bảng giá dịch vụ
                            </Link>
                        </li>

                        <li>
                            <Link
                                href={ROUTES.SUPPORT}
                                className="inline-block transition-all hover:translate-x-1 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                Hỗ trợ khách hàng
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* About */}
                <div>
                    <h4 className="mb-5 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                        Về ATS System
                    </h4>

                    <ul className="space-y-3.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <li>
                            <Link
                                href={ROUTES.ABOUT}
                                className="inline-block transition-all hover:translate-x-1 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                Về chúng tôi
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/terms"
                                className="inline-block transition-all hover:translate-x-1 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                Điều khoản dịch vụ
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/privacy"
                                className="inline-block transition-all hover:translate-x-1 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                Chính sách bảo mật
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 border-t border-slate-100 pt-8 text-xs font-medium text-slate-400 dark:border-slate-800 dark:text-slate-500 md:flex-row">
                <p>© 2026 ATS System. Bản quyền đã được bảo hộ.</p>

                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                    {/* Social */}
                    <div className="flex items-center gap-5 pr-2 sm:pr-3">
                        <button
                            type="button"
                            className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            X (Twitter)
                        </button>

                        <button
                            type="button"
                            className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            Facebook
                        </button>

                        <button
                            type="button"
                            className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            LinkedIn
                        </button>

                        <button
                            type="button"
                            className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            GitHub
                        </button>
                    </div>

                    <div className="hidden h-5 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

                    {/* Language */}
                    <button
                        type="button"
                        onClick={toggleLanguage}
                        className="flex items-center gap-1.5 rounded-full px-2.5 py-2 text-xs font-black text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                        aria-label="Chuyển đổi ngôn ngữ"
                        title="Chuyển đổi ngôn ngữ"
                    >
                        <Globe className="h-4 w-4" />
                        <span>{language}</span>
                    </button>

                    {/* Theme */}
                    {mounted && (
                        <button
                            type="button"
                            onClick={() =>
                                setTheme(theme === 'dark' ? 'light' : 'dark')
                            }
                            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                            aria-label="Chuyển đổi giao diện"
                            title="Chuyển đổi giao diện"
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-4 w-4" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                        </button>
                    )}
                </div>
            </div>
        </footer>
    );
}