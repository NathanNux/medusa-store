import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import styles from "./style.module.scss"

type LineItemOptionsProps = {
  variant: HttpTypes.StoreProductVariant | undefined
  "data-testid"?: string
  "data-value"?: HttpTypes.StoreProductVariant
}

const LineItemOptions = ({
  variant,
  "data-testid": dataTestid,
  "data-value": dataValue,
}: LineItemOptionsProps) => {
  const rawTitle = variant?.title ?? ""
  const titleKey = rawTitle.trim().toLowerCase()
  const displayTitle = titleKey === "default variant" ? "Základ" : rawTitle

  return (
    <Text
      data-testid={dataTestid}
      data-value={dataValue}
      className={styles.root}
    >
      Variace: {displayTitle}
    </Text>
  )
}

export default LineItemOptions
