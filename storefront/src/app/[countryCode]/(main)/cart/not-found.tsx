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
      <h1 className={styles.heading}>Page not found</h1>
      <p className={styles.message}>
        The page you tried to access does not exist.
      </p>
      <InteractiveLink href="/">Go to frontpage</InteractiveLink>
    </div>
  );
}
