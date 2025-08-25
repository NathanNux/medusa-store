import { ArrowUpRightMini } from "@medusajs/icons"
import styles from "./notfound.module.scss"
import Link from "next/link"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  return (
    <div className={styles.root}>
      <h1 className={styles.heading}>Page not found</h1>
      <p className={styles.message}>
        The page you tried to access does not exist.
      </p>
      <Link className={styles.link} href="/">
        <p className={styles.linkText}>Go to frontpage</p>
        <ArrowUpRightMini className={styles.arrow} color="var(--fg-interactive)" />
      </Link>
    </div>
  );
}
