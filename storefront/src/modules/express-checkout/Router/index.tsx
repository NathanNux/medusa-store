"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo } from "react"
import { Product } from "../Product"
import { Address } from "../Address"
import { Shipping } from "../Shipping"
import { Payment } from "../Payment"
import { useCart } from "@lib/context/cart"
import { StoreRegion } from "@medusajs/types"

type ActiveTab = "product" | "address" | "shipping" | "payment"

type RouterProps = {
  handle: string
  regions: StoreRegion[]
}

export const Router = ({
  handle,
  regions
}: RouterProps) => {
  const { cart } = useCart()
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentStep = searchParams.get("step")

  const isCartValid = useMemo(() => {
    return cart?.items?.[0]?.product_handle === handle
  }, [cart, handle])

  const activeTab: ActiveTab = currentStep === "product" || currentStep === "address" || 
    currentStep === "shipping" || currentStep === "payment" ? currentStep : "product"

  // WIP: FIX the problem with bundles
  useEffect(() => {
    if (!cart) {
      return
    }
    
    if ((activeTab !== "product") && !isCartValid) {
      return router.push(`express-checkout/${handle}`)
    }

    if (activeTab === "shipping" && (!cart?.shipping_address || !cart?.billing_address)) {
      return router.push(`express-checkout/${handle}?step=address`)
    }
  
    if (activeTab === "payment" && (
      !cart?.shipping_address || !cart?.billing_address || !cart?.shipping_methods?.length
    )) {
      return router.push(`express-checkout/${handle}?step=shipping`)
    }
  }, [isCartValid, activeTab])

  return (
    <>
      <Product handle={handle} isActive={activeTab === "product"} />
      <Address handle={handle} isActive={activeTab === "address"} regions={regions} />
      <Shipping handle={handle} isActive={activeTab === "shipping"} />
      <Payment handle={handle} isActive={activeTab === "payment"} />
    </>
  )
}