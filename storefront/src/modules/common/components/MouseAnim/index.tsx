"use client";
import React from 'react';
import { Easing, motion } from 'framer-motion';
import useResponsiveAnimation, { AnimationConfig } from '@lib/anims/useDimension';

export default function MouseAnim() {
    // Define animation values for different viewports
    const mouseAnimConfigs: AnimationConfig[] = [
        { name: 'hugeh', initial: -20, y1: -10, y2: -20 },
        { name: 'xlh', initial: -20, y1: -10, y2: -20 },
        { name: 'lgh', initial: -17, y1: -7.5, y2: -17 },
        { name: 'mdh', initial: -10, y1: -5, y2: -10 },
        { name: 'smh', initial: -8, y1: -4, y2: -8 },
        { name: 'xsh', initial: -6, y1: -3, y2: -6 },
        { name: 'xxsh', initial: -4, y1: -2, y2: -4 },
        { name: 'lgv', initial: -15, y1: -7, y2: -15 },
        { name: 'mdv', initial: -12, y1: -6, y2: -12 },
        { name: 'sv', initial: -8, y1: -4, y2: -8 },
        { name: 'smv', initial: -6, y1: -3, y2: -6 },
        { name: 'xsv', initial: -4, y1: -2, y2: -4 },
    ];

    const { currentViewport, animationValues } = useResponsiveAnimation(mouseAnimConfigs);

    const wheelAnimation = {
        initial: { y: animationValues.initial },
        animate: {
            y: [animationValues.initial, animationValues.y1, animationValues.y2],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: [0.76, 0, 0.24, 1] as Easing,
            }
        }
    };

    return (
        <div className="mouse-anim">
            <div className="mouse-anim__border"></div>
            <motion.div 
                className="mouse-anim__wheel" 
                initial="initial" 
                animate="animate" 
                variants={wheelAnimation}
                key={currentViewport}
            />
        </div>
    );
}