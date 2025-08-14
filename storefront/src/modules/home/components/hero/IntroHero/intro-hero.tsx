"use client";
import Image from "next/image";
import { Easing, motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import LinkButton from "@modules/common/components/Buttons/LinkButton";
import { useEffect, useRef } from "react";
import { useStateContext } from "@lib/context/StateContext";

export default function IntroHero() {
    const { firstLoad } = useStateContext();
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
    const maskY = useTransform(scrollYProgress, [0, 1], [0, 100]);

    // const PreloaderAnimSVG = {
    //     start: {
            
            
    //     },
    //     enter: {
            
    //         transition: {
    //             duration: 0.75,
    //             delay: firstLoad ? 2 : 0,
    //             ease: [0.76, 0, 0.24, 1],
    //         }
    //     }
    // }
    const PreloaderAnimImage = {
        initial: {
            blur: "10px",
        },
        start: {
            blur: "10px",
            transition: {
                duration: 0.75,
                delay: 0.25,
                ease: [0.76, 0, 0.24, 1] as Easing,
            }
        },
        enter: {
            blur: "0px",
            transition: {
                duration: 0.75,
                delay: !firstLoad ? 0.25 : 0,
                ease: [0.76, 0, 0.24, 1] as Easing,
            }
        }
    }
      const PreloaderAnimImage2 = {
        initial: {
            height: "0%",
        },
        start: {
            height: "0%",
            transition: {
                duration: 0.75,
                delay: 0.25,
                ease: [0.76, 0, 0.24, 1] as Easing,
            }
        },
        enter: {
            height: "100%",
            transition: {
                duration: 0.75,
                delay: !firstLoad ? 0.25 : 0,
                ease: [0.76, 0, 0.24, 1] as Easing,
            }
        }
    }
    const PreloaderAnimUpdates = {
        initial: {
            y: "100%",
        },
        start: {
            y: "100%",
        },
        enter: {
            y: "0%",
            transition: {
                duration: 0.75,
                delay: !firstLoad ? 3 : 0,
                ease: [0.76, 0, 0.24, 1] as Easing,
            }
        }
    }
    const PreloaderAnimButton = {
        initial: {
            opacity: 0,
            y: 20,
        },
        start: {
            opacity: 0,
            y: 20,
        },
        enter: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: !firstLoad ? 3 : 0.5,
                ease: [0.76, 0, 0.24, 1] as Easing,
            }
        }
    }

    const maskPosition = useMotionTemplate`0px ${maskY}px`;
    return (
        <section className="Hero__Intro" ref={ref}>
            <div className="Hero__Intro__Img">
                {/* <motion.div 
                    className="Hero__Intro__Img__inner"
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    variants={PreloaderAnimImage}
                    style={{ transformOrigin: "bottom center"}}
                >
                    <Image 
                        src={"/assets/img/11.jpg"}
                        alt="Intro Image"
                        sizes="50vw"
                        fill={true}
                    />
                </motion.div> */}
            </div>
            <div className="Hero__Intro__Header">
                <div className="Hero__Intro__Header__Title">
                    <PreciseBlendedText i={4} text="Lucie" delay={0} />
                </div>
                <div className="Hero__Intro__Header__Subtitle">
                    <PreciseBlendedText i={0} text="Polanská" delay={0.5} />
                </div>
            </div>
            <div className="Hero__Intro__Content">
                <div className="Hero__Intro__Content__Text">
                    <p>
                        {wordSplit("..za každým mým výrobkem je příběh..", firstLoad)}<br /><br />

                        {wordSplit("Každý výrobek tvořím ručně s respektem k materiálu, času i lidem.", firstLoad)}
                    </p>
                </div>
                <motion.div 
                    className="Hero__Intro__Content__Button"
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    variants={PreloaderAnimButton}
                    custom={3}
                >
                    <LinkButton href="/store" text="Navštívit E-shop" />
                </motion.div>
            </div>
            <div className="Hero__Intro__Image__wrapper">
                <motion.div 
                    className="Hero__Intro__Cover"
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    variants={PreloaderAnimImage}
                    style={{ y }}
                >
                    <motion.div
                        className="Hero__Intro__Cover__Image"
                        initial="initial"
                        animate="enter"
                        exit="exit"
                        variants={PreloaderAnimImage2}
                        style={{ height: "100%", width: "100%", position: "relative", transformOrigin: "center center" }}
                    >
                        <Image 
                            src={"/assets/img/img/2.jpg"}
                            alt="Intro Image"
                            sizes="100vw"
                            fill={true}
                            className="Hero__Intro__Cover"
                            style={{ objectFit: "cover", zIndex: -1 }}
                        />
                    </motion.div>
                </motion.div>
            </div>
            <motion.div 
                className="Hero__Intro__Updates"
                initial="initial"
                animate="enter"
                exit="exit"
                variants={PreloaderAnimUpdates}
                custom={2}
            >
                <motion.p
                >
                    Dovolená | Novinky
                </motion.p>
            </motion.div>
            <motion.div 
                className="Hero__Intro__Updates__Mask"
                initial="initial"
                animate="enter"
                exit="exit"
                variants={PreloaderAnimUpdates}
                custom={2}
            >
                <motion.p
                    style={{
                        WebkitMaskPosition: maskPosition,
                        WebkitMaskSize: "100% 100%",
                    }}
                >
                    Dovolena | Novinky
                </motion.p>
            </motion.div>
        </section>
    )
}


function PreciseBlendedText({ text, i, delay }: { text: string, i: number, delay: number }) {
    const PreloaderAnimText = {
        initial: {
            opacity: 0,
            y: 20,
        },
        start: {
            opacity: 0,
            y: 20,
        },
        enter: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: 0.5 + (i * 0.1) + delay,
                ease: [0.76, 0, 0.24, 1] as Easing,
            }
        })
    }
    return (
        <h1 className="precise-blended-text">
            {text.split('').map((char, index) => {
                // Determine if this character overlaps the dark image
                const isOverDarkArea = i === index ? true : false; 
                
                return (
                    <motion.span
                        initial="start"
                        animate="enter"
                        exit="exit"
                        variants={PreloaderAnimText}
                        custom={index}
                        key={index}
                        className={`precise-char ${isOverDarkArea ? 'over-dark' : 'over-light'}`}
                    >
                        {char}
                    </motion.span>
                );
            })}
        </h1>
    );
}


const wordSplit = (text: string, firstLoad: boolean) => {
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
                delay: !firstLoad ? 3 + (i * 0.01) : 0.5 + (i * 0.01),
                ease: [0.76, 0, 0.24, 1] as Easing,
            }
        })
    }
    return text.split(' ').map((word, index) => (
        <motion.span 
            key={index}
            initial="start"
            animate="enter"
            exit="exit"
            variants={PreloaderAnimText}
            custom={index}
        >
            {word}
        </motion.span>
    ));
}