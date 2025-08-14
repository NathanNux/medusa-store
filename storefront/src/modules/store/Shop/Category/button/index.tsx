import { motion } from 'framer-motion';
import style from './styles.module.scss';
import Image from 'next/image';

// Mobile Category Button Component (similar to navbar Button)
export default function CategoryButton({ isActive, toggleMenu }: { isActive: boolean; toggleMenu: () => void }) {
    return (
        <div className={style.button}>
            <motion.div 
                className={style.slider}
                animate={{top: isActive ? "-100%" : "0%"}}
                transition={{ duration: 0.5, type: "tween", ease: [0.76, 0, 0.24, 1]}}
            >
                <div 
                    className={style.el}
                    onClick={toggleMenu}
                >
                    <CategoryPerspectiveText src="/assets/icons/options_white.svg"/>
                </div>
                <div 
                    className={style.el}
                    onClick={toggleMenu}
                >
                    <CategoryPerspectiveText src="/assets/icons/options_white.svg" />
                </div>
            </motion.div>
        </div>
    );
}

function CategoryPerspectiveText({ src }: { src: string }) {
    return (    
        <div className={style.perspectiveText}>
            <Image src={src} alt="Menu Icon" width={30} height={30} />
            <Image src={src} alt="Menu Icon" width={30} height={30} />
        </div>
    );
}