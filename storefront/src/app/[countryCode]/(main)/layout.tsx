import { Metadata } from "next"


import { getBaseURL } from "@lib/util/env"
import Nav from "@modules/layout/templates/original/nav"
import Footer from "@modules/layout/templates/Footer"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {props.children}
      <Footer />
    </>
  )
}
