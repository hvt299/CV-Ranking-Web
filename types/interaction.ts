import { AlertFrequency, RecommendationEnum } from './common';

export interface CompanyReviewCreate {
    company_id: string;
    is_anonymous: boolean;
    rating: number;
    comment?: string;
}

export interface SavedJobCreate {
    job_id: string;
}

export interface JobAlertCreate {
    search_criteria: Record<string, any>;
    frequency: AlertFrequency;
    is_active: boolean;
}

export interface JobAlertUpdate {
    search_criteria?: Record<string, any>;
    frequency?: AlertFrequency;
    is_active?: boolean;
}

export interface InterviewFeedbackCreate {
    application_id: string;
    overall_rating: number;
    strengths?: string;
    concerns?: string;
    recommendation: RecommendationEnum;
}