import { Container, Heading, Button, toast } from "@medusajs/ui"
import { useMutation } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import Angolia from "../../../icons/angolia-icon"

const AlgoliaPage = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: () => 
      sdk.client.fetch("/admin/algolia/sync", {
        method: "POST"
      }),
    onSuccess: () => {
      toast.success("Successfully triggered data sync to Algolia") 
    },
    onError: (err) => {
      console.error(err)
      toast.error("Failed to sync data to Algolia") 
    }
  })

  const handleSync = () => {
    mutate()
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Algolia Synchronizace</Heading>
      </div>
      <div className="px-6 py-8 gap-4 w-full flex flex-row items-center justify-between">
        <Button 
          variant="primary"
          onClick={handleSync}
          isLoading={isPending}
        >
          Synchronizovat data s Algolia
        </Button>
        <a href="https://dashboard.algolia.com/apps/1B0DZIKJ1O/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            // WIP: update latter with the actual URL of the Algolia dashboard
          >
            <Button variant="secondary" size="small">
              Otevřít Dashboard
            </Button>
          </a>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Algolia Search Engine",
  icon: Angolia,
})

export default AlgoliaPage
