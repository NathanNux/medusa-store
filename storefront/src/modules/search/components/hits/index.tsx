import { clx } from "@medusajs/ui"
import React from "react"
import {
  UseHitsProps,
  useHits,
  useSearchBox,
} from "react-instantsearch-hooks-web"

import { ProductHit } from "../hit"
import ShowAll from "../show-all"
import styles from "./style.module.scss"

type HitsProps<THit> = React.ComponentProps<"div"> &
  UseHitsProps & {
    hitComponent: (props: { hit: THit }) => JSX.Element
  }

const Hits = ({
  hitComponent: Hit,
  className,
  ...props
}: HitsProps<ProductHit>) => {
  const { query } = useSearchBox()
  const { hits } = useHits(props)

  return (
    <div
      className={clx(
        styles.root,
        className,
        {
          [styles.maxHeightFull]: !!query,
          [styles.maxHeightZero]: !query && !hits.length,
        }
      )}
    >
      <div
        className={styles.resultsGrid}
        data-testid="search-results"
      >
        {hits.slice(0, 6).map((hit, index) => (
          <li
            key={index}
            className={clx(styles.listItem, {
              [styles.hiddenOnMobile]: index > 2,
            })}
          >
            <Hit hit={hit as unknown as ProductHit} />
          </li>
        ))}
      </div>
      <ShowAll />
    </div>
  )
}

export default Hits
