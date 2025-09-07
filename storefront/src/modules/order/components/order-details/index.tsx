import { HttpTypes } from "@medusajs/types"
import styles from "../styles/order-details.module.scss"
import { translateStatus } from "@lib/i18n/statuses"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  // use translateStatus to show localized (Czech) status labels

  return (
    <div className={styles.root}>
      <p className={styles.text}>
        Potvrzení objednávky bylo odesláno na: {" "}
        <span className={styles.email} data-testid="order-email">
          {order.email}
        </span>
        .
      </p>
      <p className={styles.text}>
        Datum objednávky: {" "}
        <span data-testid="order-date" className={styles.date}>
          {new Date(order.created_at).toDateString()}
        </span>
      </p>
      <p className={styles.orderNumber}>
        Číslo objednávky: <span data-testid="order-id">{order.display_id}</span>
      </p>

      <div className={styles.statusRow}>
        {showStatus && (
          <>
            <p className={styles.statusText}>
              Stav objednávky: {" "}
              <span className={styles.statusValue} data-testid="order-status">
                {translateStatus(order.fulfillment_status, "fulfillment", "cs")}
              </span>
            </p>
            <p className={styles.statusText}>
              Stav platby:{" "}
              <span className={styles.statusValue} data-testid="order-payment-status">
                {translateStatus(order.payment_status, "payment", "cs")}
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
