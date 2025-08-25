import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"
import styles from "../styles/help.module.scss"

const Help = () => {
  return (
    <div className={styles.root}>
      <h2 className={styles.title}>Potřebujete pomoc?</h2>
      <div className={styles.content}>
        <ul className={styles.list}>
          <li>
            <LocalizedClientLink href="/contact" className={styles.link}>
              Kontakt
            </LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/contact" className={styles.link}>
              Reklamace a výměny
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
