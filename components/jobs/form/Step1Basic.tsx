'use client';

import Select from 'react-select';
import { Briefcase, Flame } from 'lucide-react';
import { GROUPED_INDUSTRIES, JOB_LEVELS, EMPLOYMENT_TYPES, WORK_MODES } from '@/constants/job.constants';
import { useSubscription } from '@/hooks/useSubscription';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import ProFeatureLock from '@/components/shared/ProFeatureLock';
import { useTheme } from 'next-themes';

interface Step1Props {
    formData: any;
    setFormData: (data: any) => void;
}

export default function Step1Basic({ formData, setFormData }: Step1Props) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Kéo dữ liệu Subscription để check quyền gắn nhãn HOT
    const { data: myPlanRes } = useSubscription();
    const { data: plansRes } = useSubscriptionPlans('hr');
    const currentPlanCode = myPlanRes?.data?.current_plan_code || 'hr_free';
    const currentPlan = plansRes?.data?.find((p: any) => p.plan_code === currentPlanCode);
    const canSetHotJob = currentPlan?.features?.can_set_hot_job || false;
    
    // Tìm gói cước mở khóa tính năng HOT
    const unlockHotPlan = plansRes?.data?.find((p: any) => p.features?.can_set_hot_job);
    const unlockHotPlanName = unlockHotPlan?.name || 'Enterprise';

    const customSelectStyles = {
        control: (base: any, state: any) => ({
            ...base, background: 'transparent', borderColor: state.isFocused ? '#3b82f6' : (isDark ? '#334155' : '#e2e8f0'),
            borderRadius: '0.75rem', padding: '4px', boxShadow: 'none', fontSize: '0.875rem'
        }),
        menu: (base: any) => ({
            ...base, zIndex: 9999, fontSize: '0.875rem', backgroundColor: isDark ? '#1e293b' : '#ffffff',
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`
        }),
        option: (base: any, state: any) => ({
            ...base, cursor: 'pointer', backgroundColor: state.isFocused ? (isDark ? '#334155' : '#f1f5f9') : 'transparent',
            color: isDark ? '#f8fafc' : '#1e293b'
        }),
        singleValue: (base: any) => ({ ...base, color: isDark ? '#f8fafc' : '#1e293b' })
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div className="p-2 bg-primary-100 dark:bg-primary-500/20 rounded-lg text-primary-600 dark:text-primary-400">
                    <Briefcase className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Cơ bản & Phân loại</h2>
                    <p className="text-xs text-slate-500 mt-1">Các thông tin định danh chính của chiến dịch tuyển dụng.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Tên vị trí tuyển dụng <span className="text-rose-500">*</span></label>
                        <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 dark:text-white shadow-sm transition-colors" placeholder="VD: Senior ReactJS Developer" />
                    </div>

                    {/* Block Gắn nhãn HOT */}
                    <div className="shrink-0 w-full sm:w-auto relative group">
                        <label className={`flex items-center gap-3 h-12.5 px-4 rounded-xl border transition-all ${formData.is_hot ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'} ${!canSetHotJob ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                            <div className={`p-1.5 rounded-lg ${formData.is_hot ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                                <Flame className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-800 dark:text-white leading-tight">Gắn nhãn HOT</span>
                                <span className="text-[10px] text-slate-500 font-medium mt-0.5">Tăng x3 lượt tiếp cận</span>
                            </div>

                            {/* Nút Toggle */}
                            <div className="ml-2 relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none" style={{ backgroundColor: formData.is_hot ? '#f97316' : '#cbd5e1' }}>
                                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${formData.is_hot ? 'translate-x-5' : 'translate-x-1'}`} />
                                <input
                                    type="checkbox"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                    checked={formData.is_hot || false}
                                    disabled={!canSetHotJob}
                                    onChange={e => setFormData({ ...formData, is_hot: e.target.checked })}
                                />
                            </div>
                        </label>

                        {/* Tooltip báo lỗi nếu không có quyền */}
                        {!canSetHotJob && (
                            <div className="absolute -bottom-10 right-0 w-max px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                Tính năng chỉ dành cho gói {unlockHotPlanName.replace('HR ', '')}
                            </div>
                        )}
                    </div>
                </div>

                <div className="dark:text-slate-900 relative z-10">
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Ngành nghề (Industry)</label>
                    <Select
                        options={GROUPED_INDUSTRIES}
                        styles={customSelectStyles}
                        placeholder="Chọn ngành nghề..."
                        value={GROUPED_INDUSTRIES.flatMap(g => g.options).find(i => i.value === formData.industry)}
                        onChange={(selected: any) => setFormData({ ...formData, industry: selected?.value || '' })}
                    />
                </div>

                <div className="dark:text-slate-900 relative z-10">
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Cấp bậc (Level)</label>
                    <Select
                        options={JOB_LEVELS}
                        styles={customSelectStyles}
                        value={JOB_LEVELS.find(l => l.value === formData.job_level)}
                        onChange={(selected: any) => setFormData({ ...formData, job_level: selected?.value || '' })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Loại hình</label>
                    <select className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm transition-colors focus:border-primary-500 cursor-pointer" value={formData.employment_type} onChange={e => setFormData({ ...formData, employment_type: e.target.value })}>
                        {EMPLOYMENT_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Hình thức</label>
                    <select className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm transition-colors focus:border-primary-500 cursor-pointer" value={formData.work_mode} onChange={e => setFormData({ ...formData, work_mode: e.target.value })}>
                        {WORK_MODES.map(mode => <option key={mode.value} value={mode.value}>{mode.label}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Số lượng tuyển</label>
                    <input type="number" min="1" className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm transition-colors focus:border-primary-500" value={formData.headcount} onChange={e => setFormData({ ...formData, headcount: Number(e.target.value) })} />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Hạn nộp hồ sơ <span className="text-rose-500">*</span></label>
                    <input type="date" required className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm transition-colors focus:border-primary-500" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
                </div>
            </div>
        </div>
    );
}