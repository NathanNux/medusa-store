import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import styles from "./page.module.scss"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout(props:{params: Promise<{countryCode:string}>}) {
  const cart = await retrieveCart()
  const params = await props.params
  const { countryCode } = params
  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <div className={styles.root}>
      <PaymentWrapper cart={cart}>
        <CheckoutForm cart={cart} customer={customer} countryCode={countryCode} />
      </PaymentWrapper>
      <CheckoutSummary cart={cart} />
    </div>
  )
}
