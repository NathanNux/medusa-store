import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import BgImage from "@modules/account/components/BgImage"
import { retrieveProduct } from "@lib/data/products"
import WishlistTemplate from "@modules/account/templates/wishlist-template"
import { listRegions } from "@lib/data/regions"

import s from "../styles/profile.module.scss"

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved products",
}

async function getCustomerWishlists(_customerId: string) {
  // const cookieStore = await cookies()
  // const token = cookieStore.get("_medusa_jwt")?.value
  // const pk = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  // const headers: Record<string, string> = {
  //   accept: "application/json",
  //   "content-type": "application/json",
  //   ...(pk ? { "x-publishable-api-key": pk, "x-publishable-key": pk } : {}),
  //   cookie: cookieStore.toString(),
  // }
  // if (token) headers.authorization = `Bearer ${token}`

  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/customers/me/wishlists`,
  //   {
  //     cache: "no-store",
  //     headers,
  //   }
  // )

  // if (!res.ok) {
  //   return []
  // }
  // const data = await res.json()
  // // Backend returns { wishlist: {..., items: [...] } }
  // console.log("Wishlist data", data)
  // return data.wishlist?.items ?? []

  const mockWishlistItems = [
    {
      id: "wishlist_item_1",
      product_variant: {
        id: "variant_01K2JKVDFXEEBTD7W4BH4KGSNC",
        product: {
          id: "prod_01K2JKVDCGDD9FD6YCRNSCN9CT",
          handle: "t-shirt",
          thumbnail: "/assets/tee-black-front.webp",
          title: "Medusa T-Shirt"
        },
        options: [
          { value: "Large" },
          { value: "Black" }
        ]
      }
    },
    {
      id: "wishlist_item_2",
      product_variant: {
        id: "variant_01K2JKVDFXEEBTD7W4BH4KGSND",
        product: {
          id: "prod_01K2JKVDCGDD9FD6YCRNSCN9CU",
          handle: "hoodie",
          thumbnail: "/assets/img/img/1.jpg",
          title: "Medusa Hoodie"
        },
        options: [
          { value: "Medium" },
          { value: "Gray" }
        ]
      }
    },
    {
      id: "wishlist_item_3",
      product_variant: {
        id: "variant_01K2JKVDFXEEBTD7W4BH4KGSNE",
        product: {
          id: "prod_01K2JKVDCGDD9FD6YCRNSCN9CV",
          handle: "mug",
          thumbnail: "/assets/img/img/2.jpg",
          title: "Medusa Mug"
        },
        options: [
          { value: "11oz" },
          { value: "White" }
        ]
      }
    },
    {
      id: "wishlist_item_4",
      product_variant: {
        id: "variant_01K2JKVDFXEEBTD7W4BH4KGSNF",
        product: {
          id: "prod_01K2JKVDCGDD9FD6YCRNSCN9CW",
          handle: "cap",
          thumbnail: "/assets/img/img/3.jpg",
          title: "Medusa Cap"
        },
        options: [
          { value: "One Size" },
          { value: "Black" }
        ]
      }
    },
    {
      id: "wishlist_item_5",
      product_variant: {
        id: "variant_01K2JKVDFXEEBTD7W4BH4KGSNG",
        product: {
          id: "prod_01K2JKVDCGDD9FD6YCRNSCN9CX",
          handle: "sticker",
          thumbnail: "/assets/img/img/4.jpg",
          title: "Medusa Sticker Pack"
        },
        options: [
          { value: "Pack of 3" }
        ]
      }
    },
    {
      id: "wishlist_item_6",
      product_variant: {
        id: "variant_01K2JKVDFXEEBTD7W4BH4KGSNH",
        product: {
          id: "prod_01K2JKVDCGDD9FD6YCRNSCN9CY",
          handle: "notebook",
          thumbnail: "/assets/img/img/5.jpg",
          title: "Medusa Notebook"
        },
        options: [
          { value: "A5" },
          { value: "Black Cover" }
        ]
      }
    }
  ]

  console.log("Using mock wishlist items:", mockWishlistItems.length)
  return mockWishlistItems
}

type PageProps = { params: Promise<{ countryCode: string }> }

export default async function WishlistPage(props: PageProps) {
  const { countryCode } = await props.params
    const customer = await retrieveCustomer()
    const regions = await listRegions()
    
    if (!customer || !regions) {
      notFound()
    }

  const wishlistItems = await getCustomerWishlists(customer.id)
  const enrichedItems = await Promise.all(
    wishlistItems.map(async (item: any) => {
      const variant = item?.product_variant
      const product = variant?.product
      const hasHandle = !!product?.handle
      const hasThumb = !!product?.thumbnail
      if (hasHandle && hasThumb) return item

      const productId = product?.id || variant?.product_id
      if (!productId) return item

      try {
        const p = await retrieveProduct(productId, { fields: "id,handle,thumbnail,title" })
        return {
          ...item,
          product_variant: {
            ...variant,
            product: { ...product, ...p },
          },
        }
      } catch {
        return item
      }
    })
  )
  console.log("Fetched wishlist items", wishlistItems)
  return (
    <main className={s.root}>
      <WishlistTemplate items={enrichedItems} countryCode={countryCode} />
      <BgImage src="/assets/img/img/2.jpg" />
    </main>
  )
}
