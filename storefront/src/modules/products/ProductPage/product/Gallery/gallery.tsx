"use client"

import { HttpTypes } from "@medusajs/types";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";


type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const Gallery: React.FC<ProductTemplateProps> = ({ product, region, countryCode }) => {
    const images = product.images || [];
    const [ currentImage, setCurrentImage ] = useState<string>("");

    useEffect(()=> {
        if(images.length > 0){
            setCurrentImage(images[0].id)
        }
    },[images])

    return (
        <div className="product__image">
            <div className="Image__container">
                {(images.length > 1) ? (
                    <div>
                        <AnimatePresence mode="wait">
                            {(() => {
                                const image = images.find(img => img.id === currentImage);
                                if (!image) return null;
                                if (!image.url) return (<div>No image available</div>);
                                return (
                                <motion.div
                                    key={image.id}
                                    className="product__image__item active"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Image
                                    src={image.url}
                                    alt={`Product image ${image.rank}`}
                                    layout="fill"
                                    objectFit="cover"
                                    className="image active"
                                    />
                                </motion.div>
                                );
                            })()}
                        </AnimatePresence>
                        <div className="product__image__bar">
                            {images.map(dot => (
                                <div
                                    key={dot.id}
                                    className={`dot ${currentImage === dot.id ? "active" : ""}`}
                                    onClick={() => setCurrentImage(dot.id)}
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
                        <div className="product__image__benefits__text__items__title">
                            <p>Mrazuvzdorné</p>
                        </div>
                        <div className="product__image__benefits__text__items__title">
                            <p>zapojení</p>
                        </div>
                        <div className="product__image__benefits__text__items__title">
                            <p>Vyráběné ručně</p>
                        </div>
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