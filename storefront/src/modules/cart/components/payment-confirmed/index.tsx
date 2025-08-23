"use client"
import { useEffect } from "react"
import { placeOrder } from "@lib/data/cart"

export default function PaymentConfirmed({ id }: { id: string }) {
    useEffect(() => {
        placeOrder(id)
      }, [])
  return (
    <div className="h-full w-full items-center justify-center">
      <h1>Payment Confirmed</h1>
    </div>
  )
}
