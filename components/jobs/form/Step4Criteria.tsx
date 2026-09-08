'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronUp, GraduationCap, Info, X } from 'lucide-react';
import { EDUCATION_LEVELS, GENDER_OPTIONS } from '@/constants/job.constants';
import { JobFormData, FilterRequirement } from '@/types';

interface Step4Props {
    formData: JobFormData;
    setFormData: (data: JobFormData) => void;
}

type RequirementField = 'languages' | 'required_certifications';

export default function Step4Criteria({ formData, setFormData }: Step4Props) {
    const [certInput, setCertInput] = useState('');
    const [majorInput, setMajorInput] = useState('');
    const [languageInput, setLanguageInput] = useState('');
    const [showKnockoutInfo, setShowKnockoutInfo] = useState(false);

    const languages = formData.languages || [];
    const certifications = formData.required_certifications || [];
    const majors = formData.education?.preferred_majors || [];

    const knockoutCount = useMemo(() => {
        return [...languages, ...certifications].filter((item) => item.is_knockout).length;
    }, [languages, certifications]);

    const updateEducation = (data: Partial<JobFormData['education']>) => {
        setFormData({
            ...formData,
            education: {
                ...formData.education,
                ...data
            }
        });
    };

    const addMajor = () => {
        const value = majorInput.trim();

        if (!value || majors.includes(value)) return;

        updateEducation({
            preferred_majors: [...majors, value]
        });

        setMajorInput('');
    };

    const removeMajor = (index: number) => {
        updateEducation({
            preferred_majors: majors.filter((_, i) => i !== index)
        });
    };

    const addFilterRequirement = (
        field: RequirementField,
        value: string
    ) => {
        const normalizedValue = value.trim();

        if (!normalizedValue) return;

        const currentItems = formData[field] || [];

        if (
            currentItems.some(
                (item) =>
                    item.name.toLowerCase() === normalizedValue.toLowerCase()
            )
        ) {
            return;
        }

        setFormData({
            ...formData,
            [field]: [
                ...currentItems,
                {
                    name: normalizedValue,
                    is_knockout: true
                }
            ]
        });
    };

    const removeFilterRequirement = (
        field: RequirementField,
        index: number
    ) => {
        const currentItems = formData[field] || [];

        setFormData({
            ...formData,
            [field]: currentItems.filter((_, i) => i !== index)
        });
    };

    const toggleKnockout = (
        field: RequirementField,
        index: number
    ) => {
        const currentItems = [...(formData[field] || [])];

        currentItems[index] = {
            ...currentItems[index],
            is_knockout: !currentItems[index].is_knockout
        };

        setFormData({
            ...formData,
            [field]: currentItems
        });
    };

    const handleTagInput = (
        event: React.KeyboardEvent<HTMLInputElement>,
        field: RequirementField,
        value: string,
        clear: () => void
    ) => {
        if (event.key !== 'Enter' && event.key !== ',') return;

        event.preventDefault();

        const normalizedValue = value.trim();

        if (!normalizedValue) return;

        addFilterRequirement(field, normalizedValue);
        clear();
    };

    const renderRequirementTags = (
        field: RequirementField,
        items: FilterRequirement[],
        emptyText: string
    ) => (
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            {items.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 pb-2">
                    {items.map((item, index) => (
                        <div
                            key={`${item.name}-${index}`}
                            className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 pl-2.5 pr-1.5 py-1.5 dark:border-slate-700 dark:bg-slate-800"
                        >
                            <span className="max-w-55 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                                {item.name}
                            </span>

                            <button
                                type="button"
                                onClick={() => toggleKnockout(field, index)}
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${item.is_knockout
                                        ? 'border-rose-500 bg-rose-500 text-white'
                                        : 'border-slate-300 bg-white text-transparent hover:border-rose-300 dark:border-slate-600 dark:bg-slate-900'
                                    }`}
                                title={
                                    item.is_knockout
                                        ? 'Đang là tiêu chí loại trực tiếp'
                                        : 'Đặt làm tiêu chí loại trực tiếp'
                                }
                            >
                                <Check className="h-3 w-3" strokeWidth={3} />
                            </button>

                            <button
                                type="button"
                                onClick={() => removeFilterRequirement(field, index)}
                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/20"
                                aria-label={`Xóa ${item.name}`}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className={`${items.length > 0 ? 'border-t border-slate-100 dark:border-slate-800' : ''} px-3 py-2.5`}>
                <input
                    type="text"
                    className="w-full bg-transparent p-1 text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"
                    placeholder={emptyText}
                    onKeyDown={(event) => {
                        const value = event.currentTarget.value;

                        handleTagInput(
                            event,
                            field,
                            value,
                            () => {
                                event.currentTarget.value = '';
                            }
                        );
                    }}
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-700">
                <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <GraduationCap className="h-5 w-5" />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            Tiêu chí sàng lọc
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Xác định các điều kiện cơ bản để hệ thống lọc và đánh giá ứng viên.
                        </p>
                    </div>
                </div>

                <div className="hidden sm:block shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                        Tiêu chí loại trực tiếp
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-rose-500">
                        {knockoutCount} tiêu chí
                    </p>
                </div>
            </div>

            {/* BASIC CRITERIA */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                                Thông tin cơ bản
                            </h3>

                            <p className="mt-0.5 text-xs text-slate-400">
                                Các điều kiện nền tảng của vị trí tuyển dụng.
                            </p>
                        </div>

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            Cơ bản
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-xs font-bold text-slate-600 dark:text-slate-300">
                            Kinh nghiệm tối thiểu
                        </label>

                        <div className="relative">
                            <input
                                type="number"
                                step="0.5"
                                min="0"
                                value={formData.min_yoe ?? 0}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        min_yoe:
                                            e.target.value === ''
                                                ? 0
                                                : Number(e.target.value)
                                    })
                                }
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 pr-16 text-sm font-medium text-slate-700 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-900"
                            />

                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                                năm
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-bold text-slate-600 dark:text-slate-300">
                            Giới tính
                        </label>

                        <select
                            value={formData.gender_requirement || ''}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    gender_requirement: e.target.value
                                })
                            }
                            className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-900"
                        >
                            {GENDER_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* EDUCATION */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                        Học vấn & chuyên ngành
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-400">
                        Thiết lập trình độ tối thiểu và các chuyên ngành ưu tiên.
                    </p>
                </div>

                <div className="space-y-4 p-5">
                    <div>
                        <label className="mb-2 block text-xs font-bold text-slate-600 dark:text-slate-300">
                            Trình độ tối thiểu
                        </label>

                        <select
                            value={formData.education?.min_level || ''}
                            onChange={(e) =>
                                updateEducation({
                                    min_level: e.target.value
                                })
                            }
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-900 md:w-1/2"
                        >
                            {EDUCATION_LEVELS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-bold text-slate-600 dark:text-slate-300">
                            Chuyên ngành ưu tiên
                        </label>

                        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                            {majors.length > 0 && (
                                <div className="flex flex-wrap gap-2 p-3 pb-2">
                                    {majors.map((major, index) => (
                                        <span
                                            key={`${major}-${index}`}
                                            className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-400"
                                        >
                                            <span className="max-w-60 truncate">
                                                {major}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => removeMajor(index)}
                                                className="text-emerald-400 transition-colors hover:text-rose-500"
                                                aria-label={`Xóa ${major}`}
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className={`${majors.length > 0 ? 'border-t border-slate-100 dark:border-slate-800' : ''} px-3 py-2.5`}>
                                <input
                                    type="text"
                                    value={majorInput}
                                    onChange={(e) => setMajorInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key !== 'Enter' && e.key !== ',') return;

                                        e.preventDefault();
                                        addMajor();
                                    }}
                                    className="w-full bg-transparent p-1 text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"
                                    placeholder="Nhập chuyên ngành rồi nhấn Enter..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* KNOCKOUT CRITERIA */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                                    Tiêu chí bắt buộc
                                </h3>

                                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-500 dark:bg-rose-900/20 dark:text-rose-400">
                                    Knockout
                                </span>
                            </div>

                            <p className="mt-0.5 text-xs text-slate-400">
                                Ứng viên không đáp ứng tiêu chí được đánh dấu sẽ có thể bị loại trực tiếp.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowKnockoutInfo((value) => !value)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                            aria-label="Thông tin về knockout"
                        >
                            {showKnockoutInfo ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </button>
                    </div>

                    {showKnockoutInfo && (
                        <div className="mt-3 flex gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-700 dark:bg-amber-900/10 dark:text-amber-300">
                            <Info className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                                Mặc định tiêu chí mới được thêm là <strong>Knockout</strong>.
                                Bấm vào ô ✓ màu đỏ để chuyển thành tiêu chí tham khảo.
                            </span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">
                    <div>
                        <div className="mb-2.5 flex items-center justify-between">
                            <div>
                                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Ngoại ngữ
                                </h4>

                                <p className="mt-0.5 text-[11px] text-slate-400">
                                    VD: IELTS 6.5, Tiếng Nhật N2
                                </p>
                            </div>

                            {languages.length > 0 && (
                                <span className="text-[10px] font-semibold text-slate-400">
                                    {languages.length} tiêu chí
                                </span>
                            )}
                        </div>

                        {renderRequirementTags(
                            'languages',
                            languages,
                            'Nhập ngoại ngữ rồi nhấn Enter...'
                        )}
                    </div>

                    <div>
                        <div className="mb-2.5 flex items-center justify-between">
                            <div>
                                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Chứng chỉ chuyên môn
                                </h4>

                                <p className="mt-0.5 text-[11px] text-slate-400">
                                    VD: PMP, AWS Certified
                                </p>
                            </div>

                            {certifications.length > 0 && (
                                <span className="text-[10px] font-semibold text-slate-400">
                                    {certifications.length} tiêu chí
                                </span>
                            )}
                        </div>

                        {renderRequirementTags(
                            'required_certifications',
                            certifications,
                            'Nhập chứng chỉ rồi nhấn Enter...'
                        )}
                    </div>
                </div>
            </section>

            {/* FOOTER NOTE */}
            <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    Chỉ đánh dấu <strong>Knockout</strong> với những điều kiện thực sự bắt buộc.
                    Các tiêu chí còn lại nên để hệ thống AI đánh giá theo mức độ phù hợp.
                </p>
            </div>
        </div>
    );
}