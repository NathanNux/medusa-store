"use client";
import { motion } from 'framer-motion';
import { useState } from 'react';

type ClickButtonProps = {
    ClickAction?: () => void;
    text: string;
}

// This is base button for every button animation inside the website.

export default function ClickButton({ClickAction, text } : ClickButtonProps) {
    const [ isActive , setIsActive ] = useState<boolean>(false);
    return (
        <div className="ClickButton">
            <button 
                className="button"
                onClick={ClickAction}
                onMouseEnter={() => setIsActive(true)}
                onMouseLeave={() => setIsActive(false)}
            >
                <motion.div 
                    className="slider"
                    animate={{top: isActive ? "-100%" : "0%"}}
                    transition={{ duration: 0.5, type: "tween", ease: [0.76, 0, 0.24, 1]}}
                >
                    <div 
                        className="el"
                        style={{ backgroundColor: "var(--OButton)" }}
                    >
                        <PerspectiveText label={text}/>
                    </div>
                    <div 
                        className="el"
                        style={{ backgroundColor: "var(--CharcoalBg)" }}
                    >
                        <PerspectiveText label={text} />
                    </div>
                </motion.div>
            </button>
        </div>
    )
}

function PerspectiveText({label}: {label: string}) {
    return (    
        <div className="perspectiveText">
            <p>{label}</p>
            <p>{label}</p>
        </div>
    )
}