import { NextRequest, NextResponse } from "next/server"
import { sdk } from "@lib/config"
import { getAuthHeaders } from "@lib/data/cookies"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  try {
    const authHeaders = await getAuthHeaders()

    if (!("authorization" in authHeaders)) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      )
    }

    const incomingPk = req.headers.get("x-publishable-api-key") || req.headers.get("x-publishable-key")
    const publishableKey = incomingPk || process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    if (!publishableKey) {
      return NextResponse.json(
        { success: false, message: "Missing publishable key configuration" },
        { status: 500 }
      )
    }
    const cookieHeader = req.headers.get("cookie") || undefined
    const headers: Record<string, string> = {
      accept: "application/json",
      "content-type": "application/json",
      ...authHeaders,
      "x-publishable-api-key": publishableKey,
      "x-publishable-key": publishableKey,
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    }

    const data = await sdk.client.fetch(`/store/customers/me/wishlists`, {
      method: "GET",
      headers,
      cache: "no-store",
    })
    // data is expected to be { wishlist: {...} }
    return NextResponse.json({ success: true, wishlist: (data as any).wishlist })
  } catch (e: any) {
    const message = e?.message || "Failed to load wishlist"
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { variant_id } = await req.json()

    if (!variant_id || typeof variant_id !== "string") {
      return NextResponse.json(
        { success: false, message: "Missing or invalid variant_id" },
        { status: 400 }
      )
    }

    const authHeaders = await getAuthHeaders()

    if (!("authorization" in authHeaders)) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      )
    }

    // Include publishable API key explicitly for sales channel context
  const incomingPk = req.headers.get("x-publishable-api-key") || req.headers.get("x-publishable-key")
    const publishableKey = incomingPk || process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    if (!publishableKey) {
      return NextResponse.json(
        { success: false, message: "Missing publishable key configuration" },
        { status: 500 }
      )
    }
    const cookieHeader = req.headers.get("cookie") || undefined
    const headers: Record<string, string> = {
      accept: "application/json",
      "content-type": "application/json",
      ...authHeaders,
      ...(publishableKey
        ? { "x-publishable-api-key": publishableKey, "x-publishable-key": publishableKey }
        : {}),
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    }

    // Ensure wishlist exists (GET, else POST create)
    try {
      await sdk.client.fetch(`/store/customers/me/wishlists`, {
        method: "GET",
        headers,
        cache: "no-store",
      })
    } catch (err: any) {
      // Attempt to create if not found or error (handle 404 vs auth separately)
      await sdk.client.fetch(`/store/customers/me/wishlists`, {
        method: "POST",
        headers,
      })
    }

    // Add item to wishlist
    const addResp = await sdk.client.fetch(`/store/customers/me/wishlists/items`, {
      method: "POST",
      headers,
      body: { variant_id },
    })
    // If backend returns structure, surface success
    return NextResponse.json({ success: true, ...(addResp || {}) })
  } catch (e: any) {
    const message = e?.message || "Failed to add to wishlist"
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
