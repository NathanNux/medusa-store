
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import styles from "./style.module.scss"

export type ProductHit = {
  id: string
  title: string
  handle: string
  description: string | null
  thumbnail: string | null
  variants: HttpTypes.StoreProductVariant[]
  collection_handle: string | null
  collection_id: string | null
}

type HitProps = {
  hit: ProductHit
}

const Hit = ({ hit }: HitProps) => {
  return (
    <LocalizedClientLink
      href={`/products/${hit.handle}`}
      data-testid="search-result"
    >
      <div className={styles.container} key={hit.id}>
        <Thumbnail
          thumbnail={hit.thumbnail}
          size="square"
          className={styles.thumbnail}
        />
        <div className={styles.info}>
          <div className={styles.info}>
            <span
              className={styles.title}
              data-testid="search-result-title"
            >
              {hit.title}
            </span>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

export default Hit
