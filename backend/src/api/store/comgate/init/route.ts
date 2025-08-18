import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { cart_id, email, first_name, last_name } = (req.body ?? {}) as {
    cart_id?: string
    email?: string
    first_name?: string
    last_name?: string
  }

  if (!cart_id) {
    return res.status(400).json({ message: "cart_id is required" })
  }

  try {
    const cartService = req.scope.resolve("cart") as any
    const cart = await cartService.retrieveCart(cart_id, {
      relations: ["shipping_address"],
    })

    // Merge and persist metadata at cart level (Medusa v2 carts module uses updateCarts)
    await cartService.updateCarts([
      {
        id: cart_id,
        metadata: {
          ...(cart.metadata || {}),
          comgate_order_ref: cart_id,
          comgate_email: email ?? cart.email ?? null,
          comgate_first_name: first_name ?? cart?.billing_address?.first_name ?? null,
          comgate_last_name: last_name ?? cart?.billing_address?.last_name ?? null,
        },
      },
    ])

    return res.json({ ok: true })
  } catch (e: any) {
    req.scope.resolve("logger").error("Comgate init failed", e)
    return res.status(500).json({ message: e?.message || "Internal error" })
  }
}
