'use client';

import { useState } from 'react';
import { Briefcase, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { companyService } from '@/features/company/company.service';

export default function CompanyLegal({ company, setCompany }: { company: any, setCompany: any }) {
    const [isUploadingLicense, setIsUploadingLicense] = useState(false);

    const handleLicenseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingLicense(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await companyService.uploadFile(formData);
            setCompany((prev: any) => ({ ...prev, license_file_url: res.file_url || res.url }));
            toast.success('Tải giấy phép lên thành công!');
        } catch (error) {
            toast.error('Lỗi khi tải file lên');
        } finally {
            setIsUploadingLicense(false);
        }
    };

    return (
        <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Giấy phép kinh doanh</label>
            <input
                type="text"
                value={company.license_file_url || ""}
                onChange={(e) => setCompany({ ...company, license_file_url: e.target.value })}
                placeholder="https://res.cloudinary.com/..."
                className="w-full mb-4 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-medium outline-none focus:border-primary-500 transition-colors"
            />

            <label
                className={`group flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 transition-all hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 ${isUploadingLicense ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    if (isUploadingLicense) return;
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleLicenseUpload({ target: { files: [file] } } as any);
                }}
            >
                <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={handleLicenseUpload} disabled={isUploadingLicense} />
                {isUploadingLicense ? (
                    <Loader2 className="w-12 h-12 text-primary-500 mb-4 animate-spin" />
                ) : (
                    <Briefcase className="w-12 h-12 text-primary-500 mb-4 group-hover:scale-110 transition-transform" />
                )}

                <p className="font-bold text-slate-700 dark:text-slate-200">{isUploadingLicense ? "Đang tải lên..." : "Kéo & thả file vào đây"}</p>
                {!isUploadingLicense && (
                    <>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">hoặc <span className="text-primary-600 font-bold">bấm để chọn file</span></p>
                        <p className="mt-2 text-xs text-slate-400 font-medium">PDF, JPG, PNG • Tối đa 10MB</p>
                    </>
                )}
                {company.license_file_url && (
                    <a href={company.license_file_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary-600 hover:underline mt-4 inline-block relative z-10 bg-white dark:bg-slate-800 px-4 py-1.5 rounded-lg shadow-sm" onClick={(e) => e.stopPropagation()}>Xem file hiện tại</a>
                )}
            </label>
        </div>
    );
}