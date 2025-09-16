"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { toast } from "@medusajs/ui"

export default function WishlistToggle({ variantId }: { variantId?: string }) {
  const [itemId, setItemId] = useState<string | null>(null)
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null)
  const [loading, startTransition] = useTransition()

  const inWishlist = useMemo(() => Boolean(itemId), [itemId])

  useEffect(() => {
    if (!variantId) return
    let active = true
    ;(async () => {
      try {
        const res = await fetch("/api/wishlist/items", { method: "GET" })
        if (res.status === 401) {
          if (active) setIsAuthed(false)
          return
        }
        if (!res.ok) return
        const data = await res.json()
        const items = data?.wishlist?.items || []
        const found = items.find((i: any) => i?.product_variant_id === variantId)
        if (active) {
          setIsAuthed(true)
          setItemId(found?.id || null)
        }
      } catch {
        if (active) setIsAuthed(false)
      }
    })()
    return () => {
      active = false
    }
  }, [variantId])

  const toggle = async () => {
    if (!variantId) return toast.error("Vyberte variantu")
    startTransition(async () => {
      try {
        if (inWishlist && itemId) {
          const res = await fetch(`/api/wishlist/items/${itemId}`, { method: "DELETE" })
          if (!res.ok) throw new Error("Mazání selhalo")
          setItemId(null)
          toast.success("Odebráno z wishlistu")
        } else {
          const res = await fetch(`/api/wishlist/items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ variant_id: variantId }),
          })
          const data = await res.json()
          if (!res.ok || !data?.success) throw new Error(data?.message || "Přidání selhalo")
          const newId = data?.wishlist?.items?.find?.((i: any) => i?.product_variant_id === variantId)?.id
          setItemId(newId || null)
          toast.success("Přidáno do wishlistu")
        }
      } catch (e: any) {
        toast.error(e?.message || "Operace selhala")
      }
    })
  }

  if (isAuthed === false) return null

  return (
    <button
      type="button"
      className={`wishlist-toggle ${inWishlist ? "active" : ""}`}
      onClick={toggle}
      disabled={loading}
      aria-pressed={inWishlist}
      aria-label={inWishlist ? "Odebrat z wishlistu" : "Přidat do wishlistu"}
      title={inWishlist ? "Odebrat z wishlistu" : "Přidat do wishlistu"}
    >
      {inWishlist ? "Uloženo ✓" : "Uložit"}
    </button>
  )
}
