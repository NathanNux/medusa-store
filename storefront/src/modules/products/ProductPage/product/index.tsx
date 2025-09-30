
import { HttpTypes } from "@medusajs/types";
import { notFound } from "next/navigation";
import Details from "./details/details";
import Gallery from "./Gallery/gallery";


type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  categories?: HttpTypes.StoreProductCategory[]
  wishlistItems?: any[]
  onWishlistUpdateAction?: () => Promise<void>
  isAuthenticated?: boolean
  initialRating?: number
  initialCount?: number
}

const Product: React.FC<ProductTemplateProps> = ({ product, region, countryCode, categories, wishlistItems, onWishlistUpdateAction, isAuthenticated, initialRating, initialCount }) => {

    // If the product is not found return not found page
    if (!product || !product.id) {
        return notFound()
    }


    return(
        <section className="product">
            <Details product={product} categories={categories} region={region} countryCode={countryCode} wishlistItems={wishlistItems} onWishlistUpdateAction={onWishlistUpdateAction} isAuthenticated={isAuthenticated} initialRating={initialRating} initialCount={initialCount} />
            <Gallery product={product} region={region} countryCode={countryCode} />
        </section>
    )
}

export default Product; 