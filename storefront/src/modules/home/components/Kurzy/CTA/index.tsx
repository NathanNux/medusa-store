"use client";

import Image from "next/image";
import { Easing, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import LinkButton from "@modules/common/components/Buttons/LinkButton";




export default function CTA() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px", amount: 0.05 });
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });
    
    const yLeftP = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
    const yRightP = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

    // Touch device detection
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    useEffect(() => {
        setIsTouchDevice(
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0 ||
            window.matchMedia("(pointer: coarse)").matches
        );
    }, []);

    // Mouse animation logic (separate for left/right)
    const xLeft = useMotionValue(0);
    const yLeft = useMotionValue(0);
    const xRight = useMotionValue(0);
    const yRight = useMotionValue(0);

    const springXLeft1 = useSpring(xLeft, { stiffness: 100, damping: 15 });
    const springYLeft1 = useSpring(yLeft, { stiffness: 100, damping: 15 });
    const springXLeft2 = useSpring(xLeft, { stiffness: 100, damping: 15 });
    const springYLeft2 = useSpring(yRight, { stiffness: 100, damping: 15 });
    const springXRight1 = useSpring(xRight, { stiffness: 80, damping: 18 });
    const springYRight1 = useSpring(yRight, { stiffness: 80, damping: 18 });
    const springXRight2 = useSpring(xRight, { stiffness: 80, damping: 18 });
    const springYRight2 = useSpring(yLeft, { stiffness: 80, damping: 18 });

    let xForce = 0, yForce = 0, requestId: number | null = null;
    const easing = 0.08, speed = 0.01;

    const lerp = (start: number, target: number, amt: number) => start * (1 - amt) + target * amt;

    const animate = () => {
        xForce = lerp(xForce, 0, easing);
        yForce = lerp(yForce, 0, easing);

        xLeft.set(xLeft.get() + xForce * 0.025);
        yLeft.set(yLeft.get() + yForce * 0.025);
        xRight.set(xRight.get() + xForce * 0.01);
        yRight.set(yRight.get() + yForce * 0.01);

        if (Math.abs(xForce) < 0.01) xForce = 0;
        if (Math.abs(yForce) < 0.01) yForce = 0;

        if (xForce !== 0 || yForce !== 0) {
            requestId = requestAnimationFrame(animate);
        } else {
            if (requestId !== null) cancelAnimationFrame(requestId);
            requestId = null;
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isTouchDevice) return;
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const mouseX = e.clientX - rect.left - rect.width / 2;
        const mouseY = e.clientY - rect.top - rect.height / 2;
        xForce += mouseX * speed;
        yForce += mouseY * speed;
        if (requestId == null) requestId = requestAnimationFrame(animate);
    };

    const images = [
        { 
            src: "/assets/img/roller/12v.jpg", 
            alt: "Vertical Prop Image",
            x: springXLeft1,
            y: springYLeft1
        },
        { 
            src: "/assets/img/roller/14v.jpg", 
            alt: "Horizontal Prop Image",
            x: springXRight1,
            y: springYRight1
        },
        { 
            src: "/assets/img/roller/4v.jpg", 
            alt: "Vertical Prop Image",
            x: springXLeft2,
            y: springYLeft2

        },
        { 
            src: "/assets/img/roller/10v.jpg", 
            alt: "Horizontal Prop Image",
            x: springXRight2,
            y: springYRight2
        }
    ];

    return (
        <section
            className="kurzy__cta"
            ref={containerRef}
            onMouseMove={isTouchDevice ? undefined : handleMouseMove}
        >
             <div className="kurzy__cta__gradients">
                <div className="kurzy__Gradient">
                    <svg width={1182} height={1118} viewBox="0 0 1182 1118" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_f_1099_194)">
                            <path d="M665.894 600.007C701.887 608.096 754.931 717.024 618.533 717.024C601.275 717.024 539.174 708.499 539.169 631.257C539.169 613.998 573.811 571.154 591.069 571.154C608.328 571.154 640.319 585.363 665.894 600.007Z" fill="#FFE0C7" fillOpacity="0.5"/>
                            <path d="M740.718 534.27C776.712 542.358 829.755 651.287 693.358 651.287C676.099 651.287 613.998 642.762 613.994 565.52C613.994 548.261 766.299 621.356 665.894 505.417C683.152 505.417 715.143 519.625 740.718 534.27Z" fill="#FFE0C7" fillOpacity="0.5"/>
                            <path d="M547.848 462.385C583.842 470.474 616.605 666.221 480.208 666.221C462.949 666.221 400.849 657.696 400.844 580.454C400.844 563.195 402.717 484.171 419.976 484.171C437.235 484.171 565.287 389.775 547.848 462.385Z" fill="#FFE0C7" fillOpacity="0.5"/>
                            <path d="M683.275 436.704C719.268 444.792 772.312 553.721 635.915 553.721C618.656 553.721 556.555 545.196 556.55 467.954C556.55 450.695 591.192 407.851 608.451 407.851C625.709 407.851 694.077 379.889 683.275 436.704Z" fill="#FFE0C7" fillOpacity="0.5"/>
                        </g>
                        <defs>
                            <filter id="filter0_f_1099_194" x="0.84375" y="0.970703" width="1180.86" height="1116.05" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feGaussianBlur stdDeviation="40" result="effect1_foregroundBlur_1099_194"/>
                            </filter>
                        </defs>
                    </svg>
                </div>
                <div className="kurzy__Gradient">
                    <svg width={1182} height={1118} viewBox="0 0 1182 1118" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_f_1099_194)">
                            <path d="M665.894 600.007C701.887 608.096 754.931 717.024 618.533 717.024C601.275 717.024 539.174 708.499 539.169 631.257C539.169 613.998 573.811 571.154 591.069 571.154C608.328 571.154 640.319 585.363 665.894 600.007Z" fill="#FFE0C7" fillOpacity="0.5"/>
                            <path d="M740.718 534.27C776.712 542.358 829.755 651.287 693.358 651.287C676.099 651.287 613.998 642.762 613.994 565.52C613.994 548.261 766.299 621.356 665.894 505.417C683.152 505.417 715.143 519.625 740.718 534.27Z" fill="#FFE0C7" fillOpacity="0.5"/>
                            <path d="M547.848 462.385C583.842 470.474 616.605 666.221 480.208 666.221C462.949 666.221 400.849 657.696 400.844 580.454C400.844 563.195 402.717 484.171 419.976 484.171C437.235 484.171 565.287 389.775 547.848 462.385Z" fill="#FFE0C7" fillOpacity="0.5"/>
                            <path d="M683.275 436.704C719.268 444.792 772.312 553.721 635.915 553.721C618.656 553.721 556.555 545.196 556.55 467.954C556.55 450.695 591.192 407.851 608.451 407.851C625.709 407.851 694.077 379.889 683.275 436.704Z" fill="#FFE0C7" fillOpacity="0.5"/>
                        </g>
                        <defs>
                            <filter id="filter0_f_1099_194" x="0.84375" y="0.970703" width="1180.86" height="1116.05" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feGaussianBlur stdDeviation="40" result="effect1_foregroundBlur_1099_194"/>
                            </filter>
                        </defs>
                    </svg>
                </div>
            </div>
            <div className="kurzy__cta__content">
                <div className="kurzy__cta__content__title" ref={ref}>
                    <h2>Zatím <br /> připravuji</h2>
                    <p>
                        {wordSplit(
                            "„Tvořit rukama znamená odpočívat hlavou.“Spouštím první běhy brzy - každý den v týdnu jiný kurz.  Počet míst je omezen na [X] osob na den. Přihlaste se předem – místa mizí rychle.",
                            isInView
                        )}
                    </p>
                </div>
                <div className="kurzy__cta__content__CTA">
                    <div className="kurzy__cta__content__CTA__button">
                        <LinkButton href="#Kurzy" text={"Zatím připravuji"} />
                    </div>
                    <div className="kurzy__cta__content__CTA__image">
                        <Image
                            src="/assets/icons/kurzy.svg"
                            alt="CTA Image"
                            fill={true}
                            priority={true}
                            sizes="50vw"
                            className="kurzy__cta__content__CTA__image__img"
                        />
                    </div>
                </div>
            </div>
            <div className="kurzy__cta__images">
                <div className="kurzy__cta__images__left">
                    {images.slice(0, 2).map((image, index) =>{
                        const { x, y } = image;
                        return  (
                            <div className="kurzy__cta__images__left__image" key={index}>
                                <motion.div
                                    style={{
                                        x: isTouchDevice ? 0 : x,
                                        y: isTouchDevice ? 0 : y
                                    }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: (index + 1) * 0.1, duration: 0.5 }}
                                    className="kurzy__cta__images__left__image__wrapper"
                                >
                                    <motion.div className="kurzy__cta__images__left__image__img__container" style={{ y: yLeftP }}>
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            fill={true}
                                            priority={true}
                                            sizes="50vw"
                                        />
                                    </motion.div>
                                </motion.div>
                            </div>
                        )
                    })}
                </div>
                <div className="kurzy__cta__images__right">
                    {images.slice(2, 4).map((image, index) => {
                        const { x, y } = image;
                        return (
                            <div className="kurzy__cta__images__right__image" key={index}>
                                <motion.div
                                    style={{
                                        x: isTouchDevice ? 0 : x,
                                        y: isTouchDevice ? 0 : y
                                    }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: (index + 3) * 0.1, duration: 0.5 }}
                                    className="kurzy__cta__images__right__image__wrapper"
                                >
                                    <motion.div className="kurzy__cta__images__right__image__img__container" style={{ y: yRightP }}>
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            fill={true}
                                            priority={true}
                                            sizes="50vw"
                                        />
                                    </motion.div>
                                </motion.div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
}


const wordSplit = (text: string, isInView: boolean) => {
    const PreloaderAnimText = {
        initial: {
            opacity: 0,
            y: 20,
        },
        start: { opacity: 0, y: 20 },
        enter: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: 1.5 + i * 0.05,
                ease: [0.76, 0, 0.24, 1] as Easing,
            }
        })
    };
    return text.split(" ").map((word, index) => (
        <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? "enter" : "start"}
            variants={PreloaderAnimText}
            custom={index}
            style={{ display: "inline-block", whiteSpace: "pre" }}
        >
            {word + " "}
        </motion.span>
    ));
};