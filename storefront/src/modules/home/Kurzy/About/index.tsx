"use client";
import { MotionValue, useScroll, useTransform, motion, useInView, Easing } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function About() {
    const section1 = useRef<HTMLDivElement>(null);
    const section2 = useRef<HTMLDivElement>(null);
    const section3 = useRef<HTMLDivElement>(null);
    const imageRef1 = useRef<HTMLDivElement>(null);
    const imageRef2 = useRef<HTMLDivElement>(null);
    const imageRef3 = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    const isInView1 = useInView(imageRef1, { once: true, margin: "-50px", amount: 0.25 });
    const isInView2 = useInView(imageRef2, { once: true, margin: "-50px", amount: 0.25 });
    const isInView3 = useInView(imageRef3, { once: true, margin: "-50px", amount: 0.25 });

    // WIP: fix parallax effects in this animation 

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end end"]
    });
    const { scrollYProgress: firstScrollYProgress } = useScroll({
        target: section1,
        offset: ["start end", "end end"]
    });

    const { scrollYProgress: secondScrollYProgress } = useScroll({
        target: section2,
        offset: ["start end", "end end"]
    });

    const { scrollYProgress: thirdScrollYProgress } = useScroll({
        target: section3,
        offset: ["end end", "start 0.25"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    const imageAnim = {
        initial: { height: "0%" },
        inView: {
            height: "100%",
            transition: {
                duration: 0.75,
                ease: [0.76, 0, 0.24, 1] as Easing,
                delay: 0.5
            }
        },
        outOfView: {
            height: "0%",
            transition: {
                duration: 0.75,
                ease: [0.76, 0, 0.24, 1] as Easing,
            }
        }   
    }


    return (
        <section className="about" ref={sectionRef}>
            <div className="about__container__sticky">
                <div className="about__container__about" ref={section3}>
                    <div className="about__container__about__image" ref={imageRef1}>
                        <motion.div
                            className="about__container__about__image__inner"
                            initial="initial"
                            animate={isInView1 ? "inView" : "outOfView"}
                            variants={imageAnim}
                        >
                            <motion.div className="about__container__about__image__inner__img" style={{ y }}>
                                <Image 
                                    src={"/assets/img/roller/5h.jpg"}
                                    alt="About Image"
                                    fill={true}
                                    priority={true}
                                    sizes="50vw"
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                    <div className="about__container__about__content">
                        <h4>Co pro vás připravuji za kurzy</h4>
                        <p>
                            <WordSplit 
                                text="Přesně proto jsem vytvořila kurz, kde vás provedu celým procesem – od výběru hlíny, přes modelování a točení na kruhu, až po glazování a výpal."
                                scrollYProgress={thirdScrollYProgress}
                            />
                        </p>
                    </div>
                </div>

                <div className="about__container__images" ref={section1}>
                    <div className="about__container__images__image" ref={imageRef2}>
                        <motion.div
                            initial="initial"
                            animate={isInView2 ? "inView" : "outOfView"}
                            variants={imageAnim}
                            className="about__container__images__image__inner"
                        >
                            <motion.div className="about__container__images__image__inner__img" style={{ y }}>
                                <Image
                                    src={"/assets/img/img/3.jpg"}
                                    alt="About Image"
                                    fill={true}
                                    priority={true}
                                    sizes="50vw"
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                    <div className="about__container__images__image">
                        <motion.div
                            initial="initial"
                            animate={isInView3 ? "inView" : "outOfView"}
                            variants={imageAnim}
                            className="about__container__images__image__inner"
                            ref={imageRef3}
                        >
                            <motion.div className="about__container__images__image__inner__img" style={{ y}}>
                                <Image
                                    src={"/assets/img/roller/1h.jpg"}
                                    alt="About Image"
                                    fill={true}
                                    priority={true}
                                    sizes="50vw"
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                <div className="about__container__text__container" ref={section2}>
                    <div className="about__container__text">
                        <div className="about__container__text__content">
                            <h4>Co pro vás připravuji za kurzy</h4>
                            <p>
                                <WordSplit 
                                    text="Každý účastník si domů odnese svůj výtvor – hrnek, misku, nebo misku s pokličkou – podle tématu kurzu. Naučíte se nejen techniku, ale hlavně získáte pocit: „Tohle jsem zvládl/a já.“
                                    Kurzy jsou vedené v malých skupinkách, abych se mohla každému věnovat. Můžete přijít sami, nebo s kamarádkou – u čaje a hlíny se tvoří nejen keramika, ale i nové přátelství."
                                    scrollYProgress={secondScrollYProgress}
                                />
                            </p>
                        </div>
                        <div className="about__container__text__image">
                            <motion.div
                                initial="initial"
                                animate={isInView3 ? "inView" : "outOfView"}
                                variants={imageAnim}
                                className="about__container__text__image__inner"
                            >
                                <motion.div className="about__container__text__image__inner__img" style={{ y }}>
                                    <Image 
                                        src={"/assets/img/roller/14h.jpg"}
                                        alt="About Image"
                                        fill={true}
                                        priority={true}
                                        sizes="50vw"
                                    />
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="about__container__bgImages">
                <div className="about__Gradient">
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
                <div className="about__Gradient">
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
                <div className="about__Gradient">
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
                <div className="about__Gradient">
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
        </section>
    )
}


const WordSplit = ({ text, scrollYProgress}: { text: string, scrollYProgress: MotionValue<number> }) => {
    const word = text.split(' ')
    return (
        <>
            {word.map((w, index) => {
                const start = index / word.length;
                const end = start + (1 / word.length);
                const range: [number, number] = [start, end];
                return(
                    <Word key={index} scrollYProgress={scrollYProgress} range={range}>
                        {w + " "}
                    </Word>
                )
            })}
        </>
    )
}

const Word = ({ scrollYProgress, children, range }: { scrollYProgress: MotionValue<number>, children: string, range: [number, number] }) => {

    const opacity = useTransform(scrollYProgress, range, [0.25, 1]);
    return (
        <motion.span style={{ display: "inline-block", whiteSpace: "pre", opacity }}>
            {children}
        </motion.span>
    );
}