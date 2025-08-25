"use client"

import { isManual, isStripe, isComgate } from "@lib/constants"
import { placeOrder, capturePayment } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState } from "react"
import ErrorMessage from "../error-message"
import { redirect } from "next/navigation"
import styles from "./style.module.scss"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string,
  countryCode: string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  countryCode,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]
  switch (true) {
    case isStripe(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
      case isComgate(paymentSession?.provider_id):
      return (
        <ComgatePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}/>
      )
    default:
      return (
        <div className={styles.root}>
          <Button disabled>Vyberte způsob platby</Button>
        </div>
      )
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        return
      })
  }

  return (
    <div className={styles.root}>
      <Button
        className={styles.button}
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Potvrdit objednávku
      </Button>
      <div className={styles.errorWrap}>
        <ErrorMessage
          error={errorMessage}
          data-testid="stripe-payment-error-message"
        />
      </div>
    </div>
  )
}

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()
  }

  return (
    <div className={styles.root}>
      <Button
        className={styles.button}
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid="submit-order-button"
      >
        Potvrdit objednávku
      </Button>
      <div className={styles.errorWrap}>
        <ErrorMessage
          error={errorMessage}
          data-testid="manual-payment-error-message"
        />
      </div>
    </div>
  )
}

const ComgatePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )
  const country_code = cart?.shipping_address?.country_code?.toLowerCase?.()
  console.log("session:", session)

  const redirectUrl: string | undefined =
    typeof session?.data?.redirectUrl === "string"
      ? session.data.redirectUrl
      : typeof session?.provider_id === "string"
      ? session.provider_id
      : undefined

  const handlePayment = () => {
    if (!redirectUrl) {
      setErrorMessage("Přesměrovací URL ComgateComgate nebyla nalezena.")
      return
    }

    // Otevře URL v novém okně, nebo můžeš redirectnout přímo
    window.location.href = redirectUrl

    if (window.addEventListener) {
        window.addEventListener('message', async function (e) {
            // validace, že message obsahuje data
            if (!e || !(e !== null && e !== void 0 && e.data)) return;
            const { id, status /* refId, ... */ } = e.data;
            if (['PAID', 'AUTHORIZED'].includes(status)) {
                console.log("Payment successful:", id);
            } 
            else {
                console.log("redirecting to cancelled payment page")
                redirect(`/${country_code}/cart/${cart.id}/canceled`)
            }
        }, false);
    }
  }

  return (
    <div className={styles.root}>
      <Button
        className={`${styles.button} ${styles.comgate}`}
        disabled={notReady || !redirectUrl}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid={dataTestId}
      >
        Zaplatit přes Comgate
      </Button>
      <div className={styles.errorWrap}>
        <ErrorMessage
          error={errorMessage}
          data-testid="comgate-payment-error-message"
        />
      </div>
    </div>
  )
}


export default PaymentButton
