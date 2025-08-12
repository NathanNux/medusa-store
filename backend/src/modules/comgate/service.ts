import { AbstractPaymentProvider } from "@medusajs/framework/utils"
import { CancelPaymentInput, CancelPaymentOutput, DeletePaymentInput, DeletePaymentOutput, GetPaymentStatusInput, GetPaymentStatusOutput, InitiatePaymentInput, InitiatePaymentOutput, ProviderWebhookPayload, RetrievePaymentInput, RetrievePaymentOutput, UpdatePaymentInput, UpdatePaymentOutput, WebhookActionResult } from "@medusajs/types"
import { BigNumber } from "@medusajs/framework/utils"
import axios from "axios"
import crypto from "crypto"
import { Logger } from "@medusajs/framework/types"


type ComgateOptions = {
  merchant: string
  secret: string
  test?: boolean
  country: string  // Změněno na povinné
  curr: string     // Změněno na povinné
}

type InjectedDependencies = {
  logger: Logger
}

class ComgatePaymentProviderService extends AbstractPaymentProvider<ComgateOptions> {
  static identifier = "comgate"
  protected logger_: Logger

  constructor(
    container: InjectedDependencies,
    options: ComgateOptions
  ) {
    super(container, options)
    
    this.logger_ = container.logger
  }

    async authorizePayment(data: any): Promise<any> {
        // Implementujte logiku pro autorizaci platby
        return { success: true, data }
    }

    async capturePayment(data: any): Promise<any> {
        // Implementujte logiku pro zachycení platby
        return { success: true, data }
    }

    async refundPayment(data: any): Promise<any> {
        // Implementujte logiku pro refundaci platby
        return { success: true, data }
    }

    async initiatePayment(
  input: InitiatePaymentInput
): Promise<InitiatePaymentOutput> {
  const { currency_code, context } = input

  // Získání údajů o zákazníkovi, pokud jsou k dispozici
  const email = context?.customer?.email
  const fullName = context?.customer?.first_name + " " + context?.customer?.last_name


    console.log("Comgate initiatePayment input:", input)
    const merchant = "497113"
    const secret = "VnQ7tNhYZZCQRJeuUb6MDDqfNmnmYzIo"
    const auth = Buffer.from(`${merchant}:${secret}`).toString("base64")

    const payload = {
        test: 1,
        price: Number(input?.amount) * 100, // Předpokládáme, že Comgate očekává částku v haléřích
        curr: currency_code.toUpperCase(),
        label: "Keramická zahrada",
        refId: input.data?.session_id,
        method: "ALL",
        email: email,
        fullName: fullName,
        delivery: "HOME_DELIVERY",
        category: "PHYSICAL_GOODS_ONLY",
        enableApplePayGooglePay: true,
      }

    const headers = {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/json",
    }
    console.log("Comgate API request payload:", payload)

    const response = await fetch("https://payments.comgate.cz/v2.0/payment.json", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    })

    const text = await response.text()
    if (!response.ok) {
      throw new Error(`Chyba Comgate API: ${response.status} - ${text}`)
    }

    const data = JSON.parse(text)
    console.log("Comgate response payment provider:", data)
    // Ulož potřebné informace do payment session (např. redirect URL)
    return { // nebo jiný klíč podle odpovědi Comgate
        status: "pending", // nebo jiný stav podle potřeby
        id: data.transId, // Předpokládáme, že Comgate vrací ID platby
        data: {
          redirectUrl: data.redirect, // Předpokládáme, že Comgate vrací URL pro přesměrování
        },
    }
  }


    async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
        // Implementujte logiku pro smazání platby
        return {}
    }

    async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
        // Implementujte logiku pro získání stavu platby
        return { status: "authorized"}
    }

    async getPaymentDetails(paymentId: string): Promise<any> {
        // Implementujte logiku pro získání detailů platby
        return { success: true, paymentId }
    }

    async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
        // Implementujte logiku pro aktualizaci platby
        return { data: input.data}
    }

    async getWebhookActionAndData(data: ProviderWebhookPayload["payload"]): Promise<WebhookActionResult> {
        // Implementujte logiku pro zpracování webhooku
        return { action: "authorized"}
    }

    async createPayment(data: any): Promise<any> {
        // Implementujte logiku pro vytvoření platby
        return { success: true, data }
    }

    async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
        // Implementujte logiku pro získání platby
        return { }
    }


    async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
        return {
            
            }    
    }

  // Zde implementujte potřebné metody pro autorizaci, zachycení, refund atd.
}

export default ComgatePaymentProviderService