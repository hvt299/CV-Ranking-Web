'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, ChevronRight, ChevronLeft, Briefcase, FileText, BrainCircuit, CheckCircle2, MapPin, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import { JobFormData } from '@/types';
import { createInitialJobFormData } from './job-form.utils';
import Step1Basic from '@/components/jobs/form/Step1Basic';
import Step2LocationSalary from '@/components/jobs/form/Step2LocationSalary';
import Step3JD from '@/components/jobs/form/Step3JD';
import Step4Criteria from '@/components/jobs/form/Step4Criteria';
import Step5SkillsAI from '@/components/jobs/form/Step5SkillsAI';

export interface JobCampaignFormProps {
    mode: 'create' | 'edit';
    initialData?: JobFormData;
    isSubmitting?: boolean;
    onSubmit: (formData: JobFormData) => Promise<void> | void;
    onCancel?: () => void;
    submitLabel?: string;
    maxActiveJobs?: number;
    isQuotaExceeded?: boolean;
    unlockBadgeConfig?: { bg: string; text: string; border: string };
    unlockPlanName?: string;
}

export const JOB_FORM_STEPS = [
    { id: 1, title: 'Cơ bản', description: 'Thông tin vị trí', icon: Briefcase },
    { id: 2, title: 'Đãi ngộ & Vị trí', description: 'Địa điểm & lương', icon: MapPin },
    { id: 3, title: 'Nội dung JD', description: 'Mô tả công việc', icon: FileText },
    { id: 4, title: 'Tiêu chí', description: 'Yêu cầu ứng viên', icon: GraduationCap },
    { id: 5, title: 'Kỹ năng & AI', description: 'AI Scoring', icon: BrainCircuit }
];

export default function JobCampaignForm({
    mode,
    initialData,
    isSubmitting = false,
    onSubmit,
    onCancel,
    submitLabel,
    maxActiveJobs = 1,
    isQuotaExceeded = false,
    unlockBadgeConfig = { bg: 'bg-primary-100', text: 'text-primary-700', border: 'border-primary-200' },
    unlockPlanName = 'Enterprise'
}: JobCampaignFormProps) {
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(1);

    const formTopRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState<JobFormData>(
        initialData || createInitialJobFormData()
    );

    const [isNegotiable, setIsNegotiable] = useState<boolean>(
        Boolean(
            mode === 'edit' &&
            initialData &&
            initialData.salary.min_salary === undefined &&
            initialData.salary.max_salary === undefined
        )
    );

    const [requiredSkills, setRequiredSkills] = useState(
        formData.required_skills
    );

    const [preferredSkills, setPreferredSkills] = useState(
        formData.preferred_skills
    );

    const [aiWeights, setAiWeights] = useState(
        formData.aiWeights
    );

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            required_skills: requiredSkills,
            preferred_skills: preferredSkills,
            aiWeights: aiWeights
        }));
    }, [requiredSkills, preferredSkills, aiWeights]);

    const scrollToFormTop = () => {
        requestAnimationFrame(() => {
            formTopRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    };

    const changeStep = (step: number) => {
        if (step < 1 || step > JOB_FORM_STEPS.length) return;

        setCurrentStep(step);
        scrollToFormTop();
    };

    const validateCurrentStep = () => {
        if (currentStep === 1) {
            if (!formData.title.trim()) {
                toast.error('Vui lòng nhập Tên vị trí tuyển dụng!');
                return false;
            }

            if (!formData.deadline) {
                toast.error('Vui lòng chọn Hạn nộp hồ sơ!');
                return false;
            }
        }

        if (currentStep === 3) {
            if (
                !formData.description.trim() ||
                formData.description === '<p></p>'
            ) {
                toast.error('Vui lòng nhập Mô tả công việc!');
                return false;
            }

            if (
                !formData.requirements.trim() ||
                formData.requirements === '<p></p>'
            ) {
                toast.error('Vui lòng nhập Yêu cầu công việc!');
                return false;
            }
        }

        return true;
    };

    const handleNextStep = () => {
        if (!validateCurrentStep()) return;

        if (currentStep < JOB_FORM_STEPS.length) {
            changeStep(currentStep + 1);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep <= 1) return;

        changeStep(currentStep - 1);
    };

    const handleStepClick = (stepId: number) => {
        if (stepId >= currentStep) return;

        changeStep(stepId);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (currentStep < JOB_FORM_STEPS.length) {
            handleNextStep();
            return;
        }

        const totalWeight =
            aiWeights.skills +
            aiWeights.nlp +
            aiWeights.experience +
            aiWeights.education;

        if (totalWeight !== 100) {
            toast.error(
                `Tổng trọng số AI phải bằng 100% (Hiện tại: ${totalWeight}%)`
            );
            return;
        }

        const validReqSkills = requiredSkills
            .filter(s => s.name.trim() !== '')
            .map(s => ({
                ...s,
                weight: Number(s.weight),
                min_years: Number(s.min_years)
            }));

        if (validReqSkills.length === 0) {
            toast.error(
                'Cần ít nhất 1 Kỹ năng bắt buộc để AI chấm điểm!'
            );
            return;
        }

        if (isQuotaExceeded) {
            toast.error(
                `Đã đạt giới hạn ${maxActiveJobs} chiến dịch. Vui lòng đóng chiến dịch cũ hoặc nâng cấp gói cước!`
            );
            return;
        }

        const finalData = {
            ...formData,
            salary: isNegotiable
                ? { currency: formData.salary.currency }
                : formData.salary,
            required_skills: validReqSkills,
            preferred_skills: preferredSkills
                .filter(s => s.name.trim() !== '')
                .map(s => ({
                    ...s,
                    weight: Number(s.weight),
                    min_years: Number(s.min_years)
                }))
        };

        await onSubmit(finalData);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Step1Basic
                        formData={formData}
                        setFormData={setFormData}
                    />
                );

            case 2:
                return (
                    <Step2LocationSalary
                        formData={formData}
                        setFormData={setFormData}
                        isNegotiable={isNegotiable}
                        setIsNegotiable={setIsNegotiable}
                    />
                );

            case 3:
                return (
                    <Step3JD
                        formData={formData}
                        setFormData={setFormData}
                    />
                );

            case 4:
                return (
                    <Step4Criteria
                        formData={formData as any}
                        setFormData={setFormData as any}
                    />
                );

            case 5:
                return (
                    <Step5SkillsAI
                        formData={formData}
                        setFormData={setFormData}
                        aiWeights={aiWeights}
                        setAiWeights={setAiWeights}
                        requiredSkills={requiredSkills}
                        setRequiredSkills={setRequiredSkills}
                        preferredSkills={preferredSkills}
                        setPreferredSkills={setPreferredSkills}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <form
            onSubmit={handleFormSubmit}
            className="pb-8 space-y-8 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
            <div
                ref={formTopRef}
                className="absolute -top-24 left-0 h-0 w-0"
                aria-hidden="true"
            />

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={onCancel || (() => router.back())}
                            className="p-2 bg-slate-50 dark:bg-slate-900 rounded-full shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        </button>

                        <div>
                            <h1 className="text-2xl font-black text-slate-800 dark:text-white">
                                {mode === 'create'
                                    ? 'Tạo Chiến Dịch Mới'
                                    : 'Cập Nhật Chiến Dịch'}
                            </h1>

                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                Thiết lập bộ thông số cho AI Scoring
                            </p>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="text-xs font-bold text-slate-400">
                            BƯỚC
                        </span>

                        <span className="text-sm font-black text-primary-600 dark:text-primary-400">
                            {currentStep}
                        </span>

                        <span className="text-xs font-bold text-slate-400">
                            / {JOB_FORM_STEPS.length}
                        </span>
                    </div>
                </div>

                <div className="mt-10">
                    <div className="relative overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                        <div className="relative min-w-155 sm:min-w-0">
                            {/* Background progress line */}
                            <div className="absolute left-[10%] right-[10%] top-6 h-1 bg-slate-100 dark:bg-slate-700 rounded-full" />

                            {/* Active progress line */}
                            <div
                                className="absolute left-[10%] top-6 h-1 bg-primary-600 rounded-full transition-all duration-500 ease-out"
                                style={{
                                    width: `${((currentStep - 1) / (JOB_FORM_STEPS.length - 1)) * 80}%`
                                }}
                            />

                            <div className="relative flex justify-between">
                                {JOB_FORM_STEPS.map(step => {
                                    const Icon = step.icon;
                                    const isActive = currentStep === step.id;
                                    const isCompleted = currentStep > step.id;
                                    const isClickable = step.id < currentStep;

                                    return (
                                        <button
                                            key={step.id}
                                            type="button"
                                            disabled={!isClickable}
                                            onClick={() => handleStepClick(step.id)}
                                            className={`group flex flex-col items-center relative outline-none w-24 sm:w-auto ${isClickable
                                                ? 'cursor-pointer'
                                                : 'cursor-default'
                                                }`}
                                        >
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-4 ${isActive
                                                    ? 'bg-primary-600 text-white border-primary-100 dark:border-primary-900 shadow-lg shadow-primary-500/20 scale-110'
                                                    : isCompleted
                                                        ? 'bg-emerald-500 text-white border-emerald-100 dark:border-emerald-900 group-hover:bg-emerald-600 group-hover:scale-105'
                                                        : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-600'
                                                    }`}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircle2 className="w-6 h-6" />
                                                ) : (
                                                    <Icon className="w-5 h-5" />
                                                )}
                                            </div>

                                            <div
                                                className={`mt-3 text-center w-full ${isActive
                                                    ? 'text-primary-600 dark:text-primary-400'
                                                    : isCompleted
                                                        ? 'text-emerald-600 dark:text-emerald-500'
                                                        : 'text-slate-400 dark:text-slate-500'
                                                    }`}
                                            >
                                                <div className="text-[10px] sm:text-xs font-black leading-tight whitespace-normal">
                                                    {step.title}
                                                </div>

                                                <div className="hidden md:block text-[10px] font-medium mt-1 text-slate-400 dark:text-slate-500">
                                                    {step.description}
                                                </div>

                                                {step.id === 5 && mode === 'create' && (
                                                    <div
                                                        className={`w-fit mx-auto mt-1.5 px-2 py-0.5 rounded-md text-[8px] font-black border uppercase tracking-widest shadow-sm ${unlockBadgeConfig.bg} ${unlockBadgeConfig.text} ${unlockBadgeConfig.border}`}
                                                    >
                                                        {unlockPlanName.replace('HR ', '')}
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 min-h-100 transition-all"
            >
                {renderStepContent()}
            </div>

            <div
                className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700"
            >
                <button
                    type="button"
                    disabled={currentStep === 1}
                    onClick={handlePreviousStep}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-950 flex items-center justify-center gap-2 transition-all"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Quay lại
                </button>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span className="text-xs font-bold text-slate-400 sm:hidden">
                        Bước {currentStep} / {JOB_FORM_STEPS.length}
                    </span>

                    {currentStep < JOB_FORM_STEPS.length ? (
                        <button
                            type="button"
                            onClick={handleNextStep}
                            className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-0.5"
                        >
                            Tiếp tục
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="relative group">
                            <button
                                type="submit"
                                disabled={isSubmitting || isQuotaExceeded}
                                className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30 disabled:shadow-none flex items-center justify-center gap-2 transition-all"
                            >
                                <Save className="w-5 h-5" />
                                {isSubmitting
                                    ? 'Đang lưu...'
                                    : submitLabel || 'Hoàn tất & Lưu'}
                            </button>

                            {isQuotaExceeded && (
                                <div
                                    className="absolute bottom-full right-0 mb-2 w-max max-w-xs px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                                >
                                    Đã đạt giới hạn gói cước ({maxActiveJobs} Job)
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}