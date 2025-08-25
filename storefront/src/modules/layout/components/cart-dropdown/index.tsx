"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import styles from "./style.module.scss"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import LinkButton from "@modules/common/components/Buttons/LinkButton"
import Magnetic from "@modules/common/components/Buttons/Magnetic"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Cart from "@modules/common/icons/cart"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"
import { motion } from 'framer-motion';
import { useFormStatus } from 'react-dom';

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  return (
    <div
      className={styles.root}
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className={styles.popover}>
        <PopoverButton className={styles.popoverButton}>
          <LocalizedClientLink
            className={styles.cartLink}
            href="/cart"
            data-testid="nav-cart-link"
          >
            <Magnetic>
              <Cart  size={40}/>
              <p className={styles.cartCount}>
                {totalItems}
              </p>
            </Magnetic>
          </LocalizedClientLink>
        </PopoverButton>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className={styles.popoverPanel}
            data-testid="nav-cart-dropdown"
          >
            <div className={styles.panelHeader}>
              <h3>Košík</h3>
            </div>
            {cartState && cartState.items?.length ? (
              <>
                <div className={styles.items}>
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className={styles.cartItem}
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className={styles.productLink}
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                          />
                        </LocalizedClientLink>
                        <div className={styles.itemDetails}>
                          <div className={styles.itemInfo}>
                            <div className={styles.itemHeader}>
                              <div className={styles.itemTitle}>
                                <h3>
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}`}
                                    data-testid="product-link"
                                  >
                                    {item.title}
                                  </LocalizedClientLink>
                                </h3>
                                <LineItemOptions
                                  variant={item.variant}
                                  data-testid="cart-item-variant"
                                  data-value={item.variant}
                                />
                                <span
                                  data-testid="cart-item-quantity"
                                  data-value={item.quantity}
                                >
                                  Množství: {item.quantity}
                                </span>
                              </div>
                              <div className={styles.itemPrice}>
                                <LineItemPrice
                                  item={item}
                                  style="tight"
                                  currencyCode={cartState.currency_code}
                                />
                              </div>
                            </div>
                          </div>
                          <DeleteButton
                            id={item.id}
                            className={styles.removeBtn}
                            data-testid="cart-item-remove-button"
                          >
                            Odebrat
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>
                <div className={styles.subtotal}>
                  <div className={styles.subtotalRow}>
                    <span className={styles.subtotalLabel}>
                      Celkem{" "}
                      <span className={styles.normal}>(bez DPH)</span>
                    </span>
                    <span
                      className={styles.subtotalValue}
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {(() => {
                        const price = convertToLocale({
                          amount: subtotal,
                          currency_code: cartState.currency_code,
                        });
                        if (cartState.currency_code?.toLowerCase() === "czk") {
                          return price.replace(/czk/i, "") + ",-";
                        }
                        return price;
                      })()}
                    </span>
                  </div>
                  <LocalizedClientLink href="/cart" passHref>
                    <ClickButton
                      text="Přejít do košíku"
                      className={styles.goToCartBtn}
                      type="button"
                      data-testid="go-to-cart-button"
                    />
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div className={styles.empty}>
                <div className={styles.emptyContent}>
                  <div className={styles.emptyIconContainer}>
                    <div className={styles.emptyIcon}>
                      <span>0</span>
                    </div>
                    <span>položek</span>
                  </div>

                  <span className={styles.emptyText}>Váš nákupní košík je prázdný.</span>
                  <div onClick={close}>
                    <LinkButton text="Do obchodu" href="/store"/>
                  </div>
                </div>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown


type ClickButtonProps = {
    text: string;
    onClickAction?: () => void | Promise<void>;
    ClickAction?: () => void | Promise<void>; // backward compatibility
    disabled?: boolean;
    type?: "button" | "submit";
    className?: string;
    "data-testid"?: string;
}

// Base animated button used across the site. Can act as a submit button in forms.
function ClickButton({ onClickAction, ClickAction, disabled = false, text, type = "button", className, "data-testid": dataTestId }: ClickButtonProps) {
    const [ isActive , setIsActive ] = useState<boolean>(false);
    const { pending } = useFormStatus();
    const isSubmitting = type === "submit" ? pending : false;
    const isDisabled = disabled || isSubmitting;
    const handleClick = onClickAction ?? ClickAction;

    return (
        <div className={className ? `${styles.ClickButton} ${className}` : styles.ClickButton}>
            <button 
                type={type}
                className={styles.button}
                onClick={handleClick}
                disabled={isDisabled}
                aria-busy={isDisabled || undefined}
                onMouseEnter={() => setIsActive(true)}
                onMouseLeave={() => setIsActive(false)}
                data-testid={dataTestId}
            >
                <motion.div 
                    className={styles.slider}
                    animate={{top: isActive ? "-100%" : "0%"}}
                    transition={{ duration: 0.5, type: "tween", ease: [0.76, 0, 0.24, 1]}}
                >
                    <div 
                        className={styles.el}
                        style={{ backgroundColor: "var(--OButton)" }}
                    >
                        <PerspectiveText label={text}/>
                    </div>
                    <div 
                        className={styles.el}
                        style={{ backgroundColor: "var(--CharcoalBg)" }}
                    >
                        <PerspectiveText label={text} />
                    </div>
                </motion.div>
            </button>
        </div>
    )
}

function PerspectiveText({label}: {label: string}) {
    return (    
        <div className={styles.perspectiveText}>
            <p>{label}</p>
            <p>{label}</p>
        </div>
    )
}