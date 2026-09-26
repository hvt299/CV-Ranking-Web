'use client';

import { useMemo } from 'react';
import Select from 'react-select';
import { Briefcase, Flame, LockKeyhole } from 'lucide-react';
import { GROUPED_INDUSTRIES, JOB_LEVELS, EMPLOYMENT_TYPES, WORK_MODES } from '@/constants/job.constants';
import { useSubscription } from '@/hooks/useSubscription';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { useTheme } from 'next-themes';
import { JobFormData } from '@/types';

interface Step1Props {
    formData: JobFormData;
    setFormData: React.Dispatch<React.SetStateAction<JobFormData>>;
}

export default function Step1Basic({ formData, setFormData }: Step1Props) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // ---------------------------------------------------------
    // Subscription / HOT Job permission
    // ---------------------------------------------------------
    const { data: myPlanRes } = useSubscription();
    const { data: plansRes } = useSubscriptionPlans('hr');

    const currentPlanCode = myPlanRes?.data?.current_plan_code || 'hr_free';

    const currentPlan = plansRes?.data?.find(
        (plan: any) => plan.plan_code === currentPlanCode
    );

    const canSetHotJob = currentPlan?.features?.can_set_hot_job || false;

    const unlockHotPlan = plansRes?.data?.find(
        (plan: any) => plan.features?.can_set_hot_job
    );

    const unlockHotPlanName = unlockHotPlan?.name || 'Enterprise';

    // ---------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------
    const updateField = <K extends keyof JobFormData>(field: K, value: JobFormData[K]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const today = useMemo(() => new Date().toISOString().split('T')[0], []);

    // ---------------------------------------------------------
    // Select styles
    // ---------------------------------------------------------
    const customSelectStyles = {
        control: (base: any, state: any) => ({
            ...base,
            minHeight: '52px',
            background: isDark ? '#0f172a' : '#f8fafc',
            borderColor: state.isFocused ? '#3b82f6' : isDark ? '#334155' : '#e2e8f0',
            borderRadius: '0.75rem',
            padding: '2px 6px',
            boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
            fontSize: '0.875rem',
            transition: 'all 150ms ease',
            '&:hover': {
                borderColor: state.isFocused ? '#3b82f6' : isDark ? '#475569' : '#cbd5e1',
            },
        }),

        menu: (base: any) => ({
            ...base,
            zIndex: 9999,
            fontSize: '0.875rem',
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
            borderRadius: '0.75rem',
            overflow: 'hidden',
            boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.35)' : '0 10px 30px rgba(15,23,42,0.12)',
        }),

        option: (base: any, state: any) => ({
            ...base,
            cursor: 'pointer',
            padding: '10px 12px',
            backgroundColor: state.isSelected ? (isDark ? '#1d4ed8' : '#eff6ff') : state.isFocused ? (isDark ? '#334155' : '#f1f5f9') : 'transparent',
            color: state.isSelected ? (isDark ? '#ffffff' : '#1d4ed8') : isDark ? '#f8fafc' : '#1e293b',
            fontWeight: state.isSelected ? 700 : 500,
        }),

        singleValue: (base: any) => ({
            ...base,
            color: isDark ? '#f8fafc' : '#1e293b',
            fontWeight: 500,
        }),

        placeholder: (base: any) => ({
            ...base,
            color: isDark ? '#64748b' : '#94a3b8',
        }),

        input: (base: any) => ({
            ...base,
            color: isDark ? '#f8fafc' : '#1e293b',
        }),

        indicatorSeparator: () => ({
            display: 'none',
        }),

        dropdownIndicator: (base: any) => ({
            ...base,
            color: isDark ? '#64748b' : '#94a3b8',
            '&:hover': {
                color: isDark ? '#94a3b8' : '#64748b',
            },
        }),

        clearIndicator: (base: any) => ({
            ...base,
            color: isDark ? '#64748b' : '#94a3b8',
            '&:hover': {
                color: '#ef4444',
            },
        }),
    };

    const industryOptions = useMemo(() => GROUPED_INDUSTRIES.flatMap(group => group.options), []);

    const selectedIndustry = industryOptions.find(industry => industry.value === formData.industry);

    const selectedJobLevel = JOB_LEVELS.find(level => level.value === formData.job_level);

    // ---------------------------------------------------------
    // Render
    // ---------------------------------------------------------
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-5">
                <div className="p-2.5 bg-primary-100 dark:bg-primary-500/20 rounded-xl text-primary-600 dark:text-primary-400">
                    <Briefcase className="w-5 h-5" />
                </div>

                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                        Cơ bản & Phân loại
                    </h2>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Thông tin định danh chính của vị trí tuyển dụng.
                    </p>
                </div>
            </div>

            {/* Job title */}
            <section>
                <div className="mb-2.5">
                    <label htmlFor="job-title" className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                        Tên vị trí tuyển dụng <span className="text-rose-500">*</span>
                    </label>
                </div>

                <input id="job-title" type="text" required value={formData.title} onChange={e => updateField('title', e.target.value)} className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 dark:text-white shadow-sm transition-all" placeholder="VD: Senior ReactJS Developer" />

                <p className="text-[11px] text-slate-400 mt-2">
                    Ví dụ: Senior Frontend Developer, Sales Manager, HR Executive...
                </p>
            </section>

            {/* Classification */}
            <section>
                <div className="mb-4">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                        Phân loại vị trí
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Giúp hệ thống và AI xác định đúng ngữ cảnh của vị trí tuyển dụng.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Industry */}
                    <div className="relative z-20">
                        <label htmlFor="job-industry" className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">
                            Ngành nghề
                        </label>

                        <Select inputId="job-industry" isClearable options={GROUPED_INDUSTRIES} styles={customSelectStyles} placeholder="Chọn ngành nghề..." value={selectedIndustry} onChange={(selected: any) => updateField('industry', selected?.value || '')} noOptionsMessage={() => 'Không tìm thấy ngành nghề'} />
                    </div>

                    {/* Job level */}
                    <div className="relative z-20">
                        <label htmlFor="job-level" className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">
                            Cấp bậc
                        </label>

                        <Select inputId="job-level" isClearable options={JOB_LEVELS} styles={customSelectStyles} placeholder="Chọn cấp bậc..." value={selectedJobLevel} onChange={(selected: any) => updateField('job_level', selected?.value || '')} noOptionsMessage={() => 'Không tìm thấy cấp bậc'} />
                    </div>
                </div>
            </section>

            {/* Employment information */}
            <section>
                <div className="mb-4">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                        Thông tin tuyển dụng
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Thiết lập loại công việc, hình thức làm việc và nhu cầu tuyển dụng.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Employment type */}
                    <div>
                        <label htmlFor="employment-type" className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">
                            Loại công việc
                        </label>

                        <select id="employment-type" className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 cursor-pointer" value={formData.employment_type} onChange={e => updateField('employment_type', e.target.value as JobFormData['employment_type'])}>
                            {EMPLOYMENT_TYPES.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Work mode */}
                    <div>
                        <label htmlFor="work-mode" className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">
                            Hình thức làm việc
                        </label>

                        <select id="work-mode" className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 cursor-pointer" value={formData.work_mode} onChange={e => updateField('work_mode', e.target.value as JobFormData['work_mode'])}>
                            {WORK_MODES.map(workMode => (
                                <option key={workMode.value} value={workMode.value}>
                                    {workMode.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Headcount */}
                    <div>
                        <label htmlFor="headcount" className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">
                            Số lượng cần tuyển
                        </label>

                        <div className="relative">
                            <input id="headcount" type="number" min={1} value={formData.headcount} onChange={e => { const value = Number(e.target.value); updateField('headcount', value > 0 ? value : 1); }} className="w-full p-3.5 pr-16 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10" />

                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                                người
                            </span>
                        </div>
                    </div>

                    {/* Deadline */}
                    <div>
                        <label htmlFor="job-deadline" className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">
                            Hạn nộp hồ sơ <span className="text-rose-500">*</span>
                        </label>

                        <input id="job-deadline" type="date" required min={today} value={formData.deadline} onChange={e => updateField('deadline', e.target.value)} className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10" />
                    </div>
                </div>
            </section>

            {/* HOT Job */}
            <section className={`rounded-2xl border p-4 sm:p-5 transition-all ${formData.is_hot ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30' : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className={`shrink-0 p-2 rounded-xl ${formData.is_hot ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                            <Flame className="w-5 h-5" />
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                                    Đẩy tin HOT
                                </h3>

                                {!canSetHotJob && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[9px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                        <LockKeyhole className="w-2.5 h-2.5" />
                                        {unlockHotPlanName.replace('HR ', '')}
                                    </span>
                                )}
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Tăng x3 lượt tiếp cận ứng viên cho chiến dịch này.
                            </p>

                            {!canSetHotJob && (
                                <p className="text-[11px] text-slate-400 mt-1.5">
                                    Tính năng này dành cho gói <span className="font-bold text-slate-500 dark:text-slate-300">{unlockHotPlanName.replace('HR ', '')}</span>.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Toggle */}
                    <button type="button" role="switch" aria-checked={Boolean(formData.is_hot)} aria-label="Đẩy tin HOT" disabled={!canSetHotJob} onClick={() => updateField('is_hot', !Boolean(formData.is_hot))} className={`relative shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${formData.is_hot ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-700'} ${!canSetHotJob ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${formData.is_hot ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </section>

            {/* AI hint */}
            <div className="flex items-start gap-2.5 px-1">
                <div className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
                    <span className="text-[10px] text-primary-600 dark:text-primary-400">
                        ✦
                    </span>
                </div>

                <p className="text-[11px] leading-relaxed text-slate-400">
                    <span className="font-semibold text-slate-500 dark:text-slate-300">
                        Gợi ý:
                    </span>{' '}
                    Các thông tin về ngành nghề, cấp bậc và hình thức làm việc sẽ giúp AI hiểu rõ hơn ngữ cảnh của vị trí khi đánh giá ứng viên.
                </p>
            </div>
        </div>
    );
}