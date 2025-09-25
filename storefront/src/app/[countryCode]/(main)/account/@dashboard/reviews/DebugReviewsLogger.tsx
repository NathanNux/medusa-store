"use client"

import { useEffect } from "react"

type Props = {
  reviews: any[]
}

export default function DebugReviewsLogger({ reviews }: Props) {
  useEffect(() => {
    try {
      // Log a concise summary and the full array for inspection
      // This prints to the browser DevTools console
      // eslint-disable-next-line no-console
      console.log("[Account] reviews count:", Array.isArray(reviews) ? reviews.length : "n/a")
      // eslint-disable-next-line no-console
      console.log("[Account] reviews:", reviews)
    } catch {}
  }, [reviews])

  return null
}
