import { CompanyStatus } from "./common";

export interface Company {
    id: string;
    name: string;
    tax_code: string;
    owner_user_id: string;
    status: CompanyStatus;
    rejection_reason?: string;
    industry?: string;
    size?: string;
    website?: string;
    address?: string;
    license_file_url?: string;
    verified_at?: string;
    verified_by_admin_id?: string;
    created_at: string;
    updated_at?: string;
}

export interface Department {
    id: string;
    company_id: string;
    name: string;
    created_at: string;
}