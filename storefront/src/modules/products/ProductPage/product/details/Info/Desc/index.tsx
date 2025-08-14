import { HttpTypes } from "@medusajs/types";

import styles from "./style.module.scss";

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const Desc = ({ product }: ProductInfoProps) => {
    return (
        <div className={styles.desc__Container}>
            <p>{product.description}</p>
        </div>
    )
}

export default Desc;