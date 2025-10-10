import { Metadata } from "next"
import s from "../styles/profile.module.scss"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { cookies } from "next/headers"
import { sdk } from "@lib/config"
import Link from "next/link"
import BgImage from "@modules/account/components/BgImage"
import ReviewsTemplate from "@modules/account/templates/reviews-template"
import { listRegions } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "My Reviews",
  description: "See the reviews you’ve written",
}

async function getCustomerReviews() {
  // const cookieStore = await cookies()
  // const token = cookieStore.get("_medusa_jwt")?.value
  // const pk = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  // if (!token) return []

  // try {
  //   const data = await sdk.client.fetch<{ reviews: any[]; count?: number; limit?: number; offset?: number }>(
  //     `/store/customers/me/reviews`,
  //     {
  //       method: "GET",
  //       headers: {
  //         authorization: `Bearer ${token}`,
  //         ...(pk ? { "x-publishable-api-key": pk, "x-publishable-key": pk } : {}),
  //       },
  //       cache: "no-store",
  //     }
  //   )
  //   console.log("[Account] fetched reviews:", {
  //     count: (data as any)?.count,
  //     limit: (data as any)?.limit,
  //     offset: (data as any)?.offset,
  //     length: Array.isArray((data as any)?.reviews) ? (data as any)?.reviews.length : "n/a",
  //   })
  // return Array.isArray(data.reviews) ? data.reviews.filter((r) => !!r) : []
  // } catch {
  //   console.log("[Account] failed to fetch customer reviews")
  //   return []
  // }

  // TODO: WIP - Implement fetching product details from review relationships
  // Reviews should include product information, or we can fetch products separately
  // using the product_id from each review

  
  // Mock reviews for UI testing
  const mockReviews = [
    {
      id: "review_1",
      title: "Skvělá kvalita",
      content: "Toto tričko je opravdu pohodlné a kvalita materiálu je výborná. Doporučuji všem!",
      rating: 5,
      product: {
        id: "prod_01K2JKVDCGDD9FD6YCRNSCN9CT",
        title: "Medusa T-Shirt",
        handle: "t-shirt",
        thumbnail: "/assets/tee-black-front.webp",
        description: "Reimagine the feeling of a classic T-shirt. With our premium cotton blend...",
        variants: [
          {
            id: "variant_01K2JKVDFXEEBTD7W4BH4KGSNC",
            title: "Large / Black",
            prices: [{ amount: 2500, currency_code: "CZK" }]
          }
        ]
      }
    },
    {
      id: "review_2",
      title: "Dobré, ale mohlo být lepší",
      content: "Tričko je pěkné, ale velikost trochu nesedí. Jinak spokojenost.",
      rating: 4,
      product: {
        id: "prod_01K2JKVDCGDD9FD6YCRNSCN9CT",
        title: "Medusa T-Shirt",
        handle: "t-shirt",
        thumbnail: "/assets/img/img/1.jpg",
        description: "Reimagine the feeling of a classic T-shirt. With our premium cotton blend...",
        variants: [
          {
            id: "variant_01K2JKVDFXEEBTD7W4BH4KGSNC",
            title: "Large / Black",
            prices: [{ amount: 2500, currency_code: "CZK" }]
          }
        ]
      }
    },
    {
      id: "review_3",
      title: "Perfektní nákup",
      content: "Rychlé doručení a produkt přesně odpovídá popisu. Budu kupovat znovu.",
      rating: 5,
      product: {
        id: "prod_01K2JKVDCGDD9FD6YCRNSCN9CU",
        title: "Medusa Hoodie",
        handle: "hoodie",
        thumbnail: "/assets/img/img/2.jpg",
        description: "Stay warm and stylish with our premium hoodie featuring the Medusa logo.",
        variants: [
          {
            id: "variant_01K2JKVDFXEEBTD7W4BH4KGSND",
            title: "Medium / Gray",
            prices: [{ amount: 4500, currency_code: "CZK" }]
          }
        ]
      }
    },
    {
      id: "review_4",
      title: "Průměrné",
      content: "Nic extra, ale za tu cenu je to v pořádku. Očekával jsem více.",
      rating: 3,
      product: {
        id: "prod_01K2JKVDCGDD9FD6YCRNSCN9CU",
        title: "Medusa Hoodie",
        handle: "hoodie",
        thumbnail: "/assets/img/img/3.jpg",
        description: "Stay warm and stylish with our premium hoodie featuring the Medusa logo.",
        variants: [
          {
            id: "variant_01K2JKVDFXEEBTD7W4BH4KGSND",
            title: "Medium / Gray",
            prices: [{ amount: 4500, currency_code: "CZK" }]
          }
        ]
      }
    },
    {
      id: "review_5",
      title: "Výborná hodnota",
      content: "Kvalita za peníze je skvělá. Barva je živá a materiál příjemný na dotek.",
      rating: 4,
      product: {
        id: "prod_01K2JKVDCGDD9FD6YCRNSCN9CV",
        title: "Medusa Mug",
        handle: "mug",
        thumbnail: "/assets/img/img/4.jpg",
        description: "Start your day with our ceramic mug featuring the iconic Medusa design.",
        variants: [
          {
            id: "variant_01K2JKVDFXEEBTD7W4BH4KGSNE",
            title: "11oz / White",
            prices: [{ amount: 350, currency_code: "CZK" }]
          }
        ]
      }
    },
    {
      id: "review_6",
      title: "Nespokojen",
      content: "Tričko se rychle opotřebovalo. Možná chyba v materiálu.",
      rating: 2,
      product: {
        id: "prod_01K2JKVDCGDD9FD6YCRNSCN9CT",
        title: "Medusa T-Shirt",
        handle: "t-shirt",
        thumbnail: "/assets/img/img/5.jpg",
        description: "Reimagine the feeling of a classic T-shirt. With our premium cotton blend...",
        variants: [
          {
            id: "variant_01K2JKVDFXEEBTD7W4BH4KGSNC",
            title: "Large / Black",
            prices: [{ amount: 2500, currency_code: "CZK" }]
          }
        ]
      }
    }
  ]

  console.log("[Account] using mock reviews:", mockReviews.length)
  return mockReviews
}

type PageProps = { params: Promise<{ countryCode: string }> }

export default async function ReviewsPage(props: PageProps) {
  const { countryCode } = await props.params
  const customer = await retrieveCustomer()
  const regions = await listRegions()
  
  if (!customer || !regions) {
    notFound()
  }
  if (!customer) {
    return(
      <div>
        <p>Pro přístup k recenzím se prosím přihlaste</p>
        <LocalizedClientLink href={`/account`}>Přihlásit se</LocalizedClientLink>
      </div>
    )
  }

  const reviews = await getCustomerReviews()
  // console.log("[Account] reviews to render:", Array.isArray(reviews) ? reviews.length : "n/a")

  const { response: { products, count } } = await listProducts({
    queryParams: {
      limit: 16,
      fields: "*bundle", 
    },
    countryCode,
  })

  console.log('products', products, count)

  const getProductByReview = (review: any) => {
    if (!review || !Array.isArray(products) || products.length === 0) return null
    const prodId = review?.product?.id || review?.product_id
    if (!prodId) return null
    return products.find(p => p.id === prodId) || null
  }

  // Enrich reviews with real product data
  const enrichedReviews = reviews.map(review => ({
    ...review,
    product: getProductByReview(review) || review.product // fallback to mock data if not found
  }))
  return (
    <main className={s.root}>
      <ReviewsTemplate reviews={enrichedReviews}/>
      <BgImage src="/assets/img/img/2.jpg" />
    </main>
  )
}
