"use client"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text, useToggleState } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"
import s from "./style.module.scss"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <div className={s.root}>
      <div className={s.headerRow}>
        <Heading
          level="h2"
          className={s.heading}
        >
          Doručovací a fakturační adresa
          {!isOpen && <CheckCircleSolid />}
        </Heading>
        {!isOpen && cart?.shipping_address && (
          <Text>
            <button
              onClick={handleEdit}
              className={s.editBtn}
              data-testid="edit-address-button"
            >
              Upravit
            </button>
          </Text>
        )}
      </div>
      {isOpen ? (
        <form action={formAction} className={s.form}>
          <div className={s.shippingAddress}>
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsBilling && (
              <div className={s.billingAddress}>
                <Heading
                  level="h2"
                  className={s.heading}
                >
                  Doručovací adresa
                </Heading>

                <BillingAddress cart={cart} />
              </div>
            )}
            <SubmitButton className={s.submitBtn} data-testid="submit-address-button">
              Pokračovat k doručení
            </SubmitButton>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div className={s.summary}>
          <div className={s.row}>
            {cart && cart.shipping_address ? (
              <>
                <div className={s.col + " shipping"} data-testid="shipping-address-summary">
                  <Text className={s.label}>
                    Doručovací adresa
                  </Text>
                  <Text className={s.value}>
                    {cart.shipping_address.first_name} {cart.shipping_address.last_name}
                  </Text>
                  <Text className={s.value}>
                    {cart.shipping_address.address_1} {cart.shipping_address.address_2}
                  </Text>
                  <Text className={s.value}>
                    {cart.shipping_address.postal_code}, {cart.shipping_address.city}
                  </Text>
                  <Text className={s.value}>
                    {cart.shipping_address.country_code?.toUpperCase()}
                  </Text>
                </div>

                <div className={s.col + " contact"} data-testid="shipping-contact-summary">
                  <Text className={s.label}>
                    Kontaktní osoba
                  </Text>
                  <Text className={s.value}>
                    {cart.shipping_address.phone}
                  </Text>
                  <Text className={s.value}>
                    {cart.email}
                  </Text>
                </div>

                <div className={s.col + " billing"} data-testid="billing-address-summary">
                  <Text className={s.label}>
                    Fakturační adresa
                  </Text>

                  {sameAsBilling ? (
                    <Text className={s.note}>
                      Fakturační a doručovací adresa jsou stejné.
                    </Text>
                  ) : (
                    <>
                      <Text className={s.value}>
                        {cart.billing_address?.first_name} {cart.billing_address?.last_name}
                      </Text>
                      <Text className={s.value}>
                        {cart.billing_address?.address_1} {cart.billing_address?.address_2}
                      </Text>
                      <Text className={s.value}>
                        {cart.billing_address?.postal_code}, {cart.billing_address?.city}
                      </Text>
                      <Text className={s.value}>
                        {cart.billing_address?.country_code?.toUpperCase()}
                      </Text>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className={s.divider} />
    </div>
  )
}

export default Addresses
