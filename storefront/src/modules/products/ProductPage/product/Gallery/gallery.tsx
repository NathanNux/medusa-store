"use client"

import { HttpTypes } from "@medusajs/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";


type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const Gallery: React.FC<ProductTemplateProps> = ({ product, region, countryCode }) => {
    const [ isHovered, setIsHovered ] = useState<boolean>(false);

    const images = useMemo(() => {
        return product.images || [];
    }, [product.images]);

    const [ currentIndex, setCurrentIndex ] = useState<number>(0);
    const length = images.length;

    useEffect(()=> {
        if(images.length > 0){
            setCurrentIndex(0);
        }
    },[images])

    const goNext = () => {
        if (images.length === 0) return;
        setCurrentIndex((i) => (i + 1) % images.length);
    };
    const goPrev = () => {
        if (images.length === 0) return;
        setCurrentIndex((i) => (i - 1 + images.length) % images.length);
    };

    return (
        <div className="product__image">
            <div className="Image__container">
                {(images.length > 1) ? (
                    <div className="Image__container__slider">
                        <div className="Image__container__slider__container">
                            <motion.div
                                className="slider-track"
                                style={{ display: "flex", flexDirection: "row" }}
                                animate={{ x: `-${currentIndex * (100 / length)}%` }}
                                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                            >
                                {images.map((image, idx) => (
                                    <div
                                        key={image.id}
                                        className="product__image__item"
                                        
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                    >
                                        <motion.div 
                                            className="product__image__item__right"
                                            onClick={goNext}
                                            animate={{ opacity: isHovered ? 1 : 0 }}
                                            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                                        >
                                            <div className="arrow">
                                                <Image
                                                    src={"/assets/icons/arrow_up.svg"}
                                                    alt={`Product image ${image.rank}`}
                                                    height={50}
                                                    width={50}
                                                    className="image active"
                                                />
                                            </div>
                                        </motion.div>
                                        <motion.div 
                                            className="product__image__item__left"
                                            onClick={goPrev}
                                            animate={{ opacity: isHovered ? 1 : 0 }}
                                            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                                        >
                                            <div className="arrow">
                                                <Image
                                                    src={"/assets/icons/arrow_up.svg"}
                                                    alt={`Product image ${image.rank}`}
                                                    height={50}
                                                    width={50}
                                                    className="image active"
                                                />
                                            </div>
                                        </motion.div>
                                        {image.url ? (
                                            <Image
                                                src={image.url}
                                                alt={`Product image ${image.rank}`}
                                                layout="fill"
                                                objectFit="cover"
                                                className="image active"
                                            />
                                        ) : (
                                            <div>No image available</div>
                                        )}
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                        <div className="product__image__bar">
                            {images.map((_, i) => (
                                <div
                                    key={i}
                                    className={`dot ${currentIndex === i ? "active" : ""}`}
                                    onClick={() => setCurrentIndex(i)}
                                />
                            ))}
                        </div>
                    </div>
                ):(
                    images[0] ? (
                        <motion.div
                            key={images[0].id}
                            className='product__image__item active'
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                        >
                            {!images[0].url ? (
                                <div>No image available</div>
                            ) : (
                                <Image
                                    key={images[0].id}
                                    src={images[0].url}
                                    alt={`Product image ${images[0].rank}`}
                                    layout="fill"
                                    objectFit="cover"
                                    className='image'
                                />
                            )}
                        </motion.div>
                    ) : (
                        <div>No image available</div>
                    )
                )}
            </div>

            <div className="product__image__benefits">
                <div className="divider"/>
                <div className="product__image__benefits__text">
                    <Image 
                        src="/assets/icons/wheel.svg"
                        alt="Wheel Icon"
                        width={50}
                        height={50}
                    />
                    <div className="product__image__benefits__text__items">
                        {product.tags?.slice(0, 3).map((tag) => (
                            <div key={tag.id} className="product__image__benefits__text__items__title">
                                <p>{tag.value}</p>
                            </div>
                        ))}
                    </div>
                    <Image 
                        src="/assets/icons/wheel.svg"
                        alt="Wheel Icon"
                        width={50}
                        height={50}
                    />
                </div>
                <div className="divider"/>
            </div>
        </div>
    )
}

export default Gallery;