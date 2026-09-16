'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/features/admin/admin.service';
import { Sliders, Loader2, Save, CreditCard, Zap, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSystemSettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchSettings = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getSystemSettings();
            setSettings(data.data || data);
        } catch (e) {
            toast.error('Không thể tải cấu hình hệ thống');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await adminService.updateSystemSettings(settings);
            toast.success('Lưu cấu hình thành công');
        } catch {
            toast.error('Lỗi khi lưu cấu hình');
        } finally {
            setIsSaving(false);
        }
    };

    const updatePaymentConfig = (key: string, value: string) => {
        setSettings({
            ...settings,
            payment_config: {
                ...settings.payment_config,
                [key]: value
            }
        });
    };

    const updateActionCost = (key: string, value: string) => {
        setSettings({
            ...settings,
            action_costs: {
                ...settings.action_costs,
                [key]: Number(value)
            }
        });
    };

    const updateIndustryWeight = (industry: string, index: number, value: string) => {
        const newWeights = [...settings.industry_weights[industry]];
        newWeights[index] = Number(value);
        setSettings({
            ...settings,
            industry_weights: {
                ...settings.industry_weights,
                [industry]: newWeights
            }
        });
    };

    if (isLoading) {
        return (
            <div className="py-20 flex justify-center items-center text-slate-500 animate-in fade-in">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!settings) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        Cấu hình Hệ thống
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Điều chỉnh các trọng số thuật toán AI, cấu hình thanh toán hệ thống.</p>
                </div>
                <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-sm hover:shadow-md"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Lưu thay đổi
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Payment Config */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-500">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Cấu hình Thanh toán VietQR</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Mã Ngân hàng (BIN / Tên viết tắt)</label>
                            <input 
                                type="text" 
                                value={settings.payment_config.bank_id || ''} 
                                onChange={(e) => updatePaymentConfig('bank_id', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white"
                                placeholder="VD: MB, VCB, 970422"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Số tài khoản</label>
                            <input 
                                type="text" 
                                value={settings.payment_config.account_no || ''} 
                                onChange={(e) => updatePaymentConfig('account_no', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white font-mono"
                            />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tên chủ tài khoản</label>
                            <input 
                                type="text" 
                                value={settings.payment_config.account_name || ''} 
                                onChange={(e) => updatePaymentConfig('account_name', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white uppercase"
                            />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Template VietQR</label>
                            <select 
                                value={settings.payment_config.template || 'compact2'} 
                                onChange={(e) => updatePaymentConfig('template', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white"
                            >
                                <option value="compact">Compact (Nhỏ gọn)</option>
                                <option value="compact2">Compact 2 (Nhỏ gọn kèm logo)</option>
                                <option value="qr_only">QR Only (Chỉ có mã QR)</option>
                                <option value="print">Print (Khổ giấy lớn)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Action Costs */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-500">
                            <Zap className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Chi phí Tính năng (Credits)</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(settings.action_costs || {}).map(([action, cost]) => (
                            <div key={action} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 truncate" title={action}>{action}</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number" 
                                        value={String(cost)} 
                                        onChange={(e) => updateActionCost(action, e.target.value)}
                                        className="flex-1 w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-bold dark:text-white text-primary-600 font-mono"
                                        min="0"
                                    />
                                    <span className="text-xs font-bold text-slate-400">Credits</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Industry Weights */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500">
                        <BarChart2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Trọng số AI theo Ngành nghề (Industry Weights)</h2>
                        <p className="text-xs text-slate-500 mt-1">Các chỉ số tổng = 1.0 sẽ cho kết quả chuẩn xác nhất.</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="p-4 pl-6 w-48">Ngành nghề</th>
                                <th className="p-4 w-32">Kỹ năng (Skill)</th>
                                <th className="p-4 w-32">Độ khớp (NLP)</th>
                                <th className="p-4 w-32">Kinh nghiệm</th>
                                <th className="p-4 w-32">Học vấn (Edu)</th>
                                <th className="p-4 w-32">Ngưỡng Alpha</th>
                                <th className="p-4 pr-6 w-24 text-right">Tổng (Check)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {Object.entries(settings.industry_weights || {}).map(([industry, weights]: [string, any]) => {
                                const w = Array.isArray(weights) ? weights : [0,0,0,0,0];
                                const sum = Number((w[0] + w[1] + w[2] + w[3]).toFixed(2));
                                const isPerfect = sum === 1.0;
                                return (
                                    <tr key={industry} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="p-4 pl-6 font-bold text-sm text-slate-700 dark:text-slate-300">{industry}</td>
                                        {[0, 1, 2, 3, 4].map(idx => (
                                            <td key={idx} className="p-3">
                                                <input 
                                                    type="number"
                                                    step="0.05"
                                                    min="0"
                                                    max="1"
                                                    value={w[idx]}
                                                    onChange={(e) => updateIndustryWeight(industry, idx, e.target.value)}
                                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-primary-500 text-sm font-medium dark:text-white text-center"
                                                />
                                            </td>
                                        ))}
                                        <td className="p-4 pr-6 text-right">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isPerfect ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                                {sum}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
