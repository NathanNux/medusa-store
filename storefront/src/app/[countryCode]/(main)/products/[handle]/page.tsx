import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getBundleProduct, getProductReviews, listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import Product from "@modules/products/ProductPage/product"
import Details from "@modules/products/ProductPage/details"
import SoldProducts from "@modules/products/ProductPage/Sold"
import { listCategories } from "@lib/data/categories"
import ProductReviews from "@modules/products/components/product-reviews"
import ProductTemplate from "@modules/products/templates"
import BundleActions from "@modules/products/components/bundle-actions"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

const ENABLE_BUNDLES = true

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    const promises = countryCodes.map(async (country) => {
      const { response } = await listProducts({
        countryCode: country,
        queryParams: { limit: 100, fields: "handle" },
      })

      return {
        country,
        products: response.products,
      }
    })

    const countryProducts = await Promise.all(promises)

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        }))
      )
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Keramická Zahrada`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Keramická Zahrada`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

   // @ts-ignore 
  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: { 
      handle: params.handle, 
      fields: "*bundle, *variants.calculated_price, +variants.inventory_quantity, +metadata, +tags",
    },
  }).then(({ response }) => response.products[0])

  // Check before using
  if (!pricedProduct) {
    notFound()
  }

  // Fetch all categories (with products)
  const categories = await listCategories({
    fields: "*category_children, *products, *parent_category, *parent_category.parent_category",
    limit: 10,
  })

  // Find categories this product belongs to
  const productCategories = categories.filter(cat =>
    Array.isArray(cat.products) && cat.products.some(p => p.id === pricedProduct.id)
  )

  const bundleProduct = pricedProduct.bundle ? 
    await getBundleProduct(pricedProduct.bundle.id, {
      currency_code: region?.currency_code,
      region_id: region?.id,
    }) : null


  const reviewsData = await getProductReviews({
    productId: pricedProduct.id,
    limit: 10,
    offset: 0,
  })

  console.log("reviewsData", reviewsData)
  console.log("pricedProductID", pricedProduct.id)

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={params.countryCode}
      bundle={bundleProduct?.bundle_product}
    />
    // <main>
    //  <Product
    //     product={pricedProduct}
    //     region={region}
    //     countryCode={params.countryCode}
    //     categories={productCategories}
    //   />
    //   {ENABLE_BUNDLES && bundleProduct && (
    //     <BundleActions 
    //       bundle={bundleProduct?.bundle_product}
    //     />
    //   )}
    //   <Details product={pricedProduct} />
    //   <ProductReviews productId={pricedProduct.id} initialReviews={reviewsData.reviews} initialRating={reviewsData.average_rating} initialCount={reviewsData.count} />
    //   <SoldProducts />
    // </main>
  )
}
