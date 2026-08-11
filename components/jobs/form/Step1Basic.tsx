'use client';

import Select from 'react-select';
import { Briefcase } from 'lucide-react';
import { GROUPED_INDUSTRIES, JOB_LEVELS, EMPLOYMENT_TYPES, WORK_MODES } from '@/constants/job.constants';
import { useTheme } from 'next-themes';

interface Step1Props {
    formData: any;
    setFormData: (data: any) => void;
}

export default function Step1Basic({ formData, setFormData }: Step1Props) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

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
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Tên vị trí tuyển dụng <span className="text-rose-500">*</span></label>
                    <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 dark:text-white shadow-sm transition-colors" placeholder="VD: Senior ReactJS Developer" />
                </div>

                <div className="dark:text-slate-900 relative z-50">
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Ngành nghề (Industry)</label>
                    <Select
                        options={GROUPED_INDUSTRIES}
                        styles={customSelectStyles}
                        placeholder="Chọn ngành nghề..."
                        value={GROUPED_INDUSTRIES.flatMap(g => g.options).find(i => i.value === formData.industry)}
                        onChange={(selected: any) => setFormData({ ...formData, industry: selected?.value || '' })}
                    />
                </div>

                <div className="dark:text-slate-900 relative z-40">
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