import { Heading } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"
import s from "./styles/oder-complete.module.scss"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  return (
    <div className={s.root}>
      <div className={s.container}>
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        <div className={s.panel} data-testid="order-complete-container">
          <Heading
            level="h1"
            className={s.title}
          >
            <span>Děkujeme!</span>
            <span>Vaše objednávka byla úspěšně vytvořena.</span>
          </Heading>
          <OrderDetails order={order} />
          <Heading level="h2" className={s.sectionTitle}>
            Shrnutí
          </Heading>
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
