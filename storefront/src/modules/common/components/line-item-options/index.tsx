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
  return (
    <Text
      data-testid={dataTestid}
      data-value={dataValue}
      className={styles.root}
    >
      Variace: {variant?.title}
    </Text>
  )
}

export default LineItemOptions
