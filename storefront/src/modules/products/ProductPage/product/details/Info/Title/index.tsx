import { HttpTypes } from "@medusajs/types";

import styles from "./style.module.scss";

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  categories?: HttpTypes.StoreProductCategory[]
}


const Title = ({ product, categories }: ProductInfoProps) => {
    // WIP: later add to the product data structure a function to click on the category or the collection, go to store and filter by that category or collection

   const category = categories?.map(( cat ) => cat.name || cat.handle).join(", ");
   console.log("Product:", product);
   console.log("Category:", category);
  return (
    <div className={styles.title__Container}>
        <div className={styles.handle}>
            { categories && (
                <p>
                    {category}
                </p>
            )}
        </div>
        <div className={styles.title}>
            <h2>{product.title}</h2>
        </div>
    </div>
  );
};

export default Title;

