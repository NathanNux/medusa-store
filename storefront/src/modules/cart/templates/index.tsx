import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

import s from "./index.module.scss"
import ParallaxImage from "../components/prallax-image"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className={s.root}>
      <ParallaxImage />
      <div className={s.container} data-testid="cart-container">
        {cart?.items?.length ? (
          <div className={s.grid}>
            <div className={s.left}>
              {!customer && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )}
              <ItemsTemplate cart={cart} />
            </div>
            <div className={s.right}>
              <div className={s.sticky}>
                {cart && cart.region && (
                  <div className={s.summaryBox}>
                    <Summary cart={cart as any} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={s.emptyWrap}>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
