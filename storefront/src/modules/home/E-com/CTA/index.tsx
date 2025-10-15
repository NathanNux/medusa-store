"use client";
import LinkButton from '@modules/common/components/Buttons/LinkButton';
import { CTAImages } from 'constants/images';
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { client } from "../../../../sanity/lib/client";
import { urlFor } from "../../../../sanity/lib/image";

export default function CTA () {
    const [ctaData, setCtaData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await client.fetch('*[_type == "ecomCTA"][0]');
            setCtaData(data);
        };
        fetchData();
    }, []);

    return (
        <section className="cta">
            <div className='cta__content'>
                {ctaData?.title ? (
                    <h2 className='cta__title'>
                        {titleWithBreaks(ctaData.title)}
                    </h2>
                ):(
                    <h2 className='cta__title'>
                        Keramika jako tiché <br /> spojení s přírodou.
                    </h2>
                    )}
                <LinkButton 
                    href="/store"
                    text={ctaData?.buttonText || "Navštívit E-shop"}
                />
            </div>

            <div className='cta__image__bar'>
                <RotatingBar images={ctaData?.images || CTAImages} />
            </div>
        </section>
    );
}

const RotatingBar = ({ images }: { images: any[] }) => {
    const {scrollY} = useScroll();
    const BaseVelocity = 100;

    const currentRotation = useMotionValue(0);
    const isAnimating = useRef(true);

    const velocity = useVelocity(scrollY);
    const SmoothVelocity = useSpring(velocity, {
        stiffness: 400, 
        damping: 50
    });


    const velocityFactor = useTransform(SmoothVelocity, [0, 1000], [0, 5], {clamp: false}); // clamp: false => value will exceed the range if it is outside of the range
    const x = useTransform(currentRotation, (v) => `${v}px`);
    const directionFactor = useRef(1);
    
    useAnimationFrame((t, delta) => {
        if (!isAnimating.current) return;

        let moveBy = directionFactor.current * BaseVelocity * (delta / 1000);

        if(velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();
        currentRotation.set(currentRotation.get() + moveBy);
    })

    useEffect(() => {
        const unsubscribe = currentRotation.on("change", (v) => {
            if (v > 5000 || v < -5000) {
                currentRotation.set(0);
            }
        });
        return unsubscribe;
    }, [currentRotation]);

    return (
        <div className="cta__rotating__bar">
            <motion.div style={{ x, }} className="cta__rotating__bar__inner">
                <ImageBar images={images} />
                <ImageBar images={images} />
                <ImageBar images={images} />
                <ImageBar images={images} />
                <ImageBar images={images} />
            </motion.div>
        </div>
    )
}

const ImageBar = ({ images }: { images: any[] }) => {

    return (
        <div className='cta__image__bar'>
            {images.map((image, index) => {
                // Handle Sanity images (objects with asset property)
                const isSanityImage = image && typeof image === 'object' && image.asset;
                const src = isSanityImage ? urlFor(image).url() : image.src;
                const alt = isSanityImage ? (image.alt || `CTA Image ${index + 1}`) : image.alt;
                
                return (
                    <div key={index} className="cta__image__bar__item__wrapper">
                        <Image 
                            src={src} 
                            alt={alt} 
                            className="cta__image__bar__img" 
                            fill={true} 
                            priority={index < 3} // Load first three images with priority
                            sizes="50dvw" // Adjust sizes for responsive loading
                        />
                    </div>
                )
            })}
        </div>
    )
}

const titleWithBreaks = (text: string) => {
    if (!text) return null;

    return text.split('\n').map((line, index) => (
        <span key={index}>
            {line}
            {index < text.split('\n').length - 1 && <br />}
        </span>
    ));
}