'use client';

import { useEffect, useState } from 'react';
import { ChevronUp, MessageCircle, Phone, Mail, X } from 'lucide-react';

const actions = [
    {
        title: 'Chat hỗ trợ',
        href: 'https://zalo.me/your-zalo',
        icon: MessageCircle,
        className: 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/40'
    },
    {
        title: 'Hotline',
        href: 'tel:0123456789',
        icon: Phone,
        className: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/40'
    },
    {
        title: 'Email',
        href: 'mailto:support@example.com',
        icon: Mail,
        className: 'bg-slate-700 hover:bg-slate-800 shadow-slate-500/40'
    }
];

export default function FloatingActions() {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 400);

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="fixed right-4 bottom-5 z-50 flex flex-col items-center gap-3">

            <div className={`flex flex-col gap-3 origin-bottom transition-all duration-300 ${open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-8 pointer-events-none'}`}>
                {actions.map(({ title, href, icon: Icon, className }) => (
                    <a
                        key={title}
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        title={title}
                        className={`floating-btn text-white ${className}`}
                    >
                        <Icon />
                    </a>
                ))}
            </div>

            <button
                onClick={() => setOpen(!open)}
                title="Hỗ trợ"
                className="floating-btn bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/40"
            >
                {open ? <X /> : <MessageCircle />}
            </button>

            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    title="Lên đầu trang"
                    className="floating-btn bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 shadow-blue-500/20"
                >
                    <ChevronUp />
                </button>
            )}

        </div>
    );
}