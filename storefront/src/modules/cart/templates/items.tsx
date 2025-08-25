import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Table } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import s from "./items.module.scss"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  return (
    <div className={s.root}>
      <div className={s.headerRow}>
        <h1 className={s.title}>Košík</h1>
      </div>
      <Table>
        <Table.Header className={s.tableHeader}>
          <Table.Row className={s.tableHeaderRow}>
            <Table.HeaderCell className={s.colItem}>Produkt</Table.HeaderCell>
            <Table.HeaderCell className={s.colSpacer}></Table.HeaderCell>
            <Table.HeaderCell className={s.colQty}>Množství</Table.HeaderCell>
            <Table.HeaderCell className={s.colPrice}>Cena</Table.HeaderCell>
            <Table.HeaderCell className={s.colTotal}>Celkem</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items
            ? items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code}
                    />
                  )
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsTemplate
