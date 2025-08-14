"use client";
import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import LocalizedClientLink from '../../localized-client-link';

type LinkButtonProps = {
    text: string;
    href: string; 
}

// This is base button for every button animation inside the website.

export default function LinkButton({ text, href } : LinkButtonProps) {
    const [ isActive , setIsActive ] = useState<boolean>(false);
    return (
        <div className="LinkButton">
            <button 
                className="button"
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
                        <PerspectiveText label={text} href={href}/>
                    </div>
                    <div 
                        className="el"
                        style={{ backgroundColor: "var(--CreamDetails)" }}
                    >
                        <PerspectiveText label={text} href={href}/>
                    </div>
                </motion.div>
            </button>
        </div>
    )
}

function PerspectiveText({label, href}: {label: string; href: string}) {
    return (    
        <LocalizedClientLink href={href} className="perspectiveText">
            <p>{label}</p>
            <p>{label}</p>
        </LocalizedClientLink>
    )
}