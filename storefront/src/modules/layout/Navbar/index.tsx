"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, Easing, motion } from "framer-motion";
import Nav from "./nav";
import Button from "./button";
import ScrollLink from "@modules/common/components/Buttons/ScrollLink";
import LinkButton from "@modules/common/components/Buttons/LinkButton";
import Magnetic from "@modules/common/components/Buttons/Magnetic";
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
    isLoggedIn?: boolean;
    wishlistItems?: any[];
}

export default function Navbar({ cart, regions, isLoggedIn, wishlistItems = [] }: NavbarProps) {
    const [isMobile, setIsMobile] = useState<boolean>(false)
    const [isTablet, setIsTablet] = useState<boolean>(false)
    const dimension = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
    const [isActive, setIsActive] = useState<boolean>(false);
    const { firstLoad } = useStateContext();


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
            width: isTablet ? "450px" : "97dvw",
            height: isTablet ? "700px" : "85dvh",
            top: "1.5dvh",
            right: "1.5dvw",
            transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] as Easing }
        },
        closed: {
            width: isTablet ? "100px" : "90px",
            height: isTablet ? "40px" : "35px",
            top: "1.5dvh",
            right: "1.5dvw",
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
                            {isLoggedIn && (
                              <li>
                                  <Magnetic>
                                      <LocalizedClientLink href="/account/wishlist" className="relative">
                                          <Image 
                                              src="/assets/icons/bookmark.svg"
                                              alt="wishlist Icon button"
                                              width={24}
                                              height={24}
                                              className="Navbar__Icon"
                                          />
                                          {wishlistItems.length > 0 && (
                                              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                  {wishlistItems.length}
                                              </span>
                                          )}
                                      </LocalizedClientLink>
                                  </Magnetic>
                              </li>
                            )}
                            <li>
                                <Suspense
                                    fallback={
                                        <LocalizedClientLink
                                            className="hover:text-ui-fg-base flex gap-[2.5px] items-center justify-start flex-col"
                                            href="/cart"
                                            data-testid="nav-cart-link"
                                        >
                                            <Cart />
                                            <span className="cart__span">{0}</span>
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
                {isMobile && (
                    <div className="StoreLink__Container">
                        <LinkButton href="/store" text="E-shop"/>
                    </div>
                )}
            </motion.nav>
            {isMobile && <MobileIconsNavbar cart={cart} isLoggedIn={isLoggedIn} wishlistItems={wishlistItems} />}

            <NewsPopup firstLoad={firstLoad}/>
        </>
    );
}
type MobileIconsNavbarProps = {
  cart: StoreCart | null;
  isLoggedIn?: boolean;
  wishlistItems?: any[];
};

export const  MobileIconsNavbar = ({ cart, isLoggedIn, wishlistItems = [] }: MobileIconsNavbarProps) => {
    const { firstLoad } = useStateContext();
    const [activeIdx, setActiveIdx] = useState<number | null>(null);
    const icons = useMemo(() => [
        { href: "/search", icon: <Image src="/assets/icons/search.svg" alt="search Icon button" width={40} height={40} className="Navbar__Icon" /> },
        ...(isLoggedIn ? [{ href: "/account/wishlist", icon: <Image src="/assets/icons/bookmark.svg" alt="bookmark Icon button" width={40} height={40} className="Navbar__Icon" />, hasCounter: true, counter: wishlistItems.length }] : []),
        { href: "/cart", icon: <Cart />, isCart: true },
        { href: "/account", icon: <Image src="/assets/icons/user.svg" alt="user Icon button" width={40} height={40} className="Navbar__Icon" /> },
    ], [isLoggedIn, wishlistItems.length]);
    const PreloaderAnim = {
        initial: {
            y: "100%",
        },
        start: {
            y: "100%",
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

    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
    useEffect(() => {
        const idx = icons.findIndex(icon => pathname.startsWith(icon.href));
        setActiveIdx(idx !== -1 ? idx : null);
    }, [pathname, icons]);

    return (
        <motion.div 
            className="Navbar__subFooter"
            initial="initial"
            animate="enter"
            exit="exit"
            variants={PreloaderAnim}
        >
            <div className="Navbar__Icons">
                <ul>
                    {icons.map((item, idx) => (
                        <li key={idx} className={activeIdx === idx ? "active" : ""}>
                            {item.isCart ? (
                                <Suspense
                                    fallback={
                                        <LocalizedClientLink
                                            className="hover:text-ui-fg-base flex gap-[2.5px] items-center justify-start flex-col"
                                            href="/cart"
                                            data-testid="nav-cart-link"
                                        >
                                            <Cart />
                                            <span className="cart__span">{0}</span>
                                        </LocalizedClientLink>
                                    }
                                >
                                    <CartButton cart={cart} />
                                </Suspense>
                            ) : (
                                <LocalizedClientLink href={item.href} className={`relative ${item.href === "/search" ? "Navbar__Icons__Search" : ""}`}>
                                    <Magnetic>
                                        {item.icon}
                                        {item.hasCounter && item.counter > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                {item.counter}
                                            </span>
                                        )}
                                    </Magnetic>
                                </LocalizedClientLink>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}