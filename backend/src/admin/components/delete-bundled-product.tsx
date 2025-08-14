import { Button, FocusModal, Heading, toast } from "@medusajs/ui"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"

type DeleteBundledProductProps = {
  id: string
}

const DeleteBundledProduct = ({ id }: DeleteBundledProductProps) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { mutateAsync: deleteBundle, isPending } = useMutation({
    mutationFn: async () => {
      await sdk.client.fetch(`/admin/bundled-products/${id}`, {
        method: "DELETE",
      })
    },
  })

  const handleDelete = async () => {
    try {
      await deleteBundle()
      setOpen(false)
      toast.success("Balíček smazán")
      queryClient.invalidateQueries({ queryKey: ["bundled-products"] })
    } catch {
      toast.error("Nepodařilo se smazat balíček")
    }
  }

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Trigger asChild>
        <Button variant="secondary">Smazat</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <Heading level={"h2"}>Potvrdit smazání</Heading>
          </div>
        </FocusModal.Header>
        <FocusModal.Body>
          <div>Opravdu chcete tento balíček smazat? Tuto akci nelze vrátit zpět.</div>
        </FocusModal.Body>
        <FocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Zrušit
            </Button>
            <Button variant="primary" onClick={handleDelete} isLoading={isPending}>
              Smazat
            </Button>
          </div>
        </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  )
}

export default DeleteBundledProduct