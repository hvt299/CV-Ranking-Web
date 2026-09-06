'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { companyService } from '@/features/company/company.service';

// Import các sub-components (Sẽ tạo ở bước sau)
import CompanyBrandAssets from './CompanyBrandAssets';
import CompanyStatusBanner from './CompanyStatusBanner';
import CompanyBasicInfo from './CompanyBasicInfo';
import CompanyLocation from './CompanyLocation';
import CompanyCulture from './CompanyCulture';
import CompanyGallery from './CompanyGallery';
import CompanyLegal from './CompanyLegal';
import CompanyMembers from './CompanyMembers';

export default function CompanySettingsSection({ user }: { user: any }) {
    const [activeTab, setActiveTab] = useState('info');
    const [company, setCompany] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Fetch dữ liệu khởi tạo
    useEffect(() => {
        companyService.getSettings().then(res => {
            const compData = res.data || res;
            if (!compData.location) {
                compData.location = { country: 'Việt Nam', version: 'new', province_code: '', district_code: '', ward_code: '', street_address: compData.address || '' };
            }
            setCompany(compData);
            setIsLoading(false);
        }).catch(() => {
            toast.error("Lỗi khi tải dữ liệu doanh nghiệp");
            setIsLoading(false);
        });
    }, []);

    // 2. Logic Lưu thông tin
    const handleSaveCompany = async () => {
        setIsSaving(true);
        try {
            const payload = {
                tax_code: company.tax_code,
                name: company.name,
                industries: company.industries || [],
                size: company.size,
                website: company.website,
                location: company.location,
                address: company.location?.street_address,
                license_file_url: company.license_file_url,
                description: company.description,
                gallery_urls: company.gallery_urls || [],
                benefits: company.benefits || [],
                social_links: company.social_links || { facebook: '', linkedin: '', youtube: '' },
                logo_url: company.logo_url, // Bổ sung trường logo
                banner_url: company.banner_url // Bổ sung trường banner
            };

            const res = await companyService.updateSettings(payload);
            setCompany((prev: any) => ({
                ...prev, ...payload, status: res.new_company_status || prev.status, updated_at: new Date().toISOString()
            }));
            toast.success("Đã cập nhật thông tin công ty thành công!");
        } catch (e: any) {
            toast.error(e.response?.data?.detail || "Lỗi khi lưu thông tin");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
    if (!company) return null;

    return (
        <div className="space-y-6">
            {/* THIẾT KẾ TAB ĐIỀU HƯỚNG MỚI (Dạng Pill hiện đại) */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <button
                    onClick={() => setActiveTab('info')}
                    className={`px-5 py-2 font-bold text-sm rounded-xl transition-colors ${activeTab === 'info' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    Hồ sơ Doanh nghiệp
                </button>
                <button
                    onClick={() => setActiveTab('members')}
                    className={`px-5 py-2 font-bold text-sm rounded-xl transition-colors ${activeTab === 'members' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    Đội ngũ & Phân quyền
                </button>
            </div>

            {/* TAB HỒ SƠ DOANH NGHIỆP */}
            {activeTab === 'info' && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 space-y-8 animate-in fade-in">

                    <CompanyStatusBanner status={company.status} />

                    <CompanyBrandAssets company={company} setCompany={setCompany} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <CompanyBasicInfo company={company} setCompany={setCompany} />

                        <CompanyLocation company={company} setCompany={setCompany} />

                        <CompanyCulture company={company} setCompany={setCompany} />

                        <CompanyGallery company={company} setCompany={setCompany} />

                        <CompanyLegal company={company} setCompany={setCompany} />
                    </div>

                    <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-slate-700">
                        <button onClick={handleSaveCompany} disabled={isSaving} className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 flex items-center gap-2 shadow-lg shadow-primary-500/30 transition-all disabled:opacity-70">
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </div>
            )}

            {/* TAB QUẢN LÝ NHÂN SỰ */}
            {activeTab === 'members' && (
                <CompanyMembers user={user} companyId={company.id} />
            )}
        </div>
    );
}