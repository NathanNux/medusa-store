"use client";

import Magnetic from "@modules/common/components/Buttons/Magnetic";
import ScrollLink from "@modules/common/components/Buttons/ScrollLink";
import { paymentIcons, paymentIconsWhite } from "constants/icons";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Footer() {
  const pathname = usePathname();
  const params = useParams();
  const countryCode = params?.countryCode as string | undefined;

  const [footerColors, setFooterColors] = useState({
    bg: "var(--WhiteBg)",
    text: "var(--ChText)",
    border: "var(--CharcoalBg)",
    altBg: "var(--WhiteBg)",
    altBorder: "var(--CharcoalBg)",
    scrollLinkBorder: "var(--ButtonBorder)",
    footerBorder: "var(--CharcoalBg)",
    IGsrc: "/assets/icons/instagram.svg",
    FBsrc: "/assets/icons/facebook.svg",
    logoSrc: "/assets/icons/logo.svg",
    pillarSrc: "/assets/icons/pillar.svg",
    divider: "var(--CharcoalBg)",
    paymentIcons: paymentIcons,
    gradient: false
  });

  useEffect(() => {
    // If on homepage or /{countryCode}, use white variant, else black
    if (pathname === "/" || (countryCode && pathname === `/${countryCode}`)) {
      setFooterColors({
        bg: "var(--WhiteBg)",
        text: "var(--ChText)",
        border: "var(--CharcoalBg)",
        altBg: "var(--WhiteBg)",
        altBorder: "var(--CharcoalBg)",
        scrollLinkBorder: "var(--ButtonBorder)",
        footerBorder: "var(--CharcoalBg)",
        IGsrc: "/assets/icons/instagram.svg",
        FBsrc: "/assets/icons/facebook.svg",
        logoSrc: "/assets/icons/logo.svg",
        pillarSrc: "/assets/icons/pillar.svg",
        divider: "var(--CharcoalBg)",
        paymentIcons: paymentIcons,
        gradient: false
      });
    } else {
      setFooterColors({
        bg: "var(--OliveBg)",
        text: "var(--Wtext)",
        border: "var(--WhiteBg)",
        altBg: "var(--OliveBg)",
        altBorder: "var(--WhiteBg)",
        scrollLinkBorder: "var(--WhiteBg)",
        footerBorder: "var(--WhiteBg)",
        IGsrc: "/assets/icons/instagram_white.svg",
        FBsrc: "/assets/icons/facebook_white.svg",
        logoSrc: "/assets/icons/logo.svg",
        pillarSrc: "/assets/icons/pillar_white.svg",
        divider: "var(--WhiteBg)",
        paymentIcons: paymentIconsWhite,
        gradient: true
      });
    }
  }, [pathname, countryCode]);

    return (
        <footer
            className="footer"
            style={{
                backgroundColor: footerColors.bg,
                color: footerColors.text,
            }}
        >
            <div className="footer__background">
                { footerColors.gradient && (<div className="footer__gradient">
                    <svg width={400} height={400} viewBox="0 0 1182 1118" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_f_1099_194)">
                            <path d="M665.894 600.007C701.887 608.096 754.931 717.024 618.533 717.024C601.275 717.024 539.174 708.499 539.169 631.257C539.169 613.998 573.811 571.154 591.069 571.154C608.328 571.154 640.319 585.363 665.894 600.007Z" fill="#FFE0C7" fillOpacity="0.5"/>
                            <path d="M740.718 534.27C776.712 542.358 829.755 651.287 693.358 651.287C676.099 651.287 613.998 642.762 613.994 565.52C613.994 548.261 766.299 621.356 665.894 505.417C683.152 505.417 715.143 519.625 740.718 534.27Z" fill="#FFE0C7" fillOpacity="0.5"/>
                            <path d="M547.848 462.385C583.842 470.474 616.605 666.221 480.208 666.221C462.949 666.221 400.849 657.696 400.844 580.454C400.844 563.195 402.717 484.171 419.976 484.171C437.235 484.171 565.287 389.775 547.848 462.385Z" fill="#FFE0C7" fillOpacity="0.5"/>
                            <path d="M683.275 436.704C719.268 444.792 772.312 553.721 635.915 553.721C618.656 553.721 556.555 545.196 556.55 467.954C556.55 450.695 591.192 407.851 608.451 407.851C625.709 407.851 694.077 379.889 683.275 436.704Z" fill="#FFE0C7" fillOpacity="0.5"/>
                        </g>
                        <defs>
                            <filter id="filter0_f_1099_194" x="0.84375" y="0.970703" width="1180.86" height="1116.05" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feGaussianBlur stdDeviation="40" result="effect1_foregroundBlur_1099_194"/>
                            </filter>
                        </defs>
                    </svg>
                </div>)}
            </div>
            <div className="footer__head">
                <div className="footer__head__bg">
                    <svg
                        className="divider"
                        width="100vw"
                        height="4vw"
                        viewBox="0 0 100 4"
                        style={{ display: "block",zIndex: 1 }}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect
                            x="0"
                            y="1.95"
                            width="100"
                            height="0.1"
                            fill={footerColors.altBorder}
                            mask="url(#divider-mask-1)"
                        />
                    </svg>
                    <div className="footer__head__bg__overlay">
                        <svg
                            className="divider"
                            width="10vw"
                            height="10vw"
                            viewBox="0 0 100 4"
                            style={{ display: "block", zIndex: 1 }}
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <mask id="divider-mask-1">
                                    <rect x="0" y="1.95" width="100" height="0.1" fill="white" />
                                    <ellipse
                                        cx="50"
                                        cy="2"
                                        rx="4.5"
                                        ry="0.18"  // 5 * (4/100) = 0.2
                                        fill="black"
                                    />
                                </mask>
                            </defs>
                        </svg>
                    </div>
                    <svg
                        className="divider"
                        width="100vw"
                        height="4vw"
                        viewBox="0 0 100 4"
                        style={{ display: "block", zIndex: 1 }}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect
                            x="0"
                            y="1.95"
                            width="100"
                            height="0.1"
                            fill={footerColors.altBorder}
                            mask="url(#divider-mask-1)"
                        />
                    </svg>
                </div>

                <div
                    className="footer__head__logo"
                    style={{
                        border: `1px solid ${footerColors.altBorder}`,
                        backgroundColor: "transparent",
                    }}
                >
                    <Image
                        src="/assets/icons/logo.svg"
                        alt="Logo"
                        width={100}
                        height={100}
                        className="footer__head__logo__img"
                        priority={true}
                    />
                </div>

                <div className="footer__head__socials">
                   <Magnetic>
                        <Link href="https://www.instagram.com/luciepolanska/" target="_blank" rel="noopener noreferrer">
                            <Image
                                src={footerColors.IGsrc}
                                alt="Instagram Icon"
                                width={5}
                                height={35}
                                className="footer__head__socials__icon"
                            />
                        </Link>
                   </Magnetic>
                    <Magnetic>
                        <Link href="https://www.instagram.com/luciepolanska/" target="_blank" rel="noopener noreferrer">
                            <Image
                                src={footerColors.FBsrc}
                                alt="Facebook Icon"
                                width={30}
                                height={30}
                                className="footer__head__socials__icon"
                            />
                        </Link>
                    </Magnetic>
                </div>

                <div className="footer__head__Titles">
                    <h3 style={{ color: footerColors.text }}>Lucie Polanská</h3>
                    <h3 style={{ color: footerColors.text }}>Keramická Zahrada</h3>
                </div>
            </div>

            <div className="footer__content">
                <div className="footer__content__info">
                    <h3 style={{ color: footerColors.text }}>Otevírací doba:</h3>
                    <ul style={{ color: footerColors.text }}>
                        <li style={{ color: footerColors.text }}>Dle telefonické domluvy</li>
                        <li style={{ color: footerColors.text }}>Tel: +420 775 211 578</li>
                        <li style={{ color: footerColors.text }}>Volejte mezi  9 - 17:00</li>
                    </ul>
                </div>
                <div className="footer__content__products" style={{ color: footerColors.text }}>
                    <h3 style={{ color: footerColors.text }}>Výrobky - Katalog</h3>
                    <ul style={{ color: footerColors.text }}
                        // WIP: Create there the categories of products from the prev navbar, or as I see it now, there will not be pages for the categories, so just the links to the product category in the main store 
                    >
                        <li style={{ color: footerColors.text }}>Zvonky a Tlačítka</li>
                        <li style={{ color: footerColors.text }}>Venkovní Keramika</li>
                        <li style={{ color: footerColors.text }}>Interiérové Keramika</li>
                    </ul>
                </div>
            </div>

            <div className="footer__pillar">
                <div className="footer__pillar__img">
                    <div className="footer__pillar__img__container">
                        <Image
                            src={footerColors.pillarSrc}
                            alt="Pillar Icon"
                            width={100}
                            height={100}
                            className="footer__pillar__img__icon"
                        />
                    </div>
                </div>
            </div>

            <div className="footer__bottom__upper"
                style={{
                    borderTop: `0.5px solid ${footerColors.footerBorder}`,
                }}
            >
                <div className="divider" style={{ backgroundColor: `${footerColors.divider}`}}/>
                <div className="footer__bottom__links">
                    <ScrollLink
                        href="doprava-a-platba"
                        text="Doprava a platba"
                        textColor={footerColors.text}
                    />
                    <ScrollLink
                        href="odstoupeni-od-smlouvy"
                        text="Odstoupení od smlouvy"
                        textColor={footerColors.text}
                    />
                </div>
                <div className="footer__bottom__Icons">
                    {footerColors.paymentIcons.map((icon, index) => (
                        <div key={index} className="footer__bottom__Icons__Item">
                            <Magnetic>
                                <Link href={icon.href} className="footer__bottom__Icons__link" target="_blank" rel="noopener noreferrer">
                                    <Image
                                        key={index}
                                        src={icon.src}
                                        alt={icon.alt}
                                        fill
                                        className="footer__bottom__Icons__icon"
                                    />
                                </Link>
                            </Magnetic>
                        </div>
                    ))}
                </div>
            </div>
            <div className="footer__bottom"
                style={{
                    borderTop: `0.5px solid ${footerColors.footerBorder}`,
                    borderBottom: `0.5px solid ${footerColors.footerBorder}`,
                }}
            >
                <div className="divider" style={{ backgroundColor: `${footerColors.divider}`}}/>
                <div className="footer__bottom__links__left">
                    <ScrollLink
                        href="#mapa"
                        text="Kde mě najdete"
                        className="footer__bottom__links__left__title"
                        textColor={footerColors.text}
                        borderColor={footerColors.scrollLinkBorder}
                    />
                    <ScrollLink
                        href="smluvni-podminky"
                        text="Smluvní podmínky"
                        className="footer__bottom__links__left__title"
                        textColor={footerColors.text}
                        borderColor={footerColors.scrollLinkBorder}
                    />
                </div>
                <div className="footer__bottom__links__center">
                    <ScrollLink
                        href="#ome"
                        text="O mě"
                        className="footer__bottom__links__center__title"
                        textColor={footerColors.text}
                        borderColor={footerColors.scrollLinkBorder}
                        borderR={true}
                        borderL={true}
                    />
                    <ScrollLink
                        href="#Kontakt"
                        text="Kontakt"
                        className="footer__bottom__links__center__title"
                        textColor={footerColors.text}
                        borderColor={footerColors.scrollLinkBorder}
                        borderR={true}
                    />
                    <ScrollLink
                        href="#Kurzy"
                        text="Kurzy"
                        className="footer__bottom__links__center__title"
                        textColor={footerColors.text}
                        borderColor={footerColors.scrollLinkBorder}
                        borderR={true}
                    />
                    <ScrollLink
                        href="store"
                        text="E-shop"
                        className="footer__bottom__links__center__title"
                        textColor={footerColors.text}
                        borderColor={footerColors.scrollLinkBorder}
                        borderR={true}
                    />
                </div>
                <div className="footer__bottom__links__right">
                    <ScrollLink
                        href="Cookies"
                        text="Cookies"
                        className="footer__bottom__links__right__title"
                        textColor={footerColors.text}
                        borderColor={footerColors.scrollLinkBorder}
                    />
                    <ScrollLink
                        href="ochrana-osobnich-udaju"
                        text="Ochrana Osobních údajů"
                        className="footer__bottom__links__right__title"
                        textColor={footerColors.text}
                        borderColor={footerColors.scrollLinkBorder}
                    />
                </div>
            </div>

            <div className="footer__trademark">
                <p style={{ color: footerColors.text }} 
                    //WIP: create a link to the C3Studium website with custom styling and custom animation
                >
                    design & kód od C3Studium
                </p>
                <p style={{ color: footerColors.text }}>
                    Lucie Polanská - copyright ©2025 všechna práva vyhrazena
                </p>
            </div>
        </footer>
    );
}