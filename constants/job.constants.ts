import { ApplicationStatus } from "@/types";

export const INDUSTRIES = [
    { label: 'Kinh doanh/Bán hàng', value: 'sales' },
    { label: 'Marketing/PR/Quảng cáo', value: 'marketing' },
    { label: 'Chăm sóc khách hàng/Vận hành', value: 'customer_service' },
    { label: 'Nhân sự/Hành chính/Pháp chế', value: 'hr_admin_legal' },
    { label: 'Công nghệ Thông tin', value: 'it' },
    { label: 'Lao động phổ thông', value: 'labor' },
    { label: 'Tài chính/Ngân hàng/Bảo hiểm', value: 'finance' },
    { label: 'Bất động sản', value: 'realestate' },
    { label: 'Xây dựng', value: 'construction' },
    { label: 'Kế toán/Kiểm toán/Thuế', value: 'accounting' },
    { label: 'Sản xuất', value: 'manufacturing' },
    { label: 'Giáo dục/Đào tạo', value: 'education' },
    { label: 'Bán lẻ/Dịch vụ đời sống', value: 'retail_lifestyle' },
    { label: 'Phim/Truyền hình/Báo chí/Xuất bản', value: 'media_publishing' },
    { label: 'Điện/Điện tử/Viễn thông', value: 'electronics_telecom' },
    { label: 'Logistics/Thu mua/Kho/Vận tải', value: 'logistics' },
    { label: 'Tư vấn chuyên môn', value: 'consulting' },
    { label: 'Dược/Y tế/Sức khoẻ/Công nghệ sinh học', value: 'healthcare' },
    { label: 'Thiết kế', value: 'design' },
    { label: 'Nhà hàng/Khách sạn/Du lịch', value: 'hospitality' },
    { label: 'Năng lượng/Môi trường/Nông nghiệp', value: 'energy_agriculture' },
    { label: 'Tài xế', value: 'driver' },
    { label: 'Biên phiên dịch', value: 'translation' },
    { label: 'Luật', value: 'law' },
    { label: 'Nhóm nghề khác', value: 'other' }
];

export const JOB_LEVELS = [
    { value: 'Intern', label: 'Thực tập sinh (Intern)' },
    { value: 'Fresher', label: 'Mới tốt nghiệp (Fresher)' },
    { value: 'Junior', label: 'Nhân viên (Junior)' },
    { value: 'Middle', label: 'Chuyên viên (Middle)' },
    { value: 'Senior', label: 'Chuyên viên cao cấp (Senior)' },
    { value: 'Lead', label: 'Trưởng nhóm (Lead)' },
    { value: 'Manager', label: 'Quản lý (Manager)' },
    { value: 'Director', label: 'Giám đốc (Director)' },
    { value: 'Executive', label: 'Điều hành cấp cao (C-Level)' },
];

export const EMPLOYMENT_TYPES = [
    { value: 'Full-time', label: 'Toàn thời gian (Full-time)' },
    { value: 'Part-time', label: 'Bán thời gian (Part-time)' },
    { value: 'Contract', label: 'Hợp đồng (Contract)' },
    { value: 'Freelance', label: 'Tự do (Freelance)' },
    { value: 'Temporary', label: 'Thời vụ (Temporary)' },
];

export const WORK_MODES = [
    { value: 'Onsite', label: 'Làm tại văn phòng' },
    { value: 'Hybrid', label: 'Kết hợp (Hybrid)' },
    { value: 'Remote', label: 'Làm từ xa (Remote)' },
];

export const CV_STATUSES = [
    { value: ApplicationStatus.NEW, label: 'Mới nộp', color: 'bg-blue-100 text-blue-700' },
    { value: ApplicationStatus.REVIEWING, label: 'Đang xem xét', color: 'bg-amber-100 text-amber-700' },
    { value: ApplicationStatus.INTERVIEW, label: 'Phỏng vấn', color: 'bg-purple-100 text-purple-700' },
    { value: ApplicationStatus.OFFERED, label: 'Đề nghị (Offer)', color: 'bg-indigo-100 text-indigo-700' },
    { value: ApplicationStatus.HIRED, label: 'Trúng tuyển', color: 'bg-emerald-100 text-emerald-700' },
    { value: ApplicationStatus.REJECTED, label: 'Từ chối', color: 'bg-rose-100 text-rose-700' },
    { value: ApplicationStatus.WITHDRAWN, label: 'Đã rút hồ sơ', color: 'bg-slate-100 text-slate-500' },
];

export const SALARY_RANGES = [
    { value: '', label: 'Tất cả mức lương' },
    { value: 'negotiable', label: 'Thỏa thuận' },
    { value: '0-10000000', label: 'Dưới 10 triệu' },
    { value: '10000000-15000000', label: '10 - 15 triệu' },
    { value: '15000000-20000000', label: '15 - 20 triệu' },
    { value: '20000000-30000000', label: '20 - 30 triệu' },
    { value: '30000000-50000000', label: '30 - 50 triệu' },
    { value: '50000000-70000000', label: '50 - 70 triệu' },
    { value: '70000000-100000000', label: '70 - 100 triệu' },
    { value: '100000000-999999999', label: 'Trên 100 triệu' }
];

export const EXPERIENCE_RANGES = [
    { value: '', label: 'Tất cả kinh nghiệm' },
    { value: 'none', label: 'Không yêu cầu' },
    { value: 'intern', label: 'Thực tập sinh (Intern)' },
    { value: 'fresher', label: 'Mới tốt nghiệp (Fresher)' },
    { value: '0-1', label: 'Dưới 1 năm' },
    { value: '1-2', label: '1 - 2 năm' },
    { value: '2-3', label: '2 - 3 năm' },
    { value: '3-5', label: '3 - 5 năm' },
    { value: '5-7', label: '5 - 7 năm' },
    { value: '7-99', label: 'Trên 7 năm' }
];

export const EDUCATION_LEVELS = [
    { value: 'Không yêu cầu', label: 'Không yêu cầu tối thiểu' },
    { value: 'Trung cấp', label: 'Trung cấp trở lên' },
    { value: 'Cao đẳng', label: 'Cao đẳng trở lên' },
    { value: 'Cử nhân', label: 'Cử nhân / Đại học trở lên' },
    { value: 'Thạc sĩ', label: 'Thạc sĩ trở lên' },
];

export const GENDER_OPTIONS = [
    { value: 'Không yêu cầu', label: 'Không yêu cầu' },
    { value: 'Nam', label: 'Nam' },
    { value: 'Nữ', label: 'Nữ' }
];

// Tự động gom nhóm dựa trên data gốc, an toàn 100% không làm hỏng các form Create/Edit Job
export const GROUPED_INDUSTRIES = [
    {
        label: "Khối Kinh doanh & Vận hành",
        options: INDUSTRIES.filter(i => ['sales', 'marketing', 'customer_service', 'retail_lifestyle', 'logistics'].includes(i.value))
    },
    {
        label: "Khối Kỹ thuật & Công nghệ",
        options: INDUSTRIES.filter(i => ['it', 'electronics_telecom', 'manufacturing', 'construction', 'energy_agriculture'].includes(i.value))
    },
    {
        label: "Khối Chuyên môn & Khác",
        options: INDUSTRIES.filter(i => !['sales', 'marketing', 'customer_service', 'retail_lifestyle', 'logistics', 'it', 'electronics_telecom', 'manufacturing', 'construction', 'energy_agriculture'].includes(i.value))
    }
];