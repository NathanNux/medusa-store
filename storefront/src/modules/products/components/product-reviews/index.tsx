"use client"

import { getProductReviews } from "../../../../lib/data/products"
import { Star, StarSolid } from "@medusajs/icons"
import { StoreProductReview } from "../../../../types/global"
import { Button } from "@medusajs/ui"
import { useState, useEffect } from "react"
import ProductReviewsForm from "./form"
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
        <div className="flex flex-col gap-y-2 text-base-regular text-ui-fg-base">
        <div className="flex gap-x-2 items-center">
            {review.title && <strong>{review.title}</strong>}
            <div className="flex gap-x-1">
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
        <div className="border-t border-ui-border-base pt-4 text-sm-regular">
            {review.first_name} {review.last_name}
        </div>
        </div>
    )
  }

  return (
    <div className="product-page-constraint">
        <div className="flex flex-col items-center text-center mb-16">
        <span className="text-base-regular text-gray-600 mb-6">
            Recenze
        </span>
        <p className="text-2xl-regular text-ui-fg-base max-w-lg">
            Podívejte se, co o tomto produktu říkají naši zákazníci.
        </p>
        <div className="flex gap-x-2 justify-center items-center">
            <div className="flex gap-x-2">
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
            <span className="text-base-regular text-gray-600">
            {count} {count === 1 ? "recenze" : "recenzí"}
            </span>
        </div>
        </div>

        <div className="grid grid-cols-1 small:grid-cols-2 gap-x-6 gap-y-8">
        {reviews.map((review) => (
            <Review key={review.id} review={review} />
        ))}
        </div>

        {hasMoreReviews && (
        <div className="flex justify-center mt-8">
            <Button variant="secondary" onClick={() => setPage(page + 1)}>
                Načíst další recenze
            </Button>
        </div>
        )}

        <ProductReviewsForm productId={productId} />
    </div>
  )
}