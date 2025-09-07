"use client"

import { Divider, Table, clx } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"
import s from "./style.module.scss"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
  isMobile?: boolean
}

const Item = ({ item, type = "full", currencyCode, isMobile }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  return (
    <Table.Row className={s.row} data-testid="product-row">
      <Table.Cell className={s.cellThumb}>
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className={clx(s.thumbLink, type === "preview" ? s.thumbLinkPreview : s.thumbLinkFull)}
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className={s.cellTitle}>
        <p className={s.title} data-testid="product-title">
          {item.product_title}
        </p>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
        <div className="text-sm text-ui-fg-muted">
          {!!item.metadata?.width && <div>Šířka: {item.metadata.width as number}cm</div>}
          {!!item.metadata?.height && <div>Výška: {item.metadata.height as number}cm</div>}
        </div>
      </Table.Cell>

      {isMobile ? (
        <></>
      ):(
        <>
          {type === "full" && (
            <Table.Cell className={s.cellActions}>
              <div className={s.actionsRow}>
                <DeleteButton 
                  id={item.id} 
                  data-testid="product-delete-button" 
                  bundle_id={item.metadata?.bundle_id as string}
                >
                    {item.metadata?.bundle_id !== undefined ? "Odebrat Balíček" : "Odebrat"}
                </DeleteButton>
                <CartItemSelect
                  value={item.quantity}
                  onChange={(value) => changeQuantity(parseInt(value.target.value))}
                  data-testid="product-select-button"
                >
                  {/* TODO: Update this with the v2 way of managing inventory */}
                  {Array.from(
                    {
                      length: Math.min(maxQuantity, 10),
                    },
                    (_, i) => (
                      <option value={i + 1} key={i}>
                        {i + 1}
                      </option>
                    )
                  )}

                  <option value={1} key={1}>
                    1
                  </option>
                </CartItemSelect>
                {updating && <Spinner />}
              </div>
              <ErrorMessage error={error} data-testid="product-error-message" />
            </Table.Cell>
          )}

          {type === "full" && (
            <Table.Cell className={s.cellUnit}>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </Table.Cell>
          )}

          <Table.Cell className={s.cellPrice}>
            <span className={clx(s.priceWrap, { [s.previewPriceWrap]: type === "preview" })}>
              {type === "preview" && (
                <>
                  <span className={s.previewQtyRow}>
                    <span className={s.muted}>
                      <span data-testid="product-quantity">{item.quantity}</span>x
                    </span>
                    <LineItemUnitPrice
                      item={item}
                      style="tight"
                      currencyCode={currencyCode}
                    />
                  </span>
                  <Divider />
                </>
              )}
              <LineItemPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          </Table.Cell>
        </>
      )}
    </Table.Row>
  )
}

export { Item }


const ItemMobile = ({ item, type = "full", currencyCode, isMobile }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  return (
    <Table.Row className={s.row} data-testid="product-row">
      {type === "full" && (
        <Table.Cell className={s.cellActions}>
          <div className={s.actionsRow}>
            <DeleteButton 
              id={item.id} 
              data-testid="product-delete-button" 
              bundle_id={item.metadata?.bundle_id as string}
            >
                {item.metadata?.bundle_id !== undefined ? "Odebrat Balíček" : "Odebrat"}
            </DeleteButton>
            <CartItemSelect
              value={item.quantity}
              onChange={(value) => changeQuantity(parseInt(value.target.value))}
              data-testid="product-select-button"
            >
              {/* TODO: Update this with the v2 way of managing inventory */}
              {Array.from(
                {
                  length: Math.min(maxQuantity, 10),
                },
                (_, i) => (
                  <option value={i + 1} key={i}>
                    {i + 1}
                  </option>
                )
              )}

              <option value={1} key={1}>
                1
              </option>
            </CartItemSelect>
            {updating && <Spinner />}
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className={s.cellUnit}>
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </Table.Cell>
      )}

      <Table.Cell className={s.cellPrice}>
        <span className={clx(s.priceWrap, { [s.previewPriceWrap]: type === "preview" })}>
          {type === "preview" && (
            <span className={s.previewQtyRow}>
              <span className={s.muted}>
                <span data-testid="product-quantity">{item.quantity}</span>x
              </span>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export { ItemMobile }
  