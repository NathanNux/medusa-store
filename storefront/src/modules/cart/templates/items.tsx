"use client"
import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Table } from "@medusajs/ui"

import { Item, ItemMobile} from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import s from "./items.module.scss"
import { useEffect, useState } from "react"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 550)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const items = cart?.items

  return (
    <div className={s.root}>
      <div className={s.headerRow}>
        <h1 className={s.title}>Košík</h1>
      </div>
      <Table className="p-2 rounded-[25px] overflow-hidden">
       { isMobile ? (
          <Table.Header className={s.tableHeader}>
            <Table.Row className={s.tableHeaderRow}>
              <Table.HeaderCell className={s.colItem}>Produkt</Table.HeaderCell>
              <Table.HeaderCell className={s.colSpacer}></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        ): (
          <Table.Header className={s.tableHeader}>
            <Table.Row className={s.tableHeaderRow}>
              <Table.HeaderCell className={s.colItem}>Produkt</Table.HeaderCell>
              <Table.HeaderCell className={s.colSpacer}></Table.HeaderCell>
              <Table.HeaderCell className={s.colQty}>Množství</Table.HeaderCell>
              <Table.HeaderCell className={s.colPrice}>Cena</Table.HeaderCell>
              <Table.HeaderCell className={s.colTotal}>Celkem</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        )}
        <Table.Body className={s.tableBody}>
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
                      isMobile={isMobile}
                    />
                  )
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </Table.Body>
        { isMobile ? (
          <Table.Header className={s.tableHeader}>
            <Table.Row className={s.tableHeaderRow}>
              <Table.HeaderCell className={s.colQty}>Množství</Table.HeaderCell>
              <Table.HeaderCell className={s.colPrice}>Cena</Table.HeaderCell>
              <Table.HeaderCell className={s.colTotal}>Celkem</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        ): (
          <></>
        )}
        { isMobile && (
          <Table.Body className={s.tableBody}>
            {items
              ? items
                  .sort((a, b) => {
                    return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                  })
                  .map((item) => {
                    return (
                      <ItemMobile
                        key={item.id}
                        item={item}
                        currencyCode={cart?.currency_code}
                        isMobile={isMobile}
                      />
                    )
                  })
              : repeat(5).map((i) => {
                  return <SkeletonLineItem key={i} />
                })}
          </Table.Body>
        )}
      </Table>
    </div>
  )
}

export default ItemsTemplate
