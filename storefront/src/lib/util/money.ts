import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  if (currency_code && !isEmpty(currency_code)) {
    const code = currency_code.toString().toUpperCase()

    // Special-case for Czech koruna: format as integer with grouping and
    // append ',-' (e.g. 1 234,-)
    if (code === "CZK") {
      const fmt = new Intl.NumberFormat("cs-CZ", {
        style: "decimal",
        minimumFractionDigits: minimumFractionDigits ?? 0,
        maximumFractionDigits: maximumFractionDigits ?? 0,
      }).format(amount)

      return `${fmt},-`
    }

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency_code,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount)
  }

  return amount.toString()
}
