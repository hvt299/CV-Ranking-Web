'use client';

import { useState } from 'react';
import { GraduationCap, X } from 'lucide-react';
import { EDUCATION_LEVELS, GENDER_OPTIONS } from '@/constants/job.constants';

interface Step4Props {
    formData: any;
    setFormData: (data: any) => void;
}

export default function Step4Criteria({ formData, setFormData }: Step4Props) {
    const [certInput, setCertInput] = useState('');
    const [majorInput, setMajorInput] = useState('');
    const [languageInput, setLanguageInput] = useState('');

    const handleArrayInput = (e: React.KeyboardEvent<HTMLInputElement>, inputVal: string, setInput: Function, fieldArray: string[], setFieldArray: Function) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newVal = inputVal.trim();
            if (newVal && !fieldArray.includes(newVal)) {
                setFieldArray([...fieldArray, newVal]);
                setInput('');
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                    <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Tiêu chí Sàng lọc cứng</h2>
                    <p className="text-xs text-slate-500 mt-1">Các yêu cầu cơ bản bắt buộc ứng viên phải đáp ứng để vượt qua vòng lọc hồ sơ.</p>
                </div>
            </div>

            <div className="bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Số năm KN tối thiểu</label>
                        <input type="number" step="0.5" min="0" className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm focus:border-primary-500 transition-colors" value={formData.min_yoe} onChange={e => setFormData({ ...formData, min_yoe: Number(e.target.value) })} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Giới tính</label>
                        <select className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm focus:border-primary-500 cursor-pointer transition-colors" value={formData.gender_requirement} onChange={e => setFormData({ ...formData, gender_requirement: e.target.value })}>
                            {GENDER_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Học vấn & Chuyên ngành</label>
                    <div className="space-y-4">
                        <select className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm focus:border-primary-500 cursor-pointer transition-colors md:w-1/2" value={formData.education.min_level} onChange={e => setFormData({ ...formData, education: { ...formData.education, min_level: e.target.value } })}>
                            {EDUCATION_LEVELS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>

                        <div className="min-h-13 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-wrap gap-2 items-center shadow-sm">
                            {formData.education.preferred_majors.map((major: string, idx: number) => (
                                <span key={idx} className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-primary-100 dark:border-primary-800/50">
                                    {major} <button type="button" onClick={() => setFormData({ ...formData, education: { ...formData.education, preferred_majors: formData.education.preferred_majors.filter((_: string, i: number) => i !== idx) } })}><X className="w-3.5 h-3.5 hover:text-rose-500 transition-colors" /></button>
                                </span>
                            ))}
                            <input type="text" className="flex-1 bg-transparent dark:text-white outline-none text-sm p-1 min-w-50" placeholder="Nhập chuyên ngành ưu tiên (Nhấn Enter)" value={majorInput} onChange={e => setMajorInput(e.target.value)} onKeyDown={e => handleArrayInput(e, majorInput, setMajorInput, formData.education.preferred_majors, (arr: string[]) => setFormData({ ...formData, education: { ...formData.education, preferred_majors: arr } }))} />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Ngoại ngữ</label>
                    <div className="min-h-13 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-wrap gap-2 items-center shadow-sm">
                        {formData.languages.map((lang: string, idx: number) => (
                            <span key={idx} className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-primary-100 dark:border-primary-800/50">
                                {lang} <button type="button" onClick={() => setFormData({ ...formData, languages: formData.languages.filter((_: string, i: number) => i !== idx) })}><X className="w-3.5 h-3.5 hover:text-rose-500 transition-colors" /></button>
                            </span>
                        ))}
                        <input type="text" className="flex-1 bg-transparent dark:text-white outline-none text-sm p-1 min-w-50" placeholder="VD: Tiếng Anh IELTS 6.5 (Nhấn Enter)" value={languageInput} onChange={e => setLanguageInput(e.target.value)} onKeyDown={e => handleArrayInput(e, languageInput, setLanguageInput, formData.languages, (arr: string[]) => setFormData({ ...formData, languages: arr }))} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Chứng chỉ chuyên môn</label>
                    <div className="min-h-13 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-wrap gap-2 items-center shadow-sm">
                        {formData.required_certifications?.map((cert: string, idx: number) => (
                            <span key={idx} className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-primary-100 dark:border-primary-800/50">
                                {cert} <button type="button" onClick={() => setFormData({ ...formData, required_certifications: formData.required_certifications.filter((_: string, i: number) => i !== idx) })}><X className="w-3.5 h-3.5 hover:text-rose-500 transition-colors" /></button>
                            </span>
                        ))}
                        <input type="text" className="flex-1 bg-transparent dark:text-white outline-none text-sm p-1 min-w-50" placeholder="VD: PMP, AWS Certified (Nhấn Enter)" value={certInput} onChange={e => setCertInput(e.target.value)} onKeyDown={e => handleArrayInput(e, certInput, setCertInput, formData.required_certifications || [], (arr: string[]) => setFormData({ ...formData, required_certifications: arr }))} />
                    </div>
                </div>
            </div>
        </div>
    );
}