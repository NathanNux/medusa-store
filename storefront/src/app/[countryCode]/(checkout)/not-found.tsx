import InteractiveLink from "@modules/common/components/interactive-link"
import styles from "./styles/notfound.module.scss"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default async function NotFound() {
  return (
    <div className={styles.root}>
      <h1 className={styles.heading}>Stránka nenalezena</h1>
      <p className={styles.message}>
        Stránka, kterou jste se pokusili otevřít, neexistuje.
      </p>
      <InteractiveLink href="/">Zpět na úvodní stránku</InteractiveLink>
    </div>
  );
}
