"use client";
import { HttpTypes } from "@medusajs/types";
import { forwardRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductPreview from "./productPreview/product-preview";

type ProductListProps = {
  products: HttpTypes.StoreProduct[];
  ref?: React.RefObject<HTMLDivElement>;
  countryCode: string;
}

const ProductList = forwardRef<HTMLDivElement, ProductListProps>(({ products, countryCode }, ref) => {


  return (
    <div className="product__list" ref={ref}>
      <div className="product__list__items">
        <AnimatePresence>
          {products.map((product) => {
            return (
              <ProductPreview key={product.id} product={product} countryCode={countryCode} />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
});


export default ProductList;