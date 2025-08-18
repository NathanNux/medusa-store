import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { cart_id, email, first_name, last_name } = req.body || {}

  if (!cart_id) {
    return res.status(400).json({ message: "cart_id is required" })
  }

  try {
    const cartService = req.scope.resolve("cart")
    const cart = await cartService.retrieveCart(cart_id, {
      relations: ["shipping_address"],
    })

    const shippingAddress = cart.shipping_address

    // Merge and persist metadata at cart level
    await cartService.update(cart_id, {
      metadata: {
        ...(cart.metadata || {}),
        comgate_order_ref: cart_id,
        comgate_email: email ?? cart.email ?? null,
        comgate_first_name: first_name ?? cart?.billing_address?.first_name ?? null,
        comgate_last_name: last_name ?? cart?.billing_address?.last_name ?? null,
      },
    })

    // Optionally mirror to shipping address metadata (useful for fulfillment integrations)
    if (shippingAddress?.id) {
      await cartService.updateAddresses([
        {
          id: shippingAddress.id,
          metadata: {
            ...(shippingAddress.metadata || {}),
            comgate_order_ref: cart_id,
            comgate_email: email ?? cart.email ?? null,
            comgate_first_name: first_name ?? cart?.billing_address?.first_name ?? null,
            comgate_last_name: last_name ?? cart?.billing_address?.last_name ?? null,
          },
        },
      ])
    }

    return res.json({ ok: true })
  } catch (e: any) {
    req.scope.resolve("logger").error("Comgate init failed", e)
    return res.status(500).json({ message: e?.message || "Internal error" })
  }
}
