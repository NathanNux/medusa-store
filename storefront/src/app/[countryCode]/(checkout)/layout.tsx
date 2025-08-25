
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import styles from "./styles/layout.module.scss"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <nav>
          <LocalizedClientLink
            href="/cart"
            className={styles.backLink}
            data-testid="back-to-cart-link"
          >
            <ChevronDown className={styles.chevron} size={16} />
            <span className={styles.backText}>Back to shopping cart</span>
            <span className={styles.backTextMobile}>Back</span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className={styles.storeLink}
            data-testid="store-link"
          >
            Medusa Store
          </LocalizedClientLink>
          <div className={styles.spacer} />
        </nav>
      </div>
      <div className={styles.checkoutContainer} data-testid="checkout-container">{children}</div>
      <div className={styles.footer}>
        <MedusaCTA />
      </div>
    </div>
  )
}
