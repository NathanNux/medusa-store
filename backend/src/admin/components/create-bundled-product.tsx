import { 
  Button,
  FocusModal,
  Heading,
  Input,
  Label,
  Select,
  toast
} from "@medusajs/ui"
import { useState, useRef, useCallback, useMemo } from "react"
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"
import { HttpTypes } from "@medusajs/framework/types"

const queryClientProvider = new QueryClient()

const CreateBundledProductInner = () => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [items, setItems] = useState<{
    product_id: string | undefined
    quantity: number
  }[]>([
    {
      product_id: undefined,
      quantity: 1,
    }
  ])
  const [products, setProducts] = useState<HttpTypes.AdminProduct[]>([])
  const productsLimit = 15
  const [currnetProductPage, setCurrentProductPage] = useState(0)
  const [productsCount, setProductsCount] = useState(0)
  const hasNextPage = useMemo(() => 
    productsCount ? productsCount > productsLimit : true, 
  [productsCount, productsLimit])
  const queryClient = useQueryClient()
  useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { products, count } = await sdk.admin.product.list({
        limit: productsLimit,
        offset: currnetProductPage * productsLimit,
      })
      setProductsCount(count)
      setProducts((prev) => [...prev, ...products])
      return products
    },
    enabled: hasNextPage,
  })

  const fetchMoreProducts = () => {
    if (!hasNextPage) {
      return
    }
    setCurrentProductPage(currnetProductPage + 1)
  }

  // ...existing code...
  const { mutateAsync: createBundledProduct, isPending: isCreating } = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      console.log(data)
      await sdk.client.fetch("/admin/bundled-products", {
        method: "POST",
        body: data
      })
    }
  })

  const isValid = title.trim().length > 0 && items.every(
    (it) => !!it.product_id && Number.isFinite(it.quantity) && it.quantity > 0
  )

  const handleCreate = async () => {
    const validTitle = title.trim()
    console.log(validTitle)
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
      await createBundledProduct({
        title: validTitle,
        product: {
          title: validTitle,
          options: [
            {
              title: "Default",
              values: ["default"]
            }
          ],
          status: "published",
          variants: [
            {
              title: validTitle,
              // You can set prices in the product's page
              prices: [],
              options: {
                Default: "default"
              },
              manage_inventory: false
            }
          ]
        },
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        }))
      })
      setOpen(false)
      toast.success("Bundled product created successfully")
      queryClient.invalidateQueries({
        queryKey: ["bundled-products"]
      })
      setTitle("")
      setItems([{ product_id: undefined, quantity: 1 }])
    } catch (error) {
      toast.error("Failed to create bundled product")
    }
  }

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Trigger asChild>
        <Button variant="primary">Create</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <Heading level={"h1"}>Create Bundled Product</Heading>
          </div>
        </FocusModal.Header>
        <FocusModal.Body>
          <div className="flex flex-1 flex-col items-center overflow-y-auto">
            <div className="mx-auto flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
              <div>
                <Label>Bundle Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Heading level={"h2"}>Bundle Items</Heading>
                {items.map((item, index) => (
                  <BundledProductItem
                    key={index}
                    item={item}
                    index={index}
                    setItems={setItems}
                    products={products}
                    fetchMoreProducts={fetchMoreProducts}
                    hasNextPage={hasNextPage}
                  />
                ))}
                <Button
                  variant="secondary"
                  onClick={() =>
                    setItems([
                      ...items,
                      { product_id: undefined, quantity: 1 },
                    ])
                  }
                >
                  Add Item
                </Button>
              </div>
            </div>
          </div>
        </FocusModal.Body>
        <FocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreate}
              isLoading={isCreating}
              disabled={!isValid}
            >
              Create Bundle
            </Button>
          </div>
        </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  )
}

const CreateBundledProduct = () => (
  <QueryClientProvider client={queryClientProvider}>
    <CreateBundledProductInner />
  </QueryClientProvider>
)

export default CreateBundledProduct

type BundledProductItemProps = {
  item: { 
    product_id: string | undefined, 
    quantity: number, 
  }
  index: number
  setItems: React.Dispatch<React.SetStateAction<{
    product_id: string | undefined;
    quantity: number;
  }[]>>
  products: HttpTypes.AdminProduct[] | undefined
  fetchMoreProducts: () => void
  hasNextPage: boolean
}

const BundledProductItem = ({ 
  item, 
  index, 
  setItems, 
  products, 
  fetchMoreProducts, 
  hasNextPage
}: BundledProductItemProps) => {
  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        if (!hasNextPage) {
          return
        }
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
      if (!hasNextPage) {
        return
      }
      if (observer.current) {
        observer.current.disconnect()
      }
      if (node) {
        observer.current.observe(node)
      }
    },
    [hasNextPage]
  )

  return (
    <div className="my-2">
      <Heading level={"h3"} className="mb-2">Item {index + 1}</Heading>
        <Select 
          value={item.product_id} 
          onValueChange={(value) => 
            setItems((items) => 
              items.map((item, i) => 
                i === index 
                  ? { 
                      ...item, 
                      product_id: value, 
                    } 
                  : item
              )
            )
          }
        >
          <Select.Trigger>
            <Select.Value placeholder="Select Product" />
          </Select.Trigger>
          <Select.Content>
            {products?.map((product, productIndex) => (
              <Select.Item 
                key={product.id} 
                value={product.id} 
                ref={
                  productIndex === products.length - 1 
                    ? lastOptionRef 
                    : null
                }
              >
                {product.title}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        <div className="flex items-center gap-x-2 [&_div]:flex-1">
          <Label>Quantity</Label>
          <Input
            type="number"
            placeholder="Quantity"
            className="w-full mt-1 rounded-md border border-gray-200 p-2"
            value={item.quantity}
            onChange={(e) => 
              setItems((items) => 
                items.map((item, i) => 
                  i === index 
                    ? { ...item, quantity: parseInt(e.target.value) } 
                    : item
                )
              )
            }
          />
        </div>
    </div>
  )
}