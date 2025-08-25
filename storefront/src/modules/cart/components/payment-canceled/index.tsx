"use client"
import { useEffect } from "react"
import { redirect } from "next/navigation"

export default function PaymentCanceled({ countryCode }: { countryCode: string }) {
  
  useEffect(() => {
    redirect(`/${countryCode}/checkout?step=payment`)
  }, [])

  return (
    <div className="h-full w-full items-center justify-center">
      <h1>Platba zrušena</h1>
    </div>
  )
}
