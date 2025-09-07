import { clx } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
  className,
  countryCode
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  className?: string
  countryCode: string
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  return (
    <div className="product__details__cta__price">
      <p>Cena |</p>
      <div className="product__details__cta__price__main">
        <span
          className={clx(
            "text-xl-semi",
            { "text-ui-fg-interactive": selectedPrice?.price_type === "sale" },
            className
          )}
          data-testid="product-price"
          data-value={selectedPrice?.calculated_price_number}
        >
      {cheapestPrice?.calculated_price !== undefined
          ? `${String(cheapestPrice.calculated_price).replace(/czk/i, "")}`
        : "Cena není k dispozici"}
        </span>
        {selectedPrice?.price_type === "sale" && (
          <>
            <p>
              <span className="text-ui-fg-subtle">Původní cena: </span>
              <span
                className="line-through"
                data-testid="original-product-price"
                data-value={selectedPrice.original_price_number}
              >
                 {cheapestPrice?.original_price !== undefined
                ? `${String(cheapestPrice.original_price).replace(/czk/i, "")}`
                : "Cena není k dispozici"}
              </span>
            </p>
            <span className="text-ui-fg-interactive">
              -{selectedPrice.percentage_diff}%
            </span>
          </>
        )}
      </div>
    </div>
  )
}