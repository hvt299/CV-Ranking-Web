'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Plus, X } from 'lucide-react';

const RichTextEditor = dynamic(() => import('@/components/shared/RichTextEditor'), {
    ssr: false,
    loading: () => <div className="h-52 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl border border-slate-200 dark:border-slate-700" />
});

interface CompanyCultureProps {
    company: any;
    setCompany: any;
}

export default function CompanyCulture({ company, setCompany }: CompanyCultureProps) {
    const [benefitInput, setBenefitInput] = useState('');

    const handleAddBenefit = () => {
        const value = benefitInput.trim();

        if (!value) return;

        setCompany((prev: any) => ({
            ...prev,
            benefits: [...(prev.benefits || []), value]
        }));

        setBenefitInput('');
    };

    const removeBenefit = (index: number) => {
        setCompany((prev: any) => ({
            ...prev,
            benefits: (prev.benefits || []).filter((_: any, i: number) => i !== index)
        }));
    };

    const updateDescription = (value: string) => {
        setCompany((prev: any) => ({
            ...prev,
            description: value
        }));
    };

    return (
        <>
            {/* MẠNG XÃ HỘI */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 dark:bg-slate-900/30 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                    <label className="block text-xs font-bold mb-2 text-slate-500 uppercase tracking-wider">
                        Facebook
                    </label>

                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 w-4 h-4">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>

                        <input
                            type="url"
                            value={company.social_links?.facebook || ''}
                            onChange={(e) => setCompany({
                                ...company,
                                social_links: {
                                    ...company.social_links,
                                    facebook: e.target.value
                                }
                            })}
                            className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
                            placeholder="fb.com/..."
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold mb-2 text-slate-500 uppercase tracking-wider">
                        LinkedIn
                    </label>

                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 w-4 h-4">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                            <rect x="2" y="9" width="4" height="12" />
                            <circle cx="4" cy="4" r="2" />
                        </svg>

                        <input
                            type="url"
                            value={company.social_links?.linkedin || ''}
                            onChange={(e) => setCompany({
                                ...company,
                                social_links: {
                                    ...company.social_links,
                                    linkedin: e.target.value
                                }
                            })}
                            className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
                            placeholder="linkedin.com/company/..."
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold mb-2 text-slate-500 uppercase tracking-wider">
                        YouTube
                    </label>

                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500 w-4 h-4">
                            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                        </svg>

                        <input
                            type="url"
                            value={company.social_links?.youtube || ''}
                            onChange={(e) => setCompany({
                                ...company,
                                social_links: {
                                    ...company.social_links,
                                    youtube: e.target.value
                                }
                            })}
                            className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
                            placeholder="youtube.com/..."
                        />
                    </div>
                </div>
            </div>

            {/* GIỚI THIỆU CÔNG TY */}
            <div className="md:col-span-2"> <div className="flex items-center justify-between gap-3 mb-3"> <div> <label className="block text-base font-bold text-slate-700 dark:text-slate-300"> Giới thiệu tổng quan </label>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Giới thiệu về tầm nhìn, sứ mệnh, văn hóa và môi trường làm việc của doanh nghiệp.
                </p>
            </div>
            </div>
                <RichTextEditor
                    value={company.description || ''}
                    onChange={updateDescription}
                    placeholder="Chia sẻ về tầm nhìn, sứ mệnh, văn hóa và môi trường làm việc của doanh nghiệp..."
                />
            </div>

            {/* PHÚC LỢI */}
            <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">
                    Phúc lợi nổi bật (Tags)
                </label>

                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={benefitInput}
                        onChange={(e) => setBenefitInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddBenefit();
                            }
                        }}
                        className="flex-1 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-primary-500"
                        placeholder="VD: Khám sức khỏe Premium, Lương tháng 13..."
                    />

                    <button
                        type="button"
                        onClick={handleAddBenefit}
                        className="px-4 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-xl font-bold hover:bg-primary-200 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {(company.benefits || []).map((benefit: string, index: number) => (
                        <span
                            key={`${benefit}-${index}`}
                            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 shadow-sm"
                        >
                            {benefit}

                            <button
                                type="button"
                                onClick={() => removeBenefit(index)}
                                className="text-slate-400 hover:text-rose-500"
                                aria-label={`Xóa ${benefit}`}
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    ))}
                </div>
            </div>
        </>
    );
}