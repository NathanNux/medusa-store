import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import styles from "./style.module.scss"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className={styles.root}>
      <div className={styles.summary}>
        <Divider className={`${styles.divider} ${styles.hidden}`} />
        <h2 className={styles.heading}>Ve vašem košíku</h2>
        <Divider className={styles.divider} />
        <CartTotals totals={cart} />
        <ItemsPreviewTemplate cart={cart} />
        <div className={styles.discount}>
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
