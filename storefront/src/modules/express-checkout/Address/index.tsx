"use client"

import { useMemo, useState } from "react"
import { Card } from "../Card"
import { Button, Input, Select } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import { useRegion } from "@lib/context/region"
import { useCart } from "@lib/context/cart"

import { StoreRegion } from "@medusajs/types"


type AddressProps = {
  handle: string
  isActive: boolean
  regions: StoreRegion[];
}

export const Address = ({
  handle,
  isActive,
  regions
}: AddressProps) => {
  const { cart, updateCart } = useCart()
  const { region } = useRegion()
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState(cart?.shipping_address?.first_name || "")
  const [lastName, setLastName] = useState(cart?.shipping_address?.last_name || "")
  const [email, setEmail] = useState(cart?.email || "")
  const [phone, setPhone] = useState(cart?.shipping_address?.phone || "")
  const [address, setAddress] = useState(cart?.shipping_address?.address_1 || "")
  const [postalCode, setPostalCode] = useState(cart?.shipping_address?.postal_code || "")
  const [city, setCity] = useState(cart?.shipping_address?.city || "")
  const [country, setCountry] = useState(cart?.shipping_address?.country_code || region?.countries?.[0]?.iso_2 || "")
  const router = useRouter()


  const isButtonDisabled = useMemo(() => {
    return loading || !firstName || !lastName || !email || !phone || !address || !postalCode || !city || !country
  }, [firstName, lastName, email, phone, address, postalCode, city, country, loading])

  const handleSubmit = () => {
    if (isButtonDisabled) {
      return
    }

    setLoading(true)

    updateCart({
      updateData: {
        shipping_address: {
          first_name: firstName,
          last_name: lastName,
          phone,
          address_1: address,
          postal_code: postalCode,
          city,
          country_code: country,
        },
        billing_address: {
          first_name: firstName,
          last_name: lastName,
          phone,
          address_1: address,
          postal_code: postalCode,
          city,
          country_code: country,
        },
        email,
      },
    })
    .then(() => {
      setLoading(false)
      router.push(`/express-checkout/${handle}?step=shipping`)
    })
  }

  const options = useMemo(() => {
    return regions.flatMap(r => r.countries?.map(c => ({
      country: c.iso_2,
      region: r.id,
      label: c.display_name,
    })))
    .sort((a, b) => {
      if (!a || !b) return 0
      return (a.label ?? "").localeCompare(b.label ?? "")
    })
  }, [regions])

  return (
    <Card 
      title="Delivery Address" 
      isActive={isActive} 
      isDone={!!cart?.shipping_address}
      path={`/express-checkout/${handle}?step=address`}
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs">Contact</span>
          <div className="flex gap-2">
            <Input
              name="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
            />
            <Input
              name="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
            />
          </div>
          <Input
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <Input
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs">Delivery</span>
          <Input
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
          <div className="flex gap-2">
            <Input
              name="postal_code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Postal code"
            />
            <Input
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
            />
          </div>
          <Select
            value={country}
            onValueChange={(value) => setCountry(value)}
          >
            <Select.Trigger>
              <Select.Value placeholder="Country" />
            </Select.Trigger>
            <Select.Content>
              {options.map((opt) => (
                <Select.Item
                  key={opt?.country}
                  value={opt?.country || ""}
                >
                  {opt?.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
        <hr className="bg-ui-bg-subtle" />
        <Button
          disabled={isButtonDisabled}
          onClick={handleSubmit}
          className="w-full"
        >
          Continue
        </Button>
      </div>
    </Card>
  )
}