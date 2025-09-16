import { Metadata } from "next"
import s from "../styles/profile.module.scss"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { cookies } from "next/headers"
import Link from "next/link"
import BgImage from "@modules/account/components/BgImage"
import "./styles.scss"
import { retrieveProduct } from "@lib/data/products"
import DeleteButton from "./DeleteButton"

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved products",
}

async function getCustomerWishlists(_customerId: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("_medusa_jwt")?.value
  const pk = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  const headers: Record<string, string> = {
    accept: "application/json",
    "content-type": "application/json",
    ...(pk ? { "x-publishable-api-key": pk, "x-publishable-key": pk } : {}),
    cookie: cookieStore.toString(),
  }
  if (token) headers.authorization = `Bearer ${token}`

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/customers/me/wishlists`,
    {
      cache: "no-store",
      headers,
    }
  )

  if (!res.ok) {
    return []
  }
  const data = await res.json()
  // Backend returns { wishlist: {..., items: [...] } }
  console.log("Wishlist data", data)
  return data.wishlist?.items ?? []
}

type PageProps = { params: Promise<{ countryCode: string }> }

function getVariantOptionsSummary(variant: any): string {
  if (!variant) return ""
  const values: string[] = Array.isArray(variant.options)
    ? variant.options.map((o: any) => o?.value).filter(Boolean)
    : []
  if (values.length) return values.join(" / ")
  return variant.title || ""
}

export default async function WishlistPage(props: PageProps) {
  const { countryCode } = await props.params
  const customer = await retrieveCustomer()
  if (!customer) {
    return(
      <div>
        <p>Pro přístup k wishlistu se prosím přihlaste</p>
        <Link href={`/${countryCode}/account`}>Přihlásit se</Link>
      </div>
    )
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
      <div className={s.content} data-testid="wishlist-page-wrapper">
        <div className={s.header}>
          <h1 className={s.title}>Wishlist</h1>
          <p className={s.desc}>Products you’ve saved for later.</p>
        </div>

        <div className={s.body}>
          {enrichedItems.length === 0 ? (
            <p>No items in wishlist.</p>
          ) : (
            <ul className="wishlist-list">
              {enrichedItems.map((item: any) => {
                const variant = item?.product_variant
                const product = variant?.product
                const title = product?.title || variant?.title || "Unknown product"
                const handle = product?.handle
                const thumb = product?.thumbnail
                const subtitle = getVariantOptionsSummary(variant)
                console.log("Rendering wishlist item", item)

                return (
                  <li key={item.id} className="wishlist-card">
                    <Link
                      className="wishlist-link"
                      href={handle ? `/${countryCode}/products/${handle}` : `/${countryCode}`}
                    >
                      <div className="wishlist-thumb">
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumb} alt={title} />
                        ) : (
                          <div className="wishlist-thumb placeholder" />
                        )}
                      </div>
                      <div className="wishlist-info">
                        <h3 className="wishlist-title">{title}</h3>
                        {subtitle ? (
                          <div className="wishlist-subtitle">{subtitle}</div>
                        ) : null}
                      </div>
                    </Link>
                    <div className="wishlist-actions">
                      <DeleteButton itemId={item.id} />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <BgImage src="/assets/img/img/2.jpg" />
    </main>
  )
}
