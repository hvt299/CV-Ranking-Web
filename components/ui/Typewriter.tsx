'use client';

import { useState, useEffect } from 'react';

export default function Typewriter({ words }: { words: string[] }) {
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
                    // Tạm dừng 2 giây trước khi bắt đầu xóa
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                setText(currentWord.substring(0, text.length - 1));
                if (text.length === 0) {
                    setIsDeleting(false);
                    // Chuyển sang từ tiếp theo
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
}