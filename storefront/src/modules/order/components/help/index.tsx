import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"
import styles from "../styles/help.module.scss"

const Help = () => {
  // WIP: add here correct contact information
  return (
    <div className={styles.root}>
      <h2 className={styles.title}>Potřebujete pomoc?</h2>
      <div className={styles.content}>
        <ul className={styles.list}>
          <li>
            <div className={styles.contact}>
              <p className={styles.contactHeader}>
                Kontakt:
                <span className={styles.contactInfo}>
                  Tel: +420 775 211 578
                </span> 
                <span className={styles.contactInfo}>
                  Email: info@example.com
                </span></p>
            </div>
          </li>
          <li>
            <LocalizedClientLink href="/odstoupeni-od-smlouvy" className={styles.link}>
              Reklamace a výměny
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
