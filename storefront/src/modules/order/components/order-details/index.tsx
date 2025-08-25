import { HttpTypes } from "@medusajs/types"
import styles from "../styles/order-details.module.scss"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div className={styles.root}>
      <p className={styles.text}>
        Potvrzení objednávky bylo odesláno na{" "}
        <span className={styles.email} data-testid="order-email">
          {order.email}
        </span>
        .
      </p>
      <p className={styles.text}>
        Datum objednávky:{" "}
        <span data-testid="order-date">
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
              Stav objednávky:{" "}
              <span className={styles.statusValue} data-testid="order-status">
                {formatStatus(order.fulfillment_status)}
              </span>
            </p>
            <p className={styles.statusText}>
              Stav platby:{" "}
              <span className={styles.statusValue} data-testid="order-payment-status">
                {formatStatus(order.payment_status)}
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
