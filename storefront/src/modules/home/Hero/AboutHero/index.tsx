'use client';
import Image from "next/image"
import { useRef, useEffect, useState } from 'react';
import { Easing, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { images } from "constants/images";

export default function AboutHero() {
    const containerRef = useRef<HTMLElement>(null);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px", amount: 0.05 });
    
    // Touch device detection
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    
    useEffect(() => {
        const checkTouchDevice = () => {
            return (
                'ontouchstart' in window ||
                navigator.maxTouchPoints > 0 ||
                window.matchMedia("(pointer: coarse)").matches
            );
        };
        
        setIsTouchDevice(checkTouchDevice());
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const springYprogress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 20,
        restDelta: 0.001,
    });

    const parallaxY = useTransform(springYprogress, [0, 1], ["-5%", "5%"]);

    // Only initialize mouse animation variables if not touch device
    let requestAnimationFrameId: number | null = null;
    let xForce: number = 0;
    let yForce: number = 0;
    const easing: number = 0.08;
    const speed: number = 0.01;

    // Motion values for animated layers only (layer 2 and 3) - only if not touch device
    const x2 = useMotionValue(0);
    const y2 = useMotionValue(0);
    const x3 = useMotionValue(0);
    const y3 = useMotionValue(0);

    // Spring animations for smoother movement - only if not touch device
    const springX2 = useSpring(x2, { 
        stiffness: isTouchDevice ? 0 : 100, 
        damping: isTouchDevice ? 100 : 15 
    });
    const springY2 = useSpring(y2, { 
        stiffness: isTouchDevice ? 0 : 100, 
        damping: isTouchDevice ? 100 : 15 
    });
    const springX3 = useSpring(x3, { 
        stiffness: isTouchDevice ? 0 : 50, 
        damping: isTouchDevice ? 100 : 15 
    });
    const springY3 = useSpring(y3, { 
        stiffness: isTouchDevice ? 0 : 50, 
        damping: isTouchDevice ? 100 : 15 
    });

    const manageMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        // Exit early if touch device
        if (isTouchDevice) return;
        
        const { movementX, movementY } = e;
        xForce += movementX * speed;
        yForce += movementY * speed;

        if(requestAnimationFrameId == null){
            requestAnimationFrameId = requestAnimationFrame(animate);
        }
    }

    const lerp = (start: number, target: number, amount: number): number => {
        return start * (1 - amount) + target * amount;
    }

    const animate = (): void => {
        // Exit early if touch device
        if (isTouchDevice) return;
        
        xForce = lerp(xForce, 0, easing);
        yForce = lerp(yForce, 0, easing);
        
        // Update motion values only for animated layers
        x2.set(x2.get() + xForce * 0.25);
        y2.set(y2.get() + yForce * 0.25);
        x3.set(x3.get() + xForce * 0.1);
        y3.set(y3.get() + yForce * 0.1);

        if(Math.abs(xForce) < 0.01) xForce = 0;
        if(Math.abs(yForce) < 0.01) yForce = 0;
        
        if(xForce != 0 || yForce != 0){
            requestAnimationFrame(animate);
        }
        else{
            if(requestAnimationFrameId !== null) {
                cancelAnimationFrame(requestAnimationFrameId);
            }
            requestAnimationFrameId = null;
        }
    }

    // Split images: first image static, then 3 images in layer 2, then 2 images in layer 3
    const staticImage = images[0]; // First image - no animation
    const layer2Images = images.slice(1, 4); // Next 3 images (index 1, 2, 3)
    const layer3Images = images.slice(4, 6); // Last 2 images (index 4, 5)

    return (
        <section 
            className="About"
            ref={containerRef}
            onMouseMove={isTouchDevice ? undefined : manageMouseMove} // Conditionally add mouse move
            id="ome"
        >
            <div className="About__Images">
                {/* Static Layer - First image only, no animation */}
                <motion.div className="About__Images__Layer__static__layer" style={{ y: parallaxY }}>
                    <div className="About__Images__Item">
                        <motion.div 
                            className="About__Images__Item__layer__static" 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Image
                                src={staticImage.src} 
                                alt={staticImage.alt} 
                                className="About__Images__Item__Img"
                                fill={true}
                                priority={true}
                                sizes={staticImage.sizes}
                            />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Layer 2 - 3 images with medium movement */}
                <motion.div 
                    className="About__Images__Layer__animated__layer"
                    style={{ 
                        x: isTouchDevice ? 0 : springX2, 
                        y: isTouchDevice ? 0 : springY2 
                    }}
                >
                    {layer2Images.map((image, index) => (
                        <div className="About__Images__Item" key={`layer2-${index}`}>
                            <motion.div 
                                className="About__Images__Item__Img__container" 
                                key={`layer2-${index}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: (index + 1) * 0.1, duration: 0.5 }}
                            >
                                <Image
                                    src={image.src} 
                                    alt={image.alt} 
                                    className="About__Images__Item__Img"
                                    fill={true}
                                    priority={false}
                                    sizes={image.sizes}
                                />
                            </motion.div>
                        </div>
                    ))}
                </motion.div>

                {/* Layer 3 - 2 images with slower movement */}
                <motion.div 
                    className="About__Images__Layer__animated__layer"
                    style={{ 
                        x: isTouchDevice ? 0 : springX3, 
                        y: isTouchDevice ? 0 : springY3 
                    }}
                >
                    {layer3Images.map((image, index) => (
                        <div className="About__Images__Item" key={`layer3-${index}`}>
                            <motion.div 
                                className="About__Images__Item__Img__container" 
                                key={`layer3-${index}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: (index + 4) * 0.1, duration: 0.5 }}
                            >
                                <Image
                                    src={image.src} 
                                    alt={image.alt} 
                                    className="About__Images__Item__Img"
                                    fill={true}
                                    priority={false}
                                    sizes={image.sizes}
                                />
                            </motion.div>
                        </div>
                    ))}
                </motion.div>
            </div>

            <div 
                className="About__Text"
                ref={ref}
            >
                <div className="About__Text__Header">
                    <p>
                        {wordSplit("Jmenuji se Lucie Polanská, jsem Písecká rodačka, absolventka SPŠ Keramická v Bechyni a máma dvou úžasných dětí. Naplno se keramice věnuji od r.2014.", isInView)}
                    </p>
                </div> 
                <div className="About__Text__Content">
                    <p>
                        {wordSplit("Svou originální poetikou, přírodním designem a volbou vysoce kvalitních materiálů má keramika osloví každého, kdo hledá výtvarnou i řemeslnou kvalitu.", isInView)}
                    </p>
                </div>
            </div>
        </section>
    )
}

const wordSplit = (text: string, isInView: boolean) => {
    const PreloaderAnimText = {
        start: {
            opacity: 0,
            y: 20,
        },
        enter: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: 0.15 + (i * 0.05),
                ease: [0.76, 0, 0.24, 1] as Easing,
            }
        })
    }
    return text.split(' ').map((word, index) => (
        <motion.span 
            key={index}
            animate={isInView ? "enter" : "start"}
            variants={PreloaderAnimText}
            custom={index}
        >
            {word}
        </motion.span>
    ));
}