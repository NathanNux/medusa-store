"use client";

import MouseAnim from "@modules/common/components/MouseAnim";
import RotatingText from "@modules/common/components/RotatingText";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";


export default function Entry () {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Use fewer, shared transforms
    const transforms = {
        slow: {
            y: useTransform(scrollYProgress, [0, 1], ["-2%", "8%"]),
            scale: useTransform(scrollYProgress, [0, 1], [1.1, 1.15])
        },
        medium: {
            y: useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]),
            scale: useTransform(scrollYProgress, [0, 1], [1.1, 1.18])
        },
        fast: {
            y: useTransform(scrollYProgress, [0, 1], ["-8%", "3%"]),
            scale: useTransform(scrollYProgress, [0, 1], [1.1, 1.2])
        }
    };

    const images = [
        {
            src: "/assets/img/roller/10v.jpg",
            alt: "Entry Image 1",
            transform: transforms.slow
        },
        {
            src: "/assets/img/roller/5h.jpg",
            alt: "Entry Image 2",
            transform: transforms.medium
        },
        {
            src: "/assets/img/roller/11v.jpg",
            alt: "Entry Image 3",
            transform: transforms.fast
        },
        {
            src: "/assets/img/roller/6h.jpg",
            alt: "Entry Image 4",
            transform: transforms.medium
        },
        {
            src: "/assets/img/roller/12h.jpg",
            alt: "Entry Image 5",
            transform: transforms.slow
        }
    ];

    return (
        <section className="ECom__Entry" ref={ref}>
            <div className="ECom__Entry__title">
                <h2>Vstoupit Dovnitř</h2>
                <MouseAnim />
            </div>

            <div className="ECom__Entry__content">
                <div className="ECom__Entry__content__images">
                    <div className="ECom__Entry__Gradient">
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
                    <div className="ECom__Entry__Gradient">
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
                <div className="ECom__Entry__content__images__upper">
                    {images.slice(0,3).map((image, index) => (
                        <div className="ECom__Entry__content__images__upper__item" key={index}>
                           <motion.div className="ECom__Entry__content__images__upper__item__img__container" style={{ y: image.transform.y, scale: image.transform.scale }}>
                                <Image
                                    src={image.src} 
                                    alt={image.alt} 
                                    className="ECom__Entry__content__images__upper__item__img"
                                    fill={true}
                                    priority={index < 3}
                                    sizes="50vw"
                                />
                           </motion.div>
                        </div>
                    ))}
                </div>

                <div className="ECom__Entry__content__text">
                    <RotatingText text="mé - výrobky - mé výrobky - mé výrobky -" textColor="var(--Wtext)"/>
                </div>

                <div className="ECom__Entry__content__images__lower">
                    {images.slice(3,5).map((image, index) => (
                        <div className="ECom__Entry__content__images__upper__item" key={index}>
                            <motion.div className="ECom__Entry__content__images__upper__item__img__container" style={{ y: image.transform.y, scale: image.transform.scale }}>
                                <Image
                                    src={image.src} 
                                    alt={image.alt} 
                                    className="ECom__Entry__content__images__upper__item__img"
                                    fill={true}
                                    priority={index < 3}
                                    sizes="50vw"
                                />
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}