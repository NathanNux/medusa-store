"use client"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import styles from "./styles/oder-complete.module.scss"
import { useRef } from "react"

const ImageParallax = () => {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])
  return (
    <div className={styles.ImageParallax} ref={ref}>
      <motion.div className={styles.ImageContainer} style={{ y }}>
        <div className={styles.ImageOverlay} />
        <Image
          src={"/assets/img/img/2.jpg"}
          alt="Order Completed"
          layout="fill"
          objectFit="cover"
        />
      </motion.div>
    </div>
  )
}

export default ImageParallax
