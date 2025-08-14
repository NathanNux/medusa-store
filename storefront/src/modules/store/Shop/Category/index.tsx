"use client";
import Image from "next/image";
import { AnimatePresence, Easing, motion } from "framer-motion";
import { useEffect, useState } from "react";
import CategoryNav from "./nav";
import CategoryButton from "./button";

type CategoryProps = {
    category: string;
    setCategoryAction: (c: string) => void;
    categories?: { id: string; name: string }[];
};


export default function Categories({ category, setCategoryAction, categories }: CategoryProps) {
    const [isMobile, setIsMobile] = useState(true);
    const [isActive, setIsActive] = useState(false);

    // Mobile menu animation
    const menu = {
        open: {
            width: "90vw",
            height: "65vh",
            top: "1vh",
            left: "2vw",
            transition: { duration: 0.75, type: "tween" as const, ease: [0.76, 0, 0.24, 1] as Easing}
        },
        closed: {
            width: "50px",
            height: "50px",
            top: "1vh",
            left: "2vw",
            transition: { duration: 0.75, delay: 0.35, type: "tween" as const, ease: [0.76, 0, 0.24, 1] as Easing }
        }
    }

    return (
        <div className="categories">
            {isMobile && (
                // Mobile Category Menu
                <div className="categories__mobile">
                    <motion.div 
                        className="categories__mobile__menu"
                        variants={menu}
                        animate={isActive ? "open" : "closed"}
                        initial="closed"
                    >
                        <AnimatePresence>
                            {isActive && (
                                <CategoryNav 
                                    category={category}
                                    setCategoryAction={setCategoryAction}
                                    categories={categories}
                                />
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {isActive && (
                                <motion.div className="categories__mobile__button__confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 , transition: { delay: 0.5}}} exit={{ opacity: 0 }}>
                                    <button className="confirm__button" onClick={() => setIsActive(false)}>
                                        <p>Potvrdit</p>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                    <CategoryButton 
                        isActive={isActive} 
                        toggleMenu={() => setIsActive(!isActive)}
                    />
                </div>
            )}
        </div>
    );
}