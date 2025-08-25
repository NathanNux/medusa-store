"use client"

import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import React from "react"
import s from "./styles/order-details.module.scss"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  return (
    <div className={s.root}>
      <div className={s.header}>
        <h1 className={s.title}>Detaily objednávky</h1>
        <LocalizedClientLink
          href="/account/orders"
          className={s.backLink}
          data-testid="back-to-overview-button"
        >
          <XMark /> Zpět na přehled
        </LocalizedClientLink>
      </div>
      <div className={s.container} data-testid="order-details-container">
        <OrderDetails order={order} showStatus />
        <Items order={order} />
        <ShippingDetails order={order} />
        <OrderSummary order={order} />
        <Help />
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
