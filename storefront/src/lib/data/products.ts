"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"
import { StoreProductReview } from "../../types/global"

export type BundleProduct = {
  id: string
  title: string
  product: {
    id: string
    thumbnail: string
    title: string
    handle: string
  }
  items: {
    id: string
    title: string
    product: HttpTypes.StoreProduct
  }[]
}

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: (HttpTypes.StoreProduct & {
    bundle?: Omit<BundleProduct, "items">
  })[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 16
  const _pageParam = Math.max(pageParam, 1)
  const offset = (_pageParam === 1) ? 0 : (_pageParam - 1) * limit;

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }
  
  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ products: (HttpTypes.StoreProduct & { bundle?: Omit<BundleProduct, "items"> })[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          ...queryParams,
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: (HttpTypes.StoreProduct & { bundle?: Omit<BundleProduct, "items"> })[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 20,
      fields: "*bundle",
      //NOTE if products are not shown in the store page correctly, bump up the limit to one more 0
    },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
}


/**
 * This will fetch reviews for a specific product.
 * It will return the reviews along with the average rating, limit, offset, and count. So they can be used for pagination. and for displaying the average rating.
 */

export const getProductReviews = async ({
  productId,
  limit = 10,
  offset = 0,
}: {
  productId: string
  limit?: number
  offset?: number 
}) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions(`product-reviews-${productId}`)),
  }
  
  const url = `/store/products/${productId}/reviews`
  const query = { limit, offset, order: "-created_at" }

  console.log("=== getProductReviews REQUEST ===")
  console.log("URL:", url)
  console.log("Query:", query)
  console.log("Headers:", headers)
  console.log("Next options:", next)
  return sdk.client.fetch<{
    reviews: StoreProductReview[]
    average_rating: number
    limit: number
    offset: number
    count: number
  }>(`/store/products/${productId}/reviews`, {
    // NOTE: always check for the method, dot forget it. 
    // WIP: LET THE DEVS KNOW THERE IS ISSUE WITH THEIR DOCS CODE 
  
    method: "GET",
    headers,
    query: {
      limit,
      offset,
      order: "-created_at",
    },
    next,
    cache: "force-cache",
  })
}

export const addProductReview = async (input: {
  title?: string
  content: string
  first_name: string
  last_name: string
  rating: number,
  product_id: string
}) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client.fetch(`/store/reviews`, {
    method: "POST",
    headers,
    body: input,
    next: {
      ...(await getCacheOptions(`product-reviews-${input.product_id}`)),
    },
    cache: "no-store",
  })
}


export const subscribeToRestock = async ({
  variant_id,
  email,
  sales_channel_id,
}: {
  variant_id: string
  email?: string
  sales_channel_id?: string
}) => {
  return sdk.client.fetch(`/store/restock-subscriptions`, {
    method: "POST",
    body: {
      variant_id,
      email,
      sales_channel_id,
    },
    cache: "no-store",
  })
}


export const getBundleProduct = async (id: string, {
  currency_code,
  region_id,
}: {
  currency_code?: string
  region_id?: string
}) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client.fetch<{
    bundle_product: BundleProduct
  }>(`/store/bundle-products/${id}`, {
    method: "GET",
    headers,
    query: {
      currency_code,
      region_id,
    },
  })
}


export const listBundles = async (params?: { limit?: number; offset?: number }) => {
  return sdk.client.fetch<{ bundles: BundleProduct[]; count: number }>(
    "/store/bundle-products",
    {
      method: "GET",
      query: params,
    }
  )
}