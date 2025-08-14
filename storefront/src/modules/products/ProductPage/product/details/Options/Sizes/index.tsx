'use client';

import { HttpTypes } from "@medusajs/types";

import { useMemo } from "react";
import OptionsSelect from "./Select/select";

type SizesProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
  isAdding?: boolean
  options: Record<string, string | undefined>
  setOptionValue: (optionId: string, value: string) => void
}

export default function Sizes({
    product,
    disabled = false,
    isAdding,
    options = {},
    setOptionValue,
}: SizesProps) {

    const SizeOptions = useMemo(() => {
        if (!product.options) {
            return undefined
        }
        return (
            product.options?.find((o) => o.title.toLowerCase() === "velikost") || 
            product.options?.find((o) => o.title.toLowerCase() === "size") ||
            product.options?.find((o) => o.title.toLowerCase() === "velikosti") || 
            product.options?.find((o) => o.title.toLowerCase() === "sizes")
        )
    }, [product.options]);


    return (
        <div className="product__details__subDetails__colors" >
            { SizeOptions &&(<p>Velikosti |</p>)}
            <div className="product__details__subDetails__colors__items">
                {(product.variants?.length ?? 0) > 1 && SizeOptions && (
                    <div className="product__details__subDetails__colors__items__select">
                        <OptionsSelect 
                            key={SizeOptions.id}
                            option={SizeOptions}
                            current={options[SizeOptions.id]}
                            updateOption={setOptionValue}
                            title={SizeOptions.title ?? ""}
                            data-testid={`product-option-select-${SizeOptions.id}`}
                            disabled={!!disabled || isAdding}
                        />
                    </div>
                )}
            </div> 
        </div>
    )
}

