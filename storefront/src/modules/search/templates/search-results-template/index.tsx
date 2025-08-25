import { Heading, Text } from "@medusajs/ui"
import Link from "next/link"
import styles from "./style.module.scss"

import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type SearchResultsTemplateProps = {
  query: string
  ids: string[]
  sortBy?: SortOptions
  page?: string
  countryCode: string
}

const SearchResultsTemplate = ({
  query,
  ids,
  sortBy,
  page,
  countryCode,
}: SearchResultsTemplateProps) => {
  const pageNumber = page ? parseInt(page) : 1

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <Text className={styles.searchLabel}>Hledání výsledků pro:</Text>
          <Heading className={styles.heading}>
            {decodeURI(query)} ({ids.length})
          </Heading>
        </div>
        <LocalizedClientLink
          href="/store"
          className={styles.clearLink}
        >
          Zrušit
        </LocalizedClientLink>
      </div>
      <div className={styles.main}>
        {ids.length > 0 ? (
          <>
            <RefinementList sortBy={sortBy || "created_at"} search />
            <div className={styles.contentContainer}>
              <PaginatedProducts
                productsIds={ids}
                sortBy={sortBy}
                page={pageNumber}
                countryCode={countryCode}
              />
            </div>
          </>
        ) : (
          <Text className={styles.noResults}>Nenalezeny žádné výsledky.</Text>
        )}
      </div>
    </div>
  )
}

export default SearchResultsTemplate
