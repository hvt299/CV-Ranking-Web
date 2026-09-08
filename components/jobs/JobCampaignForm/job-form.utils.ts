import { Job, JobFormData, JobPayload, FilterRequirement, ScoreWeights, AiWeights } from '@/types';

export function normalizeFilterRequirements(items: unknown[] | null | undefined): FilterRequirement[] {
    return (items ?? [])
        .map((item): FilterRequirement | null => {
            if (typeof item === 'string') {
                const name = item.trim();
                if (!name) return null;
                return { name, is_knockout: true };
            }

            if (typeof item === 'object' && item !== null && 'name' in item) {
                const record = item as Record<string, unknown>;
                const name = String(record.name ?? '').trim();
                if (!name) return null;
                return {
                    name,
                    is_knockout: typeof record.is_knockout === 'boolean' ? record.is_knockout : Boolean(record.is_knockout),
                };
            }
            return null;
        })
        .filter((item): item is FilterRequirement => item !== null);
}

export function toApiScoreWeights(aiWeights: AiWeights): ScoreWeights {
    return {
        skills_weight: aiWeights.skills / 100,
        nlp_weight: aiWeights.nlp / 100,
        experience_weight: aiWeights.experience / 100,
        education_weight: aiWeights.education / 100,
    };
}

export function fromApiScoreWeights(weights?: ScoreWeights | null): AiWeights {
    return {
        skills: Math.round((weights?.skills_weight ?? 0.4) * 100),
        nlp: Math.round((weights?.nlp_weight ?? 0.3) * 100),
        experience: Math.round((weights?.experience_weight ?? 0.2) * 100),
        education: Math.round((weights?.education_weight ?? 0.1) * 100),
    };
}

export function createInitialJobFormData(): JobFormData {
    return {
        title: '', industry: '', job_level: 'Middle', employment_type: 'Full-time', work_mode: 'Office', headcount: 1,
        deadline: '', probation_period: '2 tháng', gender_requirement: 'Không yêu cầu',
        languages: [],
        required_certifications: [],
        min_yoe: 0, education: { min_level: 'Không yêu cầu', preferred_majors: [] },
        salary: { min_salary: 10000000, max_salary: 30000000, currency: 'VND' },
        working_hours: '08:00 - 17:30, Thứ 2 - Thứ 6', location: { province_name: '', street_address: '', country: 'Việt Nam' },
        description: '', requirements: '', benefits: '', other_info: '',
        jd_file_url: '',
        required_skills: [{ skill_id: null, name: '', weight: 0.5, min_years: 0, is_knockout: true }],
        preferred_skills: [{ skill_id: null, name: '', weight: 0.2, min_years: 0, is_knockout: false }],
        aiWeights: { skills: 40, nlp: 30, experience: 20, education: 10 }
    };
}

export function mapJobToFormData(job: Job): JobFormData {
    return {
        title: job.title || '',
        industry: job.industry || '',
        job_level: job.job_level || 'Middle',
        employment_type: job.employment_type || 'Full-time',
        work_mode: job.work_mode || 'Office',
        headcount: job.headcount || 1,
        deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
        probation_period: job.probation_period || '2 tháng',
        gender_requirement: job.gender_requirement || 'Không yêu cầu',
        languages: normalizeFilterRequirements(job.languages),
        required_certifications: normalizeFilterRequirements(job.required_certifications),
        min_yoe: job.min_yoe || 0,
        education: {
            min_level: job.education?.min_level || 'Không yêu cầu',
            preferred_majors: job.education?.preferred_majors || []
        },
        salary: job.salary || { currency: 'VND' },
        working_hours: job.working_hours || '08:00 - 17:30, Thứ 2 - Thứ 6',
        location: job.location || { country: 'Việt Nam' },
        description: job.description || '',
        requirements: job.requirements || '',
        benefits: job.benefits || '',
        other_info: job.other_info || '',
        jd_file_url: job.jd_file_url || '',
        required_skills: (job.required_skills || []).map(s => ({
            skill_id: s.skill_id || null,
            name: s.name,
            weight: s.weight ?? 0.5,
            min_years: s.min_years ?? 0,
            is_knockout: s.is_knockout ?? true
        })),
        preferred_skills: (job.preferred_skills || []).map(s => ({
            skill_id: s.skill_id || null,
            name: s.name,
            weight: s.weight ?? 0.2,
            min_years: s.min_years ?? 0,
            is_knockout: s.is_knockout ?? false
        })),
        aiWeights: fromApiScoreWeights(job.score_weights),
        is_hot: typeof job.is_hot === 'string' ? job.is_hot === 'true' : Boolean(job.is_hot),
        is_hot_until: job.is_hot_until
    };
}

export function mapFormDataToJobPayload(formData: JobFormData, company_id?: string): JobPayload {
    const validReqSkills = formData.required_skills.filter(s => s.name.trim() !== '').map(s => ({ ...s, weight: Number(s.weight), min_years: Number(s.min_years) }));
    const validPrefSkills = formData.preferred_skills.filter(s => s.name.trim() !== '').map(s => ({ ...s, weight: Number(s.weight), min_years: Number(s.min_years) }));

    return {
        ...formData,
        company_id: company_id || '',
        deadline: formData.deadline ? new Date(`${formData.deadline}T23:59:59Z`).toISOString() : undefined,
        required_skills: validReqSkills,
        preferred_skills: validPrefSkills,
        score_weights: toApiScoreWeights(formData.aiWeights),
        salary: formData.salary.min_salary === undefined && formData.salary.max_salary === undefined ? undefined : formData.salary,
        is_hot: formData.is_hot,
        is_hot_until: formData.is_hot_until
    };
}
