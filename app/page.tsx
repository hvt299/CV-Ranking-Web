'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, useMotionValue, useSpring, animate, AnimatePresence, Variants } from 'framer-motion';
import {
    Hexagon, ArrowRight, Sparkles, BrainCircuit, FileSearch,
    Zap, ShieldCheck, CheckCircle2, ChevronDown, Search, MapPin,
    Briefcase, DollarSign, Building2, Play
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Job, UserRole } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import JobSearchBar from '@/components/jobs/JobSearchBar';
import JobCard from '@/components/jobs/JobCard';

// ==========================================
// STATIC DATA (Chỉ dùng cho Text hiển thị / Tính năng)
// ==========================================
const HERO_WORDS = ["Kỹ sư phần mềm", "Chuyên viên Marketing", "Giám đốc tài chính", "Nhà thiết kế UI/UX"];
const STATS = [
    { label: "Ứng viên hoạt động", value: 12500, suffix: "+" },
    { label: "Doanh nghiệp tin dùng", value: 450, suffix: "+" },
    { label: "Việc làm đang mở", value: 3200, suffix: "+" },
    { label: "Tỷ lệ kết nối thành công", value: 98, suffix: "%" },
];
const FEATURES = [
    { icon: BrainCircuit, title: "AI Scoring Matrix", desc: "Chấm điểm CV đa chiều bằng mô hình LLM tiên tiến, đối chiếu chính xác với JD không thiên vị." },
    { icon: FileSearch, title: "Anti-Stuffing System", desc: "Tự động phát hiện và trừ điểm các hồ sơ cố tình nhồi nhét từ khóa, font chữ trắng hoặc tàng hình." },
    { icon: Zap, title: "Smart Parsing", desc: "Bóc tách chính xác Học vấn, Số năm kinh nghiệm và Kỹ năng chỉ trong 2 giây từ file PDF/DOCX." },
    { icon: ShieldCheck, title: "Bảo mật chuẩn Enterprise", desc: "Dữ liệu ứng viên và doanh nghiệp được mã hóa đầu cuối, tuân thủ các tiêu chuẩn bảo mật khắt khe nhất." }
];
const FAQS = [
    { q: "Hệ thống AI chấm điểm dựa trên tiêu chí nào?", a: "AI của chúng tôi phân tích dựa trên 4 trọng số: Kỹ năng chuyên môn, Ngữ nghĩa văn cảnh (NLP), Kinh nghiệm làm việc và Trình độ học vấn." },
    { q: "Dữ liệu CV của tôi có được bảo mật không?", a: "Tuyệt đối. Chúng tôi sử dụng mã hóa AES-256 cho dữ liệu lưu trữ và TLS 1.3 cho dữ liệu truyền tải. Hồ sơ chỉ được chia sẻ khi bạn ứng tuyển." },
    { q: "Làm sao để đăng ký tài khoản Doanh nghiệp?", a: "Doanh nghiệp cần cung cấp Mã số thuế và Giấy phép kinh doanh. Đội ngũ Admin sẽ kiểm duyệt (KYC) trong vòng 24h làm việc." }
];

// ==========================================
// ANIMATION VARIANTS
// ==========================================
const fadeUp: Variants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const staggerContainer: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

// ==========================================
// CUSTOM COMPONENTS
// ==========================================

const Counter = ({ value, suffix = "" }: { value: number, suffix?: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { damping: 50, stiffness: 100 });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (isInView) animate(motionValue, value, { duration: 2, ease: "easeOut" });
    }, [isInView, value, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => setDisplayValue(Math.floor(latest)));
    }, [springValue]);

    return <span ref={ref} className="text-4xl md:text-5xl font-black text-blue-600 dark:text-white">{displayValue.toLocaleString('en-US')}{suffix}</span>;
};

const Typewriter = ({ words }: { words: string[] }) => {
    const [text, setText] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentWord = words[wordIndex];
        const typeSpeed = isDeleting ? 30 : 80;

        const timer = setTimeout(() => {
            if (!isDeleting) {
                setText(currentWord.substring(0, text.length + 1));
                if (text.length === currentWord.length) {
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                setText(currentWord.substring(0, text.length - 1));
                if (text.length === 0) {
                    setIsDeleting(false);
                    setWordIndex((prev) => (prev + 1) % words.length);
                }
            }
        }, typeSpeed);

        return () => clearTimeout(timer);
    }, [text, isDeleting, wordIndex, words]);

    return (
        <span className="inline-block text-left text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 border-r-4 border-blue-500 animate-[pulse_1s_step-end_infinite] pr-1">
            {text}
        </span>
    );
};

// ==========================================
// MAIN PAGE
// ==========================================
export default function LandingPage() {
    const { isAuthenticated, user } = useAuth();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [uniqueCompanies, setUniqueCompanies] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [filters, setFilters] = useState({
        location: '', workMode: '', jobLevel: '', employmentType: '', salaryMin: '', salaryMax: '', skills: [] as string[], company: '', industry: '', education: ''
    });
    const [filterOptions, setFilterOptions] = useState({
        locations: [] as string[], workModes: [] as string[], jobLevels: [] as string[], employmentTypes: [] as string[], skills: [] as string[], companies: [] as string[], industries: [] as string[], educations: [] as string[]
    });

    const jobsSectionRef = useRef<HTMLDivElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(0);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        api.get('/apply/jobs').then(res => {
            const data = res.data;
            setJobs(data);
            setFilteredJobs(data);

            const locations = [...new Set(data.map((job: any) => job.location?.city).filter(Boolean))] as string[];
            const workModes = [...new Set(data.map((job: any) => job.work_mode).filter(Boolean))] as string[];
            const jobLevels = [...new Set(data.map((job: any) => job.job_level).filter(Boolean))] as string[];
            const employmentTypes = [...new Set(data.map((job: any) => job.employment_type).filter(Boolean))] as string[];
            const skills = [...new Set(data.flatMap((job: any) => job.required_skills || []))] as string[];
            const companies = [...new Set(data.map((job: any) => job.company_name).filter(Boolean))] as string[];
            const industries = [...new Set(data.map((job: any) => job.industry).filter(Boolean))] as string[];
            const educations = [...new Set(data.map((job: any) => job.education?.min_level).filter(Boolean))] as string[];

            setFilterOptions({
                locations,
                workModes,
                jobLevels,
                employmentTypes,
                skills,
                companies,
                industries,
                educations
            });

            setUniqueCompanies(companies);
        }).catch(() => {
            toast.error('Không thể tải danh sách việc làm');
        }).finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        let filtered = jobs;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(job =>
                job.title?.toLowerCase().includes(query) ||
                job.company_name?.toLowerCase().includes(query) ||
                job.description?.toLowerCase().includes(query) ||
                job.required_skills?.some((skill: any) => {
                    const skillName = typeof skill === 'string' ? skill : skill.name;
                    return skillName?.toLowerCase().includes(query);
                })
            );
        }

        if (filters.location) {
            filtered = filtered.filter(job => job.location?.city?.toLowerCase().includes(filters.location.toLowerCase()));
        }
        if (filters.workMode) filtered = filtered.filter(job => job.work_mode === filters.workMode);
        if (filters.jobLevel) filtered = filtered.filter(job => job.job_level === filters.jobLevel);
        if (filters.employmentType) filtered = filtered.filter(job => job.employment_type === filters.employmentType);
        if (filters.company) filtered = filtered.filter(job => job.company_name === filters.company);
        if (filters.salaryMin) filtered = filtered.filter(job => job.salary?.min_salary && job.salary.min_salary >= parseInt(filters.salaryMin));
        if (filters.salaryMax) filtered = filtered.filter(job => job.salary?.max_salary && job.salary.max_salary <= parseInt(filters.salaryMax));
        if (filters.skills.length > 0) {
            filtered = filtered.filter(job =>
                filters.skills.some(skill => {
                    const jobSkills = job.required_skills?.map((s: any) => typeof s === 'string' ? s : s.name) || [];
                    return jobSkills.includes(skill);
                })
            );
        }

        setFilteredJobs(filtered);
    }, [jobs, searchQuery, filters]);

    useEffect(() => {
        let sorted = [...filteredJobs];
        switch (sortBy) {
            case 'newest':
                sorted.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
                break;
            case 'oldest':
                sorted.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
                break;
            case 'salary_high':
                sorted.sort((a, b) => (b.salary?.max_salary || 0) - (a.salary?.max_salary || 0));
                break;
            case 'salary_low':
                sorted.sort((a, b) => (a.salary?.min_salary || 0) - (b.salary?.min_salary || 0));
                break;
        }
        setFilteredJobs(sorted);
    }, [sortBy, filteredJobs.length]);

    const clearFilters = () => {
        setFilters({
            location: '',
            workMode: '',
            jobLevel: '',
            employmentType: '',
            salaryMin: '',
            salaryMax: '',
            skills: [],
            company: '',
            industry: '',
            education: ''
        });

        setSearchQuery('');
        setSortBy('newest');
    };

    const scrollToJobs = () => {
        jobsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSelectCompany = (companyName: string) => {
        setFilters({ ...filters, company: companyName });
        scrollToJobs();
    };

    const activeFiltersCount = Object.values(filters).filter(value => Array.isArray(value) ? value.length > 0 : value !== '').length + (searchQuery ? 1 : 0);

    const hotJobsData = jobs.filter(j => j.is_hot).slice(0, 3);
    const displayHotJobs = hotJobsData.length > 0 ? hotJobsData : jobs.slice(0, 3);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-slate-300 font-sans selection:bg-blue-500/30 selection:text-blue-600 dark:selection:text-blue-200 overflow-x-hidden transition-colors duration-300">

            {/* ================= HEADER (STICKY + GLASS) ================= */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-3' : 'bg-transparent py-5'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            <Hexagon className="w-6 h-6 text-white" fill="currentColor" />
                        </div>
                        <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">ATS<span className="text-blue-500">SYSTEM</span></span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 dark:text-slate-300">
                        <a href="#features" className="hover:text-blue-600 dark:hover:text-white transition-colors">Tính năng</a>
                        <a href="#jobs" className="hover:text-blue-600 dark:hover:text-white transition-colors">Việc làm</a>
                        <a href="#workflow" className="hover:text-blue-600 dark:hover:text-white transition-colors">Quy trình</a>
                    </div>

                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <Link href={user?.role === UserRole.APPLICANT ? '/apply' : '/dashboard'} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                                Vào hệ thống
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="hidden sm:block text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors">Đăng nhập</Link>
                                <Link href="/register" className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30">
                                    Dùng thử miễn phí
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ================= HERO SECTION ================= */}
            <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
                {/* Background Grid & Glows */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50 dark:opacity-20 pointer-events-none" />
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-blue-400/20 dark:bg-blue-600/20 blur-[150px] rounded-full pointer-events-none" />

                <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">

                    <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm font-bold mb-8 backdrop-blur-md text-slate-600 dark:text-slate-300 shadow-sm">
                        <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                        Nền tảng Tuyển dụng AI thế hệ mới
                    </motion.div>

                    <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
                        Khám phá cơ hội cho <br className="hidden md:block" />
                        <Typewriter words={HERO_WORDS} />
                    </motion.h1>

                    <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl font-medium leading-relaxed">
                        Ứng dụng mô hình LLM và Vector Database để loại bỏ định kiến, tự động khớp nối CV và Yêu cầu công việc với độ chính xác lên đến 98%.
                    </motion.p>

                    {/* Quick Search - Linked to State */}
                    <motion.div variants={fadeUp} className="w-full max-w-2xl bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-2 rounded-2xl md:rounded-full flex flex-col md:flex-row gap-2 shadow-2xl">
                        <div className="flex items-center flex-1 px-4 py-3">
                            <Search className="w-5 h-5 text-slate-400 shrink-0" />
                            <input
                                type="text"
                                placeholder="Tên công việc, kỹ năng, công ty..."
                                className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-white px-3 placeholder:text-slate-400 text-sm font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && scrollToJobs()}
                            />
                        </div>
                        <div className="hidden md:block w-px h-8 bg-slate-200 dark:bg-slate-700 self-center" />
                        <div className="flex items-center flex-1 px-4 py-3">
                            <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                            <input
                                type="text"
                                placeholder="Tỉnh/Thành phố..."
                                className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-white px-3 placeholder:text-slate-400 text-sm font-medium"
                                value={filters.location}
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && scrollToJobs()}
                            />
                        </div>
                        <button onClick={scrollToJobs} className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl md:rounded-full hover:bg-blue-700 transition-colors w-full md:w-auto shrink-0 flex items-center justify-center gap-2 shadow-md">
                            Tìm việc
                        </button>
                    </motion.div>
                </motion.div>
            </section>

            {/* ================= MARQUEE COMPANIES (REAL DATA) ================= */}
            {uniqueCompanies.length > 0 && (
                <section className="py-10 border-y border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-white/2">
                    <div className="max-w-7xl mx-auto px-6 overflow-hidden flex flex-col items-center">
                        <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-8">Được tin dùng bởi các doanh nghiệp</p>
                        <div className="flex gap-12 items-center justify-center flex-wrap opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                            {uniqueCompanies.slice(0, 10).map((c, i) => (
                                <button key={i} onClick={() => handleSelectCompany(c)} className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    <Building2 className="w-6 h-6" /> {c}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ================= FEATURES SECTION ================= */}
            <section id="features" className="py-32 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="mb-16">
                        <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Tuyển dụng. <span className="text-slate-400 dark:text-slate-500">Nhưng thông minh hơn.</span></motion.h2>
                        <motion.p variants={fadeUp} className="text-slate-600 dark:text-slate-400 text-lg max-w-xl font-medium">Hệ thống ATS của chúng tôi cung cấp bộ công cụ toàn diện giúp tiết kiệm 80% thời gian sàng lọc hồ sơ.</motion.p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {FEATURES.map((feat, i) => (
                            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="p-8 md:p-10 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md dark:hover:bg-slate-800/50 transition-all group">
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                    <feat.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">{feat.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= STATS COUNTER ================= */}
            <section className="py-24 px-6 bg-blue-50 dark:bg-blue-900/10 border-y border-blue-100 dark:border-blue-900/30">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
                    {STATS.map((stat, i) => (
                        <div key={i} className="flex flex-col items-center text-center">
                            <Counter value={stat.value} suffix={stat.suffix} />
                            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wider">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= HOT JOBS SECTION (REAL DATA) ================= */}
            <section id="jobs" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Cơ hội <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-rose-500">Việc Làm Hot</span></h2>
                            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">Những vị trí có mức đãi ngộ tốt nhất đang mở tuyển.</p>
                        </div>
                        <button onClick={scrollToJobs} className="hidden md:flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                            Xem tất cả <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {displayHotJobs.map((job) => (
                            <motion.div key={job.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl hover:border-blue-400 dark:hover:border-slate-600 shadow-sm hover:shadow-md transition-all flex flex-col h-full relative group overflow-hidden">
                                {/* Decor Hover Glow */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/10 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />

                                {job.is_hot && (
                                    <div className="absolute -right-12 top-6 bg-linear-to-r from-rose-500 to-orange-500 text-white text-[10px] font-black py-1 w-40 text-center shadow-lg rotate-45 z-10 tracking-widest uppercase pointer-events-none opacity-90">
                                        HOT
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-4 relative z-20">
                                    <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {job.company_name}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location?.city || 'Việt Nam'}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 relative z-20">{job.title}</h3>

                                <div className="flex flex-wrap gap-2 mb-6 relative z-20">
                                    {job.required_skills?.slice(0, 4).map((skill: any, i: number) => (
                                        <span key={i} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700">
                                            {typeof skill === 'string' ? skill : skill.name}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between relative z-20">
                                    <div className="text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-1">
                                        <DollarSign className="w-4 h-4" />
                                        {job.salary?.min_salary && job.salary?.max_salary
                                            ? `${new Intl.NumberFormat('vi-VN').format(job.salary.min_salary / 1000000)} - ${new Intl.NumberFormat('vi-VN').format(job.salary.max_salary / 1000000)} Tr`
                                            : 'Thỏa thuận'}
                                    </div>
                                    <Link href={`/jobs/${job.id}`} className="px-4 py-2 bg-blue-50 dark:bg-white text-blue-600 dark:text-black text-sm font-bold rounded-xl hover:bg-blue-100 dark:hover:bg-slate-200 transition-colors">Chi tiết</Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= MAIN JOBS LISTING (FILTERABLE) ================= */}
            <div ref={jobsSectionRef} className="max-w-7xl mx-auto py-20 px-4 space-y-8 scroll-mt-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white">Tất cả <span className="text-blue-600">Việc làm</span></h2>
                    <p className="text-slate-500 mt-3 font-medium">Khám phá {filteredJobs.length} cơ hội nghề nghiệp với hệ thống xếp hạng công bằng AI.</p>
                </div>

                <JobSearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    filters={filters}
                    onFiltersChange={setFilters}
                    filterOptions={filterOptions}
                    onClearFilters={clearFilters}
                    activeFiltersCount={activeFiltersCount}
                />

                <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm gap-4">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                        Có <span className="text-blue-600">{filteredJobs.length}</span> vị trí phù hợp
                    </span>
                    <div className="flex items-center gap-4">
                        {activeFiltersCount > 0 && (
                            <button onClick={clearFilters} className="text-red-500 font-bold hover:underline">Xóa ({activeFiltersCount}) bộ lọc</button>
                        )}
                        <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-4">
                            <label className="font-bold">Sắp xếp:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="oldest">Cũ nhất</option>
                                <option value="salary_high">Lương cao nhất</option>
                                <option value="salary_low">Lương thấp nhất</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>
                    ) : filteredJobs.length === 0 ? (
                        <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">Không tìm thấy việc làm</h3>
                            <p className="text-slate-500 font-medium">Thử thay đổi từ khóa hoặc giảm bớt bộ lọc để tìm được nhiều kết quả hơn.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredJobs.map(job => (
                                <JobCard key={job.id} job={job} onApplySuccess={() => toast.success("Gửi hồ sơ thành công!")} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ================= WORKFLOW SECTION ================= */}
            <section id="workflow" className="py-32 px-6 bg-slate-100 dark:bg-slate-900/20 border-y border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-16">Quy trình đơn giản. <br />Hiệu quả tối đa.</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px bg-slate-300 dark:bg-slate-800 z-0" />

                        {[
                            { step: "01", title: "Tạo chiến dịch", desc: "HR tạo Job Description với các yêu cầu kỹ năng và thiết lập trọng số AI." },
                            { step: "02", title: "AI Phân tích", desc: "Ứng viên nộp CV. Hệ thống bóc tách dữ liệu và chấm điểm tự động ngay lập tức." },
                            { step: "03", title: "Kết nối", desc: "Leaderboard hiển thị ứng viên tốt nhất. HR gửi lịch phỏng vấn chỉ với 1 click." },
                        ].map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className="relative z-10 flex flex-col items-center">
                                <div className="w-24 h-24 bg-white dark:bg-[#050505] border-2 border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center text-2xl font-black text-blue-600 dark:text-white mb-6 shadow-xl">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= FAQ SECTION ================= */}
            <section className="py-32 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center mb-12">Câu hỏi thường gặp</h2>
                    <div className="space-y-4">
                        {FAQS.map((faq, i) => (
                            <div key={i} className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/30 shadow-sm">
                                <button
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className="w-full px-6 py-4 flex items-center justify-between font-bold text-slate-800 dark:text-white text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    {faq.q}
                                    <ChevronDown className={`w-5 h-5 text-slate-400 dark:text-slate-500 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {activeFaq === i && (
                                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                            <p className="px-6 pb-4 text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">{faq.a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= BOTTOM CTA ================= */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-blue-600/5 to-indigo-600/5 dark:from-blue-600/10 dark:to-indigo-600/10 pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center relative z-10 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-12 md:p-20 rounded-[3rem] backdrop-blur-xl shadow-2xl">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">Sẵn sàng nâng cấp <br /> hệ thống tuyển dụng?</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg font-medium">Tham gia cùng hàng nghìn doanh nghiệp và ứng viên đang sử dụng hệ thống ATS của chúng tôi mỗi ngày.</p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link href="/register" className="px-8 py-4 bg-blue-600 dark:bg-white text-white dark:text-black font-black rounded-full hover:bg-blue-700 dark:hover:bg-slate-200 transition-colors w-full sm:w-auto shadow-lg shadow-blue-500/20 dark:shadow-none">
                            Đăng ký miễn phí
                        </Link>
                        <Link href="/contact" className="px-8 py-4 bg-transparent text-slate-800 dark:text-white font-black rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
                            <Play className="w-4 h-4 fill-slate-800 dark:fill-white" /> Xem Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050505] pt-20 pb-10 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Hexagon className="w-6 h-6 text-blue-600" fill="currentColor" />
                            <span className="text-xl font-black text-slate-900 dark:text-white">ATS<span className="text-blue-600">SYSTEM</span></span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed font-medium">Nền tảng Quản trị Tuyển dụng Ứng dụng Trí tuệ Nhân tạo. Giúp doanh nghiệp tìm đúng người, giúp ứng viên tìm đúng việc.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-4">Sản phẩm</h4>
                        <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
                            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tính năng</a></li>
                            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Bảng giá</a></li>
                            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dành cho Doanh nghiệp</a></li>
                            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Thư viện CV</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-4">Công ty</h4>
                        <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
                            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Về chúng tôi</a></li>
                            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog công nghệ</a></li>
                            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Điều khoản dịch vụ</a></li>
                            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Chính sách bảo mật</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-600 border-t border-slate-200 dark:border-slate-800 pt-8 font-medium">
                    <p>© 2026 ATS System. Bảo lưu mọi quyền.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <a href="#" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">Twitter</a>
                        <a href="#" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">GitHub</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}