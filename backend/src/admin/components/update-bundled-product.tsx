import { Button, FocusModal, Heading, Input, Label, toast } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"

type UpdateBundledProductProps = {
  id: string
  initialTitle?: string
}

const UpdateBundledProduct = ({ id, initialTitle }: UpdateBundledProductProps) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(initialTitle ?? "")
  const queryClient = useQueryClient()

  // optional: fetch latest details when opening (keeps simple: just title)
  const { data } = useQuery<{ bundled_product?: { title?: string } }>({
    queryKey: ["bundled-product", id],
    queryFn: async () =>
      sdk.client.fetch(`/admin/bundled-products/${id}`, {
        method: "GET",
      }),
    enabled: open && !!id,
  })

  useEffect(() => {
    if (open && data?.bundled_product?.title) {
      setTitle(data.bundled_product.title)
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
    try {
      await updateBundle({ title })
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
          <div className="flex flex-col gap-y-4">
            <div>
              <Label>Název balíčku</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            {/* Pozn: pro jednoduchost upravujeme jen název; rozšíření na položky lze doplnit dle potřeby */}
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