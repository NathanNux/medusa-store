import { StoreProduct } from "@medusajs/types";
import Details from "./details";
import Product from "./product";
import SoldProducts from "./Sold";
import styles from "./style.module.scss";

export default function ProductPage({ product }: { product: StoreProduct}) {
    return (
        <section>
            <Product product={product}/>
            <div className={styles.product__details}>
                <div className={styles.product__details__sticky}>
                    <Details product={product}/>
                    <SoldProducts />
                </div>
            </div>
        </section>
    )
}