
import { HttpTypes } from "@medusajs/types";
import { notFound } from "next/navigation";
import Details from "./details/details";
import Gallery from "./Gallery/gallery";


type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  categories?: HttpTypes.StoreProductCategory[]
}

const Product: React.FC<ProductTemplateProps> = ({ product, region, countryCode, categories }) => {

    // If the product is not found return not found page
    if (!product || !product.id) {
        return notFound()
    }


    // WIP: Update the neccessary fields to match the product data structure, and add more like available colors, sizes, etc.
    return(
        <section className="product">
            <Details product={product} categories={categories} region={region} countryCode={countryCode} />
            <Gallery product={product} region={region} countryCode={countryCode} />
        </section>
    )
}

export default Product; 