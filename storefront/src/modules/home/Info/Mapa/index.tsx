"use client";
import Image from "next/image";
import { Easing, motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import LinkButton from "@modules/common/components/Buttons/LinkButton";

const details = [
    {
        text: "Pondělí - Pátek: 9:00 - 18:00"
    },
    {
        text: "Sobota: 10:00 - 14:00"
    },
    {
        text: "Neděle: Zavřeno"
    }
]

export default function Mapa() {
    const ref = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px", amount: 0.05 });
    const ref2 = useRef<HTMLDivElement>(null);
    const isInView2 = useInView(ref2, { once: true, margin: "-50px", amount: 0.05 });

    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start end", "end start"]
    });
    
    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <section className="mapa" ref={scrollRef}>
            <div className="mapa__background__overlay"/>
            <div className="mapa__title" ref={ref}>
                <h2>
                    {charSplit("Kde mě Najdete", isInView)}
                </h2>
            </div>

            <div className="mapa__content">
                <div className="mapa__content__address">
                    <div className="mapa__content__address__title">
                        <h3>Adresa</h3>
                        <p>Putim 229, Písek 397 01</p>
                    </div>
                    <div className="mapa__content__address__links">
                        <LinkButton href="https://maps.app.goo.gl/SG3efEFzJcgSfik6A" text="Mapa Google" />
                    </div>
                </div>

                <div className="mapa__content__details" ref={ref2}>
                    <div className="mapa__content__details__title">
                        <h3>
                            {charSplit("Lucie Polanská", isInView2)}
                        </h3>
                        <h4>
                            {charSplit("Otevírací a hovorové hodiny", isInView2)}
                        </h4>
                    </div>
                    <div className="mapa__content__details__text">
                        {details.map((detail, index) => (
                            <p key={index}>{wordSplit(detail.text, isInView2)}</p>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mapa__background">
                <motion.div 
                    className="mapa__background__image"
                    style={{ translateY: y}}
                >
                    <Image 
                        src="/assets/img/img/1.jpg"
                        alt="Mapa background image"
                        fill={true}
                        quality={100}
                        loading="lazy"
                        sizes="100vw"
                    />
                </motion.div>
            </div>
        </section>
    )
}

const wordSplit = (text: string, isInView: boolean) => {
    const PreloaderAnimText = {
        start: { opacity: 0, y: 20 },
        enter: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: 0.5 + i * 0.05,
                ease: [0.76, 0, 0.24, 1] as Easing,
            }
        })
    };
    return text.split(" ").map((word, index) => (
        <motion.span
            key={index}
            animate={isInView ? "enter" : "start"}
            variants={PreloaderAnimText}
            custom={index}
            style={{ display: "inline-block", whiteSpace: "pre" }}
        >
            {word + " "}
        </motion.span>
    ));
};


const charSplit = (text: string, isInView: boolean) => {
    const charAnim = {
        start: {
            opacity: 0,
            y: 20,
        },
        enter: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: 0.25 + (i * 0.05),
                ease: [0.76, 0, 0.24, 1] as Easing,
            }
        })
    } 

    return text.split('').map((char, index) => (
        <motion.span 
            key={index}
            animate={isInView ? "enter" : "start"}
            variants={charAnim}
            custom={index}
        >
            {char}
        </motion.span>
    ));
}