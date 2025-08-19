"use client";

import Image from "next/image";
import { Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, Easing, motion } from "framer-motion";
import Nav from "./nav";
import Button from "./button";
import ScrollLink from "@modules/common/components/Buttons/ScrollLink";
import LinkButton from "@modules/common/components/Buttons/LinkButton";
import Magnetic from "@modules/common/components/Buttons/Magnetic";
import { iconLinks } from "constants/icons";
import NewsPopup from "./news";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import CartButton from "./cart";
import Cart from "@modules/common/icons/cart";
import { StoreCart, StoreRegion } from "@medusajs/types";
import RegionsSelect from "./regions";
import { useStateContext } from "@lib/context/StateContext";

type NavbarProps = {
    cart: StoreCart | null;
    regions: StoreRegion[];
}


export default function Navbar({ cart, regions }: NavbarProps) {
    const [isMobile, setIsMobile] = useState<boolean>(false)
    const [isTablet, setIsTablet] = useState<boolean>(false)
    const dimension = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
    const [isActive, setIsActive] = useState<boolean>(false);
    const { firstLoad } = useStateContext();

    // WIP: add in at the end of the navbar selection for shipment regions to choose their country

    const PreloaderAnim = {
        initial: {
            y: "-100%",
        },
        start: {
            y: "-100%",
            transition: {
                duration: 1.25,
                delay: !firstLoad ? 3 : 0,
                ease: [0.76, 0, 0.24, 1] as Easing,
            }
        },
        enter: {
            y: "0%",
            transition: {
                duration: 1.25,
                delay: !firstLoad ? 3 : 0,
                ease: [0.76, 0, 0.24, 1] as Easing,
            }
        },
    }

    // Dynamic menu animation based on device type
    const menu = {
        open: {
            width: isTablet ? "400px" : "97vw",
            height: isTablet ? "600px" : "85vh",
            top: "1.5vh",
            right: "1.5vw",
            transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] as Easing }
        },
        closed: {
            width: isTablet ? "100px" : "90px",
            height: isTablet ? "40px" : "35px",
            top: "1.5vh",
            right: "1.5vw",
            transition: { duration: 0.75, delay: 0.35, ease: [0.76, 0, 0.24, 1] as Easing }
        }
    }

    useEffect(() => {
        const updateDimensions = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            // Update dimensions ref
            dimension.current = { width, height };
            
            // Check if mobile (width smaller than height = portrait)
            const isMobileDevice = width < height;
            setIsMobile(isMobileDevice);
            
            // Check if tablet (mobile AND width > 550px)
            const isTabletDevice = isMobileDevice && width > 550;
            setIsTablet(isTabletDevice);
        };

        // Run on mount
        updateDimensions();

        // Add resize listener
        window.addEventListener('resize', updateDimensions);

        // Cleanup listener on unmount
        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, []);

    return (
        <>
            <motion.nav 
                className="Navbar"
                initial="initial"
                animate="enter"
                exit="exit"
                variants={PreloaderAnim}
            >
                {!isMobile && (
                    <div className="Navbar__Links">
                        <ul>
                            <li>
                                <ScrollLink
                                    href="#ome"
                                    text="O mě"
                                    className="Navbar__Links__Title"
                                    textColor="var(--ChText)"
                                />
                            </li>
                            <li>
                                <ScrollLink
                                    href="#kontakt"
                                    text="Kontakt"
                                    className="Navbar__Links__Title"
                                    textColor="var(--ChText)"
                                />
                            </li>
                            <li>
                                <ScrollLink
                                    href="#kurzy"
                                    text="Kurzy"
                                    className="Navbar__Links__Title"
                                    textColor="var(--ChText)"
                                />
                            </li>
                            <li>
                                <LinkButton 
                                    text="E-shop"
                                    href="/store"
                                />
                            </li>
                        </ul>
                    </div>
                )}
                <div className="Navbar__Logo">
                    <Magnetic>
                        <LocalizedClientLink href="/">
                            <Image 
                                src="/assets/icons/logo.svg"
                                alt="Logo"
                                width={100}
                                height={100}
                                className="Navbar__Logo"
                                priority={true}
                            />
                        </LocalizedClientLink>
                    </Magnetic>
                    <div className="Navbar__Logo__bg" style={{ backgroundColor: "var(--WhiteBg)", border: "0.5px solid var(--ButtonBorder)"}}/>
                </div>
                { !isMobile &&(
                    <div className="Navbar__Icons">
                        <ul>
                            <li>
                                <Magnetic>
                                    <LocalizedClientLink href="/search" className="Navbar__Icons__Search">
                                        <Image 
                                            src="/assets/icons/search.svg"
                                            alt="search Icon button"
                                            width={24}
                                            height={24}
                                            className="Navbar__Icon"
                                        />
                                    </LocalizedClientLink>
                                </Magnetic>
                            </li>
                            <li>
                                <Magnetic>
                                    <LocalizedClientLink href="/cart">
                                        <Image 
                                            src="/assets/icons/bookmark.svg"
                                            alt="search Icon button"
                                            width={24}
                                            height={24}
                                            className="Navbar__Icon"
                                        />
                                    </LocalizedClientLink>
                                </Magnetic>
                            </li>
                            <li>
                                <Suspense
                                    fallback={
                                        <LocalizedClientLink
                                            className="hover:text-ui-fg-base flex gap-[2.5px] items-center justify-start flex-col"
                                            href="/cart"
                                            data-testid="nav-cart-link"
                                        >
                                            <Cart />
                                            {0}
                                        </LocalizedClientLink>
                                    }
                                >
                                    <CartButton  cart={cart}/>
                                </Suspense>
                            </li>
                            <li>
                                <Magnetic>
                                    <LocalizedClientLink href="/account">
                                            <Image 
                                                src="/assets/icons/user.svg"
                                                alt="search Icon button"
                                                width={30}
                                                height={30}
                                                className="Navbar__Icon"
                                            />
                                        </LocalizedClientLink>
                                </Magnetic>
                            </li>
                            <li>
                                <RegionsSelect 
                                    regions={regions}
                                />
                            </li>
                        </ul>
                    </div>
                )}
                {isMobile && (
                    <div className="Navbar__Mobile">
                        <motion.div 
                            className="Navbar__Mobile__Menu"
                            variants={menu}
                            animate={isActive ? "open" : "closed"}
                            initial="closed"
                            key={isTablet ? 'tablet' : 'phone'} // Force re-render when device type changes
                        >
                            <AnimatePresence>
                                {isActive && <Nav isActive={isActive} setIsActive={setIsActive} regions={regions} />}
                            </AnimatePresence>
                        </motion.div>
                        <Button isActive={isActive} toggleMenu={() => {setIsActive(!isActive)}}/>
                    </div>
                )}
            </motion.nav>
            {isMobile && <MobileIconsNavbar />}

            <NewsPopup firstLoad={firstLoad}/>
        </>
    );
}

export const  MobileIconsNavbar = () => {
    return (
    <motion.div className="Navbar__subFooter">
        <div className="Navbar__Icons">
            <ul>
                {iconLinks.map((icon, i) => (
                    <li
                        key={icon.alt + i}
                    >
                        <Image 
                            src={icon.src}
                            alt={icon.alt}
                            width={icon.width}
                            height={icon.height}
                            className="Navbar__Icon"
                        />
                    </li>
                ))}
            </ul>
        </div>
    </motion.div>
    )
}