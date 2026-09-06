'use client';

import { useRouter } from 'next/navigation';
import {
    Building2,
    MapPin,
    Users,
    Star,
    Eye,
    BriefcaseIcon,
    Heart,
    ShieldCheck,
    Globe,
} from 'lucide-react';

import { Company } from '@/types';
import { INDUSTRIES } from '@/constants/job.constants';
import { COMPANY_SIZES } from '@/constants/company.constants';
import { ROUTES } from '@/constants/routes';

interface CompanyCardProps {
    company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
    const router = useRouter();

    /*
     * =========================================================
     * LOCATION
     * =========================================================
     */

    const locationTitle = Array.from(
        new Set(
            [
                company.location?.street_address,
                company.location?.ward_name,
                company.location?.district_name,
                company.location?.province_name,
                company.location?.country,
            ].filter(Boolean)
        )
    ).join(', ');

    const locationText =
        company.location?.country &&
            company.location.country !== 'Việt Nam'
            ? Array.from(
                new Set(
                    [
                        company.location.street_address,
                        company.location.country,
                    ].filter(Boolean)
                )
            ).join(', ')
            : Array.from(
                new Set(
                    [
                        company.location?.street_address,
                        company.location?.ward_name,
                        company.location?.district_name,
                        company.location?.province_name,
                    ].filter(Boolean)
                )
            ).join(', ') || 'Đang cập nhật';

    /*
     * =========================================================
     * INDUSTRY
     * =========================================================
     */

    const industryText = (company.industries || [])
        .map(
            (industry) =>
                INDUSTRIES.find((item) => item.value === industry)?.label ||
                industry
        )
        .join(', ');

    /*
     * =========================================================
     * COMPANY SIZE
     * =========================================================
     */

    const companySize =
        COMPANY_SIZES.find((size) => size.value === company.size)?.label ||
        'Đang cập nhật';

    /*
     * =========================================================
     * HANDLERS
     * =========================================================
     */

    const handleCardClick = () => {
        router.push(ROUTES.PUBLIC_COMPANY_DETAIL(company.id));
    };

    const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        // TODO: Implement save company
    };

    const handleWebsiteClick = (
        e: React.MouseEvent<HTMLAnchorElement>
    ) => {
        e.preventDefault();
        e.stopPropagation();

        if (company.website) {
            window.open(
                company.website,
                '_blank',
                'noopener,noreferrer'
            );
        }
    };

    /*
     * =========================================================
     * RENDER
     * =========================================================
     */

    return (
        <article
            onClick={handleCardClick}
            className="
                group
                relative
                flex h-full
                cursor-pointer
                flex-col
                overflow-hidden

                rounded-3xl

                border border-slate-200
                bg-white

                shadow-sm

                transition-all
                duration-300

                hover:-translate-y-1
                hover:border-blue-400
                hover:shadow-lg

                dark:border-slate-800
                dark:bg-[#111827]
                dark:shadow-black/20

                dark:hover:border-blue-500
                dark:hover:shadow-black/40
            "
        >
            {/* =====================================================
                SAVE BUTTON
            ====================================================== */}

            <button
                type="button"
                onClick={handleSave}
                className="
                    absolute
                    right-4 top-4
                    z-30

                    flex
                    h-9 w-9
                    items-center
                    justify-center

                    rounded-xl

                    border
                    border-white/80
                    bg-white/95

                    text-slate-400
                    shadow-sm
                    backdrop-blur-md

                    transition-all
                    duration-200

                    hover:bg-white
                    hover:text-rose-500
                    hover:shadow-md

                    focus:outline-none
                    focus:ring-2
                    focus:ring-rose-500/30

                    dark:border-slate-700
                    dark:bg-slate-900/95
                    dark:text-slate-500

                    dark:hover:bg-slate-800
                    dark:hover:text-rose-400
                "
                title="Lưu công ty"
                aria-label="Lưu công ty"
            >
                <Heart className="h-4 w-4" />
            </button>

            {/* =====================================================
                COMPANY BANNER
            ====================================================== */}

            <div
                className="
                    relative
                    h-32
                    w-full
                    shrink-0
                    overflow-hidden

                    bg-slate-100
                    dark:bg-slate-900
                "
            >
                {company.banner_url ? (
                    <img
                        src={company.banner_url}
                        alt={`Banner ${company.name}`}
                        className="
                            h-full w-full
                            object-cover

                            transition-transform
                            duration-700

                            group-hover:scale-105
                        "
                    />
                ) : (
                    <div
                        className="
                            relative
                            flex h-full w-full
                            items-center justify-center
                            overflow-hidden

                            bg-slate-100
                            dark:bg-slate-900
                        "
                    >
                        {/* Glow */}

                        <div
                            className="
                                absolute inset-0

                                bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))]
                                from-blue-400
                                via-transparent
                                to-transparent

                                opacity-40
                                blur-xl

                                dark:from-blue-600
                                dark:opacity-25
                            "
                        />

                        {/* Grid */}

                        <div
                            className="
                                absolute inset-0

                                bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]
                                bg-size-[12px_12px]

                                dark:opacity-40
                            "
                        />

                        <Building2
                            className="
                                relative z-10

                                h-10 w-10

                                text-slate-300
                                dark:text-slate-600
                            "
                        />
                    </div>
                )}

                {/* Subtle overlay */}

                <div
                    className="
                        absolute inset-0

                        bg-black/0

                        transition-colors
                        duration-300

                        group-hover:bg-black/5
                        dark:group-hover:bg-black/15
                    "
                />
            </div>

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

            <div className="flex flex-1 flex-col px-5 pb-5 pt-0 sm:px-6 sm:pb-6">
                {/* =================================================
                    FLOATING LOGO
                ================================================== */}

                <div
                    className="
                        relative z-20

                        flex
                        h-16 w-16
                        shrink-0
                        items-center justify-center

                        -mt-8
                        mb-3

                        overflow-hidden

                        rounded-2xl

                        border-4
                        border-white

                        bg-white

                        shadow-md

                        dark:border-[#111827]
                        dark:bg-slate-900
                        dark:shadow-black/40
                    "
                >
                    {company.logo_url ? (
                        <img
                            src={company.logo_url}
                            alt={`Logo ${company.name}`}
                            className="
                                h-full w-full
                                object-contain
                                p-1.5
                            "
                        />
                    ) : (
                        <Building2
                            className="
                                h-7 w-7

                                text-slate-300
                                dark:text-slate-600
                            "
                        />
                    )}
                </div>

                {/* =================================================
                    COMPANY NAME + VERIFIED
                ================================================== */}

                <div className="mb-3 min-w-0 pr-10">
                    <div className="flex min-w-0 items-start gap-2">
                        <h3
                            className="
                                min-w-0
                                line-clamp-2

                                text-lg
                                font-black
                                leading-tight

                                text-slate-900

                                transition-colors
                                duration-200

                                group-hover:text-primary-600

                                dark:text-white
                                dark:group-hover:text-primary-400
                            "
                            title={company.name}
                        >
                            {company.name}
                        </h3>

                        {/* Verified */}

                        <span
                            className="
                                mt-0.5
                                shrink-0

                                inline-flex
                                items-center
                                justify-center

                                text-emerald-500
                                dark:text-emerald-400
                            "
                            title="Đã xác thực (Verified KYC)"
                            aria-label="Đã xác thực"
                        >
                            <ShieldCheck className="h-5 w-5" />
                        </span>
                    </div>
                </div>

                {/* =================================================
                    COMPANY INFO
                ================================================== */}

                <div className="mb-6 flex-1 space-y-2.5">
                    {/* Industry */}

                    {company.industries &&
                        company.industries.length > 0 && (
                            <div
                                className="
                                    flex
                                    items-start
                                    gap-2

                                    text-sm
                                    font-medium

                                    text-slate-600
                                    dark:text-slate-400
                                "
                                title={industryText}
                            >
                                <BriefcaseIcon
                                    className="
                                        mt-0.5
                                        h-4 w-4
                                        shrink-0

                                        text-blue-400
                                        dark:text-blue-400
                                    "
                                />

                                <span className="line-clamp-2 leading-relaxed">
                                    {industryText}
                                </span>
                            </div>
                        )}

                    {/* Location */}

                    <div
                        className="
                            flex
                            items-start
                            gap-2

                            text-sm
                            font-medium

                            text-slate-600
                            dark:text-slate-400
                        "
                        title={locationTitle || 'Đang cập nhật'}
                    >
                        <MapPin
                            className="
                                mt-0.5
                                h-4 w-4
                                shrink-0

                                text-rose-400
                                dark:text-rose-400
                            "
                        />

                        <span className="line-clamp-2 leading-relaxed">
                            {locationText}
                        </span>
                    </div>

                    {/* Company size */}

                    {company.size && (
                        <div
                            className="
                                flex
                                items-center
                                gap-2

                                text-sm
                                font-medium

                                text-slate-600
                                dark:text-slate-400
                            "
                        >
                            <Users
                                className="
                                    h-4 w-4
                                    shrink-0

                                    text-violet-400
                                    dark:text-violet-400
                                "
                            />

                            <span className="truncate">
                                Quy mô:{' '}
                                <span className="font-bold text-slate-700 dark:text-slate-300">
                                    {companySize}
                                </span>
                            </span>
                        </div>
                    )}

                    {/* Website */}

                    {company.website && (
                        <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleWebsiteClick}
                            className="
                                flex
                                min-w-0
                                items-center
                                gap-2

                                text-sm
                                font-medium

                                text-blue-600
                                hover:text-blue-700
                                hover:underline

                                dark:text-blue-400
                                dark:hover:text-blue-300
                            "
                            title={company.website}
                        >
                            <Globe
                                className="
                                    h-4 w-4
                                    shrink-0
                                "
                            />

                            <span className="truncate">
                                {company.website.replace(/^https?:\/\//, '')}
                            </span>
                        </a>
                    )}
                </div>

                {/* =================================================
                    FOOTER
                ================================================== */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-4

                        border-t
                        border-slate-100
                        pt-4

                        text-xs
                        font-bold
                        text-slate-500

                        dark:border-slate-800
                        dark:text-slate-400
                    "
                >
                    {/* Rating */}

                    <div className="flex min-w-0 items-center gap-1.5">
                        <Star
                            className={`
                                h-4 w-4
                                shrink-0

                                ${company.avg_rating > 0
                                    ? 'fill-amber-500 text-amber-500'
                                    : 'text-slate-300 dark:text-slate-600'
                                }
                            `}
                        />

                        {company.avg_rating > 0 ? (
                            <span className="truncate">
                                {company.avg_rating.toFixed(1)}

                                <span
                                    className="
                                        ml-1
                                        font-medium
                                        text-slate-400
                                        dark:text-slate-500
                                    "
                                >
                                    ({company.review_count})
                                </span>
                            </span>
                        ) : (
                            <span
                                className="
                                    truncate
                                    font-medium
                                    text-slate-400
                                    dark:text-slate-500
                                "
                            >
                                Chưa đánh giá
                            </span>
                        )}
                    </div>

                    {/* Views */}

                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-1.5
                        "
                    >
                        <Eye className="h-4 w-4" />

                        <span>
                            {(company.view_count || 0).toLocaleString('vi-VN')}{' '}
                            lượt xem
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
}