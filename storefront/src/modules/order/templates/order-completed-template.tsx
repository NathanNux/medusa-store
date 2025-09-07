import { cookies as nextCookies } from "next/headers"
import s from "./styles/oder-complete.module.scss"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"

import ImageParallax from "./image-parallax"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  // WIP: finish the responsive design of this component, then the whole checkout till this week
  return (
    <div className={s.root}>
      <ImageParallax />
      <div className={s.container}>
        {/* {isOnboarding && <OnboardingCta orderId={order.id} />} */}
        <div className={s.panel} data-testid="order-complete-container">
          <h1
            className={s.title}
          >
            <span>Děkujeme!</span>
            <span>Vaše objednávka byla úspěšně vytvořena.</span>
          </h1>
          <OrderDetails order={order} showStatus={true} />
          <h2 className={s.sectionTitle}>
            Shrnutí objednávky:
          </h2>
          <Items order={order} />
          <CartTotals totals={order} />
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
          <Help />
        </div>
      </div>
    </div>
  )
}
