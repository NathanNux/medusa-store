"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Easing, motion, useInView } from "framer-motion";
import ClickButton from "@modules/common/components/Buttons/ClickButton";
import HashtagButton from "@modules/common/components/Buttons/hashtagButton";
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";

const defaultHashtags = ["Objednavka", "Kurzy", "E-shop", "Dotaz"];

export default function Kontakt() {
    const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
    const [kontaktData, setKontaktData] = useState<any>(null);

    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px", amount: 0.05 });

    useEffect(() => {
        const fetchData = async () => {
            const data = await client.fetch('*[_type == "kontakt"][0]');
            setKontaktData(data);
        };
        fetchData();
    }, []);

    const handleHashtagClick = (hashtag: string) => {
        setSelectedHashtags(prev => {
            if (prev.includes(hashtag)) {
                // Remove if already selected
                return prev.filter(tag => tag !== hashtag);
            } else {
                // Add if not selected
                return [...prev, hashtag];
            }
        });
    };

    const isHashtagActive = (hashtag: string) => selectedHashtags.includes(hashtag);
    return (
        <section className="kontakt" id="kontakt">
            <div className="kontakt__wraper">
                <div className="kontakt__Newsletter" ref={ref}>
                    <h3>
                        {wordSplit(kontaktData?.newsletterTitle || "Odebírejte mé novinky, abyste věděli, kdy budu mít nové produkty", isInView)}
                    </h3>
                    <div className="kontakt__Newsletter__Input">
                        <input type="email" placeholder="Zadejte zde svůj E-mail" required />
                        <ClickButton text="Přihlásit se" />
                    </div>
                </div>

                <div className="kontakt__Contact">
                    <div className="kontakt__Contact__Title">
                        <div className="divider"/>
                        <h3>
                            {charSplit(kontaktData?.contactTitle || "Máte nějaký dotaz?", isInView)}
                        </h3>
                        <div className="divider"/>
                    </div>

                    <div className="kontakt__Contact__Form">
                        <div className="kontakt__Contact__Form__Pillar">
                            <Image 
                                src={kontaktData?.pillarImage ? urlFor(kontaktData.pillarImage).url() : "/assets/icons/pillar.svg"}
                                alt="Pillar icon image"
                                fill={true}
                                quality={100}
                                loading="lazy"
                                className="kontakt__Contact__Form__Background"
                                sizes="(max-width: 768px) 100dvw, (min-width: 769px) 50dvw"
                            />
                        </div>
                        <form>
                            <div className="kontakt__Contact__Form__Inputs">
                                <div className="kontakt__Contact__Form__Inputs__inner">
                                    <p>Jméno:</p>
                                    <input title="Jméno:" type="text" placeholder="Vaše jméno" required />
                                </div>
                                <div className="kontakt__Contact__Form__Inputs__inner">
                                    <p>Jméno:</p>
                                    <input title="E-mail:" type="email" placeholder="Váš e-mail" required />
                                </div>
                                <div className="kontakt__Contact__Form__Inputs__inner">
                                    <p>Jméno:</p>
                                    <input title="Tel. číslo:" type="text" placeholder="Váše tel. číslo" required />
                                </div>
                            </div>
                            <div className="kontakt__Contact__Form__Message">
                                <div className="kontakt__Contact__Form__Message__Text">
                                    <div className="kontakt__Contact__Form__Message__Text__inner">
                                        <p>Zpráva:</p>
                                        <textarea title="Zpráva:" placeholder="Vaše zpráva" required></textarea>
                                    </div>
                                    <div className="kontakt__Contact__Form__Message__Text__Button">
                                        <ClickButton 
                                            text="Odeslat" 
                                            ClickAction={() => {/* Handle form submission */}}
                                        />
                                    </div>
                                </div>
                                <div className="kontakt__Contact__Form__Message__HashTag">
                                    {(kontaktData?.hashtags || defaultHashtags).map((hashtag: string, index: number) => (
                                        <HashtagButton 
                                            key={index}
                                            text={hashtag} 
                                            isActive={isHashtagActive(hashtag)}
                                            onClick={() => handleHashtagClick(hashtag)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
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