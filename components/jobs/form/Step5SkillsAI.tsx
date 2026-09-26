'use client';

import { JobSkillForm } from '@/types';
import { BrainCircuit, Trash2, CheckCircle2, Plus, X, Check } from 'lucide-react';
import AsyncSelect from 'react-select/async';
import { systemService } from '@/features/system/system.service';
import { useRef, useEffect, useState } from 'react';
import ProFeatureLock from '@/components/shared/ProFeatureLock';
import { useSubscription } from '@/hooks/useSubscription';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { getTierBadgeConfig } from '@/utils/tier-colors';

interface Step5Props {
    formData: any;
    setFormData: (data: any) => void;
    aiWeights: { skills: number; nlp: number; experience: number; education: number };
    setAiWeights: (val: any) => void;
    requiredSkills: JobSkillForm[];
    setRequiredSkills: (val: any[] | ((prev: any[]) => any[])) => void;
    preferredSkills: JobSkillForm[];
    setPreferredSkills: (val: any[] | ((prev: any[]) => any[])) => void;
}

type SkillType = 'required' | 'preferred';

export default function Step5SkillsAI({ formData, setFormData, aiWeights, setAiWeights, requiredSkills, setRequiredSkills, preferredSkills, setPreferredSkills }: Step5Props) {
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    const totalWeight = aiWeights.skills + aiWeights.nlp + aiWeights.experience + aiWeights.education;
    const isFirstRender = useRef(true);
    const [dbWeights, setDbWeights] = useState<any>(null);

    useEffect(() => {
        systemService.getIndustryWeights().then(res => {
            if (res?.data) setDbWeights(res.data);
        }).catch(() => { });
    }, []);

    useEffect(() => {
        if (!dbWeights) return;

        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const industryKey = formData.industry?.toLowerCase() || 'default';
        const rawWeights = dbWeights[industryKey] || dbWeights.default || [0.4, 0.3, 0.2, 0.1];

        setAiWeights({
            skills: Math.round(rawWeights[0] * 100),
            nlp: Math.round(rawWeights[1] * 100),
            experience: Math.round(rawWeights[2] * 100),
            education: Math.round(rawWeights[3] * 100)
        });
    }, [formData.industry, dbWeights, setAiWeights]);

    const { data: myPlanRes } = useSubscription();
    const { data: plansRes } = useSubscriptionPlans('hr');

    const currentPlanCode = myPlanRes?.data?.current_plan_code || 'hr_free';
    const currentPlan = plansRes?.data?.find((p: any) => p.plan_code === currentPlanCode);
    const canCustomizeAI = currentPlan?.features?.can_customize_ai_weights || false;

    const unlockPlan = plansRes?.data?.find((p: any) => p.features?.can_customize_ai_weights);
    const unlockPlanName = unlockPlan?.name || 'Enterprise';
    const unlockTierConfig = getTierBadgeConfig(unlockPlan?.tier_level || 3);
    const userPlanColor = getTierBadgeConfig(currentPlan?.tier_level || 0);

    const updateSkills = (type: SkillType, updater: (prev: JobSkillForm[]) => JobSkillForm[]) => {
        if (type === 'required') {
            setRequiredSkills(updater);
        } else {
            setPreferredSkills(updater);
        }
    };

    const handleSkillChange = (type: SkillType, index: number, field: keyof JobSkillForm, value: any) => {
        updateSkills(type, prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleSkillSelect = (type: SkillType, index: number, selected: any) => {
        if (!selected) return;

        updateSkills(type, prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], name: selected.label, skill_id: selected.value };
            return updated;
        });
    };

    const addSkillRow = (type: SkillType) => {
        const newRow: JobSkillForm = {
            skill_id: null,
            name: '',
            weight: type === 'required' ? 0.5 : 0.2,
            min_years: 0,
            is_knockout: type === 'required'
        };

        updateSkills(type, prev => [...prev, newRow]);
    };

    const removeSkillRow = (type: SkillType, index: number) => {
        updateSkills(type, prev => {
            if (type === 'required' && prev.length === 1) return prev;
            return prev.filter((_, i) => i !== index);
        });
    };

    const loadSkillOptions = async (inputValue: string) => {
        if (!inputValue.trim()) return [];

        try {
            const skills = await systemService.searchSkills(inputValue, formData.industry);

            return skills.map((skill: any) => ({
                value: skill.id,
                label: skill.canonical_name,
                skillObj: skill
            }));
        } catch {
            return [];
        }
    };

    const asyncSelectStyles = {
        control: (base: any) => ({ ...base, background: 'transparent', borderColor: 'transparent', boxShadow: 'none', minHeight: '40px', '&:hover': { borderColor: 'transparent' } }),
        menu: (base: any) => ({ ...base, zIndex: 9999, backgroundColor: isDark ? '#1e293b' : '#ffffff', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}` }),
        option: (base: any, state: any) => ({ ...base, cursor: 'pointer', fontSize: '14px', backgroundColor: state.isFocused ? (isDark ? '#334155' : '#eff6ff') : 'transparent', color: isDark ? '#f8fafc' : '#1e293b' }),
        singleValue: (base: any) => ({ ...base, color: isDark ? '#f8fafc' : '#1e293b', fontSize: '14px', fontWeight: 600 }),
        input: (base: any) => ({ ...base, color: isDark ? '#f8fafc' : '#1e293b', margin: 0, padding: 0 }),
        placeholder: (base: any) => ({ ...base, fontSize: '14px' })
    };

    const renderSkillRow = (skill: JobSkillForm, index: number, type: SkillType) => {
        const isRequired = type === 'required';

        return (
            <div key={`${type}-${index}`} className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 dark:focus-within:ring-primary-900 transition-all">
                <div className="flex-1 min-w-0">
                    <AsyncSelect
                        cacheOptions
                        defaultOptions={false}
                        loadOptions={loadSkillOptions}
                        styles={asyncSelectStyles}
                        placeholder="Gõ để tìm kiếm kỹ năng..."
                        noOptionsMessage={({ inputValue }) => inputValue ? 'Không tìm thấy dữ liệu' : 'Gõ tên kỹ năng để bắt đầu...'}
                        value={skill.name ? { label: skill.name, value: skill.skill_id } : null}
                        onChange={(selected: any) => handleSkillSelect(type, index, selected)}
                    />
                </div>

                <div className="grid grid-cols-3 lg:flex gap-2">
                    <div className="lg:w-24">
                        <label className="lg:hidden block text-[10px] font-bold text-slate-400 mb-1 text-center">Trọng số</label>
                        <input type="number" min="0.1" max="1" step="0.1" className="w-full lg:w-24 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none text-sm text-center dark:text-white font-bold" value={skill.weight} onChange={e => handleSkillChange(type, index, 'weight', Number(e.target.value))} title="Từ 0.1 đến 1.0" />
                    </div>

                    <div className="lg:w-24">
                        <label className="lg:hidden block text-[10px] font-bold text-slate-400 mb-1 text-center">Năm KN</label>
                        <input type="number" min="0" step="0.5" className="w-full lg:w-24 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none text-sm text-center dark:text-white font-bold" value={skill.min_years} onChange={e => handleSkillChange(type, index, 'min_years', Number(e.target.value))} />
                    </div>

                    <div>
                        <label className="lg:hidden block text-[10px] font-bold text-slate-400 mb-1 text-center">Knockout</label>
                        <button type="button" onClick={() => handleSkillChange(type, index, 'is_knockout', !skill.is_knockout)} className={`w-full lg:w-10 h-9 lg:h-9 flex justify-center items-center rounded-lg border transition-all ${skill.is_knockout ? 'bg-rose-500 border-rose-500 text-white shadow-sm' : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-rose-300 hover:text-rose-400'}`} title={isRequired ? 'Tiêu chí tử thần (Knockout)' : 'Đánh dấu là tiêu chí tử thần'}>
                            {skill.is_knockout ? <Check className="w-4 h-4" /> : <span className="text-xs">K</span>}
                        </button>
                    </div>

                    <button type="button" onClick={() => removeSkillRow(type, index)} disabled={isRequired && requiredSkills.length === 1} className="w-9 h-9 self-end lg:self-auto flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 disabled:opacity-30 disabled:cursor-not-allowed" title="Xóa dòng">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
                <div className="flex items-start gap-3 border-b border-slate-100 dark:border-slate-700 pb-5">
                    <div className="p-2.5 bg-primary-100 dark:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-400">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Kỹ năng chuyên môn</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Xác định kỹ năng cốt lõi để hệ thống tìm kiếm và đánh giá CV chính xác hơn.</p>
                    </div>
                </div>

                <div className="mt-5 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 space-y-6">
                    <section>
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white">Kỹ năng bắt buộc <span className="text-rose-500">*</span></h3>
                                <p className="text-xs text-slate-400 mt-1">Những kỹ năng ứng viên cần có để đạt yêu cầu.</p>
                            </div>
                            <button type="button" onClick={() => addSkillRow('required')} className="inline-flex items-center gap-1.5 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-3 py-2 rounded-lg font-bold hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors">
                                <Plus className="w-3.5 h-3.5" />
                                Thêm
                            </button>
                        </div>

                        <div className="hidden lg:grid grid-cols-[minmax(0,1fr)_96px_96px_40px_36px] gap-3 px-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <span>Kỹ năng</span>
                            <span className="text-center">Trọng số</span>
                            <span className="text-center">Năm KN</span>
                            <span className="text-center">KO</span>
                            <span />
                        </div>

                        <div className="space-y-3">
                            {requiredSkills.map((skill, index) => renderSkillRow(skill, index, 'required'))}

                            {requiredSkills.length === 0 && (
                                <div className="py-8 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-sm text-slate-400">
                                    Chưa có kỹ năng bắt buộc. Hãy thêm ít nhất một kỹ năng.
                                </div>
                            )}
                        </div>
                    </section>

                    <div className="border-t border-slate-200 dark:border-slate-700" />

                    <section>
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white">Kỹ năng ưu tiên <span className="text-xs font-normal text-slate-400">(Nice-to-have)</span></h3>
                                <p className="text-xs text-slate-400 mt-1">Có thêm sẽ giúp ứng viên được đánh giá cao hơn.</p>
                            </div>
                            <button type="button" onClick={() => addSkillRow('preferred')} className="inline-flex items-center gap-1.5 text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                                <Plus className="w-3.5 h-3.5" />
                                Thêm
                            </button>
                        </div>

                        <div className="hidden lg:grid grid-cols-[minmax(0,1fr)_96px_96px_40px_36px] gap-3 px-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <span>Kỹ năng</span>
                            <span className="text-center">Trọng số</span>
                            <span className="text-center">Năm KN</span>
                            <span className="text-center">KO</span>
                            <span />
                        </div>

                        <div className="space-y-3">
                            {preferredSkills.map((skill, index) => renderSkillRow(skill, index, 'preferred'))}

                            {preferredSkills.length === 0 && (
                                <div className="py-8 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-sm text-slate-400">
                                    Chưa có kỹ năng ưu tiên.
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            <div>
                <div className="flex items-start gap-3 border-b border-slate-100 dark:border-slate-700 pb-5">
                    <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                        <BrainCircuit className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Trọng số thuật toán AI</h2>

                            {canCustomizeAI ? (
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm border ${userPlanColor.bg} ${userPlanColor.text} ${userPlanColor.border}`}>
                                    {currentPlan?.name || 'Đã mở khóa'}
                                </span>
                            ) : (
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm border ${unlockTierConfig.bg} ${unlockTierConfig.text} ${unlockTierConfig.border}`}>
                                    {unlockPlanName.replace('HR ', '')}
                                </span>
                            )}
                        </div>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Hệ thống tự động phân bổ trọng số theo ngành <strong className="text-primary-600 dark:text-primary-400">{formData.industry || 'Mặc định'}</strong>.</p>
                    </div>
                </div>

                <div className="mt-5 bg-slate-50 dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden p-5 sm:p-8 min-h-96">
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 text-slate-200/50 dark:text-slate-700/30 pointer-events-none">
                        <BrainCircuit className="w-64 h-64" />
                    </div>

                    {!canCustomizeAI && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-8 bg-white/60 dark:bg-slate-900/80 backdrop-blur-md">
                            <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 sm:p-4">
                                <ProFeatureLock
                                    title="Mở khóa tinh chỉnh AI"
                                    description="Tự do điều chỉnh tỷ trọng Kỹ năng, Ngữ nghĩa, Kinh nghiệm và Học vấn theo nhu cầu tuyển dụng của công ty."
                                    requiredTierName={unlockPlanName.replace('HR ', '')}
                                    requiredTierLevel={unlockPlan?.tier_level || 3}
                                />
                            </div>
                        </div>
                    )}

                    <div className={`relative z-10 w-full ${!canCustomizeAI ? 'filter blur-[5px] pointer-events-none select-none opacity-40' : ''}`}>
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <div>
                                <h3 className="text-lg font-black text-slate-800 dark:text-white">Tổng phân bổ</h3>
                                <p className="text-xs text-slate-400 mt-1">Tổng trọng số nên bằng 100%.</p>
                            </div>

                            <span className={`px-3 py-1.5 rounded-xl text-sm font-black shadow-sm ${totalWeight === 100 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                {totalWeight}% / 100%
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                            <WeightCard label="Kỹ năng" value={aiWeights.skills} color="primary" disabled={!canCustomizeAI} onChange={value => setAiWeights({ ...aiWeights, skills: value })} />
                            <WeightCard label="Ngữ nghĩa" value={aiWeights.nlp} color="indigo" disabled={!canCustomizeAI} onChange={value => setAiWeights({ ...aiWeights, nlp: value })} />
                            <WeightCard label="Kinh nghiệm" value={aiWeights.experience} color="emerald" disabled={!canCustomizeAI} onChange={value => setAiWeights({ ...aiWeights, experience: value })} />
                            <WeightCard label="Học vấn" value={aiWeights.education} color="amber" disabled={!canCustomizeAI} onChange={value => setAiWeights({ ...aiWeights, education: value })} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface WeightCardProps {
    label: string;
    value: number;
    color: 'primary' | 'indigo' | 'emerald' | 'amber';
    disabled: boolean;
    onChange: (value: number) => void;
}

function WeightCard({ label, value, color, disabled, onChange }: WeightCardProps) {
    const colors = {
        primary: { text: 'text-primary-600 dark:text-primary-400', hover: 'hover:border-primary-300 dark:hover:border-primary-700', accent: 'accent-primary-600' },
        indigo: { text: 'text-indigo-600 dark:text-indigo-400', hover: 'hover:border-indigo-300 dark:hover:border-indigo-700', accent: 'accent-indigo-600' },
        emerald: { text: 'text-emerald-600 dark:text-emerald-400', hover: 'hover:border-emerald-300 dark:hover:border-emerald-700', accent: 'accent-emerald-600' },
        amber: { text: 'text-amber-500 dark:text-amber-400', hover: 'hover:border-amber-300 dark:hover:border-amber-700', accent: 'accent-amber-500' }
    };

    const config = colors[color];

    return (
        <div className={`bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors ${config.hover}`}>
            <p className={`text-xs font-bold text-slate-500 uppercase mb-3 tracking-wider text-center ${config.text}`}>{label}</p>

            <input
                disabled={disabled}
                type="number"
                min="0"
                max="100"
                value={value}
                onChange={e => onChange(Math.min(100, Math.max(0, Number(e.target.value))))}
                className={`w-full bg-transparent text-center text-4xl font-black outline-none mb-3 ${config.text}`}
            />

            <div className="flex items-center gap-2">
                <input
                    disabled={disabled}
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={e => onChange(Number(e.target.value))}
                    className={`w-full ${config.accent} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                />
                <span className="text-xs font-bold text-slate-400 w-8 text-right">%</span>
            </div>
        </div>
    );
}