'use client';

import { useState, useEffect, useRef } from 'react';
import { adminService } from '@/features/admin/admin.service';
import { Sliders, Loader2, Save, CreditCard, Zap, BarChart2, Check, QrCode, ChevronDown, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/utils/utils';

export default function AdminSystemSettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [banks, setBanks] = useState<any[]>([]);

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
        
        // Fetch VietQR banks list
        fetch('https://api.vietqr.io/v2/banks')
            .then(res => res.json())
            .then(data => {
                if (data.code === '00' && data.data) {
                    setBanks(data.data);
                }
            })
            .catch(console.error);
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

    // Helper for QR Preview
    const { bank_id = '', account_no = '', account_name = '', template = 'compact2' } = settings.payment_config || {};
    const safeAccountName = encodeURIComponent(account_name || 'NGUYEN VAN A');
    const qrPreviewUrl = `https://img.vietqr.io/image/${bank_id || '970422'}-${account_no || '123456789'}-${template}.png?amount=50000&addInfo=ThanhToanGoiCuoc&accountName=${safeAccountName}`;
    
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
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-sm hover:shadow-md shrink-0"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Lưu thay đổi
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Payment Config */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col col-span-1 lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-500">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Cấu hình Thanh toán VietQR</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sử dụng Quick Link từ NAPAS VietQR để tạo mã thanh toán tự động</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Form Inputs */}
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Ngân hàng thụ hưởng</label>
                                <BankSelect 
                                    banks={banks} 
                                    value={bank_id} 
                                    onChange={(val) => updatePaymentConfig('bank_id', val)} 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Số tài khoản</label>
                                <input 
                                    type="text" 
                                    value={account_no} 
                                    onChange={(e) => updatePaymentConfig('account_no', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white font-mono uppercase"
                                    placeholder="VD: 113366668888"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tên chủ tài khoản</label>
                                <input 
                                    type="text" 
                                    value={account_name} 
                                    onChange={(e) => updatePaymentConfig('account_name', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white uppercase"
                                    placeholder="VD: NGUYEN VAN A"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Giao diện (Template VietQR)</label>
                                <div className="relative">
                                    <select 
                                        value={template} 
                                        onChange={(e) => updatePaymentConfig('template', e.target.value)}
                                        className="w-full px-4 py-3 pr-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 text-sm font-medium dark:text-white cursor-pointer appearance-none"
                                    >
                                        <option value="compact">compact - Mã QR + logo VietQR & Napas</option>
                                        <option value="compact2">compact2 - Mã QR + Logo + Thông tin CK (Khuyên dùng)</option>
                                        <option value="qr_only">qr_only - Đơn giản, chỉ mã QR</option>
                                        <option value="print">print - Khổ giấy lớn đầy đủ thông tin</option>
                                        <option value="loax">loax - Loa thanh toán</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <div className="border-solid border-t-slate-500 border-t-4 border-x-transparent border-x-4 border-b-0"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* QR Preview Area */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute top-4 left-4 flex items-center gap-2 text-slate-400">
                                <QrCode className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Live Preview</span>
                            </div>
                            
                            <div className="mt-8 mb-4 w-full max-w-[280px] bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center aspect-auto min-h-[300px]">
                                {bank_id && account_no ? (
                                    <img 
                                        src={qrPreviewUrl} 
                                        alt="VietQR Preview" 
                                        className="max-w-full h-auto object-contain rounded-xl"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x500/f8fafc/94a3b8?text=Invalid+QR+Config';
                                        }}
                                    />
                                ) : (
                                    <div className="text-center p-6 space-y-3 opacity-60">
                                        <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center">
                                            <QrCode className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p className="text-xs font-medium text-slate-500">Vui lòng chọn Ngân hàng và Số tài khoản để xem mã QR</p>
                                    </div>
                                )}
                            </div>
                            
                            {bank_id && account_no && (
                                <p className="text-[10px] text-slate-400 text-center max-w-xs break-all">
                                    <span className="font-bold">Mẫu link test (50.000đ):</span><br/>
                                    {qrPreviewUrl}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Costs */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col col-span-1 lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-500">
                            <Zap className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Chi phí Tính năng (Credits)</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

                {/* Industry Weights */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col col-span-1 lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500">
                            <BarChart2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Trọng số AI (Industry Weights)</h2>
                            <p className="text-xs text-slate-500 mt-1">Tổng 4 chỉ số = 1.0 (chuẩn xác nhất)</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="p-4 pl-6 w-1/4">Ngành nghề</th>
                                    <th className="p-4 w-32">Kỹ năng</th>
                                    <th className="p-4 w-32">Ngữ nghĩa</th>
                                    <th className="p-4 w-32">Kinh nghiệm</th>
                                    <th className="p-4 w-32">Học vấn</th>
                                    <th className="p-4 w-32">Alpha</th>
                                    <th className="p-4 pr-6 w-24 text-right">Check</th>
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
        </div>
    );
}

// Custom Select Component for Banks
function BankSelect({ banks, value, onChange }: { banks: any[], value: string, onChange: (val: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedBank = banks.find(b => String(b.bin) === String(value) || b.shortName === value || b.code === value);
    const filteredBanks = banks.filter(b => 
        b.shortName.toLowerCase().includes(search.toLowerCase()) || 
        b.name.toLowerCase().includes(search.toLowerCase()) || 
        String(b.bin).includes(search)
    );

    return (
        <div className="relative" ref={dropdownRef}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between cursor-pointer focus-within:border-primary-500 transition-colors min-h-[50px]"
            >
                {selectedBank ? (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-7 bg-white rounded-sm border border-slate-200 flex items-center justify-center p-0.5 overflow-hidden shrink-0">
                            <img src={selectedBank.logo} alt={selectedBank.shortName} className="max-w-full max-h-full object-contain" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{selectedBank.shortName}</span>
                    </div>
                ) : (
                    <span className="text-sm font-medium text-slate-400">-- Chọn Ngân hàng thụ hưởng --</span>
                )}
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[350px]">
                    <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Tìm theo tên hoặc BIN..." 
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium outline-none focus:border-primary-500 transition-colors dark:text-white"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto p-2 space-y-1">
                        {filteredBanks.length === 0 ? (
                            <div className="p-4 text-center text-sm text-slate-500">Không tìm thấy ngân hàng phù hợp</div>
                        ) : (
                            filteredBanks.map(bank => (
                                <div 
                                    key={bank.id} 
                                    onClick={() => { onChange(bank.bin); setIsOpen(false); setSearch(''); }}
                                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${String(selectedBank?.bin) === String(bank.bin) ? 'bg-primary-50 dark:bg-primary-500/10' : ''}`}
                                >
                                    <div className="w-12 h-8 bg-white rounded-md border border-slate-100 flex items-center justify-center p-0.5 overflow-hidden shrink-0">
                                        <img src={bank.logo} alt={bank.shortName} className="max-w-full max-h-full object-contain" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-bold text-slate-700 dark:text-slate-200 flex justify-between items-center">
                                            <span>{bank.shortName}</span>
                                            {String(selectedBank?.bin) === String(bank.bin) && <Check className="w-4 h-4 text-primary-600" />}
                                        </div>
                                        <div className="text-xs text-slate-500 truncate mt-0.5">{bank.name}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
