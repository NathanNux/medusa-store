"use client";
import LinkButton from '@modules/common/components/Buttons/LinkButton';
import { CTAImages } from 'constants/images';
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function CTA () {
    return (
        <section className="cta">
            <div className='cta__content'>
                <h2 className="cta__title">Keramika jako tiché<br/> spojení s přírodou.</h2>
                <LinkButton 
                    href="/store"
                    text="Navštívit E-shop"
                />
            </div>

            <div className='cta__image__bar'>
                <RotatingBar />
            </div>
        </section>
    );
}

const RotatingBar = () => {
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
                <ImageBar />
                <ImageBar />
                <ImageBar />
                <ImageBar />
                <ImageBar />
            </motion.div>
        </div>
    )
}

const ImageBar = () => {

    return (
        <div className='cta__image__bar'>
            {CTAImages.map((image, index) => {
                const { src, alt } = image;
                return (
                    <div key={index} className="cta__image__bar__item__wrapper">
                        <Image 
                            src={src} 
                            alt={alt} 
                            className="cta__image__bar__img" 
                            fill={true} 
                            priority={index < 3} // Load first three images with priority
                            sizes="50vw" // Adjust sizes for responsive loading
                        />
                    </div>
                )
            })}
        </div>
    )
}