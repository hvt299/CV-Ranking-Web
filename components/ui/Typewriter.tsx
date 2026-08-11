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
                const nextText = currentWord.substring(0, text.length + 1);
                setText(nextText);

                if (nextText === currentWord) {
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                if (text.length === 1) {
                    const nextWordIndex = (wordIndex + 1) % words.length;
                    const nextWord = words[nextWordIndex];

                    setWordIndex(nextWordIndex);
                    setText(nextWord.substring(0, 1));
                    setIsDeleting(false);
                } else {
                    setText(currentWord.substring(0, text.length - 1));
                }
            }
        }, typeSpeed);

        return () => clearTimeout(timer);
    }, [text, isDeleting, wordIndex, words]);

    return (
        <span className="inline-block whitespace-nowrap text-left pb-2 text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 border-r-4 border-blue-500 animate-[pulse_1s_step-end_infinite] pr-1">
            {text}
        </span>
    );
}