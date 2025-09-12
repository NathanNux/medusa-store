import { Metadata } from "next"
import s from "../styles/profile.module.scss"

import { notFound } from "next/navigation"
import { listRegions } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"
import ProfileTemplate from "@modules/account/templates/profile-template"

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your Medusa Store profile.",
}

export default async function Profile() {
  const customer = await retrieveCustomer()
  const regions = await listRegions()

  if (!customer || !regions) {
    notFound()
  }

  // WIP: add password change functionality to the profile page

  return (
    <main className={s.root}>
      <ProfileTemplate customer={customer} regions={regions} />
    </main>
  )
}

