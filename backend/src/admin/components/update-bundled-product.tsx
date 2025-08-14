import { Button, FocusModal, Heading, Input, Label, Select, toast } from "@medusajs/ui"
import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"
import { HttpTypes } from "@medusajs/framework/types"

type UpdateBundledProductProps = {
  id: string
  initialTitle?: string
}

const UpdateBundledProduct = ({ id, initialTitle }: UpdateBundledProductProps) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(initialTitle ?? "")
  const [items, setItems] = useState<{
    product_id: string | undefined
    quantity: number
  }[]>([])
  // Produkty pro výběr v selectu
  const [products, setProducts] = useState<HttpTypes.AdminProduct[]>([])
  const productsLimit = 15
  const [currentProductPage, setCurrentProductPage] = useState(0)
  const [productsCount, setProductsCount] = useState(0)
  const hasNextPage = useMemo(() => products.length < productsCount, [products.length, productsCount])
  const queryClient = useQueryClient()

  // optional: fetch latest details when opening (keeps simple: just title)
  const { data } = useQuery<{ bundled_product?: { title?: string, items?: Array<{ quantity?: number | null, product?: { id?: string | null } | null }> } }>({
    queryKey: ["bundled-product", id],
    queryFn: async () =>
      sdk.client.fetch(`/admin/bundled-products/${id}`, {
        method: "GET",
      }),
    enabled: open && !!id,
  })

  // Načítání produktů pro select (stejně jako v create)
  useQuery({
    queryKey: ["products", currentProductPage],
    queryFn: async () => {
      const { products: fetched, count } = await sdk.admin.product.list({
        limit: productsLimit,
        offset: currentProductPage * productsLimit,
      })
      setProductsCount(count)
      setProducts((prev) => [...prev, ...fetched])
      return fetched
    },
    enabled: true,
  })

  useEffect(() => {
    if (!open) return
    if (data?.bundled_product?.title) {
      setTitle(data.bundled_product.title)
    }
    if (Array.isArray(data?.bundled_product?.items)) {
      setItems(
        (data!.bundled_product!.items || []).map((it) => ({
          product_id: it?.product?.id || undefined,
          quantity: typeof it?.quantity === "number" && it.quantity > 0 ? it.quantity : 1,
        }))
      )
    } else {
      setItems([])
    }
  }, [open, data])

  const { mutateAsync: updateBundle, isPending } = useMutation({
    mutationFn: async (payload: Record<string, any>) => {
      await sdk.client.fetch(`/admin/bundled-products/${id}`, {
        method: "PATCH",
        body: payload,
      })
    },
  })

  const handleUpdate = async () => {
    const validTitle = title.trim()
    const validItems = items.every((it) => !!it.product_id && Number.isFinite(it.quantity) && it.quantity > 0)
    if (!validTitle) {
      toast.error("Bundle title is required")
      return
    }
    if (!validItems) {
      toast.error("Please select a product and set quantity > 0 for each item")
      return
    }

    try {
      await updateBundle({
        title: validTitle,
        items: items.map((it) => ({ product_id: it.product_id, quantity: it.quantity })),
      })
      setOpen(false)
      toast.success("Balíček aktualizován")
      queryClient.invalidateQueries({ queryKey: ["bundled-products"] })
      queryClient.invalidateQueries({ queryKey: ["bundled-product", id] })
    } catch {
      toast.error("Nepodařilo se aktualizovat balíček")
    }
  }

  useEffect(() => {
    if (open) {
      setTitle(initialTitle ?? "")
    }
  }, [open, initialTitle])

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Trigger asChild>
        <Button variant="secondary">Upravit</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <Heading level={"h2"}>Upravit balíček</Heading>
          </div>
        </FocusModal.Header>
        <FocusModal.Body>
          <div className="flex flex-1 flex-col items-center overflow-y-auto">
            <div className="mx-auto flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-4">
              <div>
                <Label>Název balíčku</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <Heading level={"h3"}>Položky balíčku</Heading>
                {items.map((item, index) => (
                  <BundledProductItem
                    key={index}
                    item={item}
                    index={index}
                    setItems={setItems}
                    products={products}
                    fetchMoreProducts={() => setCurrentProductPage((p) => p + 1)}
                    hasNextPage={hasNextPage}
                    onRemove={() => setItems((arr) => arr.filter((_, i) => i !== index))}
                  />
                ))}
                <Button
                  variant="secondary"
                  onClick={() => setItems((arr) => [...arr, { product_id: undefined, quantity: 1 }])}
                >
                  Přidat položku
                </Button>
              </div>
            </div>
          </div>
        </FocusModal.Body>
        <FocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Zrušit
            </Button>
            <Button variant="primary" onClick={handleUpdate} isLoading={isPending}>
              Uložit
            </Button>
          </div>
        </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  )
}

export default UpdateBundledProduct

type BundledProductItemProps = {
  item: {
    product_id: string | undefined
    quantity: number
  }
  index: number
  setItems: React.Dispatch<
    React.SetStateAction<
      {
        product_id: string | undefined
        quantity: number
      }[]
    >
  >
  products: HttpTypes.AdminProduct[] | undefined
  fetchMoreProducts: () => void
  hasNextPage: boolean
  onRemove: () => void
}

const BundledProductItem = ({
  item,
  index,
  setItems,
  products,
  fetchMoreProducts,
  hasNextPage,
  onRemove,
}: BundledProductItemProps) => {
  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        if (!hasNextPage) return
        const first = entries[0]
        if (first.isIntersecting) {
          fetchMoreProducts()
        }
      },
      { threshold: 1 }
    )
  )

  const lastOptionRef = useCallback(
    (node: HTMLDivElement) => {
      if (!hasNextPage) return
      if (observer.current) observer.current.disconnect()
      if (node) observer.current.observe(node)
    },
    [hasNextPage]
  )

  return (
    <div className="my-2">
  <Heading level={"h3"} className="mb-2">
        Položka {index + 1}
      </Heading>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Label>Produkt</Label>
          <Select
            value={item.product_id}
            onValueChange={(value) =>
              setItems((items) =>
                items.map((it, i) => (i === index ? { ...it, product_id: value } : it))
              )
            }
          >
            <Select.Trigger>
              <Select.Value placeholder="Vyber produkt" />
            </Select.Trigger>
            <Select.Content>
              {products?.map((product, productIndex) => (
                <Select.Item
                  key={product.id}
                  value={product.id}
                  ref={productIndex === products.length - 1 ? lastOptionRef : null}
                >
                  {product.title}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
        <div className="flex-1">
          <Label>Množství</Label>
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) =>
              setItems((items) =>
                items.map((it, i) =>
                  i === index ? { ...it, quantity: Math.max(1, parseInt(e.target.value || "1", 10)) } : it
                )
              )
            }
          />
        </div>
        <div>
          <Button variant="secondary" onClick={onRemove}>
            Odebrat
          </Button>
        </div>
      </div>
    </div>
  )
}