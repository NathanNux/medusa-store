import Medusa from "@medusajs/js-sdk"

const browserBaseUrl = typeof window !== "undefined" ? window.location.origin : undefined

export const sdk = new Medusa({
  // Use current origin in the browser (admin is served by the backend),
  // fall back to localhost for build/SSR.
  baseUrl: browserBaseUrl || "http://localhost:9000",
  debug: false,
  auth: {
    type: "session",
  },
})
