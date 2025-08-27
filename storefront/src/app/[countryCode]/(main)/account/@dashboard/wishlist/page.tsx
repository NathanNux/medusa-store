import { Metadata } from "next"
import s from "../styles/profile.module.scss"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { cookies } from "next/headers"

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved products",
}

async function getCustomerWishlists(customerId: string) {
  // volání na backend (musíš mít endpoint, co vrací wishlisty pro zákazníka)
  const res = await fetch(
  `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/customers/me/wishlists`,
  { cache: "no-store", headers: { cookie: cookies().toString() } }
)


  if (!res.ok) {
    return []
  }
  const data = await res.json()
  return data.wishlists ?? []
}

export default async function WishlistPage() {
  const customer = await retrieveCustomer()
  if (!customer) notFound()

  const wishlists = await getCustomerWishlists(customer.id)

  return (
    <div className={s.root}>
      <div className={s.header}>
        <h1 className={s.title}>Wishlist</h1>
        <p className={s.desc}>Products you’ve saved for later.</p>
      </div>

      <div className={s.body}>
        {wishlists.length === 0 ? (
          <p>No items in wishlist.</p>
        ) : (
          <ul>
            {wishlists.map((item: any) => (
              <li key={item.id}>
                {item.product?.title ?? "Unknown product"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
