
"use client"

import styles from "./style.module.scss"

import { clx } from "@medusajs/ui"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"

const Review = ({ cart, countryCode }: { cart: any, countryCode: string }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2
          className={clx(styles.heading, {
            [styles.inactive]: !isOpen,
          })}
        >
          Přehled
        </h2>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className={styles.reviewRow}>
            <div className={styles.reviewTextWrap}>
              <p className={styles.reviewText}>
                Kliknutím na tlačítko Objednat potvrzujete, že jste si přečetli, porozuměli a souhlasíte s našimi Podmínkami použití, Podmínkami prodeje a Reklamačním řádem a potvrzujete, že jste si přečetli Zásady ochrany osobních údajů obchodu Keramická zahrada.
              </p>
            </div>
          </div>
          <PaymentButton cart={cart} data-testid="submit-order-button" countryCode={countryCode} />
        </>
      )}
    </div>
  )
}

export default Review


