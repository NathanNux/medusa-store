import { Button } from "@medusajs/ui"
import { useMemo } from "react"

import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import s from "./style.module.scss"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity
      }, 0) ?? 0
    )
  }, [order])

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0
  }, [order])

  return (
    <div className={s.root} data-testid="order-card">
      <div className={s.header}>
        #<span data-testid="order-display-id">{order.display_id}</span>
      </div>
      <div className={s.meta}>
        <span className={s.metaDate} data-testid="order-created-at">
          {new Date(order.created_at).toDateString()}
        </span>
        <span className={s.metaAmount} data-testid="order-amount">
          {convertToLocale({
            amount: order.total,
            currency_code: order.currency_code,
          })}
        </span>
        <span className={s.metaLines}>{`${numberOfLines} ${
          numberOfLines > 1 ? "items" : "item"
        }`}</span>
      </div>
      <div className={s.grid}>
        {order.items?.slice(0, 3).map((i) => {
          return (
            <div
              key={i.id}
              className={s.item}
              data-testid="order-item"
            >
              <Thumbnail thumbnail={i.thumbnail} images={[]} size="full" />
              <div className={s.itemInfo}>
                <span className={s.itemTitle} data-testid="item-title">
                  {i.title}
                </span>
                <span className={s.multiply}>x</span>
                <span data-testid="item-quantity">{i.quantity}</span>
              </div>
            </div>
          )
        })}
        {numberOfProducts > 4 && (
          <div className={s.more}>
            <span className={s.moreText}>
              + {numberOfLines - 4}
            </span>
            <span className={s.moreText}>více</span>
          </div>
        )}
      </div>
      <div className={s.actions}>
        <LocalizedClientLink
          className={s.detailsLink}
          href={`/account/orders/details/${order.id}`}
        >
          <Button data-testid="order-details-link" variant="secondary">
            Zobrazit detaily
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderCard
