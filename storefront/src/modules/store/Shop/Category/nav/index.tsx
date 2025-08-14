"use client";
import Image from "next/image";
import { AnimatePresence, Easing, motion } from "framer-motion";
import style from "./styles.module.scss"; 

type CategoryProps = {
    category: string;
    setCategoryAction: (c: string) => void;
    categories?: { id: string; name: string }[];
};

export default function CategoryNav({ category, setCategoryAction, categories }: CategoryProps) {
    const perspective = {
        initial: {
            opacity: 0,
            rotateX: 90,
            translateY: 80,
            translateX: -20,
        },
        enter: (i: number) => ({
            opacity: 1,
            rotateX: 0,
            translateY: 0,
            translateX: 0,
            transition: {
                duration: 0.65, 
                delay: 0.5 + (i * 0.1), 
                ease: [.215,.61,.355,1] as Easing,
                opacity: { duration: 0.35}
            }
        }),
        exit: {
            opacity: 0,
            transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] as Easing }
        }
    }

    const handleCategoryClick = (catName: string) => {
        if (category === catName) {
            setCategoryAction("");
        } else {
            setCategoryAction(catName);
        }
    }

    return (
        <div className={style.navCat}>
            <div className={style.bodyCat}>
                {categories?.map((cat, i) => (
                    <div key={cat.id} className={style.linkContainerCat}>
                        <motion.div
                            custom={i}
                            variants={perspective}
                            initial="initial"
                            animate="enter"
                            exit="exit"
                            className={`${style.category__nav__item} ${category === cat.name ? "active" : ""}`}
                            onClick={() => handleCategoryClick(cat.name)}
                            style={{
                                backgroundColor: category === cat.name ? "var(--CharcoalBg)" : "var(--WhiteBg)",
                            }}
                        >
                            <p
                                style={{
                                    color: category === cat.name ? "var(--WhiteBg)" : "var(--ChText)",
                                }}
                            >
                                {cat.name}
                            </p>
                            <motion.div className={style.category__icon}
                                initial={{ rotate: 0 }}
                                animate={{ rotate: category === cat.name ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                style={{
                                    borderColor: category === cat.name ? "var(--WhiteBg)" : "var(--ButtonBorder)",
                                }}
                            >
                                <AnimatePresence>
                                    {category === cat.name && (
                                        <Image 
                                            src="/assets/icons/arrow_up_white.svg"
                                            alt="arrow up icon" 
                                            width={20} 
                                            height={20} 
                                            className="arrow__icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCategoryAction("");
                                            }}
                                        />
                                    )}
                                    {category !== cat.name && (
                                        <Image 
                                            src="/assets/icons/arrow_up.svg"
                                            alt="arrow right icon" 
                                            width={20} 
                                            height={20} 
                                            className={style.arrow__icon}
                                            onClick={e => {
                                                e.stopPropagation();
                                                setCategoryAction("");
                                            }}
                                        />
                                    )}
                                </AnimatePresence>   
                            </motion.div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
    );
}