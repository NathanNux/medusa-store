"use client"
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

import s from "./style.module.scss"
import { useRef } from "react";

export default function ParallaxImage () {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress} = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "15%"])
    return(
        <div className={s.ImageContainer} ref={ref}>
            <motion.div className={s.Image} style={{ y }}>
                <div className={s.ImageOverlay}/>
                <Image 
                    src={"/assets/img/img/1.jpg"}
                    alt="Cart Image"
                    layout="fill"
                    objectFit="cover"
                />
            </motion.div>
        </div>
    )
}