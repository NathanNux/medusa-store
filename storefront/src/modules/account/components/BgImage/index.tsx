"use client"
import { useRef } from 'react';
import styles from './style.module.scss'

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

export default function BgImage({ src }: { src?: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "15%"])

    return (
        <div className={styles.root} ref={ref}>
            <motion.div style={{ y }} className={styles.ImageContainer}>
                <Image 
                    src={src || "/assets/img/img/2.jpg"}
                    alt="Background image"
                    layout="fill"
                    objectFit="cover"
                />
                <div className={styles.bg} />
            </motion.div>
        </div>
    )
}