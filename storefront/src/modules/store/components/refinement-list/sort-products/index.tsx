"use client"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"

export type SortOptions =
  | "created_at"
  | "price_asc"
  | "price_desc"
  | "sale"
  | "new"
  | "category"
  | "price_range"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
  { value: "created_at", label: "Latest Arrivals" },
  { value: "price_asc", label: "Price: Low -> High" },
  { value: "price_desc", label: "Price: High -> Low" },
  { value: "sale", label: "Sale" },
  { value: "new", label: "New" },
  { value: "category", label: "Category" },
  { value: "price_range", label: "Price Range" },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  return (
    <FilterRadioGroup
      title="Sort by"
      items={sortOptions}
      value={sortBy}
      handleChange={handleChange}
      data-testid={dataTestId}
    />
  )
}

export default SortProducts