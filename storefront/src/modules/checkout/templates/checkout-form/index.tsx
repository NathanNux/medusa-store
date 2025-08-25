import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import styles from "./style.module.scss"

export default async function CheckoutForm({
  cart,
  customer,
  countryCode
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  countryCode: string
}) {
  if (!cart) {
    return null
  }

  const regionID = cart.region?.id ?? ""

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(regionID)


  if (!shippingMethods || !paymentMethods) {
    return null
  }

  return (
    <div className={styles.root}>
      <Addresses cart={cart} customer={customer} />
      <Shipping
        cart={cart}
        availableShippingMethods={shippingMethods}
        packetaApiKey={process.env.NEXT_PUBLIC_PACKETA_API_KEY}
        packetaShippingMethodId={process.env.NEXT_PUBLIC_PACKETA_SHIPPING_METHOD_ID}
      />
      <Payment cart={cart} availablePaymentMethods={paymentMethods} />
      <Review cart={cart} countryCode={countryCode} />
    </div>
  )
}
