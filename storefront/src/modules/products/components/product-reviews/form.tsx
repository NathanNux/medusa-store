"use client"

import { useState } from "react"

import { useEffect } from "react"
import { retrieveCustomer } from "../../../../lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import { Button, Input, Label, Textarea, toast, Toaster } from "@medusajs/ui"
import { Star, StarSolid } from "@medusajs/icons"
import { addProductReview } from "../../../../lib/data/products"

type ProductReviewsFormProps = {
  productId: string
}

export default function ProductReviewsForm({ productId }: ProductReviewsFormProps) {
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [rating, setRating] = useState(0)

  useEffect(() => {
    if (customer) {
      return
    }

    retrieveCustomer().then(setCustomer)
  }, [])

  if (!customer) {
    return (
      <div className="product-page-constraint mt-8">
        <div className="flex justify-center">
          <span className="text-ui-fg-subtle">
            Pro přidání recenze se prosím <a href="/account/login" className="underline">přihlaste</a> nebo <a href="/account/register" className="underline">vytvořte účet</a>.
          </span>
        </div>
        <Toaster />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!content || !rating) {
      toast.error("Chyba", {
        description: "Prosím vyplňte povinná pole.",
      })
      return
    }

    e.preventDefault()
    setIsLoading(true)
    addProductReview({
      title,
      content,
      rating,
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      product_id: productId,
    }).then(() => {
      setShowForm(false)
      setTitle("")
      setContent("")
      setRating(0)
      toast.success("Úspěch", {
        description: "Vaše recenze byla odeslána",
      })
    }).catch(() => {
      toast.error("Chyba", {
        description: "Při odesílání vaší recenze došlo k chybě. Zkuste to prosím znovu později.",
      })
    }).finally(() => {
      setIsLoading(false)
    })
  }

  return (
    <div className="product-page-constraint mt-8">
        {!showForm && (
        <div className="flex justify-center">
            <Button variant="secondary" onClick={() => setShowForm(true)}>Přidat recenzi</Button>
        </div>
        )}
        {showForm && (
        <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
            <span className="text-xl-regular text-ui-fg-base">
            Přidat recenzi
            </span>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
                <Label>Název</Label>
                <Input name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Název" />
            </div>
            <div className="flex flex-col gap-y-2">
                <Label>Obsah</Label>
                <Textarea name="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
            </div>
            <div className="flex flex-col gap-y-2">
                <Label>Hodnocení</Label>
                <div className="flex gap-x-1">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Button key={index} variant="transparent" onClick={(e) => {
                    e.preventDefault()
                    setRating(index + 1)
                    }} className="p-0">
                    {rating >= index + 1 ? <StarSolid className="text-ui-tag-orange-icon" /> : <Star />}
                    </Button>
                ))}
                </div>
            </div>
            <Button type="submit" disabled={isLoading} variant="primary">Odeslat</Button>
            </form>
            </div>
        </div>
        )}
        <Toaster />
    </div>
    )
}