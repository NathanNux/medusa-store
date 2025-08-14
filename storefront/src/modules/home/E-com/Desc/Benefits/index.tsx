"use client";
import Image from "next/image";
import { useRef } from "react";
import { Easing, motion, useInView, useScroll, useTransform } from "framer-motion";

export default function Benefits() {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(textRef, { once: true, margin: "-50px", amount: 0.05 });

    // Parallax for images
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Parallax values for each image (different speeds)
    const parallax1 = useTransform(scrollYProgress, [0, 1], ["-5%", "18%"]);
    const parallax2 = useTransform(scrollYProgress, [0, 1], ["5%", "-18%"]);

    return (
        <section className="Benefits" ref={sectionRef}>
            <div className="Benefits__gradients">
                <div className="Benefits__gradient">
                    <svg width={400} height={400} viewBox="0 0 1182 1118" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <div className="Benefits__content" ref={textRef}> 
                <div className="Benefits__content__text">
                    <h4>
                        Detaily k mým výrobkům
                    </h4>
                    <p>
                        {wordSplit("Všechny materiály (hlíny a glazury), které při výrobě používám, jsou zdravotně nezávadné. Výrobky určené pro přímý styk s potravinou mají certifikát o zdravotní nezávadnosti dělaný u Zdravotního ústavu v Ústí nad Labem.", isInView)}
                    </p>
                </div>

                <div className="Benefits__content__text">
                    <h4>
                        {wordSplit("Většina mých výrobků jsou mrazuvzdorné a vhodné tak k celoroční instalaci venku.", isInView)}
                    </h4>
                </div>
            </div>  

            <div className="Benefits__image">
                <div className="Benefits__image__container">
                    <motion.div 
                        className="Benefits__image__Wrapper"
                        style={{
                            y: parallax1,
                            willChange: "transform",
                            transform: "translateZ(0)",
                            backfaceVisibility: "hidden",
                            perspective: "1000px",
                            contain: "layout style paint"
                        }}
                    >
                        <Image 
                            src={"/assets/img/img/2.jpg"}
                            alt="Benefits Image"
                            fill={true}
                            sizes="50vw"
                            className="Benefits__image__img"
                            priority={true}
                            quality={80}
                            placeholder="blur"
                            blurDataURL="/assets/img/2-blur.jpg"
                        />
                    </motion.div>
                </div>
                <div className="Benefits__image__container">
                    <motion.div 
                        className="Benefits__image__Wrapper"
                        style={{
                            y: parallax2,
                            willChange: "transform",
                            transform: "translateZ(0)",
                            backfaceVisibility: "hidden",
                            perspective: "1000px",
                            contain: "layout style paint"
                        }}
                    >
                        <Image 
                            src={"/assets/img/roller/3h.jpg"}
                            alt="Benefits Image"
                            fill={true}
                            sizes="50vw"
                            className="Benefits__image__img"
                            priority={true}
                            quality={80}
                            placeholder="blur"
                            blurDataURL="/assets/roller/3h-blur.jpg"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
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
            style={{ display: "inline-block", whiteSpace: "pre" }}
        >
            {word + " "}
        </motion.span>
    ));
}