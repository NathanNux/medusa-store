import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"
import { 
  DetailWidgetProps, 
  AdminProduct,
} from "@medusajs/framework/types"

type WishlistResponse = {
  count: number
}

const queryClient = new QueryClient();

const ProductWidget = ({ 
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const { data, isLoading } = useQuery<WishlistResponse>({
    queryFn: () => sdk.client.fetch(`/admin/products/${product.id}/wishlist`),
    queryKey: [["products", product.id, "wishlist"]],
  })

  return (
    <QueryClientProvider client={queryClient}>
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Seznam Přání</Heading>
        </div>
        <Text className="px-6 py-4">
          {isLoading ? 
            "Načítání..." : `Tento produkt je v ${data?.count} seznamech přání.`
          }
        </Text>
      </Container>
    </QueryClientProvider>
  )
}


export const config = defineWidgetConfig({
  zone: "product.details.before",
})

export default ProductWidget