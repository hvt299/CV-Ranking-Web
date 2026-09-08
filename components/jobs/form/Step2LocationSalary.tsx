'use client';

import { useState, useEffect } from 'react';
import { MapPin, DollarSign } from 'lucide-react';
import { systemService, LocationUnit } from '@/features/system/system.service';
import { parseCurrency, formatCurrency } from '@/utils/format';

interface Step2Props {
    formData: any;
    setFormData: (data: any) => void;
    isNegotiable: boolean;
    setIsNegotiable: (val: boolean) => void;
}

export default function Step2LocationSalary({
    formData,
    setFormData,
    isNegotiable,
    setIsNegotiable
}: Step2Props) {
    const [allProvinces, setAllProvinces] = useState<LocationUnit[]>([]);
    const [domesticVersion, setDomesticVersion] = useState<'new' | 'old'>(
        formData.location?.version || 'new'
    );
    const [districts, setDistricts] = useState<LocationUnit[]>([]);
    const [wards, setWards] = useState<LocationUnit[]>([]);

    const displayedProvinces = allProvinces.filter(
        p => p.version === domesticVersion
    );

    // ---------------------------------------------------------
    // Load provinces
    // ---------------------------------------------------------
    useEffect(() => {
        systemService
            .getLocations()
            .then(res => setAllProvinces(res))
            .catch(console.error);
    }, []);

    // ---------------------------------------------------------
    // Load districts / wards when editing existing job
    // ---------------------------------------------------------
    useEffect(() => {
        const loadInitialSubLocations = async () => {
            if (
                formData.location?.country === 'Việt Nam' &&
                formData.location?.province_code
            ) {
                if (domesticVersion === 'new') {
                    const wds = await systemService.getSubLocations(
                        formData.location.province_code
                    );

                    setWards(wds.filter(item => item.version === 'new'));
                } else {
                    const dists = await systemService.getSubLocations(
                        formData.location.province_code
                    );

                    setDistricts(
                        dists.filter(item => item.version === 'old')
                    );

                    if (formData.location?.district_code) {
                        const wds = await systemService.getSubLocations(
                            formData.location.district_code
                        );

                        setWards(
                            wds.filter(item => item.version === 'old')
                        );
                    }
                }
            }
        };

        loadInitialSubLocations();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.location?.province_code, domesticVersion]);

    // ---------------------------------------------------------
    // Location handlers
    // ---------------------------------------------------------
    const handleVersionChange = (ver: 'new' | 'old') => {
        setDomesticVersion(ver);

        setFormData({
            ...formData,
            location: {
                ...formData.location,
                version: ver,
            },
        });
    };

    const handleProvinceChange = async (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const code = e.target.value;
        const prov = displayedProvinces.find(p => p.code === code);

        setFormData({
            ...formData,
            location: {
                ...formData.location,
                province_code: code,
                province_name: prov?.name || '',
                version: domesticVersion,
                district_code: '',
                district_name: '',
                ward_code: '',
                ward_name: '',
                full_address_snapshot: '',
            },
        });

        if (domesticVersion === 'new') {
            const wds = await systemService.getSubLocations(code);

            setWards(wds.filter(item => item.version === 'new'));
            setDistricts([]);
        } else {
            const dists = await systemService.getSubLocations(code);

            setDistricts(
                dists.filter(item => item.version === 'old')
            );

            setWards([]);
        }
    };

    const handleDistrictChange = async (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const code = e.target.value;
        const dist = districts.find(d => d.code === code);

        setFormData({
            ...formData,
            location: {
                ...formData.location,
                district_code: code,
                district_name: dist?.name || '',
                ward_code: '',
                ward_name: '',
                full_address_snapshot: '',
            },
        });

        const wds = await systemService.getSubLocations(code);

        setWards(
            wds.filter(item => item.version === 'old')
        );
    };

    const handleWardChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const code = e.target.value;
        const ward = wards.find(w => w.code === code);

        setFormData({
            ...formData,
            location: {
                ...formData.location,
                ward_code: code,
                ward_name: ward?.name || '',
            },
        });
    };

    // ---------------------------------------------------------
    // Salary
    // ---------------------------------------------------------
    const [salaryStr, setSalaryStr] = useState({
        min:
            formData.salary?.min_salary != null
                ? formatCurrency(formData.salary.min_salary)
                : '',
        max:
            formData.salary?.max_salary != null
                ? formatCurrency(formData.salary.max_salary)
                : '',
    });

    // Đồng bộ khi formData thay đổi.
    // Không dùng fallback 0 hoặc 10tr / 30tr.
    useEffect(() => {
        setSalaryStr({
            min:
                formData.salary?.min_salary != null
                    ? formatCurrency(formData.salary.min_salary)
                    : '',
            max:
                formData.salary?.max_salary != null
                    ? formatCurrency(formData.salary.max_salary)
                    : '',
        });
    }, [
        formData.salary?.min_salary,
        formData.salary?.max_salary
    ]);

    const handleManualSalaryChange = (
        type: 'min' | 'max',
        value: string
    ) => {
        const numVal = parseCurrency(value);

        setSalaryStr(prev => ({
            ...prev,
            [type]: value ? formatCurrency(numVal) : '',
        }));

        setFormData({
            ...formData,
            salary: {
                ...formData.salary,
                [`${type}_salary`]: value ? numVal : null,
            },
        });
    };

    const isVietnam =
        (formData.location?.country || 'Việt Nam') === 'Việt Nam';

    // ---------------------------------------------------------
    // Render
    // ---------------------------------------------------------
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">

            {/* WORK LOCATION */}
            <section className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                            <MapPin className="w-5 h-5" />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                Khu vực làm việc
                            </h2>

                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Đồng bộ với cơ sở dữ liệu hành chính.
                            </p>
                        </div>
                    </div>

                    {isVietnam && (
                        <div className="flex w-fit bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <button
                                type="button"
                                onClick={() => handleVersionChange('new')}
                                className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-colors ${domesticVersion === 'new'
                                        ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                Mới (Hiện tại)
                            </button>

                            <button
                                type="button"
                                onClick={() => handleVersionChange('old')}
                                className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-colors ${domesticVersion === 'old'
                                        ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                Cũ (Trước 1/7/2025)
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    {/* Country */}
                    <div>
                        <label
                            htmlFor="location-country"
                            className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300"
                        >
                            Quốc gia
                        </label>

                        <select
                            id="location-country"
                            className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm focus:border-emerald-500 cursor-pointer"
                            value={
                                formData.location?.country ||
                                'Việt Nam'
                            }
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    location: {
                                        ...formData.location,
                                        country: e.target.value,
                                        province_code: '',
                                        district_code: '',
                                        ward_code: '',
                                    },
                                })
                            }
                        >
                            <option value="Việt Nam">
                                Việt Nam
                            </option>
                            <option value="Nước ngoài">
                                Nước ngoài
                            </option>
                        </select>
                    </div>

                    {isVietnam ? (
                        <>
                            {/* Province */}
                            <div>
                                <label
                                    htmlFor="location-province"
                                    className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300"
                                >
                                    Tỉnh / Thành phố
                                </label>

                                <select
                                    id="location-province"
                                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm focus:border-emerald-500 cursor-pointer"
                                    value={
                                        formData.location?.province_code ||
                                        ''
                                    }
                                    onChange={handleProvinceChange}
                                >
                                    <option value="" disabled>
                                        Tỉnh/Thành phố
                                    </option>

                                    {displayedProvinces.map(province => (
                                        <option
                                            key={province.code}
                                            value={province.code}
                                        >
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* District */}
                            {domesticVersion === 'old' && (
                                <div>
                                    <label
                                        htmlFor="location-district"
                                        className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300"
                                    >
                                        Quận / Huyện
                                    </label>

                                    <select
                                        id="location-district"
                                        className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm focus:border-emerald-500 cursor-pointer disabled:opacity-50"
                                        value={
                                            formData.location?.district_code ||
                                            ''
                                        }
                                        onChange={handleDistrictChange}
                                        disabled={
                                            !formData.location?.province_code
                                        }
                                    >
                                        <option value="" disabled>
                                            Quận/Huyện
                                        </option>

                                        {districts.map(district => (
                                            <option
                                                key={district.code}
                                                value={district.code}
                                            >
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Ward */}
                            <div>
                                <label
                                    htmlFor="location-ward"
                                    className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300"
                                >
                                    Phường / Xã
                                </label>

                                <select
                                    id="location-ward"
                                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm focus:border-emerald-500 cursor-pointer disabled:opacity-50"
                                    value={
                                        formData.location?.ward_code ||
                                        ''
                                    }
                                    onChange={handleWardChange}
                                    disabled={
                                        domesticVersion === 'new'
                                            ? !formData.location?.province_code
                                            : !formData.location?.district_code
                                    }
                                >
                                    <option value="" disabled>
                                        Phường/Xã
                                    </option>

                                    {wards.map(ward => (
                                        <option
                                            key={ward.code}
                                            value={ward.code}
                                        >
                                            {ward.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Street */}
                            <div className="col-span-1 md:col-span-4">
                                <label
                                    htmlFor="street-address"
                                    className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300"
                                >
                                    Địa chỉ cụ thể
                                </label>

                                <input
                                    id="street-address"
                                    type="text"
                                    placeholder="Nhập số nhà, tên đường, tòa nhà..."
                                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm focus:border-emerald-500 transition-colors"
                                    value={
                                        formData.location?.street_address ||
                                        ''
                                    }
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            location: {
                                                ...formData.location,
                                                street_address:
                                                    e.target.value,
                                            },
                                        })
                                    }
                                />
                            </div>
                        </>
                    ) : (
                        <div className="col-span-1 md:col-span-3">
                            <label
                                htmlFor="foreign-address"
                                className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300"
                            >
                                Địa chỉ
                            </label>

                            <input
                                id="foreign-address"
                                type="text"
                                placeholder="VD: 123 Orchard Road, Singapore"
                                className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm focus:border-emerald-500 transition-colors"
                                value={
                                    formData.location?.street_address ||
                                    ''
                                }
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        location: {
                                            ...formData.location,
                                            street_address:
                                                e.target.value,
                                        },
                                    })
                                }
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* SALARY */}
            <section className="space-y-5 pt-5 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-500">
                        <DollarSign className="w-5 h-5" />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            Lương & Chế độ
                        </h2>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Ngân sách dự kiến và thời gian làm việc.
                        </p>
                    </div>
                </div>

                {/* Salary mode */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <label className="font-bold text-slate-800 dark:text-white">
                            Mức lương dự kiến
                        </label>

                        <p className="text-xs text-slate-400 mt-1">
                            Có thể nhập khoảng lương hoặc chọn thỏa thuận.
                        </p>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <input
                            type="checkbox"
                            className="w-4 h-4 accent-amber-500 rounded"
                            checked={isNegotiable}
                            onChange={e =>
                                setIsNegotiable(e.target.checked)
                            }
                        />

                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            Lương thỏa thuận
                        </span>
                    </label>
                </div>

                {!isNegotiable ? (
                    <div className="space-y-5">

                        {/* Currency */}
                        <div className="max-w-40">
                            <label
                                htmlFor="salary-currency"
                                className="block text-xs font-bold text-slate-500 uppercase mb-2"
                            >
                                Tiền tệ
                            </label>

                            <select
                                id="salary-currency"
                                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm focus:border-amber-500 cursor-pointer"
                                value={formData.salary.currency}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        salary: {
                                            ...formData.salary,
                                            currency: e.target.value,
                                        },
                                    })
                                }
                            >
                                <option value="VND">VND</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>

                        {/* Salary range */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label
                                    htmlFor="salary-min"
                                    className="block text-xs font-bold text-slate-500 uppercase mb-2"
                                >
                                    Tối thiểu
                                </label>

                                <div className="relative">
                                    <input
                                        id="salary-min"
                                        type="text"
                                        placeholder="Nhập mức lương tối thiểu"
                                        value={salaryStr.min}
                                        onChange={e =>
                                            handleManualSalaryChange(
                                                'min',
                                                e.target.value
                                            )
                                        }
                                        className="w-full p-3 pr-16 font-bold text-lg text-primary-700 dark:text-primary-400 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 shadow-sm transition-colors"
                                    />

                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                                        {formData.salary.currency}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="salary-max"
                                    className="block text-xs font-bold text-slate-500 uppercase mb-2"
                                >
                                    Tối đa
                                </label>

                                <div className="relative">
                                    <input
                                        id="salary-max"
                                        type="text"
                                        placeholder="Nhập mức lương tối đa"
                                        value={salaryStr.max}
                                        onChange={e =>
                                            handleManualSalaryChange(
                                                'max',
                                                e.target.value
                                            )
                                        }
                                        className="w-full p-3 pr-16 font-bold text-lg text-emerald-700 dark:text-emerald-400 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900 shadow-sm transition-colors"
                                    />

                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                                        {formData.salary.currency}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-4 px-6 bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 shrink-0 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5" />
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                Mức lương thỏa thuận
                            </span>

                            <span className="text-xs text-slate-500 mt-0.5">
                                Sẽ được trao đổi trực tiếp khi phỏng vấn ứng viên
                            </span>
                        </div>
                    </div>
                )}

                {/* Working conditions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5 border-t border-slate-200 dark:border-slate-700">
                    <div>
                        <label
                            htmlFor="working-hours"
                            className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300"
                        >
                            Thời gian làm việc
                        </label>

                        <input
                            id="working-hours"
                            type="text"
                            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm focus:border-amber-500 transition-colors"
                            value={formData.working_hours}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    working_hours: e.target.value,
                                })
                            }
                            placeholder="VD: 08:00 - 17:30, Thứ 2 - Thứ 6"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="probation-period"
                            className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300"
                        >
                            Thời gian thử việc
                        </label>

                        <input
                            id="probation-period"
                            type="text"
                            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white shadow-sm focus:border-amber-500 transition-colors"
                            value={formData.probation_period}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    probation_period: e.target.value,
                                })
                            }
                            placeholder="VD: 2 tháng, 100% lương"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}