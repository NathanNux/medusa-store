import ECom from "@modules/store/Shop"
import { listProducts } from "@lib/data/products"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { listCategories } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"
import { getRegion } from "@lib/data/regions"

export default async function StorePage({ params, searchParams }: { params: { countryCode: string }, searchParams: { sortBy?: SortOptions, page?: string } }) {
  const countryCode = params.countryCode

  // Fetch all products, including bundle info
  const { response: { products, count } } = await listProducts({
    queryParams: {
      limit: 16,
      fields: "*bundle", 
    },
    countryCode,
  })

    let region: HttpTypes.StoreRegion | undefined | null
  
  // Fetch region information based on country code
  if (countryCode) {
    region = await getRegion(countryCode)
  }
  // Merge products and mark bundles
  const allProducts: HttpTypes.StoreProduct[] = products.map(product => ({
    ...product,
    isBundle: (!!product as any).bundle,
    bundle: (product as any).bundle,
  }))

  // Fetch all categories (with products)
  const categories = await listCategories({
    fields: "*category_children, *products, *parent_category, *parent_category.parent_category",
    limit: 10,
  })



  return (
    <ECom
      countryCode={countryCode}
      products={allProducts}
      categories={categories}
      regionId={region?.id}
    />
    // <StoreTemplate
    //   sortBy={sortBy}
    //   page={currentPage}
    //   countryCode={params.countryCode}
    // />
  )
}