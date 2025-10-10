"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import DeleteButton from "../components/delete-button/DeleteButton"
import s from "./styles/wishlist-template.module.scss"
import Image from "next/image"
import { Divider } from "@medusajs/ui"
import ShareButton from "../components/share-button/ShareButton"
import ClickButton from "../components/edit-button"

function getVariantOptionsSummary(variant: any): string {
  if (!variant) return ""
  const values: string[] = Array.isArray(variant.options)
    ? variant.options.map((o: any) => o?.value).filter(Boolean)
    : []
  if (values.length) return values.join(" / ")
  return variant.title || ""
}

function truncateTitle(title: string): string {
  const words = title.split(' ')
  if (words.length <= 2) return title
  return words.slice(0, 2).join(' ') + '...'
}

type WishlistTemplateProps = {
  items: any[]
  countryCode: string
}

export default function WishlistTemplate({ items, countryCode }: WishlistTemplateProps) {
    return (
        <div className={s.content} data-testid="wishlist-page-wrapper">
            <div className={s.header}>
                <h1 className={s.title}>Seznam přání</h1>
                <Divider />
                <p className={s.desc}>Produkty, které jste si uložili na později.</p>
            </div>

            <div className={s.body}>
                <div
                    className={s.actions}
                    // NOTE: this div is here for future if other features are added to the wishlist page, like sorting or filtering, adding/editing new wishlist, etc.
                    //WIP : add share functionality, add filtering system similar to store page
                >
                    <ShareButton 
                        data-testid="share-button"
                        
                    />
                    {/* <ClickButton 
                        data-testid="edit-button"
                        text="Upravit"
                    />
                    <ClickButton 
                        data-testid="edit-button"
                        text="Vytvořit nový"
                    /> */}
                </div>
                <Divider />
                <div className={s.wishlistContainer}>
                    {items.length === 0 ? (
                        <p>Žádné položky v seznamu přání.</p>
                    ) : (
                        <ul className={s.wishlistList}>
                        {items.map((item: any) => {
                            const variant = item?.product_variant
                            const product = variant?.product
                            const title = product?.title || variant?.title || "Unknown product"
                            const handle = product?.handle
                            const thumb = product?.thumbnail
                            const subtitle = getVariantOptionsSummary(variant)
                            console.log("Rendering wishlist item", item)

                            return (
                            <li key={item.id} className={s.wishlistCard}>
                                <LocalizedClientLink
                                    className={s.wishlistLink}
                                    href={handle ? `/products/${handle}` : `/`}
                                >
                                    <div className={s.wishlistThumb}>
                                        {thumb ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <Image 
                                                src={thumb} 
                                                alt={title}
                                                width={100}
                                                height={100}
                                                style={{ objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        ) : (
                                            <Image 
                                                src={"/assets/img/horizontal_prop.png"} 
                                                alt={"placeholder"}
                                                width={100}
                                                height={100}
                                                style={{ objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        )}
                                    </div>
                                    <div className={s.wishlistInfo}>
                                        <h3 className={s.wishlistTitle}>{truncateTitle(title)}</h3>
                                        <Divider />
                                        {subtitle ? (
                                        <div className={s.wishlistSubtitle}>{subtitle}</div>
                                        ) : null}
                                    </div>

                                    <div className={s.wishlistActions}>
                                        <DeleteButton itemId={item.id} />
                                    </div>
                                </LocalizedClientLink>
                            </li>
                            )
                        })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}
