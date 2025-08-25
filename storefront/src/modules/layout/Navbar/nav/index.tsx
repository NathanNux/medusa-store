import styles from './styles.module.scss';
import { Easing, motion } from 'framer-motion';
import { links, footerLinks } from '../data';
import Image from 'next/image';
import CountrySelect from '@modules/layout/components/country-select';
import { HttpTypes } from '@medusajs/types';
import useToggleState from '@lib/hooks/use-toggle-state';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

type NavbarProps = {
    isActive: boolean;
    setIsActive: (active: boolean) => void;
    regions: HttpTypes.StoreRegion[];
}

export default function index({ isActive, setIsActive, regions }: NavbarProps) {
    const toggleState = useToggleState();
    const perspective = {
        initial: {
            opacity: 0,
            rotateX: 90,
            translateY: 80,
            translateX: 20,
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
            transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] as Easing}
        }
    }

    const slideIn = {
        initial: {
            opacity: 0,
            y: 20
        },
        enter: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { 
                duration: 0.5,
                delay: 0.75 + (i * 0.1), 
                ease: [.215,.61,.355,1] as Easing,
            }
        }),
        exit: {
            opacity: 0,
            transition: { duration: 0.5 , ease: "easeInOut" as Easing}
        }
    }

    const closeMenu = () => {
        setIsActive(!isActive);
    }

    return (
        <div className={styles.nav}>
            <div className={styles.header}>
                <motion.div 
                    className={styles.logo}
                    variants={perspective}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    custom={1}
                >
                    <LocalizedClientLink href="/" onClick={closeMenu}>
                        <Image 
                            src="/assets/icons/logo.svg"
                            alt="Logo"
                            width={150}
                            height={150}
                            className={styles.logoImage}
                            priority={true}
                        />
                    </LocalizedClientLink>
                </motion.div>
                <motion.div 
                    className={styles.logoTitle}
                    variants={perspective}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    custom={2}
                >
                    <h3>Keramická Zahrada</h3>
                </motion.div>
            </div>
           <div className={styles.body}>
            {
                links.map( (link, i) => {
                    const { title, href } = link;
                    return (
                        <div key={`b_${i}`} className={styles.linkContainer}>
                            <motion.div
                              custom={i}
                              variants={perspective}
                              initial="initial"
                              animate="enter"
                              exit="exit"
                            >
                                <LocalizedClientLink href={href} onClick={closeMenu}>
                                    <p>{title}</p>
                                </LocalizedClientLink>
                            </motion.div>
                        </div>
                    )
                })
            }
           </div>
            <motion.div className={styles.footer}>
                {
                    footerLinks.map( (link, i) => {
                        const { title, href } = link;
                        return (
                            <motion.div 
                                variants={slideIn}
                                custom={i} 
                                initial="initial"
                                animate="enter"
                                exit="exit"
                                key={`f_${i}`}
                                className={styles.a}
                            >
                                <LocalizedClientLink href={href} onClick={closeMenu}>
                                    {title}
                                </LocalizedClientLink>
                            </motion.div>
                        )
                    })
                }
           </motion.div>
           <motion.div 
            className={styles.country__Select}
            variants={perspective}
            initial="initial"
            animate="enter"
            exit="exit"
            custom={3}
           >
                <CountrySelect toggleState={toggleState} regions={regions} />
           </motion.div>
        </div>
    )
}