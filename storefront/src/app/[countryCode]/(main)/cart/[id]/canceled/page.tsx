"use client"

import { retrieveOrder } from "@lib/data/orders"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { useEffect } from "react"

type Props = {
  params: Promise<{ id: string; countryCode: string }>
}
export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "You purchase was successful",
}

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)
  const cart = params.id
  const countryCode = params.countryCode

  if (!cart) {
    return notFound()
  }

  useEffect(() => {
    redirect(`/${countryCode}/checkout?step=payment`)
  }, [])


  return <div className="h-full w-full items-center justify-center">
    <h1>Order canceled</h1>
  </div>
}

