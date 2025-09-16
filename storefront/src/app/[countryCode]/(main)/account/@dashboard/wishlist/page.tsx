import { Metadata } from "next"
import s from "../styles/profile.module.scss"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { cookies } from "next/headers"
import BgImage from "@modules/account/components/BgImage"

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

export default async function WishlistPage() {
  const customer = await retrieveCustomer()
  if (!customer) notFound()

  const wishlistItems = await getCustomerWishlists(customer.id)
  console.log("Fetched wishlist items", wishlistItems)
  return (
    <main className={s.root}>
      <div className={s.content} data-testid="wishlist-page-wrapper">
        <div className={s.header}>
          <h1 className={s.title}>Wishlist</h1>
          <p className={s.desc}>Products you’ve saved for later.</p>
        </div>

        <div className={s.body}>
          {wishlistItems.length === 0 ? (
            <p>No items in wishlist.</p>
          ) : (
            <ul>
              {wishlistItems.map((item: any) => (
                <li key={item.id}>
                  {item?.product_variant?.product?.title || item?.product_variant?.title || "Unknown product"}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <BgImage src="/assets/img/img/2.jpg" />
    </main>
  )
}
