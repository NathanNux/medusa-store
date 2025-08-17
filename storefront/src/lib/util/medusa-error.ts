export default function medusaError(error: any): never {
  if (error?.response) {
    // The request was made and the server responded with a non-2xx status
    try {
      const base = error?.config?.baseURL || undefined
      const url = error?.config?.url || ""
      const u = new URL(url, base)
      console.error("Resource:", u.toString())
    } catch {
      // ignore URL logging failures
    }

    console.error("Response data:", error.response.data)
    console.error("Status code:", error.response.status)
    console.error("Headers:", error.response.headers)

    // Best-effort message extraction
    const data = error.response.data
    let message: string
    if (typeof data === "string") {
      message = data
    } else if (data && typeof data.message === "string") {
      message = data.message
    } else if (data && typeof data.error === "string") {
      message = data.error
    } else {
      try {
        message = JSON.stringify(data)
      } catch {
        message = "An unknown error occurred"
      }
    }

    const c = message?.charAt?.(0)
    const pretty = c ? c.toUpperCase() + message.slice(1) : message
    throw new Error(pretty.endsWith(".") ? pretty : pretty + ".")
  } else if (error?.request) {
    // The request was made but no response was received
    throw new Error("No response received from server.")
  } else {
    // Something happened in setting up the request that triggered an Error
    const msg = error?.message || "Unknown client error"
    throw new Error("Error setting up the request: " + msg)
  }
}
