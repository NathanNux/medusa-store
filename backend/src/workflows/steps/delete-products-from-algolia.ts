import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

type DeleteProductsFromAlgoliaInput = {
  ids: string[]
}

// Placeholder step: implement actual Algolia deletion when Algolia is configured
export const deleteProductsFromAlgoliaStep = createStep(
  "delete-products-from-algolia",
  async (input: DeleteProductsFromAlgoliaInput) => {
  // no-op for now
  return new StepResponse(input)
  }
)
