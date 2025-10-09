'use client'
import DebugReviewsLogger from "app/[countryCode]/(main)/account/@dashboard/reviews/DebugReviewsLogger";
import { motion } from 'framer-motion';
import { useState, useRef, type WheelEvent, type TouchEvent } from 'react';
import { useFormStatus } from 'react-dom';
import { Divider } from "@medusajs/ui";
import { Star, StarSolid } from "@medusajs/icons";

import s from "./styles/reviews-template.module.scss";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import Image from "next/image";

export default function ReviewsTemplate({ reviews }: { reviews: any[]} ) {
    const reviewsListRef = useRef<HTMLUListElement | null>(null)

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className={s.star}>
                {index < rating ? (
                    <StarSolid className="text-ui-tag-orange-icon" />
                ) : (
                    <Star />
                )}
            </span>
        ))
    }
    
    const handleWheel = (e: WheelEvent<HTMLUListElement>) => {
        const el = reviewsListRef.current
        if (!el) return

        const delta = e.deltaY
        const atTop = el.scrollTop === 0
        const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight

        const tryingToScrollUpPastTop = atTop && delta < 0
        const tryingToScrollDownPastBottom = atBottom && delta > 0

        // If the container can scroll in the wheel direction, keep the event inside.
        // If the user is trying to scroll past the top or bottom, prevent the event so the page doesn't scroll.
        const canScrollUp = el.scrollTop > 0
        const canScrollDown = Math.ceil(el.scrollTop + el.clientHeight) < el.scrollHeight

        if ((delta < 0 && canScrollUp) || (delta > 0 && canScrollDown)) {
            // inner scrolling — stop propagation so the page doesn't pick up the event
            e.stopPropagation()
            return
        }

        if (tryingToScrollUpPastTop || tryingToScrollDownPastBottom) {
            // prevent the page from scrolling when flinging past edges
            e.preventDefault()
            e.stopPropagation()
        }
    }

    // Touch handling for mobile scroll
    const handleTouchStart = (e: TouchEvent<HTMLUListElement>) => {
        // Store initial touch position
        const touch = e.touches[0]
        if (reviewsListRef.current) {
            reviewsListRef.current.dataset.touchStartY = touch.clientY.toString()
        }
    }

    const handleTouchMove = (e: TouchEvent<HTMLUListElement>) => {
        const el = reviewsListRef.current
        if (!el) return

        const touch = e.touches[0]
        const startY = parseFloat(el.dataset.touchStartY || '0')
        const deltaY = startY - touch.clientY

        const atTop = el.scrollTop === 0
        const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight

        // If at top and trying to scroll up, or at bottom and trying to scroll down
        if ((atTop && deltaY < 0) || (atBottom && deltaY > 0)) {
            // Prevent the page from scrolling
            e.preventDefault()
        }
    }
    return (
        <div className={s.content} data-testid="reviews-page-wrapper">
            <div className={s.header}>
                <h1 className={s.title}>Mé recenze</h1>
                <Divider />
                <p className={s.desc}>Všechny recenze, které jste napsali.</p>
            </div>

            <div className={s.body}>
                <DebugReviewsLogger reviews={reviews} />
                {(!reviews || reviews.length === 0) ? (
                    <p className={s.emptyState}>Ještě jste nenapsali žádné recenze...</p>
                ) : (
                    <ul 
                        className={s.reviewsList} 
                        ref={reviewsListRef} 
                        onWheel={handleWheel}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                    >
                    {reviews
                        .filter((r: any) => !!r)
                        .map((review: any) => (
                        <li key={review.id} className={s.reviewCard}>
                            <LocalizedClientLink href={`/${review?.product?.handle ? `products/${review.product.handle}` : ''}`} className={s.viewProductLink}>
                                <div className={s.reviewContent}>
                                    <div className={s.productName}>
                                        {review?.product?.handle ? (
                                            <ClickButton 
                                                text={(review?.product?.title || review?.product?.handle).split(' ').slice(0, 2).join(' ')}
                                            />
                                        ) : (
                                            <span>{review?.product?.title || review?.product?.id || review?.product_id || "neznámý produkt"}</span>
                                        )}
                                        <div className={s.reviewStars}>
                                            {renderStars(review?.rating ?? 0)}
                                        </div>
                                    </div>
                                    <div className={s.reviewText}>
                                        <span>
                                            <strong>{review?.title || "Bez názvu"}</strong>
                                        </span>
                                        <p>{review?.content ?? ""}</p>
                                    </div>
                                </div>
                                <div className={s.reviewImage}>
                                    <Image    
                                        src={review?.product?.thumbnail?.url || '/assets/tee-black-front.webp' || '/assets/img/horizontal_prop.png'}
                                        alt={review?.product?.title || 'Product image'}
                                        width={100}
                                        height={100}
                                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                </div>
                            </LocalizedClientLink>
                        </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}


type ClickButtonProps = {
    text: string;
    onClickAction?: () => void | Promise<void>;
    ClickAction?: () => void | Promise<void>; // backward compatibility
    disabled?: boolean;
    type?: "button" | "submit";
    className?: string;
    active?: boolean; // New prop to keep button in active/animated state
    "data-testid"?: string;
}

// Base animated button used across the site. Can act as a submit button in forms.
function ClickButton({ onClickAction, ClickAction, text, className, active = false, "data-testid": dataTestId }: ClickButtonProps) {
    const [ isActive , setIsActive ] = useState<boolean>(false);
    const { pending } = useFormStatus();
    const handleClick = onClickAction ?? ClickAction;
    
    // Button stays in animated state if active prop is true, otherwise uses hover state
    const shouldAnimate = active || isActive;

    return (
        <div className={className ? `${s.ClickButton} ${className}` : s.ClickButton}>
            <div 
                className={s.button}
                onClick={handleClick}
                onMouseEnter={() => setIsActive(true)}
                onMouseLeave={() => setIsActive(false)}
                data-testid={dataTestId}
            >
                <motion.div 
                    className={s.slider}
                    animate={{top: shouldAnimate ? "-100%" : "0%"}}
                    transition={{ duration: 0.5, type: "tween", ease: [0.76, 0, 0.24, 1]}}
                >
                    <div 
                        className={s.el}
                    >
                        <PerspectiveText label={text}/>
                    </div>
                    <div 
                        className={s.el}
                    >
                        <PerspectiveText label={text} />
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

function PerspectiveText({label}: {label: string}) {
    return (    
        <div className={s.perspectiveText}>
            <p>{label}</p>
            <p>{label}</p>
        </div>
    )
}