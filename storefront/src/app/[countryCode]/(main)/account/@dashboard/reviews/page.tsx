import { Metadata } from "next"
import s from "../styles/profile.module.scss"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { cookies } from "next/headers"

export const metadata: Metadata = {
  title: "My Reviews",
  description: "See the reviews you’ve written",
}

async function getCustomerReviews(customerId: string) {
  const res = await fetch(
  `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/customers/me/reviews`,
  { cache: "no-store", headers: { cookie: cookies().toString() } }
)


  if (!res.ok) {
    return []
  }
  const data = await res.json()
  return data.reviews ?? []
}

export default async function ReviewsPage() {
  const customer = await retrieveCustomer()
  if (!customer) notFound()

  const reviews = await getCustomerReviews(customer.id)

  return (
    <div className={s.root}>
      <div className={s.header}>
        <h1 className={s.title}>My Reviews</h1>
        <p className={s.desc}>All the reviews you’ve submitted.</p>
      </div>

      <div className={s.body}>
        {reviews.length === 0 ? (
          <p>You haven’t written any reviews yet.</p>
        ) : (
          <ul>
            {reviews.map((review: any) => (
              <li key={review.id}>
                <strong>{review.title}</strong> – {review.rating}/5
                <br />
                {review.content}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
