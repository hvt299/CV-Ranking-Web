'use client';

import { useState, useEffect, useMemo } from 'react';
import { BookOpen, Search, Calendar, Clock, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { useAuthStore } from '@/store/useAuthStore';
import { ROUTES } from '@/constants/routes';

// --- MOCK DATA ---
const CATEGORIES = ['Tất cả', 'Phỏng vấn', 'Viết CV', 'Định hướng', 'Góc HR'];

const MOCK_POSTS = [
    {
        id: '1',
        slug: 'bi-kip-chinh-phuc-vong-phong-van-voi-ai',
        title: 'Bí kíp chinh phục mọi vòng phỏng vấn với hệ thống AI của ATS',
        excerpt: 'Khám phá cách hệ thống Trí tuệ nhân tạo của chúng tôi chấm điểm ứng viên và những mẹo nhỏ để bạn luôn nổi bật trong hàng ngàn hồ sơ.',
        category: 'Phỏng vấn',
        readTime: '5 phút đọc',
        date: '28/07/2026',
        imageUrl: 'bg-linear-to-br from-blue-500 to-blue-600',
        featured: true
    },
    {
        id: '2',
        slug: 'cach-viet-cv-chuan-ats',
        title: 'Cách viết CV "chuẩn ATS" để lọt vào mắt xanh nhà tuyển dụng',
        excerpt: 'Đừng để CV của bạn bị loại chỉ vì lỗi format. Hướng dẫn chi tiết cách tối ưu từ khóa và bố cục để vượt qua bộ lọc tự động.',
        category: 'Viết CV',
        readTime: '7 phút đọc',
        date: '25/07/2026',
        imageUrl: 'bg-linear-to-br from-emerald-400 to-teal-600',
        featured: false
    },
    {
        id: '3',
        slug: 'top-5-xu-huong-hr-tech-2026',
        title: 'Top 5 xu hướng HR Tech định hình thị trường lao động 2026',
        excerpt: 'Từ Vector Database đến Generative AI, tìm hiểu những công nghệ đang tái định nghĩa lại hoàn toàn cách các tập đoàn lớn tuyển dụng.',
        category: 'Góc HR',
        readTime: '6 phút đọc',
        date: '20/07/2026',
        imageUrl: 'bg-linear-to-br from-rose-400 to-red-600',
        featured: false
    },
    {
        id: '4',
        slug: 'nhay-viec-hay-o-lai-bai-toan-tuoi-25',
        title: 'Nhảy việc hay ở lại? Bài toán định hướng sự nghiệp tuổi 25',
        excerpt: 'Ở lại để tích lũy hay nhảy việc để đột phá thu nhập? Cùng lắng nghe lời khuyên từ các chuyên gia nhân sự hàng đầu.',
        category: 'Định hướng',
        readTime: '8 phút đọc',
        date: '15/07/2026',
        imageUrl: 'bg-linear-to-br from-amber-400 to-orange-500',
        featured: false
    },
    {
        id: '5',
        slug: 'thuong-luong-luong-hieu-qua',
        title: 'Nghệ thuật thương lượng mức lương mong muốn không sợ "hớ"',
        excerpt: 'Đừng ngần ngại đề xuất mức đãi ngộ xứng đáng. Đây là công thức 3 bước giúp bạn tự tin deal lương với mọi nhà tuyển dụng.',
        category: 'Phỏng vấn',
        readTime: '4 phút đọc',
        date: '10/07/2026',
        imageUrl: 'bg-linear-to-br from-purple-500 to-fuchsia-600',
        featured: false
    },
    {
        id: '6',
        slug: '5-loi-sai-khien-cv-bi-loai',
        title: '5 lỗi sai cơ bản khiến CV của bạn bị AI loại ngay lập tức',
        excerpt: 'Lưu file sai định dạng, lạm dụng biểu đồ hay chèn ảnh quá nặng... là những lỗi "chí mạng" bạn cần tránh tuyệt đối.',
        category: 'Viết CV',
        readTime: '5 phút đọc',
        date: '05/07/2026',
        imageUrl: 'bg-linear-to-br from-cyan-400 to-blue-500',
        featured: false
    }
];

export default function BlogPage() {
    const { isAuthenticated, user } = useAuthStore();
    const [isScrolled, setIsScrolled] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Tất cả');

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lọc dữ liệu bài viết
    const filteredPosts = useMemo(() => {
        let result = MOCK_POSTS;

        if (activeCategory !== 'Tất cả') {
            result = result.filter(post => post.category === activeCategory);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(post =>
                post.title.toLowerCase().includes(query) ||
                post.excerpt.toLowerCase().includes(query)
            );
        }

        return result;
    }, [searchQuery, activeCategory]);

    const featuredPost = filteredPosts.find(p => p.featured) || filteredPosts[0];
    const regularPosts = filteredPosts.filter(p => p.id !== featuredPost?.id);

    return (
        <div className="font-sans min-h-screen bg-slate-50 dark:bg-[#050505] flex flex-col transition-colors duration-300">
            <PublicHeader isScrolled={isScrolled} isAuthenticated={isAuthenticated} user={user} />

            {/* Khối Hero Banner */}
            <div className="relative pt-32 pb-16 md:pt-40 md:pb-24 border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#0a0a0a]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-200 dark:border-blue-800/50">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        Cẩm nang <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-400">Nghề nghiệp</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto mb-10">
                        Nâng tầm sự nghiệp với những kiến thức chuyên sâu, mẹo phỏng vấn và xu hướng công nghệ nhân sự mới nhất.
                    </p>

                    {/* Thanh tìm kiếm */}
                    <div className="max-w-2xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài viết, chủ đề..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium placeholder:text-slate-400 transition-all"
                        />
                    </div>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-12 md:py-16 space-y-12">

                {/* Bộ lọc Danh mục (Categories) */}
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeCategory === category
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {filteredPosts.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-[#0a0a0a] rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                        <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">Không tìm thấy bài viết nào</h3>
                        <p className="text-slate-500 font-medium">Thử thay đổi từ khóa hoặc chọn danh mục khác nhé.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Bài viết nổi bật (Featured Post) - Chỉ hiện khi ở trang đầu/danh mục Tất cả */}
                        {featuredPost && activeCategory === 'Tất cả' && !searchQuery && (
                            <Link href={`${ROUTES.BLOG}/${featuredPost.slug}`} className="group block bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300">
                                <div className="flex flex-col md:flex-row">
                                    <div className={`md:w-1/2 h-64 md:h-auto ${featuredPost.imageUrl} relative overflow-hidden flex items-center justify-center`}>
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                        <BookOpen className="w-20 h-20 text-white/50 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider rounded-lg">
                                                {featuredPost.category}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {featuredPost.title}
                                        </h2>
                                        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8">
                                            {featuredPost.excerpt}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 mt-auto">
                                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {featuredPost.date}</span>
                                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {featuredPost.readTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Danh sách bài viết thông thường (Grid) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {regularPosts.map(post => (
                                <Link key={post.id} href={`${ROUTES.BLOG}/${post.slug}`} className="group bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
                                    {/* Thumbnail giả lập bằng Gradient */}
                                    <div className={`h-48 w-full ${post.imageUrl} relative overflow-hidden flex items-center justify-center shrink-0`}>
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                        <BookOpen className="w-12 h-12 text-white/50 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                                    </div>

                                    <div className="p-6 md:p-8 flex flex-col flex-1">
                                        <div className="mb-4">
                                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-black uppercase tracking-wider rounded-lg">
                                                {post.category}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium line-clamp-3 mb-6 flex-1">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100 dark:border-slate-800/50">
                                            <div className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                                            </div>
                                            <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <PublicFooter />
        </div>
    );
}