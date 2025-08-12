import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { QueryContext } from "@medusajs/framework/utils"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve("query")
  const { currency_code, region_id } = req.query

  const { data } = await query.graph({
    entity: "bundle",
    fields: [
      "*", 
      "items.*", 
      "items.product.*", 
      "items.product.options.*",
      "items.product.options.values.*",
      "items.product.variants.*",
      "items.product.variants.calculated_price.*",
      "items.product.variants.options.*",
    ],
    // No filters: fetch all bundles
    context: {
      items: {
        product: {
          variants: {
            calculated_price: QueryContext({
              region_id,
              currency_code,
            }),
          },
        },
      },
    },
  })

  res.json({
    bundles: data,
  })
}