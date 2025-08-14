"use client";
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

export default function Magnetic({ children, sensitivity = 0.1 }: { children: React.ReactNode; sensitivity?: number }) {
    const ref = useRef<HTMLDivElement | null> (null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { width, height, top, left } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * sensitivity, y: middleY * sensitivity });
    }

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    }

    const { x, y } = position;

    const animationSpring = {
        type: "spring" as const,
        damping: 5,
        stiffness: 100,
        mass: 0.5,
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={reset}
            style={{ x, y, zIndex: 50, position: 'relative' }}
            animate={{ x, y }}
            transition={animationSpring}
            className='magnetic'
        >
            {children}
        </motion.div>
    )
}