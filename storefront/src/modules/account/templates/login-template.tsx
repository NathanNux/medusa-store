"use client"

import { useRef, useState } from "react"
import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"
import { AnimatePresence, Easing, motion, useScroll, useTransform } from "framer-motion"

import styles from "./styles/login.module.scss"
import Image from "next/image"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const bgImages = [
  {
    src: "/assets/img/img/1.jpg",
    alt: "Login"
  },
  {
    src: "/assets/img/img/2.jpg",
    alt: "Register"
  },
]

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])

  return (
    <div className={styles.container} ref={ref}>
      <AnimatePresence mode="wait" initial={false}>
        {(() => {
          const isSignIn = currentView === LOGIN_VIEW.SIGN_IN || currentView === "sign-in"
          const img = isSignIn ? bgImages[0] : bgImages[1]
          return (
            <motion.div
              key={isSignIn ? "bg-login" : "bg-register"}
              className={styles.ImageContainer}
              initial={{ opacity: 0.75 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.75 }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] as Easing }}
            >
              <motion.div className={styles.Image} style={{ y }}>
                <div className={styles.ImageOverlay} />
                <Image
                  src={img.src}
                  alt={img.alt}
                  layout="fill"
                  objectFit="cover"
                />
              </motion.div>
            </motion.div>
          )
        })()}
      </AnimatePresence>
      {currentView === "sign-in" ? (
        <Login setCurrentView={setCurrentView} />
      ) : (
        <Register setCurrentView={setCurrentView} />
      )}
    </div>
  )
}

export default LoginTemplate