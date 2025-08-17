import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"
import { FulfillmentOption, CreateFulfillmentResult, FulfillmentDTO, FulfillmentItemDTO, FulfillmentOrderDTO } from "@medusajs/framework/types"
import { randomUUID } from "crypto"
import { Builder, Parser } from "xml2js"



const API_KEY="1c80656ab4964dc5"

class PacketaProviderService extends AbstractFulfillmentProviderService {
  static identifier = "packeta"
  constructor(options:any) {
    super()
    // Inicializace klienta pro Packeta API, pokud potřebujete
  }

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    // Zde můžete vracet výdejní místa, typy dopravy apod.
    return [
      { id: "packeta_pickup", name: "Zásilkovna - výdejní místo" }
    ]
  }

  async validateFulfillmentData(optionData, data, context) {
    console.log("Validating fulfillment data with optionData:", optionData, "data:", data, "context:", context);
    return data
  }

async createFulfillment(
    data: Record<string, unknown>,
    items: Partial<Omit<FulfillmentItemDTO, "fulfillment">>[],
    order: Partial<FulfillmentOrderDTO>,
    fulfillment: Partial<Omit<FulfillmentDTO, "provider_id" | "data" | "items">>,
  ): Promise<CreateFulfillmentResult> {

    // Use pickup_point_id or fallback
    const addressId = order?.shipping_address?.metadata?.packeta_pickup_point
    const email = order?.shipping_address?.metadata?.email
  
const requestBody = {
  createPacket: {
    apiPassword: "1c80656ab4964dc5f40d14a3d2412391",
    packetAttributes: {
      number: order?.id,
      name: order?.shipping_address?.first_name,
      surname: order?.shipping_address?.last_name,
      company: "Keramická zahrada",
      sendLabelToEmail: true,
      email: email,
      phone: order?.shipping_address?.phone,
      addressId: Number(addressId) || 0, // ID výdejního místa
      cod: Math.round(Number(order?.total) || 0),
      value: order?.total, // Packeta API expects value in cents
      weight: 2.5,
      currency: order?.currency_code?.toLocaleUpperCase() || "CZK",
      eshop: "keramickazahrada.cz", // only if you have multiple senders (under Indication / Označení)

    }
  }
}

    console.log("Sending request to Packeta API with body:", requestBody);


  try {


    const response = await fetch(
        "https://www.zasilkovna.cz/api/rest",
        {
            method: "POST",
            body: new Builder().buildObject(requestBody)
        }
    );

    const responseBody = await new Parser({ explicitArray: false }).parseStringPromise(await response.text());

    // Always log the full response first!
    console.log("Full Packeta API response:", JSON.stringify(responseBody, null, 2));  
    }
    catch (exception) {
        console.error("Packeta API exception:", exception);
    }





    // Výsledek fulfillmentu
    return {
      data: {
        ...data,
        packeta_response: "Response from Packeta API",
      },
      labels: []
    }
  }

  async cancelFulfillment(data) {
    // Zde voláte Packeta API pro zrušení zásilky
  }
}

export default PacketaProviderService