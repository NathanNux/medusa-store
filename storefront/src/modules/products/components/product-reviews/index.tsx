"use client"

import { getProductReviews } from "../../../../lib/data/products"
import { Star, StarSolid } from "@medusajs/icons"
import { StoreProductReview } from "../../../../types/global"
// import { Button } from "@medusajs/ui"
import { useState, useEffect } from "react"
import ProductReviewsForm from "./form"
import styles from "./style.module.scss"

import { motion } from 'framer-motion';
import { useFormStatus } from 'react-dom';

type ProductReviewsProps = {
  productId: string
  initialReviews: StoreProductReview[]
  initialRating: number
  initialCount: number
}

export default function ProductReviews({
  productId,
  initialReviews,
  initialRating,
  initialCount,
}: ProductReviewsProps) {
  const [page, setPage] = useState(1)
  const defaultLimit = 10
  const [reviews, setReviews] = useState<StoreProductReview[]>(initialReviews)
  const [rating, setRating] = useState(initialRating)
  const [hasMoreReviews, setHasMoreReviews] = useState(false)
  const [count, setCount] = useState(initialCount)

  useEffect(() => {
    console.log("Fetching reviews for product:", productId, "Page:", page)
    getProductReviews({
      productId,
      limit: defaultLimit,
      offset: (page - 1) * defaultLimit,
    }).then(({ reviews, average_rating, count, limit }) => {
      console.log("CLIENT got reviews:", reviews, average_rating, count, limit)
      setReviews((prev) => {
        const newReviews = reviews.filter(
          (review) => !prev.some((r) => r.id === review.id)
        )
        return [...prev, ...newReviews]
      })
      setRating(Math.round(average_rating))
      console.log("Reviews after filtering:", reviews)
      console.log("Count:", count, limit, page, count > limit * page)
      setHasMoreReviews(count > limit * page)
      setCount(count)
    })
  }, [page])


  console.log("ProductReviews", { productId, page, reviews, rating, hasMoreReviews, count })
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(
        localStorage.getItem("medusa_jwt") || localStorage.getItem("token")
      )
    }
  }, [])
  

  function Review({ review }: { review: StoreProductReview }) {
    return (
      <div key={review.id} className={styles.review}>
        <div className={styles.reviewHeader}>
          {review.title && <strong>{review.title}</strong>}
          <div className={styles.reviewStars}>
            {Array.from({ length: 5 }).map((_, index) => (
              <span key={index}>
                {index <= review.rating ? (
                  <StarSolid className="text-ui-tag-orange-icon" />
                ) : (
                  <Star />
                )}
              </span>
            ))}
          </div>
        </div>
        <div>{review.content}</div>
        <div className={styles.reviewFooter}>
          {review.first_name} {review.last_name}
        </div>
      </div>
    )
  }

  return (
    <div className={`product-page-constraint ${styles.container}`}>
        <div className={styles.header}>
        <p className={styles.title}>
            Podívejte se, co o tomto produktu říkají naši zákazníci.
        </p>
        <div className={styles.starsAndCount}>
            <div className={styles.stars}>
            {Array.from({ length: 5 }).map((_, index) => (
                <span key={index}>
                {!rating || index > rating ? (
                    <Star />
                ) : (
                    <StarSolid className="text-ui-tag-orange-icon" />
                )}
                </span>
            ))}
            </div>
            <span className={styles.count}>
            {count} {count === 1 ? "recenze" : "recenzí"}
            </span>
        </div>
        </div>

        <div className={styles.reviewsGrid}>
          {reviews.map((review) => (
              <Review key={review.id} review={review} />
          ))}
        </div>

        {hasMoreReviews && (
          <div className="flex justify-center mt-8">
            <ClickButton
              text="Načíst další recenze"
              onClickAction={() => setPage(page + 1)}
              type="button"
              className={styles.loadMoreButton}
            />
          </div>
        )}

      <ProductReviewsForm productId={productId} />
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
    "data-testid"?: string;
}

// Base animated button used across the site. Can act as a submit button in forms.
function ClickButton({ onClickAction, ClickAction, disabled = false, text, type = "button", className, "data-testid": dataTestId }: ClickButtonProps) {
    const [ isActive , setIsActive ] = useState<boolean>(false);
    const { pending } = useFormStatus();
    const isSubmitting = type === "submit" ? pending : false;
    const isDisabled = disabled || isSubmitting;
    const handleClick = onClickAction ?? ClickAction;

    return (
        <div className={className ? `${styles.ClickButton} ${className}` : styles.ClickButton}>
            <button 
                type={type}
                className={styles.button}
                onClick={handleClick}
                disabled={isDisabled}
                aria-busy={isDisabled || undefined}
                onMouseEnter={() => setIsActive(true)}
                onMouseLeave={() => setIsActive(false)}
                data-testid={dataTestId}
            >
                <motion.div
                    className={styles.slider}
                    animate={{top: isActive ? "-100%" : "0%"}}
                    transition={{ duration: 0.5, type: "tween", ease: [0.76, 0, 0.24, 1]}}
                >
                    <div 
                        className={styles.el}
                        style={{ backgroundColor: "var(--CreamDetails)" }}
                    >
                        <PerspectiveText label={text}/>
                    </div>
                    <div 
                        className={styles.el}
                        style={{ backgroundColor: "var(--CharcoalBg)" }}
                    >
                        <PerspectiveText label={text} />
                    </div>
                </motion.div>
            </button>
        </div>
    )
}

function PerspectiveText({label}: {label: string}) {
    return (    
        <div className={styles.perspectiveText}>
            <p>{label}</p>
            <p>{label}</p>
        </div>
    )
}