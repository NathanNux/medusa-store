import { HttpTypes } from "@medusajs/types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type StoreProductWithPrice = HttpTypes.StoreProduct & {
  cheapestPrice?: {
    calculated_price: number | string;
    price_type?: string;
    original_price?: number | string;
    // add other fields if needed
  };
};

const ProductPreview = ({ product, countryCode }: { product: StoreProductWithPrice, countryCode: string }) => {
    const imageUrl = product.images?.[0]?.url || product.thumbnail || "/assets/img/horizontal_prop.png";

  return (
    <motion.div
        key={product.id}
        className="product__list__item"
        layout
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.4 }}
    >
        <Link href={`/products/${product.handle}`} className="product__link">
        <div className="product__image__container">
            <Image
            src={imageUrl}
            alt={product.title}
            width={200}
            height={200}
            className="product__image"
            loading="lazy"
            quality={75}

            />
        </div>
        <div className="product__title__color_container">
            <h3 className="product__name">{product.title}</h3>
            {/* Add color options if present */}
        </div>
        <div className="product__desc__container">
            <p className="product__desc">{product.description}</p>
            {product.created_at && new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                <span className="product__new">Novinka</span>
            )}
        </div>
        <div className="product__price__container">
            <p className="product__price">
                {product.cheapestPrice?.calculated_price !== undefined
                    ? `${String(product.cheapestPrice.calculated_price).replace(/czk/i, "")}${countryCode === "cz" ? " Kč" : ""}`
                    : "—"}
            </p>
            <div className="product__sale__container">
            <button className="add__to__cart__button">
                <Image
                    src="/assets/icons/bookmark.svg"
                    alt="Add to Cart Icon"
                    width={24}
                    height={24}
                    className="add__to__cart__icon"
                />
            </button>
            </div>
        </div>
        </Link>
    </motion.div>
  );
};


export default ProductPreview;