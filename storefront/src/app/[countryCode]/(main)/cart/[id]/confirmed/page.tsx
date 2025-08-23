import { Metadata } from "next"
import { notFound } from "next/navigation"
import { placeOrder } from "@lib/data/cart"

type Props = {
  params: Promise<{ id: string }>
}
export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "You purchase was successful",
}

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params
  if (!params.id) {
    return notFound()
  }
  await placeOrder(params.id)

}
