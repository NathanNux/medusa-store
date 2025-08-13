import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"
import { FulfillmentOption, ValidateFulfillmentDataContext } from "@medusajs/framework/types"

class MyFulfillmentProviderService extends AbstractFulfillmentProviderService {
  static identifier = "ceska-posta-fulfillment"

  constructor({}, options) {
    super()
    // Initialize any clients or dependencies here
  }

  async getFulfillmentOptions() : Promise<FulfillmentOption[]> {
    return[
        {id: "classic", name: "Česká Pošta"},
        {id: "fragile", name: "Česká Pošta - Křehké"}]
  }

 async validateFulfillmentData(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: Record<string, unknown>
    ): Promise<any> {
    // Například:
    return data
    }

  // Implement required methods like createFulfillment, cancelFulfillment, etc.
}

export default MyFulfillmentProviderService