import { retrieveOrder } from "@lib/data/orders"
import PaymentCanceled from "@modules/cart/components/payment-canceled"
import { Metadata } from "next"
import { notFound } from "next/navigation"

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
  console.log("Cart:", cart)

  if (!cart) {
    return notFound()
  }


  return <PaymentCanceled countryCode={countryCode} />
}
