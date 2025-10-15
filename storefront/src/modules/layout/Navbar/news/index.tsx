"use client";
import { AnimatePresence, Easing, motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { client } from "../../../../sanity/lib/client";

export default function NewsPopup ({firstLoad}: {firstLoad: boolean}) {
    const [popupData, setPopupData] = useState<{ enabled: boolean, text: string } | null>(null);
    const [sanityLoaded, setSanityLoaded] = useState(false);
    const [showPopup, setShowPopup] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const popupData = await client.fetch('*[_type == "newsPopup"][0]');
                setPopupData(popupData);
            } catch (e) {
                setPopupData(null);
            } finally {
                setSanityLoaded(true);
            }
        };
        fetchData();
    }, []);

    // Auto-hide popup after 15 seconds
    useEffect(() => {
        if (sanityLoaded && showPopup) {
            const timer = setTimeout(() => {
                setShowPopup(false);
            }, 15000); // 15 seconds

            return () => clearTimeout(timer);
        }
    }, [sanityLoaded, showPopup]);

    const PreloaderAnim = {
        initial: {
            y: "-100%",
            opacity: 0,
        },
        enter: {
            y: "0",
            opacity: 1,
            transition: {
                duration: 1.25,
                delay: !firstLoad ? 3.25 : 0,
                ease: [0.76, 0, 0.24, 1] as Easing,
            }
        },
        exit: {
            y: "-100%",
            opacity: 0,
            transition: {
                duration: 1.25,
                ease: [0.76, 0, 0.24, 1] as Easing,
            }
        },
    }


    return (
        <div className='Navbar__News'>
            <AnimatePresence>
                {sanityLoaded && showPopup && (
                    <motion.div 
                        className="Navbar__News__RotatingBar"
                        initial="initial"
                        animate="enter"
                        exit="exit"
                        variants={PreloaderAnim}
                    >
                        <RotatingBar text={popupData?.enabled && popupData?.text ? popupData.text : "Dovolena | Novinky"} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const RotatingBar = ({ text }: { text: string }) => {
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
                        {text}
                    </p>
                ))}
            </motion.div>
        </div>
    )
}