'use client';

import { BrainCircuit, CheckCircle2, Trash2 } from 'lucide-react';
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
    aiWeights: { skills: number, nlp: number, experience: number, education: number };
    setAiWeights: (val: any) => void;
    requiredSkills: { skill_id: string | null; name: string; weight: number; min_years: number }[];
    setRequiredSkills: (val: any[] | ((prev: any[]) => any[])) => void;
    preferredSkills: { skill_id: string | null; name: string; weight: number; min_years: number }[];
    setPreferredSkills: (val: any[] | ((prev: any[]) => any[])) => void;
}

export default function Step5SkillsAI({
    formData, setFormData, aiWeights, setAiWeights,
    requiredSkills, setRequiredSkills, preferredSkills, setPreferredSkills
}: Step5Props) {
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    const totalWeight = aiWeights.skills + aiWeights.nlp + aiWeights.experience + aiWeights.education;

    const isFirstRender = useRef(true);
    const [dbWeights, setDbWeights] = useState<any>(null);

    // Fetch hệ số chuẩn từ Database
    useEffect(() => {
        systemService.getIndustryWeights().then(res => {
            if (res?.data) setDbWeights(res.data);
        }).catch(() => { });
    }, []);

    // Tự động đồng bộ Trọng số AI theo ngành nghề khi Ngành thay đổi
    useEffect(() => {
        if (!dbWeights) return;
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const industryKey = formData.industry?.toLowerCase() || "default";

        // Chuyển đổi dữ liệu (vd: 0.50 -> 50)
        const rawWeights = dbWeights[industryKey] || dbWeights["default"] || [0.4, 0.3, 0.2, 0.1, 0.5];
        setAiWeights({
            skills: Math.round(rawWeights[0] * 100),
            nlp: Math.round(rawWeights[1] * 100),
            experience: Math.round(rawWeights[2] * 100),
            education: Math.round(rawWeights[3] * 100)
        });
    }, [formData.industry, dbWeights, setAiWeights]);

    // Kéo dữ liệu Subscription để check quyền tinh chỉnh AI
    const { data: myPlanRes } = useSubscription();
    const { data: plansRes } = useSubscriptionPlans('hr');
    const currentPlanCode = myPlanRes?.data?.current_plan_code || 'hr_free';
    const currentPlan = plansRes?.data?.find((p: any) => p.plan_code === currentPlanCode);
    const canCustomizeAI = currentPlan?.features?.can_customize_ai_weights || false;

    // Tìm gói cước yêu cầu để mở khóa và lấy config màu tự động
    const unlockPlan = plansRes?.data?.find((p: any) => p.features?.can_customize_ai_weights);
    const unlockPlanName = unlockPlan?.name || 'Enterprise';
    const unlockTierConfig = getTierBadgeConfig(unlockPlan?.tier_level || 3);
    const userPlanColor = getTierBadgeConfig(currentPlan?.tier_level || 0);

    const handleSkillChange = (type: 'required' | 'preferred', index: number, field: string, value: any) => {
        const updater = (prev: any[]) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        };
        type === 'required' ? setRequiredSkills(updater as any) : setPreferredSkills(updater as any);
    };

    const handleSkillSelect = (type: 'required' | 'preferred', index: number, selected: any) => {
        if (!selected) return;
        const updater = (prev: any[]) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], name: selected.label, skill_id: selected.value };
            return updated;
        };
        type === 'required' ? setRequiredSkills(updater as any) : setPreferredSkills(updater as any);
    };

    const addSkillRow = (type: 'required' | 'preferred') => {
        const newRow = { skill_id: null, name: '', weight: type === 'required' ? 0.5 : 0.2, min_years: 0 };
        type === 'required' ? setRequiredSkills([...requiredSkills, newRow]) : setPreferredSkills([...preferredSkills, newRow]);
    };

    const removeSkillRow = (type: 'required' | 'preferred', index: number) => {
        if (type === 'required') {
            if (requiredSkills.length === 1) return;
            setRequiredSkills(requiredSkills.filter((_, i) => i !== index));
        } else {
            setPreferredSkills(preferredSkills.filter((_, i) => i !== index));
        }
    };

    const loadSkillOptions = async (inputValue: string) => {
        if (!inputValue) return [];
        try {
            const skills = await systemService.searchSkills(inputValue, formData.industry);
            return skills.map((s: any) => ({
                value: s.id,
                label: s.canonical_name,
                skillObj: s
            }));
        } catch (error) {
            return [];
        }
    };

    const asyncSelectStyles = {
        control: (base: any, state: any) => ({
            ...base, background: 'transparent', borderColor: 'transparent', boxShadow: 'none', minHeight: '40px',
            '&:hover': { borderColor: 'transparent' }
        }),
        menu: (base: any) => ({
            ...base, zIndex: 9999, backgroundColor: isDark ? '#1e293b' : '#ffffff', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`
        }),
        option: (base: any, state: any) => ({
            ...base, cursor: 'pointer', fontSize: '14px',
            backgroundColor: state.isFocused ? (isDark ? '#334155' : '#eff6ff') : 'transparent',
            color: isDark ? '#f8fafc' : '#1e293b'
        }),
        singleValue: (base: any) => ({ ...base, color: isDark ? '#f8fafc' : '#1e293b', fontSize: '14px', fontWeight: 600 }),
        input: (base: any) => ({ ...base, color: isDark ? '#f8fafc' : '#1e293b', margin: 0, padding: 0 }),
        placeholder: (base: any) => ({ ...base, fontSize: '14px' })
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4">

            {/* Block 1: Khai báo Kỹ năng */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Kỹ năng Chuyên môn</h2>
                        <p className="text-xs text-slate-500 mt-1">Từ khóa cốt lõi dùng để truy vấn cơ sở dữ liệu Vector CV.</p>
                    </div>
                </div>

                <div className="bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-8">
                    {/* Bắt buộc */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                Kỹ năng Bắt buộc (Must-have) <span className="text-rose-500">*</span>
                            </h3>
                            <button type="button" onClick={() => addSkillRow('required')} className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-3 py-1.5 rounded-lg font-bold hover:bg-primary-200 transition-colors shadow-sm">+ Thêm dòng</button>
                        </div>
                        <div className="space-y-3">
                            <div className="flex gap-4 px-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                <div className="flex-1">Tên kỹ năng (Tra cứu từ hệ thống)</div>
                                <div className="w-24 text-center">Trọng số</div>
                                <div className="w-24 text-center">Năm KN</div>
                                <div className="w-10"></div>
                            </div>
                            {requiredSkills.map((skill, index) => (
                                <div key={index} className="flex gap-4 items-center bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 dark:focus-within:ring-primary-900 transition-all">
                                    <div className="flex-1">
                                        <AsyncSelect
                                            cacheOptions defaultOptions={false} loadOptions={loadSkillOptions} styles={asyncSelectStyles}
                                            placeholder="Gõ để tìm kiếm kỹ năng..." noOptionsMessage={({ inputValue }) => inputValue ? "Không tìm thấy dữ liệu" : "Gõ tên kỹ năng để bắt đầu..."}
                                            value={skill.name ? { label: skill.name, value: skill.skill_id } : null}
                                            onChange={(selected: any) => handleSkillSelect('required', index, selected)}
                                        />
                                    </div>
                                    <input type="number" min="0.1" max="1" step="0.1" className="w-24 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none text-sm text-center dark:text-white font-bold" value={skill.weight} onChange={e => handleSkillChange('required', index, 'weight', Number(e.target.value))} title="Từ 0.1 đến 1.0" />
                                    <input type="number" min="0" step="0.5" className="w-24 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none text-sm text-center dark:text-white font-bold" value={skill.min_years} onChange={e => handleSkillChange('required', index, 'min_years', Number(e.target.value))} />
                                    <button type="button" onClick={() => removeSkillRow('required', index)} className="w-10 flex justify-center text-slate-400 hover:text-rose-500 transition-colors p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="border-slate-200 dark:border-slate-700" />

                    {/* Ưu tiên */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                Kỹ năng Ưu tiên (Nice-to-have)
                            </h3>
                            <button type="button" onClick={() => addSkillRow('preferred')} className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-300 transition-colors shadow-sm">+ Thêm dòng</button>
                        </div>
                        <div className="space-y-3">
                            {preferredSkills.map((skill, index) => (
                                <div key={index} className="flex gap-4 items-center bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm focus-within:border-slate-400 transition-all">
                                    <div className="flex-1">
                                        <AsyncSelect
                                            cacheOptions defaultOptions={false} loadOptions={loadSkillOptions} styles={asyncSelectStyles}
                                            placeholder="Gõ để tìm kiếm kỹ năng..." noOptionsMessage={({ inputValue }) => inputValue ? "Không tìm thấy dữ liệu" : "Gõ tên kỹ năng để bắt đầu..."}
                                            value={skill.name ? { label: skill.name, value: skill.skill_id } : null}
                                            onChange={(selected: any) => handleSkillSelect('preferred', index, selected)}
                                        />
                                    </div>
                                    <input type="number" min="0.1" max="1" step="0.1" className="w-24 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none text-sm text-center dark:text-white font-bold" value={skill.weight} onChange={e => handleSkillChange('preferred', index, 'weight', Number(e.target.value))} title="Từ 0.1 đến 1.0" />
                                    <input type="number" min="0" step="0.5" className="w-24 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg outline-none text-sm text-center dark:text-white font-bold" value={skill.min_years} onChange={e => handleSkillChange('preferred', index, 'min_years', Number(e.target.value))} />
                                    <button type="button" onClick={() => removeSkillRow('preferred', index)} className="w-10 flex justify-center text-slate-400 hover:text-rose-500 transition-colors p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Block 2: AI Weights */}
            <div className="space-y-6 pt-4">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <BrainCircuit className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Trọng số Thuật toán AI</h2>
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
                        <p className="text-xs text-slate-500 mt-1">Hệ thống AI đã tự động phân bổ trọng số tối ưu nhất cho ngành: <strong className="text-primary-600 dark:text-primary-400">{formData.industry || 'Mặc định'}</strong>.</p>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/80 p-6 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden min-h-105 w-full flex flex-col justify-center">
                    {/* Background Pattern trang trí */}
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 text-slate-200/50 dark:text-slate-700/30 pointer-events-none">
                        <BrainCircuit className="w-64 h-64" />
                    </div>

                    {/* Overlay Ổ khóa Teaser bao trùm toàn bộ khối để Description không bị bóp hẹp */}
                    {!canCustomizeAI && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 sm:p-8 bg-white/60 dark:bg-slate-900/80 backdrop-blur-md">
                            <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 sm:p-4">
                                <ProFeatureLock
                                    title="Mở khóa Tinh chỉnh AI"
                                    description="Tự do can thiệp vào bộ não của hệ thống. Phá vỡ giới hạn mặc định để tự tăng tỷ trọng Kinh nghiệm hoặc Học vấn theo đúng khẩu vị tuyển dụng của công ty."
                                    requiredTierName={unlockPlanName.replace('HR ', '')}
                                    requiredTierLevel={unlockPlan?.tier_level || 3}
                                />
                            </div>
                        </div>
                    )}

                    <div className={`relative z-10 transition-all w-full ${!canCustomizeAI ? 'filter blur-[5px] pointer-events-none select-none opacity-40' : ''}`}>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Tổng phân bổ</h3>
                            <span className={`px-4 py-1.5 rounded-xl text-sm font-black shadow-sm ${totalWeight === 100 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                {totalWeight}% / 100%
                            </span>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Kỹ năng */}
                            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 hover:border-primary-300 dark:hover:border-primary-700 transition-colors group">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-wider text-center group-hover:text-primary-600 transition-colors">Kỹ năng</p>
                                <input disabled={!canCustomizeAI} type="number" min="0" max="100" className="w-full bg-transparent text-center text-4xl font-black text-primary-600 dark:text-primary-400 outline-none mb-2" value={aiWeights.skills} onChange={e => setAiWeights({ ...aiWeights, skills: Number(e.target.value) })} />
                                <input disabled={!canCustomizeAI} type="range" min="0" max="100" className={`w-full accent-primary-600 ${canCustomizeAI ? 'cursor-pointer' : 'cursor-not-allowed'}`} value={aiWeights.skills} onChange={e => setAiWeights({ ...aiWeights, skills: Number(e.target.value) })} />
                            </div>
                            {/* Ngữ nghĩa */}
                            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-wider text-center group-hover:text-indigo-600 transition-colors">Ngữ nghĩa</p>
                                <input disabled={!canCustomizeAI} type="number" min="0" max="100" className="w-full bg-transparent text-center text-4xl font-black text-indigo-600 dark:text-indigo-400 outline-none mb-2" value={aiWeights.nlp} onChange={e => setAiWeights({ ...aiWeights, nlp: Number(e.target.value) })} />
                                <input disabled={!canCustomizeAI} type="range" min="0" max="100" className={`w-full accent-indigo-600 ${canCustomizeAI ? 'cursor-pointer' : 'cursor-not-allowed'}`} value={aiWeights.nlp} onChange={e => setAiWeights({ ...aiWeights, nlp: Number(e.target.value) })} />
                            </div>
                            {/* Kinh nghiệm */}
                            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors group">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-wider text-center group-hover:text-emerald-600 transition-colors">Kinh nghiệm</p>
                                <input disabled={!canCustomizeAI} type="number" min="0" max="100" className="w-full bg-transparent text-center text-4xl font-black text-emerald-600 dark:text-emerald-400 outline-none mb-2" value={aiWeights.experience} onChange={e => setAiWeights({ ...aiWeights, experience: Number(e.target.value) })} />
                                <input disabled={!canCustomizeAI} type="range" min="0" max="100" className={`w-full accent-emerald-600 ${canCustomizeAI ? 'cursor-pointer' : 'cursor-not-allowed'}`} value={aiWeights.experience} onChange={e => setAiWeights({ ...aiWeights, experience: Number(e.target.value) })} />
                            </div>
                            {/* Học vấn */}
                            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 hover:border-amber-300 dark:hover:border-amber-700 transition-colors group">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-wider text-center group-hover:text-amber-600 transition-colors">Học vấn</p>
                                <input disabled={!canCustomizeAI} type="number" min="0" max="100" className="w-full bg-transparent text-center text-4xl font-black text-amber-500 outline-none mb-2" value={aiWeights.education} onChange={e => setAiWeights({ ...aiWeights, education: Number(e.target.value) })} />
                                <input disabled={!canCustomizeAI} type="range" min="0" max="100" className={`w-full accent-amber-500 ${canCustomizeAI ? 'cursor-pointer' : 'cursor-not-allowed'}`} value={aiWeights.education} onChange={e => setAiWeights({ ...aiWeights, education: Number(e.target.value) })} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}