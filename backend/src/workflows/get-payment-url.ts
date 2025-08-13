import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

const merchant = "497113"
const secret = "VnQ7tNhYZZCQRJeuUb6MDDqfNmnmYzIo"
const auth = Buffer.from(`${merchant}:${secret}`).toString("base64")

const getUrlStep = createStep(
  "get-payment-url",
  async () => {
    try {
      const payload = {
        test: 1,
        price: 1000,
        curr: "CZK",
        label: "Product 123",
        refId: "order445566",
        method: "ALL",
        email: "platce@email.com",
        fullName: "Jan Novák",
        delivery: "HOME_DELIVERY",
        category: "PHYSICAL_GOODS_ONLY",
      }

      const headers = {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      }

      const response = await fetch("https://payments.comgate.cz/v2.0/payment.json", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      })

      const text = await response.text()
      console.log("Comgate API raw response:", text)
      if (!response.ok) {
        throw new Error(`Chyba Comgate API: ${response.status} - ${text}`)
      }

      const data = JSON.parse(text)
      console.log("Comgate API response:", data)
      return new StepResponse(data)
    } catch (error) {
      console.error("Comgate API error:", error)
      throw error
    }
  }
)

const GetPaymentUrlWorkflow = createWorkflow(
  "get-payment-url-workflow",
  () => {
    const result = getUrlStep()
    // Výsledná data jsou v result.value
    console.log("Výsledek kroku getUrlStep:", result.value)
    return new WorkflowResponse({
      url: result.value?.redirect || null,
      data: result.value, // zde budou všechna data z Comgate
    })
  }
)

export default GetPaymentUrlWorkflow