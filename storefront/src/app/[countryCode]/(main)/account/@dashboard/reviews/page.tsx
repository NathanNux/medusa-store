import { Metadata } from "next"
import s from "../styles/profile.module.scss"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { cookies } from "next/headers"
import { sdk } from "@lib/config"
import Link from "next/link"
import BgImage from "@modules/account/components/BgImage"
import DebugReviewsLogger from "./DebugReviewsLogger"

export const metadata: Metadata = {
  title: "My Reviews",
  description: "See the reviews you’ve written",
}

async function getCustomerReviews() {
  const cookieStore = await cookies()
  const token = cookieStore.get("_medusa_jwt")?.value
  const pk = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  if (!token) return []

  try {
    const data = await sdk.client.fetch<{ reviews: any[]; count?: number; limit?: number; offset?: number }>(
      `/store/customers/me/reviews`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
          ...(pk ? { "x-publishable-api-key": pk, "x-publishable-key": pk } : {}),
        },
        cache: "no-store",
      }
    )
    console.log("[Account] fetched reviews:", {
      count: (data as any)?.count,
      limit: (data as any)?.limit,
      offset: (data as any)?.offset,
      length: Array.isArray((data as any)?.reviews) ? (data as any)?.reviews.length : "n/a",
    })
    return data.reviews ?? []
  } catch {
    console.log("[Account] failed to fetch customer reviews")
    return []
  }
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

  const reviews = await getCustomerReviews()
  console.log("[Account] reviews to render:", Array.isArray(reviews) ? reviews.length : "n/a")

  return (
    <main className={s.root}>
      <div className={s.content} data-testid="reviews-page-wrapper">
        <div className={s.header}>
          <h1 className={s.title}>My Reviews</h1>
          <p className={s.desc}>All the reviews you’ve submitted.</p>
        </div>

        <div className={s.body}>
          <DebugReviewsLogger reviews={reviews} />
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
