'use client';

import { useState, useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring, animate } from 'framer-motion';

export default function Counter({ value, suffix = "" }: { value: number, suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    // Kích hoạt khi component vào vùng nhìn thấy (chỉ chạy 1 lần)
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { damping: 50, stiffness: 100 });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (isInView) {
            animate(motionValue, value, { duration: 2, ease: "easeOut" });
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            setDisplayValue(Math.floor(latest));
        });
    }, [springValue]);

    return (
        <span
            ref={ref}
            // FIX: Dùng text-current để kế thừa màu trắng từ component cha (StatsSection)
            className="text-4xl md:text-5xl font-black text-current"
        >
            {displayValue.toLocaleString('en-US')}{suffix}
        </span>
    );
}