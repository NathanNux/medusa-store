
import InteractiveLink from "@modules/common/components/interactive-link"
import styles from "./style.module.scss"
import { Container } from "@medusajs/ui"
import { useHits, useSearchBox } from "react-instantsearch-hooks-web"

const ShowAll = () => {
  const { hits } = useHits()
  const { query } = useSearchBox()
  const width = typeof window !== "undefined" ? window.innerWidth : 0

  if (query === "") return null
  if (hits.length > 0 && hits.length <= 6) return null

  if (hits.length === 0) {
    return (
      <Container
        className={styles.noResultsContainer}
        data-testid="no-search-results-container"
      >
        <p>Nenalezeny žádné výsledky.</p>
      </Container>
    )
  }

  return (
    <Container className={styles.resultsContainer}>
      <p>Zobrazit první {width > 640 ? 6 : 3} výsledků.</p>
      <InteractiveLink href={`/results/${query}`}>Zobrazit všechny</InteractiveLink>
    </Container>
  )
}

export default ShowAll
