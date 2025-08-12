import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: "http://localhost:9000",
  // WIP: Use the environment variable for the base URL in production or the actual address
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})
