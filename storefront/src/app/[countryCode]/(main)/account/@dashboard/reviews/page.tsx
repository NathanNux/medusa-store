import { Metadata } from "next"
import s from "../styles/profile.module.scss"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { cookies } from "next/headers"
import Link from "next/link"
import BgImage from "@modules/account/components/BgImage"

export const metadata: Metadata = {
  title: "My Reviews",
  description: "See the reviews you’ve written",
}

async function getCustomerReviews(customerId: string) {
  const cookieStore = await cookies()
  const res = await fetch(
  `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/customers/me/reviews`,
  { cache: "no-store", headers: { cookie: cookieStore.toString() } }
)


  if (!res.ok) {
    return []
  }
  const data = await res.json()
  return data.reviews ?? []
}

type PageProps = { params: Promise<{ countryCode: string }> }

export default async function ReviewsPage(props: PageProps) {
  const { countryCode } = await props.params
  const customer = await retrieveCustomer()
  if (!customer) {
    return(
      <div>
        <p>Pro přístup k recenzím se prosím přihlaste</p>
        <Link href={`/${countryCode}/account`}>Přihlásit se</Link>
      </div>
    )
  }

  const reviews = await getCustomerReviews(customer.id)

  return (
    <main className={s.root}>
      <div className={s.content} data-testid="reviews-page-wrapper">
        <div className={s.header}>
          <h1 className={s.title}>My Reviews</h1>
          <p className={s.desc}>All the reviews you’ve submitted.</p>
        </div>

        <div className={s.body}>
          {(!reviews || reviews.length === 0) ? (
            <p>You haven’t written any reviews yet.</p>
          ) : (
            <ul>
              {reviews
                .filter((r: any) => !!r)
                .map((review: any) => (
                  <li key={review.id}>
                    <strong>{review?.title || "Bez názvu"}</strong> – {(review?.rating ?? 0)}/5
                    <br />
                    {review?.content ?? ""}
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
