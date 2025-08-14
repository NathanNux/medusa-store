"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Card } from "../Card"
import { Button, RadioGroup } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { useRouter } from "next/navigation"
import { useCart } from "@lib/context/cart"
import { sdk } from "@lib/config"
import { formatPrice } from "@lib/util/price"

const ZASILKOVNA_ID = "so_01K1BYJ5XTSZA9H74KQ2F3PE2F"

type ShippingProps = {
  handle: string
  isActive: boolean
}

export const Shipping = ({
  handle,
  isActive
}: ShippingProps) => {
  const { cart, updateCart } = useCart()
  const [loading, setLoading] = useState(true)
  const [shippingMethod, setShippingMethod] = useState(cart?.shipping_methods?.[0]?.shipping_option_id || "")
  const [shippingOptions, setShippingOptions] = useState<HttpTypes.StoreCartShippingOption[]>([])
  const [calculatedPrices, setCalculatedPrices] = useState<Record<string, number>>({})
  const [isWidgetOpen, setIsWidgetOpen] = useState(false)
  const router = useRouter()

  // Load shipping options
  useEffect(() => {
    if (shippingOptions.length || !cart) return
    sdk.store.fulfillment.listCartOptions({ cart_id: cart.id || "" })
      .then(({ shipping_options }) => {
        setShippingOptions(shipping_options)
        setLoading(false)
      })
  }, [shippingOptions, cart])

  // Calculate prices for calculated shipping options
  useEffect(() => {
    if (!cart || !shippingOptions.length) return
    const promises = shippingOptions
      .filter(opt => opt.price_type === "calculated")
      .map(opt =>
        sdk.client.fetch(`/store/shipping-options/${opt.id}/calculate`, {
          method: "POST",
          body: { cart_id: cart.id, data: {} }
        }) as Promise<{ shipping_option: HttpTypes.StoreCartShippingOption }>
      )
    if (promises.length) {
      Promise.allSettled(promises).then(res => {
        const pricesMap: Record<string, number> = {}
        res.filter(r => r.status === "fulfilled")
          .forEach(p => (pricesMap[p.value?.shipping_option.id || ""] = p.value?.shipping_option.amount))
        setCalculatedPrices(pricesMap)
      })
    }
  }, [shippingOptions, cart])

  // Load Packeta widget script once
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://widget.packeta.com/v6/www/js/library.js'
    script.async = true
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  // Open widget when needed
  useEffect(() => {
    if (!isWidgetOpen) return
    if (!window.Packeta || !window.Packeta.Widget) return

    const packetaApiKey = '1c80656ab4964dc5'
    const packetaOptions = {
      language: "en",
      valueFormat: "\"Packeta\",id,carrierId,carrierPickupPointId,name,city,street",
      view: "modal",
      vendors: [
        { country: "cz" }, { country: "hu" }, { country: "sk" }, { country: "ro" },
        { country: "cz", group: "zbox" }, { country: "sk", group: "zbox" },
        { country: "hu", group: "zbox" }, { country: "pl" }, { country: "ro", group: "zbox" }
      ]
    }

    function showSelectedPickupPoint(point) {
      if (point) {
        updateCart({
          metadata: { packeta_pickup_point: point.id }
        })
        setIsWidgetOpen(false)
      }
    }

    window.Packeta.Widget.pick(packetaApiKey, showSelectedPickupPoint, packetaOptions)
  }, [isWidgetOpen, updateCart])

  const getShippingOptionPrice = useCallback((opt) => {
    const price = opt.price_type === "flat" ? opt.amount : calculatedPrices[opt.id]
    return formatPrice(price || 0, cart?.currency_code)
  }, [calculatedPrices, cart])

  const isButtonDisabled = useMemo(() => loading || !shippingMethod, [shippingMethod, loading])

  const handleShippingChange = (value) => {
    setShippingMethod(value)
    if (value === ZASILKOVNA_ID) setIsWidgetOpen(true)
  }

  const handleSubmit = () => {
    if (isButtonDisabled) return
    setLoading(true)
    updateCart({
      shippingMethodData: {
        option_id: shippingMethod,
        data: {}
      }
    }).then(() => {
      setLoading(false)
      router.push(`/express-checkout/${handle}?step=payment`)
    })
  }

  return (
    <Card
      title="Shipping"
      isActive={isActive}
      isDone={!!cart?.shipping_methods?.length}
      path={`/express-checkout/${handle}?step=shipping`}
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <RadioGroup value={shippingMethod} onValueChange={handleShippingChange}>
            {shippingOptions.map(opt => (
              <div className="flex gap-1" key={opt.id}>
                <RadioGroup.Item value={opt.id} />
                <div className="flex justify-between w-full gap-2">
                  <span className="text-sm">{opt.name}</span>
                  <span className="text-xs text-ui-fg-muted">{getShippingOptionPrice(opt)}</span>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
        <hr className="bg-ui-bg-subtle" />
        <Button
          disabled={isButtonDisabled}
          onClick={handleSubmit}
          className="w-full"
        >
          Go to payment
        </Button>
      </div>
    </Card>
  )
}