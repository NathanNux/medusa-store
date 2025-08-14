import { Metadata } from "next"

// import Hero from "@modules/home/components/original/hero"
// import FeaturedProducts from "@modules/home/components/original/featured-products"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import ScrollToTopOnReload from "@lib/helpers/scrollToTopOnReload"
import ECom from "@modules/home/components/E-com"
import Kurzy from "@modules/home/components/Kurzy"
import Info from "@modules/home/components/Info"
import IntroHero from "@modules/home/components/Hero/IntroHero"
import AboutHero from "@modules/home/components/Hero/AboutHero"


export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  // this is the main page of the storefront
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <ScrollToTopOnReload />
      {/* <IntroHero />
      <AboutHero /> */}
      <ECom />
      <Kurzy />
      <Info />
      {/* <Hero />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div> */}
    </>
  )
}
