"use client"

import { convertToLocale } from "@lib/util/money"
import { CheckCircleSolid, XMark } from "@medusajs/icons"
import {
  HttpTypes,
  StoreCart,
  StoreCartShippingOption,
  StorePrice,
} from "@medusajs/types"
import { Button, clx } from "@medusajs/ui"
import styles from "./style.module.scss"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useState } from "react"
import { StoreFreeShippingPrice } from "types/global"

const computeTarget = (
  cart: HttpTypes.StoreCart,
  price: HttpTypes.StorePrice
) => {
  const priceRule = (price.price_rules || []).find(
    (pr) => pr.attribute === "item_total"
  )!

  const currentAmount = cart.item_total
  const targetAmount = parseFloat(priceRule.value)

  if (priceRule.operator === "gt") {
    return {
      current_amount: currentAmount,
      target_amount: targetAmount,
      target_reached: currentAmount > targetAmount,
      target_remaining:
        currentAmount > targetAmount ? 0 : targetAmount + 1 - currentAmount,
      remaining_percentage: (currentAmount / targetAmount) * 100,
    }
  } else if (priceRule.operator === "gte") {
    return {
      current_amount: currentAmount,
      target_amount: targetAmount,
      target_reached: currentAmount > targetAmount,
      target_remaining:
        currentAmount > targetAmount ? 0 : targetAmount - currentAmount,
      remaining_percentage: (currentAmount / targetAmount) * 100,
    }
  } else if (priceRule.operator === "lt") {
    return {
      current_amount: currentAmount,
      target_amount: targetAmount,
      target_reached: targetAmount > currentAmount,
      target_remaining:
        targetAmount > currentAmount ? 0 : currentAmount + 1 - targetAmount,
      remaining_percentage: (currentAmount / targetAmount) * 100,
    }
  } else if (priceRule.operator === "lte") {
    return {
      current_amount: currentAmount,
      target_amount: targetAmount,
      target_reached: targetAmount > currentAmount,
      target_remaining:
        targetAmount > currentAmount ? 0 : currentAmount - targetAmount,
      remaining_percentage: (currentAmount / targetAmount) * 100,
    }
  } else {
    return {
      current_amount: currentAmount,
      target_amount: targetAmount,
      target_reached: currentAmount === targetAmount,
      target_remaining:
        targetAmount > currentAmount ? 0 : targetAmount - currentAmount,
      remaining_percentage: (currentAmount / targetAmount) * 100,
    }
  }
}

export default function ShippingPriceNudge({
  variant = "inline",
  cart,
  shippingOptions,
}: {
  variant?: "popup" | "inline"
  cart: StoreCart
  shippingOptions: StoreCartShippingOption[]
}) {
  if (!cart || !shippingOptions?.length) {
    return
  }

  // Check if any shipping options have a conditional price based on item_total
  const freeShippingPrice = shippingOptions
    .map((shippingOption) => {
      const calculatedPrice = shippingOption.calculated_price

      if (!calculatedPrice) {
        return
      }

      // Get all prices that are:
      // 1. Currency code is same as the cart's
      // 2. Have a rule that is set on item_total
      const validCurrencyPrices = shippingOption.prices.filter(
        (price) =>
          price.currency_code === cart.currency_code &&
          (price.price_rules || []).some(
            (priceRule) => priceRule.attribute === "item_total"
          )
      )

      return validCurrencyPrices.map((price) => {
        return {
          ...price,
          shipping_option_id: shippingOption.id,
          ...computeTarget(cart, price),
        }
      })
    })
    .flat(1)
    .filter(Boolean)
    // We focus here entirely on free shipping, but this can be edited to handle multiple layers
    // of reduced shipping prices.
    .find((price) => price?.amount === 0)

  if (!freeShippingPrice) {
    return
  }

  if (variant === "popup") {
    return <FreeShippingPopup cart={cart} price={freeShippingPrice} />
  } else {
    return <FreeShippingInline cart={cart} price={freeShippingPrice} />
  }
}

function FreeShippingInline({
  cart,
  price,
}: {
  cart: StoreCart
  price: StorePrice & {
    target_reached: boolean
    target_remaining: number
    remaining_percentage: number
  }
}) {
  return (
  <div className={styles.root}>
  <div className={styles.content}>
  <div className={styles.header}>
          <div>
            {price.target_reached ? (
              <div className={styles.unlocked}>
                <CheckCircleSolid className={styles.icon} />{" "}
                Free Shipping unlocked!
              </div>
            ) : (
              `Unlock Free Shipping`
            )}
          </div>

          <div
            className={clx(styles.remaining, {
              [styles.hidden]: price.target_reached,
            })}
          >
            Only{" "}
            <span className={styles.remainingAmount}>
              {convertToLocale({
                amount: price.target_remaining,
                currency_code: cart.currency_code,
              })}
            </span>{" "}
            away
          </div>
        </div>
  <div className={styles.progressRow}>
          <div
            className={clx(styles.progressBar, {
              [styles.progressBarReached]: price.target_reached,
            })}
            style={{ width: `${price.remaining_percentage}%` }}
          ></div>
          <div className={styles.progressBg}></div>
        </div>
      </div>
    </div>
  )
}

function FreeShippingPopup({
  cart,
  price,
}: {
  cart: StoreCart
  price: StoreFreeShippingPrice
}) {
  const [isClosed, setIsClosed] = useState(false)

  return (
    <div
      className={clx(
        styles.popupRoot,
        {
          [styles.popupHiddenDelayed]: price.target_reached,
          [styles.popupHidden]: isClosed,
          [styles.popupVisible]: !price.target_reached && !isClosed,
        }
      )}
    >
      <div>
        <Button
          className={styles.closeBtn}
          onClick={() => setIsClosed(true)}
        >
          <XMark />
        </Button>
      </div>

  <div className={styles.popupContent}>
        <div className={styles.popupHeader}>
          <div className={styles.popupHeaderContent}>
            <div className={styles.popupHeaderRow}>
              <div>
                {price.target_reached ? (
                  <div className={styles.unlocked}>
                    <CheckCircleSolid className={styles.icon} />{" "}
                    Doprava zdarma odemčena!
                  </div>
                ) : (
                  `Odemknout dopravu zdarma`
                )}
              </div>

              <div
                className={clx(styles.remaining, {
                  [styles.hidden]: price.target_reached,
                })}
              >
                Pouze{" "}
                <span className={styles.popupRemainingAmount}>
                  {convertToLocale({
                    amount: price.target_remaining,
                    currency_code: cart.currency_code,
                  })}
                </span>{" "}
                od Vás
              </div>
            </div>
            <div className={styles.popupProgressRow}>
              <div
                className={clx(styles.popupProgressBar, {
                  [styles.progressBarReached]: price.target_reached,
                })}
                style={{ width: `${price.remaining_percentage}%` }}
              ></div>
              <div className={styles.popupProgressBg}></div>
            </div>
          </div>
        </div>

        <div className={styles.popupActions}>
          <LocalizedClientLink
            className={styles.popupCartBtn}
            href="/cart"
          >
            Zobrazit košík
          </LocalizedClientLink>

          <LocalizedClientLink
            className={styles.popupProductsBtn}
            href="/store"
          >
            Zobrazit produkty
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
