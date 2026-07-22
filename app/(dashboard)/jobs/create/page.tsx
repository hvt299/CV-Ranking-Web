'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
    Briefcase, Building2, MapPin, DollarSign, BrainCircuit,
    X, ArrowLeft, Save, GraduationCap, ChevronRight, ChevronLeft,
    FileText, CheckCircle2, Clock, Users, Languages, Trash2
} from 'lucide-react';
import apiClient from '@/lib/api-client'
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Select from 'react-select';
import { INDUSTRIES, JOB_LEVELS, EMPLOYMENT_TYPES, WORK_MODES } from '@/constants/job.constants';
import { parseCurrency, formatCurrency } from '@/utils/format';

const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor'), {
    ssr: false,
    loading: () => <div className="h-40 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl border border-slate-200 dark:border-slate-700"></div>
});

export default function CreateEnterpriseJobPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        title: '', industry: '', job_level: 'Middle', employment_type: 'Full-time', work_mode: 'Onsite', headcount: 1,
        deadline: '', probation_period: '2 tháng', gender_requirement: 'Không yêu cầu', languages: [] as string[],
        min_yoe: 0, education: { min_level: 'Không yêu cầu', preferred_majors: [] as string[] },
        salary: { min_salary: 10000000, max_salary: 30000000, currency: 'VND' },
        working_hours: '08:00 - 17:30, Thứ 2 - Thứ 6', location: { city: '', address: '', country: 'Việt Nam' },
        description: '', requirements: '', benefits: '', other_info: ''
    });

    const [salaryStr, setSalaryStr] = useState({ min: '10,000,000', max: '30,000,000' });
    const [isNegotiable, setIsNegotiable] = useState(false);
    const [requiredSkills, setRequiredSkills] = useState([{ name: '', weight: 0.5, min_years: 0 }]);
    const [preferredSkills, setPreferredSkills] = useState([{ name: '', weight: 0.2, min_years: 0 }]);
    const [majorInput, setMajorInput] = useState('');
    const [languageInput, setLanguageInput] = useState('');
    const [aiWeights, setAiWeights] = useState({ skills: 40, nlp: 30, experience: 20, education: 10 });

    const [locCountry, setLocCountry] = useState('Việt Nam');
    const [locCity, setLocCity] = useState('');
    const [locDistrict, setLocDistrict] = useState('');
    const [locWard, setLocWard] = useState('');
    const [locStreet, setLocStreet] = useState('');

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            location: {
                country: locCountry,
                city: locCountry === 'Việt Nam' ? locCity : 'Nước ngoài',
                address: locCountry === 'Việt Nam'
                    ? [locStreet, locWard, locDistrict].filter(Boolean).join(', ')
                    : locStreet
            }
        }));
    }, [locCountry, locCity, locDistrict, locWard, locStreet]);

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (!formData.title.trim()) return toast.error("Vui lòng nhập Tên vị trí tuyển dụng!");
            if (!formData.deadline) return toast.error("Vui lòng chọn Hạn nộp hồ sơ!");
        }
        if (currentStep === 2) {
            if (!formData.description.trim() || formData.description === '<p></p>') return toast.error("Vui lòng nhập Mô tả công việc!");
            if (!formData.requirements.trim() || formData.requirements === '<p></p>') return toast.error("Vui lòng nhập Yêu cầu công việc!");
        }
        setCurrentStep(prev => prev + 1);
    };

    const handleManualSalaryChange = (type: 'min' | 'max', value: string) => {
        const numVal = parseCurrency(value);
        setSalaryStr(prev => ({ ...prev, [type]: formatCurrency(numVal) }));
        setFormData(prev => ({ ...prev, salary: { ...prev.salary, [`${type}_salary`]: numVal } }));
    };

    const handleSliderSalaryChange = (type: 'min' | 'max', value: number) => {
        setSalaryStr(prev => ({ ...prev, [type]: formatCurrency(value) }));
        setFormData(prev => ({ ...prev, salary: { ...prev.salary, [`${type}_salary`]: value } }));
    };

    const handleSkillChange = (type: 'required' | 'preferred', index: number, field: string, value: any) => {
        const updated = type === 'required' ? [...requiredSkills] : [...preferredSkills];
        updated[index] = { ...updated[index], [field]: value };
        type === 'required' ? setRequiredSkills(updated) : setPreferredSkills(updated);
    };

    const addSkillRow = (type: 'required' | 'preferred') => {
        const newSkill = {
            name: '',
            weight: type === 'required' ? 0.5 : 0.2,
            min_years: 0
        };

        if (type === 'required') {
            setRequiredSkills(prev => [...prev, newSkill]);
        } else {
            setPreferredSkills(prev => [...prev, newSkill]);
        }
    };

    const removeSkillRow = (
        type: 'required' | 'preferred',
        index: number
    ) => {
        if (type === 'required') {
            if (requiredSkills.length === 1) return;

            setRequiredSkills(prev =>
                prev.filter((_, i) => i !== index)
            );
        } else {
            setPreferredSkills(prev =>
                prev.filter((_, i) => i !== index)
            );
        }
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (currentStep < 3) {
            handleNextStep();
            return;
        }

        const totalWeight = aiWeights.skills + aiWeights.nlp + aiWeights.experience + aiWeights.education;
        if (totalWeight !== 100) return toast.error(`Tổng trọng số AI phải bằng 100% (Hiện tại: ${totalWeight}%)`);

        const validReqSkills = requiredSkills.filter(s => s.name.trim() !== '').map(s => ({ ...s, weight: Number(s.weight), min_years: Number(s.min_years) }));
        if (validReqSkills.length === 0) return toast.error('Cần ít nhất 1 Kỹ năng bắt buộc để AI chấm điểm!');

        setIsLoading(true);
        try {
            const payload = {
                ...formData,
                company_id: user?.company_id || "temp_id",
                deadline: formData.deadline ? new Date(`${formData.deadline}T23:59:59Z`).toISOString() : null,
                salary: isNegotiable ? null : formData.salary,
                required_skills: validReqSkills,
                preferred_skills: preferredSkills.filter(s => s.name.trim() !== '').map(s => ({ ...s, weight: Number(s.weight), min_years: Number(s.min_years) })),
                score_weights: {
                    skills_weight: aiWeights.skills / 100, nlp_weight: aiWeights.nlp / 100,
                    experience_weight: aiWeights.experience / 100, education_weight: aiWeights.education / 100
                }
            };
            await apiClient.post('/jobs/', payload);
            toast.success('Xuất bản chiến dịch tuyển dụng thành công!');
            router.push('/jobs');
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Lỗi hệ thống khi tạo Job');
        } finally {
            setIsLoading(false);
        }
    };

    const STEPS = [
        { id: 1, title: 'Thông tin chung', icon: Briefcase },
        { id: 2, title: 'Chi tiết & Đãi ngộ', icon: FileText },
        { id: 3, title: 'Cấu hình AI Scoring', icon: BrainCircuit }
    ];

    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

    const customSelectStyles = {
        control: (base: any, state: any) => ({
            ...base,
            background: 'transparent',
            borderColor: state.isFocused ? '#3b82f6' : (isDark ? '#334155' : '#e2e8f0'),
            borderRadius: '0.75rem', padding: '4px', boxShadow: 'none', fontSize: '0.875rem'
        }),
        menu: (base: any) => ({
            ...base, zIndex: 9999, fontSize: '0.875rem',
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`
        }),
        option: (base: any, state: any) => ({
            ...base, cursor: 'pointer',
            backgroundColor: state.isFocused ? (isDark ? '#334155' : '#f1f5f9') : 'transparent',
            color: isDark ? '#f8fafc' : '#1e293b'
        }),
        singleValue: (base: any) => ({ ...base, color: isDark ? '#f8fafc' : '#1e293b' })
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto pb-20 px-4 lg:px-8">

            {/* HEADER KHÔNG STICKY, BO GÓC MỀM MẠI */}
            <div className="bg-white dark:bg-slate-800 shadow-sm p-6 mb-8 border border-slate-200 dark:border-slate-700 rounded-3xl mt-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button type="button" onClick={() => router.back()} className="p-2 bg-slate-50 dark:bg-slate-900 rounded-full shadow-sm hover:bg-slate-100 transition-colors border border-slate-200 dark:border-slate-700">
                            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 dark:text-white">Tạo Chiến Dịch Mới</h1>
                            <p className="text-xs text-slate-500 font-medium">Thiết lập bộ thông số cho AI Scoring</p>
                        </div>
                    </div>
                </div>

                {/* PROGRESS BAR (Thanh nối liền các bước chuẩn UI) */}
                <div className="relative flex justify-between items-center w-full max-w-3xl mx-auto px-4 mt-6 z-0">
                    {/* Nền xám */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full -z-10"></div>
                    {/* Thanh chạy màu xanh */}
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full -z-10 transition-all duration-500 ease-out"
                        style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                    ></div>

                    {STEPS.map((step) => {
                        const Icon = step.icon;
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;
                        return (
                            <div key={step.id} className="flex flex-col items-center relative group">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-4 ${isActive ? 'bg-blue-600 text-white border-blue-100 dark:border-blue-900 shadow-lg scale-110' : isCompleted ? 'bg-emerald-500 text-white border-emerald-100 dark:border-emerald-900' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-600'}`}>
                                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                                </div>
                                <span className={`absolute -bottom-7 w-32 text-center text-xs font-bold transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : isCompleted ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}>
                                    {step.title}
                                </span>
                            </div>
                        )
                    })}
                </div>
                <div className="h-6"></div>
            </div>

            {/* CONTENT */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 min-h-125">

                {/* BƯỚC 1: THÔNG TIN CHUNG */}
                {currentStep === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4 text-slate-800 dark:text-white"><Briefcase className="text-blue-500" /> Cơ bản & Phân loại</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Tên vị trí tuyển dụng <span className="text-rose-500">*</span></label>
                                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 dark:text-white" placeholder="VD: Senior ReactJS Developer" />
                            </div>

                            <div className="dark:text-slate-900">
                                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Ngành nghề (Industry)</label>
                                <Select
                                    options={INDUSTRIES}
                                    styles={customSelectStyles}
                                    placeholder="Chọn ngành nghề..."
                                    value={INDUSTRIES.find(i => i.value === formData.industry)}
                                    onChange={(selected: any) => setFormData({ ...formData, industry: selected?.value || '' })}
                                />
                            </div>

                            <div className="dark:text-slate-900">
                                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Cấp bậc (Level)</label>
                                <Select
                                    options={JOB_LEVELS}
                                    styles={customSelectStyles}
                                    value={JOB_LEVELS.find(l => l.value === formData.job_level)}
                                    onChange={(selected: any) => setFormData({ ...formData, job_level: selected?.value || '' })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                                    Loại hình & Hình thức
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <select
                                        className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white"
                                        value={formData.employment_type}
                                        onChange={e => setFormData({ ...formData, employment_type: e.target.value })}
                                    >
                                        {EMPLOYMENT_TYPES.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>

                                    <select
                                        className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white"
                                        value={formData.work_mode}
                                        onChange={e => setFormData({ ...formData, work_mode: e.target.value })}
                                    >
                                        {WORK_MODES.map(mode => (
                                            <option key={mode.value} value={mode.value}>{mode.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Số lượng & Hạn nộp</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input type="number" min="1" className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" value={formData.headcount} onChange={e => setFormData({ ...formData, headcount: Number(e.target.value) })} title="Số lượng tuyển" />
                                    <input type="date" required className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} title="Hạn nộp hồ sơ" />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Khu vực làm việc</label>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                        <select
                                            className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white"
                                            value={locCountry}
                                            onChange={e => setLocCountry(e.target.value)}
                                        >
                                            <option value="Việt Nam">Việt Nam</option>
                                            <option value="Nước ngoài">Nước ngoài</option>
                                        </select>

                                        {locCountry === 'Việt Nam' ? (
                                            <>
                                                {/* Dropdown Tỉnh/Thành, Quận/Huyện, Xã/Phường: Tạm thời mock dữ liệu tĩnh, sau này bạn gọi API để bind vào options nhé */}
                                                <select className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" value={locCity} onChange={e => setLocCity(e.target.value)}>
                                                    <option value="" disabled>Tỉnh/Thành phố</option>
                                                    <option value="Hà Nội">Hà Nội</option>
                                                    <option value="TP.HCM">TP.HCM</option>
                                                    <option value="Đà Nẵng">Đà Nẵng</option>
                                                </select>
                                                <select className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" value={locDistrict} onChange={e => setLocDistrict(e.target.value)}>
                                                    <option value="" disabled>Quận/Huyện</option>
                                                    <option value="Quận 1">Quận 1</option>
                                                    <option value="Quận Cầu Giấy">Quận Cầu Giấy</option>
                                                </select>
                                                <select className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" value={locWard} onChange={e => setLocWard(e.target.value)}>
                                                    <option value="" disabled>Phường/Xã</option>
                                                    <option value="Phường Bến Nghé">Phường Bến Nghé</option>
                                                </select>
                                            </>
                                        ) : (
                                            <div className="md:col-span-3 text-sm text-slate-500 p-3.5 flex items-center">
                                                Vui lòng nhập địa chỉ chi tiết ở ô bên dưới
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={locCountry === 'Việt Nam' ? "Số nhà, tên đường, tòa nhà..." : "Nhập đầy đủ địa chỉ tại nước ngoài..."}
                                        className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white"
                                        value={locStreet}
                                        onChange={e => setLocStreet(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* BƯỚC 2: CHI TIẾT & ĐÃI NGỘ */}
                {currentStep === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4 text-slate-800 dark:text-white"><DollarSign className="text-amber-500" /> Lương & Chế độ</h2>

                            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mb-6">
                                <div className="flex justify-between items-center mb-6">
                                    <label className="font-bold text-slate-800 dark:text-white">Mức lương dự kiến (VND)</label>
                                    <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700">
                                        <input type="checkbox" className="w-4 h-4 accent-blue-600 rounded" checked={isNegotiable} onChange={(e) => setIsNegotiable(e.target.checked)} />
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Lương thỏa thuận</span>
                                    </label>
                                </div>

                                {!isNegotiable ? (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tối thiểu</label>
                                                <div className="relative mb-3">
                                                    <input type="text" value={salaryStr.min} onChange={(e) => handleManualSalaryChange('min', e.target.value)} className="w-full p-3 pr-12 font-bold text-lg text-blue-700 dark:text-blue-400 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-xl outline-none focus:ring-2 ring-blue-100 dark:ring-blue-900" />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">VND</span>
                                                </div>
                                                <input type="range" min="1000000" max="100000000" step="1000000" value={formData.salary.min_salary} onChange={(e) => handleSliderSalaryChange('min', Number(e.target.value))} className="w-full accent-blue-600" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tối đa</label>
                                                <div className="relative mb-3">
                                                    <input type="text" value={salaryStr.max} onChange={(e) => handleManualSalaryChange('max', e.target.value)} className="w-full p-3 pr-12 font-bold text-lg text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-xl outline-none focus:ring-2 ring-emerald-100 dark:ring-emerald-900" />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">VND</span>
                                                </div>
                                                <input type="range" min="1000000" max="200000000" step="1000000" value={formData.salary.max_salary} onChange={(e) => handleSliderSalaryChange('max', Number(e.target.value))} className="w-full accent-emerald-500" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-4 px-6 bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 rounded-2xl flex items-center gap-4">
                                        <div className="w-10 h-10 shrink-0 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-full flex items-center justify-center">
                                            <DollarSign className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Mức lương thỏa thuận</span>
                                            <span className="text-xs text-slate-500 mt-0.5">Sẽ được trao đổi trực tiếp khi phỏng vấn ứng viên</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Thời gian làm việc</label>
                                    <input type="text" className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" value={formData.working_hours} onChange={e => setFormData({ ...formData, working_hours: e.target.value })} placeholder="VD: 08:00 - 17:30, Thứ 2 - Thứ 6" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Thời gian thử việc</label>
                                    <input type="text" className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" value={formData.probation_period} onChange={e => setFormData({ ...formData, probation_period: e.target.value })} placeholder="VD: 2 tháng, 100% lương" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4 text-slate-800 dark:text-white"><FileText className="text-indigo-500" /> Nội dung JD</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Mô tả công việc <span className="text-rose-500">*</span></label>
                                    <RichTextEditor value={formData.description} onChange={(val) => setFormData({ ...formData, description: val })} placeholder="Mô tả các nhiệm vụ chính..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Yêu cầu công việc <span className="text-rose-500">*</span></label>
                                    <RichTextEditor value={formData.requirements} onChange={(val) => setFormData({ ...formData, requirements: val })} placeholder="Yêu cầu về kỹ năng, kinh nghiệm..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Quyền lợi</label>
                                    <RichTextEditor value={formData.benefits} onChange={(val) => setFormData({ ...formData, benefits: val })} placeholder="Bảo hiểm, thưởng, chế độ nghỉ phép..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Thông tin khác (Không bắt buộc)</label>
                                    <RichTextEditor value={formData.other_info} onChange={(val) => setFormData({ ...formData, other_info: val })} placeholder="Cách thức phỏng vấn, quy trình tuyển dụng, hoặc ghi chú thêm..." />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* BƯỚC 3: AI SCORING & YÊU CẦU */}
                {currentStep === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-900 dark:text-indigo-300"><BrainCircuit className="text-indigo-500" /> Tinh chỉnh Trọng số AI</h2>
                                <span className={`text-sm font-bold px-3 py-1 rounded-lg ${(aiWeights.skills + aiWeights.nlp + aiWeights.experience + aiWeights.education) === 100 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                                    Tổng: {aiWeights.skills + aiWeights.nlp + aiWeights.experience + aiWeights.education}%
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Kỹ năng</p>
                                    <input type="number" min="0" max="100" className="w-full bg-transparent text-center text-2xl font-black text-blue-600 outline-none" value={aiWeights.skills} onChange={e => setAiWeights({ ...aiWeights, skills: Number(e.target.value) })} />
                                    <input type="range" min="0" max="100" className="w-full accent-blue-600 mt-2 cursor-pointer" value={aiWeights.skills} onChange={e => setAiWeights({ ...aiWeights, skills: Number(e.target.value) })} />
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Ngữ nghĩa</p>
                                    <input type="number" min="0" max="100" className="w-full bg-transparent text-center text-2xl font-black text-indigo-600 outline-none" value={aiWeights.nlp} onChange={e => setAiWeights({ ...aiWeights, nlp: Number(e.target.value) })} />
                                    <input type="range" min="0" max="100" className="w-full accent-indigo-600 mt-2 cursor-pointer" value={aiWeights.nlp} onChange={e => setAiWeights({ ...aiWeights, nlp: Number(e.target.value) })} />
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Kinh nghiệm</p>
                                    <input type="number" min="0" max="100" className="w-full bg-transparent text-center text-2xl font-black text-emerald-600 outline-none" value={aiWeights.experience} onChange={e => setAiWeights({ ...aiWeights, experience: Number(e.target.value) })} />
                                    <input type="range" min="0" max="100" className="w-full accent-emerald-600 mt-2 cursor-pointer" value={aiWeights.experience} onChange={e => setAiWeights({ ...aiWeights, experience: Number(e.target.value) })} />
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Học vấn</p>
                                    <input type="number" min="0" max="100" className="w-full bg-transparent text-center text-2xl font-black text-amber-600 outline-none" value={aiWeights.education} onChange={e => setAiWeights({ ...aiWeights, education: Number(e.target.value) })} />
                                    <input type="range" min="0" max="100" className="w-full accent-amber-600 mt-2 cursor-pointer" value={aiWeights.education} onChange={e => setAiWeights({ ...aiWeights, education: Number(e.target.value) })} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="font-bold border-b border-slate-200 dark:border-slate-700 pb-2 text-slate-800 dark:text-white"><GraduationCap className="w-4 h-4 inline mr-2 text-slate-500" /> Trình độ & Ngôn ngữ</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Số năm KN tối thiểu</label>
                                        <input type="number" step="0.5" className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white focus:border-blue-500" value={formData.min_yoe} onChange={e => setFormData({ ...formData, min_yoe: Number(e.target.value) })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Giới tính</label>
                                        <select className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white focus:border-blue-500" value={formData.gender_requirement} onChange={e => setFormData({ ...formData, gender_requirement: e.target.value })}>
                                            <option value="Không yêu cầu">Không yêu cầu</option>
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Học vấn & Chuyên ngành</label>
                                    <div className="space-y-3">
                                        <select className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white focus:border-blue-500" value={formData.education.min_level} onChange={e => setFormData({ ...formData, education: { ...formData.education, min_level: e.target.value } })}>
                                            <option value="Không yêu cầu">Không yêu cầu tối thiểu</option>
                                            <option value="Trung cấp">Trung cấp trở lên</option>
                                            <option value="Cao đẳng">Cao đẳng trở lên</option>
                                            <option value="Cử nhân">Cử nhân / Đại học trở lên</option>
                                            <option value="Thạc sĩ">Thạc sĩ trở lên</option>
                                        </select>

                                        <div className="min-h-12 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-wrap gap-2 items-center">
                                            {formData.education.preferred_majors.map((major, idx) => (
                                                <span key={idx} className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                                                    {major} <button type="button" onClick={() => setFormData({ ...formData, education: { ...formData.education, preferred_majors: formData.education.preferred_majors.filter((_, i) => i !== idx) } })}><X className="w-3 h-3 hover:text-red-500" /></button>
                                                </span>
                                            ))}
                                            <input type="text" className="flex-1 bg-transparent dark:text-white outline-none text-sm p-1 min-w-37.5" placeholder="Chuyên ngành ưu tiên (Nhấn Enter)" value={majorInput} onChange={e => setMajorInput(e.target.value)} onKeyDown={e => handleArrayInput(e, majorInput, setMajorInput, formData.education.preferred_majors, (arr: string[]) => setFormData({ ...formData, education: { ...formData.education, preferred_majors: arr } }))} />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Ngoại ngữ (Nhấn Enter)</label>
                                    <div className="min-h-12 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-wrap gap-2 items-center">
                                        {formData.languages.map((lang, idx) => (
                                            <span key={idx} className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                                                {lang} <button type="button" onClick={() => setFormData({ ...formData, languages: formData.languages.filter((_, i) => i !== idx) })}><X className="w-3 h-3 hover:text-red-500" /></button>
                                            </span>
                                        ))}
                                        <input type="text" className="flex-1 bg-transparent dark:text-white outline-none text-sm p-1" placeholder="VD: Tiếng Anh IELTS 6.5" value={languageInput} onChange={e => setLanguageInput(e.target.value)} onKeyDown={e => handleArrayInput(e, languageInput, setLanguageInput, formData.languages, (arr: string[]) => setFormData({ ...formData, languages: arr }))} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                                    <h3 className="font-bold text-slate-800 dark:text-white"><CheckCircle2 className="w-4 h-4 inline mr-2 text-blue-500" /> Kỹ năng Bắt buộc (Must-have)</h3>
                                    <button type="button" onClick={() => addSkillRow('required')} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded font-bold hover:bg-blue-200 dark:hover:bg-blue-900/50">+ Thêm</button>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex gap-2 px-1 text-[10px] font-bold text-slate-500 uppercase"><div className="w-1/2">Tên kỹ năng</div><div className="w-1/4 text-center">Trọng số</div><div className="w-1/4 text-center">Năm KN</div><div className="w-8"></div></div>
                                    {requiredSkills.map((skill, index) => (
                                        <div key={index} className="flex gap-2 items-center">
                                            <input type="text" placeholder="VD: ReactJS" className="w-1/2 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm dark:text-white focus:border-blue-500" value={skill.name} onChange={e => handleSkillChange('required', index, 'name', e.target.value)} />
                                            <input type="number" min="0.1" max="1" step="0.1" className="w-1/4 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm text-center dark:text-white focus:border-blue-500" value={skill.weight} onChange={e => handleSkillChange('required', index, 'weight', e.target.value)} />
                                            <input type="number" min="0" step="0.5" className="w-1/4 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm text-center dark:text-white focus:border-blue-500" value={skill.min_years} onChange={e => handleSkillChange('required', index, 'min_years', e.target.value)} />
                                            <button type="button" onClick={() => removeSkillRow('required', index)} className="w-8 text-rose-400 hover:text-rose-600 flex justify-center"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2 pt-4">
                                    <h3 className="font-bold text-slate-800 dark:text-white"><CheckCircle2 className="w-4 h-4 inline mr-2 text-emerald-500" /> Kỹ năng Ưu tiên (Nice-to-have)</h3>
                                    <button type="button" onClick={() => addSkillRow('preferred')} className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded font-bold hover:bg-emerald-200 dark:hover:bg-emerald-900/50">+ Thêm</button>
                                </div>
                                <div className="space-y-2">
                                    {preferredSkills.map((skill, index) => (
                                        <div key={index} className="flex gap-2 items-center">
                                            <input type="text" placeholder="VD: AWS" className="w-1/2 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm dark:text-white focus:border-blue-500" value={skill.name} onChange={e => handleSkillChange('preferred', index, 'name', e.target.value)} />
                                            <input type="number" min="0.1" max="1" step="0.1" className="w-1/4 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm text-center dark:text-white focus:border-blue-500" value={skill.weight} onChange={e => handleSkillChange('preferred', index, 'weight', e.target.value)} />
                                            <input type="number" min="0" step="0.5" className="w-1/4 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm text-center dark:text-white focus:border-blue-500" value={skill.min_years} onChange={e => handleSkillChange('preferred', index, 'min_years', e.target.value)} />
                                            <button type="button" onClick={() => removeSkillRow('preferred', index)} className="w-8 text-rose-400 hover:text-rose-600 flex justify-center"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* FOOTER NAVIGATION KHÔNG STICKY */}
            <div className="flex justify-between items-center mt-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <button type="button" disabled={currentStep === 1} onClick={() => setCurrentStep(prev => prev - 1)} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-200 dark:hover:bg-slate-950 flex items-center gap-2 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Quay lại
                </button>

                {currentStep < 3 ? (
                    <button type="button" onClick={(e) => { e.preventDefault(); handleNextStep(); }} className="px-6 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2 shadow-lg transition-colors">
                        Tiếp tục <ChevronRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button type="submit" disabled={isLoading} className="px-8 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-colors">
                        <Save className="w-5 h-5" /> {isLoading ? 'Đang xuất bản...' : 'Hoàn tất & Xuất bản Job'}
                    </button>
                )}
            </div>
        </form>
    );
}