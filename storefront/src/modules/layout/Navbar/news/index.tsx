"use client";
import { Easing, motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function NewsPopup ({firstLoad}: {firstLoad: boolean}) {

    // WIP: create for this a handle and url and desc to fetch the news or if there is new product release or something => might be useful, 
    // Only do that after the full webite is done and fully functional, so that it is not a priority right now
    const PreloaderAnim = {
        initial: {
            y: "-100%",
            opacity: 0,
        },
        start: {
            y: "-100%",
            opacity: 0,
            transition: {
                duration: 1.25,
                delay: !firstLoad ? 3.25 : 0,
                ease: [0.76, 0, 0.24, 1] as Easing,
            }
        },
        enter: {
            y: "0%",
            opacity: 1,
            transition: {
                duration: 1.25,
                delay: !firstLoad ? 3.25 : 0,
                ease: [0.76, 0, 0.24, 1] as Easing,
            }
        },
    }
    return (
        <div className='Navbar__News'>
            <motion.div 
                className="Navbar__News__RotatingBar"
                initial="initial"
                animate="enter"
                exit="exit"
                variants={PreloaderAnim}
            >
                <RotatingBar />
            </motion.div>
        </div>
    );
}

const RotatingBar = () => {
    const {scrollY} = useScroll();
    const BaseVelocity = 25;

    const currentRotation = useMotionValue(0);
    const isAnimating = useRef(true);

    const velocity = useVelocity(scrollY);
    const SmoothVelocity = useSpring(velocity, {
        stiffness: 400, 
        damping: 50
    });


    const velocityFactor = useTransform(SmoothVelocity, [0, 1000], [0, 5], {clamp: false}); // clamp: false => value will exceed the range if it is outside of the range
    const x = useTransform(currentRotation, (v) => `${v}px`);
    const directionFactor = useRef(1);
    
    useAnimationFrame((t, delta) => {
        if (!isAnimating.current) return;

        let moveBy = directionFactor.current * BaseVelocity * (delta / 1000);

        if(velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();
        currentRotation.set(currentRotation.get() + moveBy);
    })

    useEffect(() => {
        const unsubscribe = currentRotation.on("change", (v) => {
            if (v > 5000 || v < -5000) {
                currentRotation.set(0);
            }
        });
        return unsubscribe;
    }, [currentRotation]);

    return (
        <div className="NavbarNews__rotating__bar">
            <motion.div style={{ x, }} className="NavbarNews__rotating__bar__inner">
                {Array.from({ length: 25 }).map((_, index) => (
                    <p key={`news-${index}`}>
                        Dovolena | Novinky
                    </p>
                ))}
            </motion.div>
        </div>
    )
}