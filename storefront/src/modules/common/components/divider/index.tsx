import { clx } from "@medusajs/ui"
import styles from "./style.module.scss"

const Divider = ({ className }: { className?: string }) => (
  <div
    className={clx(styles.root, className)}
  />
)

export default Divider
