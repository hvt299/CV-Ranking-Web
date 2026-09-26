'use client';

import { BrainCircuit, GraduationCap, Zap, CheckCircle2, User, Star, Lock } from 'lucide-react';
import { Job } from '@/types';
import { useSubscription } from '@/hooks/useSubscription';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { getTierBadgeConfig } from '@/utils/tier-colors';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import ProFeatureLock from '@/components/shared/ProFeatureLock';

interface TabAIConfigProps {
    jobInfo: Job;
}

export default function TabAIConfig({ jobInfo }: TabAIConfigProps) {
    const { data: myPlanRes } = useSubscription();
    const { data: plansRes } = useSubscriptionPlans('hr');

    const currentPlanCode = myPlanRes?.data?.current_plan_code || 'hr_free';
    const currentPlan = plansRes?.data?.find((p: any) => p.plan_code === currentPlanCode);
    const canCustomizeAI = currentPlan?.features?.can_customize_ai_weights || false;

    const unlockPlan = plansRes?.data?.find((p: any) => p.features?.can_customize_ai_weights);
    const unlockPlanName = unlockPlan?.name || 'Enterprise';
    const unlockTierConfig = getTierBadgeConfig(unlockPlan?.tier_level || 3);
    const userPlanColor = getTierBadgeConfig(currentPlan?.tier_level || 0);

    if (!jobInfo) return null;

    const aiWeights = {
        skills: Math.round((jobInfo.score_weights?.skills_weight || 0.4) * 100),
        nlp: Math.round((jobInfo.score_weights?.nlp_weight || 0.3) * 100),
        experience: Math.round((jobInfo.score_weights?.experience_weight || 0.2) * 100),
        education: Math.round((jobInfo.score_weights?.education_weight || 0.1) * 100),
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-6">
            {/* PHÂN BỔ TRỌNG SỐ AI */}
            <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 min-w-0">
                        <BrainCircuit className="w-5 h-5 text-blue-500 shrink-0" />
                        <h3 className="text-base font-black text-slate-800 dark:text-white tracking-wide">Phân bổ Trọng số Thuật toán AI</h3>

                        {canCustomizeAI ? (
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm border ml-1 shrink-0 ${userPlanColor.bg} ${userPlanColor.text} ${userPlanColor.border}`}>
                                {currentPlan?.name || 'Đã mở khóa'}
                            </span>
                        ) : (
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm border ml-1 shrink-0 ${unlockTierConfig.bg} ${unlockTierConfig.text} ${unlockTierConfig.border}`}>
                                {unlockPlanName.replace('HR ', '')}
                            </span>
                        )}
                    </div>

                    {!canCustomizeAI && (
                        <Link href={ROUTES.HR_BILLING} className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800/30 transition-colors w-fit shrink-0">
                            <Lock className="w-3.5 h-3.5" />
                            Mở khóa quyền tùy chỉnh
                        </Link>
                    )}
                </div>

                <div className={`relative w-full rounded-3xl overflow-hidden ${!canCustomizeAI ? 'min-h-90 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm p-6 md:p-10 flex flex-col justify-center' : ''}`}>
                    {!canCustomizeAI && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 sm:p-8 bg-white/60 dark:bg-slate-900/80 backdrop-blur-md">
                            <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 sm:p-4">
                                <ProFeatureLock
                                    title="Mở khóa Tinh chỉnh AI"
                                    description="Tự do can thiệp vào bộ não của hệ thống để xem tỷ trọng chi tiết và thay đổi linh hoạt theo nhu cầu tuyển dụng."
                                    requiredTierName={unlockPlanName.replace('HR ', '')}
                                    requiredTierLevel={unlockPlan?.tier_level || 3}
                                />
                            </div>
                        </div>
                    )}

                    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 transition-all w-full ${!canCustomizeAI ? 'filter blur-[5px] pointer-events-none select-none opacity-40' : ''}`}>
                        <WeightCard label="Kỹ năng" value={aiWeights.skills} color="primary" />
                        <WeightCard label="Ngữ nghĩa" value={aiWeights.nlp} color="indigo" />
                        <WeightCard label="Kinh nghiệm" value={aiWeights.experience} color="emerald" />
                        <WeightCard label="Học vấn" value={aiWeights.education} color="amber" />
                    </div>
                </div>
            </section>

            {/* KỸ NĂNG + TIÊU CHÍ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                <section className="flex flex-col min-w-0">
                    <SectionTitle icon={Zap} iconClass="text-primary-500" title="Kỹ năng Truy vấn (Vector)" />

                    <div className="mt-4 flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-7">
                        <div>
                            <FieldTitle icon={CheckCircle2} iconClass="text-emerald-500" title="Kỹ năng bắt buộc" suffix="MUST-HAVE" />

                            {jobInfo.required_skills && jobInfo.required_skills.length > 0 ? (
                                <div className="space-y-2.5">
                                    {jobInfo.required_skills.map((skill: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 min-w-0">{skill.name}</span>

                                            <div className="flex items-center gap-2 shrink-0 text-[10px] font-black">
                                                {(skill.min_years ?? 0) > 0 && (
                                                    <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-md">{skill.min_years} năm</span>
                                                )}

                                                <span className="bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded-md">Trọng số: {skill.weight}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState text="Không có yêu cầu." />
                            )}
                        </div>

                        <div>
                            <FieldTitle icon={Star} iconClass="text-amber-500" title="Kỹ năng ưu tiên" suffix="ĐIỂM CỘNG" />

                            {jobInfo.preferred_skills && jobInfo.preferred_skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {jobInfo.preferred_skills.map((skill: any, idx: number) => (
                                        <span key={idx} className="px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1.5">
                                            {skill.name}
                                            <span className="text-[10px] text-slate-400">({skill.weight})</span>
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState text="Không có yêu cầu." />
                            )}
                        </div>
                    </div>
                </section>

                <section className="flex flex-col min-w-0">
                    <SectionTitle icon={GraduationCap} iconClass="text-emerald-500" title="Tiêu chí Sàng lọc cứng" />

                    <div className="mt-4 flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                        <CriteriaRow label="Kinh nghiệm tối thiểu" value={`${jobInfo.min_yoe || 0} năm`} />

                        <CriteriaRow
                            label="Giới tính"
                            value={jobInfo.gender_requirement || 'Không yêu cầu'}
                            icon={<User className="w-3.5 h-3.5 text-slate-400" />}
                        />

                        <CriteriaRow label="Học vấn tối thiểu" value={jobInfo.education?.min_level || 'Không yêu cầu'} />

                        {jobInfo.education?.preferred_majors && jobInfo.education.preferred_majors.length > 0 && (
                            <TagCriteria label="Chuyên ngành ưu tiên" tags={jobInfo.education.preferred_majors} />
                        )}

                        {jobInfo.languages && jobInfo.languages.length > 0 && (
                            <TagCriteria label="Ngoại ngữ" tags={jobInfo.languages.map((lang: any) => lang?.name || lang)} tone="blue" />
                        )}

                        {jobInfo.required_certifications && jobInfo.required_certifications.length > 0 && (
                            <TagCriteria
                                label="Chứng chỉ chuyên môn"
                                tags={jobInfo.required_certifications.map((cert: any) => cert?.name || cert)}
                                tone="amber"
                                last
                            />
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

function WeightCard({ label, value, color }: { label: string; value: number; color: 'primary' | 'indigo' | 'emerald' | 'amber' }) {
    const styles = {
        primary: { bar: 'bg-primary-500', value: 'text-primary-600 dark:text-primary-400' },
        indigo: { bar: 'bg-indigo-500', value: 'text-indigo-600 dark:text-indigo-400' },
        emerald: { bar: 'bg-emerald-500', value: 'text-emerald-600 dark:text-emerald-400' },
        amber: { bar: 'bg-amber-500', value: 'text-amber-500 dark:text-amber-400' },
    };

    const style = styles[color];

    return (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className={`absolute bottom-0 left-0 h-1 ${style.bar} transition-all`} style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-3xl font-black ${style.value}`}>{value}%</p>
        </div>
    );
}

function SectionTitle({ icon: Icon, iconClass, title }: { icon: typeof Zap; iconClass: string; title: string }) {
    return (
        <div className="h-9 flex items-center gap-2 shrink-0">
            <Icon className={`w-5 h-5 ${iconClass}`} />
            <h3 className="text-base font-black text-slate-800 dark:text-white tracking-wide">{title}</h3>
        </div>
    );
}

function FieldTitle({ icon: Icon, iconClass, title, suffix }: { icon: typeof CheckCircle2; iconClass: string; title: string; suffix?: string }) {
    return (
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
            <Icon className={`w-4 h-4 ${iconClass}`} />
            <span>{title}</span>
            {suffix && <span className="text-[10px] font-semibold text-slate-400">({suffix})</span>}
        </p>
    );
}

function CriteriaRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
            <span className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5 text-right">{icon}{value}</span>
        </div>
    );
}

function TagCriteria({ label, tags, tone = 'slate', last = false }: { label: string; tags: string[]; tone?: 'slate' | 'blue' | 'amber'; last?: boolean }) {
    const toneStyles = {
        slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
        blue: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50',
        amber: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50',
    };

    return (
        <div className={`py-3 ${!last ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}>
            <span className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{label}</span>

            <div className="flex flex-wrap gap-1.5">
                {tags.map((tag, idx) => (
                    <span key={`${tag}-${idx}`} className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border ${toneStyles[tone]}`}>
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return <p className="text-sm italic text-slate-400">{text}</p>;
}