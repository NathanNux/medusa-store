import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption, StoreRegion } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"
import { listRegions } from "@lib/data/regions"
import Navbar from "@modules/layout/Navbar"
import Footer from "@modules/layout/Footer"
import Scrollbar from "@modules/layout/scrollbar"


export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  let shippingOptions: StoreCartShippingOption[] = []
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)
  

  if (cart) {
    try {
      const { shipping_options } = await listCartOptions()
      shippingOptions = shipping_options
    } catch (e) {
      console.error("Failed to load shipping options for layout:", e)
      shippingOptions = []
    }
  }

  return (
    <>
      <Navbar  cart={cart} regions={regions}/>
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      <Scrollbar />
      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
      {props.children}
      <Footer />
    </>
  )
}
