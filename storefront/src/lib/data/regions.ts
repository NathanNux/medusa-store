"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { getCacheOptions } from "./cookies"

export const listRegions = async () => {
  const next = {
    ...(await getCacheOptions("regions")),
  }

  return sdk.client
    .fetch<{ regions: any[] }>(`/store/regions`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ regions }: { regions: any[] }) => regions)
    .catch(medusaError)
}

export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
  }

  return sdk.client
    .fetch<{ region: any }>(`/store/regions/${id}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ region }: { region: any }) => region)
    .catch(medusaError)
}

const regionMap = new Map<string, any>()

export const getRegion = async (countryCode: string) => {
  try {
    const code = (countryCode || "").toLowerCase()

    if (code && regionMap.has(code)) {
      return regionMap.get(code)
    }

    const regions = await listRegions()

    if (!regions || !regions.length) {
      return null
    }

    regions.forEach((region: any) => {
      region.countries?.forEach((c: any) => {
        const iso2 = (c?.iso_2 || "").toLowerCase()
        if (iso2) {
          regionMap.set(iso2, region)
        }
      })
    })

    // Try exact match after hydrating the map
    const exact = code ? regionMap.get(code) : undefined
    if (exact) return exact

    // Final fallbacks to avoid hard failure in server actions
    // 1) Prefer US if present, 2) otherwise pick the first region
    const us = regionMap.get("us")
    return us ?? regions[0]
  } catch (e: any) {
    return null
  }
}
