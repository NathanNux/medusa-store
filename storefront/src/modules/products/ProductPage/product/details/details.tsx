'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Title from "./Info/Title";
import Desc from "./Info/Desc";
import Colors from "./Options/Colors";
import { HttpTypes } from "@medusajs/types";
import { useIntersection } from "@lib/hooks/use-in-view";
import Sizes from "./Options/Sizes";
import ProductPrice from "./Cta/Price";
import CTA from "./Cta/Add";
import { addToCart } from "@lib/data/cart";
import { isEqual } from "lodash";
import RestockForm from "../../restock";


type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  categories?: HttpTypes.StoreProductCategory[]
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}


const Details: React.FC<ProductTemplateProps> = ({ product, region, countryCode, categories }) => {
    const [options, setOptions] = useState<Record<string, string | undefined>>({})
    const [isAdding, setIsAdding] = useState(false)
  
    // If there is only 1 variant, preselect the options
    useEffect(() => {
      if (product.variants?.length === 1) {
        const variantOptions = optionsAsKeymap(product.variants[0].options)
        setOptions(variantOptions ?? {})
      }
    }, [product.variants])
    useEffect(() => {
        if (product.variants && product.variants.length > 0) {
            const variantOptions = optionsAsKeymap(product.variants[0].options)
            setOptions(variantOptions ?? {})
        }
    }, [product.variants])
  
    const selectedVariant = useMemo(() => {
      if (!product.variants || product.variants.length === 0) {
        return
      }
  
      return product.variants.find((v) => {
        const variantOptions = optionsAsKeymap(v.options)
        return isEqual(variantOptions, options)
      })
    }, [product.variants, options])
  
    // update the options when a variant is selected
    const setOptionValue = (optionId: string, value: string) => {
      setOptions((prev) => ({
        ...prev,
        [optionId]: value,
      }))
    }
  
    //check if the selected options produce a valid variant
    const isValidVariant = useMemo(() => {
      return product.variants?.some((v) => {
        const variantOptions = optionsAsKeymap(v.options)
        return isEqual(variantOptions, options)
      })
    }, [product.variants, options])
  
    // check if the selected variant is in stock
    const inStock = useMemo(() => {
      // If we don't manage inventory, we can always add to cart
      if (selectedVariant && !selectedVariant.manage_inventory) {
        return true
      }
  
      // If we allow back orders on the variant, we can add to cart
      if (selectedVariant?.allow_backorder) {
        return true
      }
  
      // If there is inventory available, we can add to cart
      if (
        selectedVariant?.manage_inventory &&
        (selectedVariant?.inventory_quantity || 0) > 0
      ) {
        return true
      }
  
      // Otherwise, we can't add to cart
      return false
    }, [selectedVariant])  
  
    // add the selected variant to the cart
    const handleAddToCart = async () => {
      if (!selectedVariant?.id) return null
  
      setIsAdding(true)
  
      await addToCart({
        variantId: selectedVariant.id,
        quantity: 1,
        countryCode,
      })
  
      setIsAdding(false)
    }

    // WIP finish here the styling and scss
    return (
        <div className="product__details">
            <div className="product__details__mainDetails">
                <Title product={product} categories={categories} />
                <Desc product={product} />
            </div>

            <div className="product__details__subDetails">
                <Colors
                    product={product}
                    region={region}
                    isAdding={isAdding}
                    options={options}
                    setOptionValue={setOptionValue}
                />
                <Sizes
                    product={product}
                    region={region}
                    isAdding={isAdding}
                    options={options}
                    setOptionValue={setOptionValue}
                />
            </div>
            <div className="product__details__cta">
                <ProductPrice product={product} variant={selectedVariant} />
                <CTA
                    inStock={inStock}
                    selectedVariant={selectedVariant}
                    isAdding={isAdding}
                    isValidVariant={!!isValidVariant}
                    handleAddToCart={handleAddToCart}
                    options={options}
                    product={product}
                />
                <div className="divider"/>
            </div>
            {selectedVariant && !inStock && (
              <RestockForm variant={selectedVariant} product={product} />
            )}
        </div>
    )
}

export default Details;