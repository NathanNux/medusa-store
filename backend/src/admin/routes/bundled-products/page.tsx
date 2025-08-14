import { defineRouteConfig } from "@medusajs/admin-sdk"
import { CubeSolid } from "@medusajs/icons"
import { 
  Container,
  Heading,
  DataTable,
  useDataTable,
  createDataTableColumnHelper,
  DataTablePaginationState,
} from "@medusajs/ui"
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query"
// Použijeme obyčejný <a> místo Link, abychom nevyžadovali Router kontext
import { useMemo, useState } from "react"
import { sdk } from "../../lib/sdk"
import CreateBundledProduct from "../../components/create-bundled-product"
import UpdateBundledProduct from "../../components/update-bundled-product"
import DeleteBundledProduct from "../../components/delete-bundled-product"

type BundledProduct = {
  id: string
  title?: string | null
  product?: {
    id?: string | null
  } | null
  items?: Array<{
    id?: string | null
    product?: {
      id?: string | null
      title?: string | null
    } | null
    quantity?: number | null
  }> | null
  created_at?: Date
  updated_at?: Date
}

const columnHelper = createDataTableColumnHelper<BundledProduct>()

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
  }),
  columnHelper.accessor("title", {
    header: "Title",
  }),
  columnHelper.accessor("items", {
    header: "Items",
    cell: ({ row }) => {
      const items = Array.isArray(row.original.items)
        ? row.original.items.filter(Boolean)
        : []

      if (!items.length) {
        return <span>—</span>
      }

      return items.map((item, idx) => {
        const pid = item?.product?.id ?? undefined
        const ptitle = item?.product?.title ?? "(bez názvu)"
        const qty = typeof item?.quantity === "number" ? item?.quantity : "?"

        return (
          <div key={item?.id ?? idx}>
            {pid ? (
              <a href={`/products/${pid}`}>{ptitle}</a>
            ) : (
              <span>{ptitle}</span>
            )}{" "}
            x {qty}
          </div>
        )
      })
    },
  }),
  columnHelper.accessor("product", {
    header: "Product",
    cell: ({ row }) => {
      const pid = row.original.product?.id ?? undefined
      if (!pid) {
        return <span>—</span>
      }
      return <a href={`/products/${pid}`}>View Product</a>
    },
  }),
  // new actions column
  columnHelper.display({
    id: "actions",
    header: "Akce",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <UpdateBundledProduct id={row.original.id} initialTitle={row.original.title ?? undefined} />
          <DeleteBundledProduct id={row.original.id} />
        </div>
      )
    },
  }),
]

const limit = 15

const queryClient = new QueryClient()

const BundledProductsPageInner = () => {
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  })

  const offset = useMemo(() => {
    return pagination.pageIndex * limit
  }, [pagination])

  const { data, isLoading } = useQuery<{
    bundled_products: BundledProduct[]
    count: number
  }>({
    queryKey: ["bundled-products", offset, limit],
    queryFn: () => sdk.client.fetch("/admin/bundled-products", {
      method: "GET",
      query: {
        limit,
        offset,
      },
    }),
  })

  const safeData = useMemo(() => {
    const arr = Array.isArray(data?.bundled_products)
      ? data!.bundled_products
      : []
    return arr.filter((bp): bp is BundledProduct => !!bp && typeof (bp as any).id === "string")
  }, [data])

  const table = useDataTable({
    columns,
    data: safeData,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
    rowCount: data?.count ?? 0,
  })

  return (
    <Container className="divide-y p-0">
      <DataTable instance={table}>
        <DataTable.Toolbar className="flex items-start justify-between gap-2 md:flex-row md:items-center">
          <Heading>Balíčky Produktů</Heading>
          <CreateBundledProduct />
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>
    </Container>
  )
}

const BundledProductsPage = () => (
  <QueryClientProvider client={queryClient}>
    <BundledProductsPageInner />
  </QueryClientProvider>
)

export const config = defineRouteConfig({
  label: "Balíčky Produktů",
  icon: CubeSolid,
})

export default BundledProductsPage
