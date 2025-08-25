"use client"

import { Button } from "@medusajs/ui"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import s from "./style.module.scss"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className={s.root}>
        {orders.map((o) => (
          <div key={o.id} className={s.itemWrap}>
            <OrderCard order={o} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={s.empty} data-testid="no-orders-container">
      <h2 className={s.title}>Nic k vidění</h2>
      <p className={s.desc}>
        Zatím nemáte žádné objednávky, pojďme to změnit {":)"}
      </p>
      <div className={s.ctaWrap}>
        <LocalizedClientLink className={s.link} href="/" passHref>
          <Button data-testid="continue-shopping-button">
            Pokračovat v nakupování
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderOverview
