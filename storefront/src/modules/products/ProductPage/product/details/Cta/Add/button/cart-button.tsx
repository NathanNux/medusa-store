"use client";
import { motion } from 'framer-motion';
import { useState } from 'react';

import styles from './cart-button.module.scss';

type ButtonProps = {
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    isLoading?: boolean;
    "data-testid"?: string;
    children: React.ReactNode;
}

export default function Button({
    onClick,
    disabled = false,
    className = "",
    isLoading = false,
    children,
    "data-testid": dataTestId,
}: ButtonProps) {
    const [isActive, setIsActive] = useState<boolean>(false);

    return (
        <div className={`${styles.MButton} ${className}`}>
            <button
                className={styles.button}
                onClick={onClick}
                onMouseEnter={() => setIsActive(true)}
                onMouseLeave={() => setIsActive(false)}
                disabled={disabled || isLoading}
                data-testid={dataTestId}
            >
                <motion.div
                    className={styles.slider}
                    animate={{ top: isActive ? "-100%" : "0%" }}
                    transition={{ duration: 0.5, type: "tween", ease: [0.76, 0, 0.24, 1] }}
                >
                    <div className={styles.el} style={{ backgroundColor: "var(--WhiteBg)" }}>
                        <PerspectiveText>{isLoading ? "Načítání..." : children}</PerspectiveText>
                    </div>
                    <div className={styles.el} style={{ backgroundColor: "var(--CharcoalBg)" }}>
                        <PerspectiveText>{isLoading ? "Načítání..." : children}</PerspectiveText>
                    </div>
                </motion.div>
            </button>
        </div>
    );
}

function PerspectiveText({ children }: { children: React.ReactNode }) {
    return (
        <span className={styles.perspectiveText}>
            <p>{children}</p>
            <p>{children}</p>
        </span>
    );
}