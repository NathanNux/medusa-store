import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import { Router } from "@modules/express-checkout/Router"


type Params = {
  params: Promise<{ handle: string }>
}

export default async function ExpressCheckoutPage ({
  params
}: Params) {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)
  
  const handle = (await params).handle

  return <Router handle={handle} regions={regions} />
}