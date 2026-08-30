'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft, Save, ChevronRight, ChevronLeft,
    Briefcase, FileText, BrainCircuit, CheckCircle2,
    MapPin, GraduationCap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { jobService } from '@/features/job/job.service';
import { LocationDetail } from '@/types';

import Step1Basic from '@/components/jobs/form/Step1Basic';
import Step2LocationSalary from '@/components/jobs/form/Step2LocationSalary';
import Step3JD from '@/components/jobs/form/Step3JD';
import Step4Criteria from '@/components/jobs/form/Step4Criteria';
import Step5SkillsAI from '@/components/jobs/form/Step5SkillsAI';
import { ROUTES } from '@/constants/routes';

export default function EditEnterpriseJobPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const params = useParams();
    const jobId = params.id as string;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        title: '', industry: '', job_level: 'Middle', employment_type: 'Full-time', work_mode: 'Onsite', headcount: 1,
        deadline: '', probation_period: '2 tháng', gender_requirement: 'Không yêu cầu', languages: [] as string[],
        required_certifications: [] as string[],
        min_yoe: 0, education: { min_level: 'Không yêu cầu', preferred_majors: [] as string[] },
        salary: { min_salary: 10000000, max_salary: 30000000, currency: 'VND' },
        working_hours: '08:00 - 17:30, Thứ 2 - Thứ 6', location: { province_name: '', street_address: '', country: 'Việt Nam' } as LocationDetail,
        description: '', requirements: '', benefits: '', other_info: '',
        jd_file_url: ''
    });

    const [isNegotiable, setIsNegotiable] = useState(false);
    const [requiredSkills, setRequiredSkills] = useState([{ skill_id: null as string | null, name: '', weight: 0.5, min_years: 0 }]);
    const [preferredSkills, setPreferredSkills] = useState([{ skill_id: null as string | null, name: '', weight: 0.2, min_years: 0 }]);
    const [aiWeights, setAiWeights] = useState({ skills: 40, nlp: 30, experience: 20, education: 10 });

    useEffect(() => {
        if (jobId) fetchJobDetail();
    }, [jobId]);

    const fetchJobDetail = async () => {
        setIsFetching(true);
        try {
            const data = await jobService.getJobById(jobId);

            setFormData({
                title: data.title || '',
                industry: data.industry || '',
                job_level: data.job_level || 'Middle',
                employment_type: data.employment_type || 'Full-time',
                work_mode: data.work_mode || 'Onsite',
                headcount: data.headcount || 1,
                deadline: data.deadline ? data.deadline.split('T')[0] : '',
                probation_period: data.probation_period || '2 tháng',
                gender_requirement: data.gender_requirement || 'Không yêu cầu',
                languages: data.languages || [],
                required_certifications: data.required_certifications || [],
                min_yoe: data.min_yoe || 0,
                education: {
                    min_level: data.education?.min_level || 'Không yêu cầu',
                    preferred_majors: data.education?.preferred_majors || []
                },
                salary: {
                    min_salary: data.salary?.min_salary ?? 10000000,
                    max_salary: data.salary?.max_salary ?? 30000000,
                    currency: data.salary?.currency || 'VND'
                },
                working_hours: data.working_hours || '',
                location: {
                    country: data.location?.country || 'Việt Nam',
                    version: data.location?.version || 'new',
                    province_code: data.location?.province_code || '',
                    province_name: data.location?.province_name || '',
                    district_code: data.location?.district_code || '',
                    district_name: data.location?.district_name || '',
                    ward_code: data.location?.ward_code || '',
                    ward_name: data.location?.ward_name || '',
                    street_address: data.location?.street_address || data.location?.full_address_snapshot || '',
                    full_address_snapshot: data.location?.full_address_snapshot || ''
                },
                description: data.description || '',
                requirements: data.requirements || '',
                benefits: data.benefits || '',
                other_info: data.other_info || '',
                jd_file_url: data.jd_file_url || ''
            });

            setIsNegotiable(!(data.salary && data.salary.min_salary !== null && data.salary.min_salary !== undefined));

            if (data.score_weights) {
                setAiWeights({
                    skills: Math.round((data.score_weights.skills_weight ?? 0.4) * 100),
                    nlp: Math.round((data.score_weights.nlp_weight ?? 0.3) * 100),
                    experience: Math.round((data.score_weights.experience_weight ?? 0.2) * 100),
                    education: Math.round((data.score_weights.education_weight ?? 0.1) * 100)
                });
            }

            setRequiredSkills(
                data.required_skills && data.required_skills.length > 0
                    ? data.required_skills.map((s: any) => ({
                        skill_id: s.skill_id ?? null,
                        name: s.name,
                        weight: s.weight ?? 0.5,
                        min_years: s.min_years ?? 0
                    }))
                    : [{ skill_id: null, name: '', weight: 0.5, min_years: 0 }]
            );

            setPreferredSkills(
                data.preferred_skills && data.preferred_skills.length > 0
                    ? data.preferred_skills.map((s: any) => ({
                        skill_id: s.skill_id ?? null,
                        name: s.name,
                        weight: s.weight ?? 0.2,
                        min_years: s.min_years ?? 0
                    }))
                    : [{ skill_id: null, name: '', weight: 0.2, min_years: 0 }]
            );

        } catch (error) {
            toast.error("Không thể tải thông tin chiến dịch!");
            router.push(ROUTES.HR_JOBS);
        } finally {
            setIsFetching(false);
        }
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (!formData.title.trim()) return toast.error("Vui lòng nhập Tên vị trí tuyển dụng!");
            if (!formData.deadline) return toast.error("Vui lòng chọn Hạn nộp hồ sơ!");
        }
        if (currentStep === 3) {
            if (!formData.description.trim() || formData.description === '<p></p>') return toast.error("Vui lòng nhập Mô tả công việc!");
            if (!formData.requirements.trim() || formData.requirements === '<p></p>') return toast.error("Vui lòng nhập Yêu cầu công việc!");
        }

        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (currentStep < 5) {
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
                company_id: user?.company_id || "",
                deadline: formData.deadline ? new Date(`${formData.deadline}T23:59:59Z`).toISOString() : null,
                salary: isNegotiable ? null : formData.salary,
                required_skills: validReqSkills,
                preferred_skills: preferredSkills.filter(s => s.name.trim() !== '').map(s => ({ ...s, weight: Number(s.weight), min_years: Number(s.min_years) })),
                score_weights: {
                    skills_weight: aiWeights.skills / 100, nlp_weight: aiWeights.nlp / 100,
                    experience_weight: aiWeights.experience / 100, education_weight: aiWeights.education / 100
                }
            };
            await jobService.updateJob(jobId, payload);
            toast.success('Cập nhật chiến dịch thành công!');
            router.push(ROUTES.HR_JOBS);
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Lỗi hệ thống khi cập nhật Job');
        } finally {
            setIsLoading(false);
        }
    };

    const STEPS = [
        { id: 1, title: 'Cơ bản', icon: Briefcase },
        { id: 2, title: 'Đãi ngộ & Vị trí', icon: MapPin },
        { id: 3, title: 'Nội dung JD', icon: FileText },
        { id: 4, title: 'Tiêu chí', icon: GraduationCap },
        { id: 5, title: 'Kỹ năng & AI', icon: BrainCircuit, isPro: true }
    ];

    if (isFetching) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin h-10 w-10 border-b-2 border-primary-600 rounded-full"></div>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="pb-20 space-y-8 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500"
        >

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button type="button" onClick={() => router.back()} className="p-2 bg-slate-50 dark:bg-slate-900 rounded-full shadow-sm hover:bg-slate-100 transition-colors border border-slate-200 dark:border-slate-700">
                            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 dark:text-white">Cập Nhật Chiến Dịch</h1>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Chỉnh sửa thông số cho AI Scoring</p>
                        </div>
                    </div>
                </div>

                {/* PROGRESS BAR 5 BƯỚC */}
                <div className="relative flex justify-between items-center w-full max-w-4xl mx-auto px-4 mt-8 z-0">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full -z-10"></div>
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-600 rounded-full -z-10 transition-all duration-500 ease-out"
                        style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                    ></div>

                    {STEPS.map((step) => {
                        const Icon = step.icon;
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;
                        return (
                            <div key={step.id} className="flex flex-col items-center relative group">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-4 ${isActive ? 'bg-primary-600 text-white border-primary-100 dark:border-primary-900 shadow-lg scale-110' : isCompleted ? 'bg-emerald-500 text-white border-emerald-100 dark:border-emerald-900' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-600'}`}>
                                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                                </div>
                                <span className={`absolute -bottom-8 w-32 flex items-center justify-center text-center text-xs font-bold transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400' : isCompleted ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}>
                                    {step.title}
                                    {step.isPro && (
                                        <span className="ml-1.5 px-1.5 py-0.5 rounded-sm text-[9px] font-black bg-linear-to-r from-amber-500 to-orange-500 text-white uppercase tracking-widest shadow-sm">
                                            Pro
                                        </span>
                                    )}
                                </span>
                            </div>
                        )
                    })}
                </div>
                <div className="h-8"></div>
            </div>

            {/* CONTENT RENDER */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 min-h-100 transition-all">
                {currentStep === 1 && <Step1Basic formData={formData} setFormData={setFormData} />}
                {currentStep === 2 && <Step2LocationSalary formData={formData} setFormData={setFormData} isNegotiable={isNegotiable} setIsNegotiable={setIsNegotiable} />}
                {currentStep === 3 && <Step3JD formData={formData} setFormData={setFormData} />}
                {currentStep === 4 && <Step4Criteria formData={formData} setFormData={setFormData} />}
                {currentStep === 5 && (
                    <Step5SkillsAI
                        formData={formData} setFormData={setFormData}
                        aiWeights={aiWeights} setAiWeights={setAiWeights}
                        requiredSkills={requiredSkills} setRequiredSkills={setRequiredSkills}
                        preferredSkills={preferredSkills} setPreferredSkills={setPreferredSkills}
                    />
                )}
            </div>

            {/* FOOTER NAVIGATION */}
            <div className="flex justify-between items-center mt-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <button type="button" disabled={currentStep === 1} onClick={() => { setCurrentStep(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-200 dark:hover:bg-slate-950 flex items-center gap-2 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Quay lại
                </button>

                {currentStep < 5 ? (
                    <button type="button" onClick={(e) => { e.preventDefault(); handleNextStep(); }} className="px-6 py-2.5 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 flex items-center gap-2 shadow-lg shadow-primary-500/20 transition-colors">
                        Tiếp tục <ChevronRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button type="submit" disabled={isLoading} className="px-8 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-colors">
                        <Save className="w-5 h-5" /> {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                )}
            </div>
        </form>
    );
}