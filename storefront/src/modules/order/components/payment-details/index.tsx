import { Container } from "@medusajs/ui"

import { isStripe, paymentInfoMap } from "@lib/constants"
import Divider from "@modules/common/components/divider"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import styles from "../styles/payment-details.module.scss"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0].payments?.[0]
  const formattedCreated = payment?.created_at
    ? (() => {
        const d = new Date(payment.created_at)
        const datePart = d.toLocaleDateString("cs-CZ", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        const timePart = d.toLocaleTimeString("cs-CZ", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        return `${datePart}, ${timePart}`
      })()
    : ""

  return (
    <div className={styles.root}>
      <h2 className={styles.title}>Platba</h2>
      <div>
        {payment && (
          <div className={styles.row}>
            <div className={styles.colLeft}>
              <p className={styles.label}>Způsob platby</p>
              <p className={styles.value} data-testid="payment-method">
                {paymentInfoMap[payment.provider_id].title}
              </p>
            </div>
            <div className={styles.colRight}>
              <p className={styles.label}>Platební údaje</p>
              <div className={styles.detailsRow}>
                <Container className={styles.iconWrap}>
                  {paymentInfoMap[payment.provider_id].icon}
                </Container>
                <p className={styles.value} data-testid="payment-amount">
                  {isStripe(payment.provider_id) && payment.data?.card_last4
                    ? `**** **** **** ${payment.data.card_last4}`
                    : `${convertToLocale({
                        amount: payment.amount,
                        currency_code: order.currency_code,
                      })} zaplaceno ${formattedCreated}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Divider className={styles.divider} />
    </div>
  )
}

export default PaymentDetails
