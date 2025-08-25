import { Badge } from "@medusajs/ui"
import styles from "./style.module.scss"

const PaymentTest = ({ className }: { className?: string }) => {
  return (
    <Badge color="orange" className={`${styles.root} ${className ?? ""}`}>
      <span className={styles.labelStrong}>Pozor:</span> Pouze pro testovací účely.
    </Badge>
  )
}

export default PaymentTest
