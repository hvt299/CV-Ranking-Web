'use client';

import { useState } from 'react';
import { Camera, Building2, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { companyService } from '@/features/company/company.service';

export default function CompanyBrandAssets({ company, setCompany }: { company: any, setCompany: any }) {
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const [isUploadingBanner, setIsUploadingBanner] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
        const file = e.target.files?.[0];
        if (!file) return;

        type === 'logo' ? setIsUploadingLogo(true) : setIsUploadingBanner(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await companyService.uploadFile(formData);
            const url = res.file_url || res.url;
            setCompany((prev: any) => ({ ...prev, [type === 'logo' ? 'logo_url' : 'banner_url']: url }));
            toast.success(`Đã tải ${type === 'logo' ? 'Logo' : 'Ảnh bìa'} lên thành công!`);
        } catch (error) {
            toast.error('Lỗi khi tải ảnh lên');
        } finally {
            type === 'logo' ? setIsUploadingLogo(false) : setIsUploadingBanner(false);
        }
    };

    return (
        <div className="relative mb-12 rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            {/* Banner */}
            <div className="h-48 md:h-64 w-full relative group bg-slate-100 dark:bg-slate-800 rounded-t-3xl overflow-hidden">
                {company.banner_url ? (
                    <img src={company.banner_url} className="w-full h-full object-cover" alt="Banner" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600"><ImageIcon className="w-10 h-10" /></div>
                )}
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold gap-2">
                    <Camera className="w-5 h-5" /> Thay ảnh bìa
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'banner')} disabled={isUploadingBanner} />
                </label>
                {isUploadingBanner && <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center"><Loader2 className="w-8 h-8 text-white animate-spin" /></div>}
            </div>

            {/* Logo */}
            <div className="absolute -bottom-10 left-8">
                <div className="w-24 h-24 md:w-28 md:h-28 bg-white dark:bg-slate-900 rounded-2xl border-4 border-white dark:border-slate-800 shadow-md relative group overflow-hidden flex items-center justify-center">
                    {company.logo_url ? (
                        <img src={company.logo_url} className="w-full h-full object-contain p-2" alt="Logo" />
                    ) : (
                        <Building2 className="w-10 h-10 text-slate-300" />
                    )}
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                        <Camera className="w-6 h-6" />
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo')} disabled={isUploadingLogo} />
                    </label>
                    {isUploadingLogo && <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center"><Loader2 className="w-6 h-6 text-white animate-spin" /></div>}
                </div>
            </div>
        </div>
    );
}