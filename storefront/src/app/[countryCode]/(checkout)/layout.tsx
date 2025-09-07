
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import styles from "./styles/layout.module.scss"
import Image from "next/image"
import NavScrollLink, { MobileNavScrollLink } from "@modules/layout/components/scrollLinkCheckout"
import Footer from "@modules/layout/Footer"
import Scrollbar from "@modules/layout/scrollbar"
import { MobileIconsNavbar } from "@modules/layout/Navbar"
import { retrieveCart } from "@lib/data/cart"

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cart = await retrieveCart()
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <nav>
          <LocalizedClientLink
            href="/cart"
            className={styles.backLink}
            data-testid="back-to-cart-link"
          >
            <NavScrollLink text="Zpět do košíku" />
            <MobileNavScrollLink text="Zpět" />
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className={styles.storeLink}
            data-testid="store-link"
          >
            <Image 
              src={"/assets/icons/logo.svg"}
              alt="KeramickaZahrada_logo"
              width={120}
              height={40}
            />
          </LocalizedClientLink>
          <div className={styles.spacer} />
        </nav>
      </div>
      <div className={styles.checkoutContainer} data-testid="checkout-container">{children}</div>
      <div className={styles.footer}>
        <Footer />
      </div>
      <Scrollbar />
      <MobileIconsNavbar cart={cart} />
    </div>
  )
}
