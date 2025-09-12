"use client"

import { clx, Divider } from "@medusajs/ui"
import styles from "./style.module.scss"
import { ArrowRightOnRectangle } from "@medusajs/icons"
import { useParams, usePathname } from "next/navigation"

import ChevronDown from "@modules/common/icons/chevron-down"
import User from "@modules/common/icons/user"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { deleteAccount, signout } from "@lib/data/customer"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useFormStatus } from "react-dom"

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }
  const [ openModal, setOpenModal ] = useState(false)

  const handleLogout = async () => {
    await signout(countryCode)
  }

  return (
    <div className={styles.root}>
      <div className={styles.mobileNav} data-testid="mobile-account-nav">
        {route !== `/${countryCode}/account` ? (
          <LocalizedClientLink
            href="/account"
            className={styles.mainLink}
            data-testid="account-main-link"
          >
            <>
              <ChevronDown className={styles.mainLinkIcon} />
              <span>Account</span>
            </>
          </LocalizedClientLink>
        ) : (
          <>
            <div className={styles.greeting}>
              Hello {customer?.first_name}
            </div>
            <div className={styles.navList}>
              <ul>
                <li>
                  <LocalizedClientLink
                    href="/account/profile"
                    className={styles.navLink}
                    data-testid="profile-link"
                  >
                    <>
                      <div className={styles.navLinkLabel}>
                        <User size={20} />
                        <span>Profile</span>
                      </div>
                      <ChevronDown className={styles.navLinkIcon} />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/addresses"
                    className={styles.navLink}
                    data-testid="addresses-link"
                  >
                    <>
                      <div className={styles.navLinkLabel}>
                        <MapPin size={20} />
                        <span>Addresses</span>
                      </div>
                      <ChevronDown className={styles.navLinkIcon} />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/orders"
                    className={styles.navLink}
                    data-testid="orders-link"
                  >
                    <div className={styles.navLinkLabel}>
                      <Package size={20} />
                      <span>Orders</span>
                    </div>
                    <ChevronDown className={styles.navLinkIcon} />
                  </LocalizedClientLink>
                </li>
                <li>
                  <button
                    type="button"
                    className={styles.logoutBtn}
                    onClick={handleLogout}
                    data-testid="logout-button"
                  >
                    <div className={styles.logoutBtnIcon}>
                      <ArrowRightOnRectangle />
                      <span>Log out</span>
                    </div>
                    <ChevronDown className={styles.navLinkIcon} />
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      <div className={styles.desktopNav} data-testid="account-nav">
        <div className={styles.container}>
          <div className={styles.header}>
            <h3>Account</h3>
            <Divider />
          </div>
          <div className={styles.navList}>
            <ul>
              <li>
                <AccountNavLink
                  href="/account"
                  route={route!}
                  data-testid="overview-link"
                  className={styles.Link}
                  text="Přehled"
                />
              </li>
              <li>
                <AccountNavLink
                  href="/account/profile"
                  route={route!}
                  data-testid="profile-link"
                  className={styles.Link}
                  text="Nastavení"
                />
              </li>
              <li>
                <AccountNavLink
                  href="/account/addresses"
                  route={route!}
                  data-testid="addresses-link"
                  className={styles.Link}
                  text="Adresy"
                />
              </li>
              <li>
                <AccountNavLink
                  href="/account/orders"
                  route={route!}
                  data-testid="orders-link"
                  className={styles.Link}
                  text="Objednávky"
                />
              </li>
              <li>
                <AccountNavLink
                  href="/account/reviews"
                  route={route!}
                  data-testid="reviews-link"
                  className={styles.Link}
                  text="Recenze"
                />
              </li>
              <li>
                <AccountNavLink
                  href="/account/wishlist"
                  route={route!}
                  data-testid="wishlist-link"
                  className={styles.Link}
                  text="Seznam přání"
                />
              </li>
              <li>
                <ClickButton
                    text="Odhlásit se"
                    onClickAction={handleLogout}
                    data-testid="logout-button"
                    className={styles.logoutBtn}
                  />
              </li>
              <li>
                <ClickButton
                  text="Smazat účet"
                  onClickAction={() => setOpenModal(true)}
                  data-testid="delete-account-button"
                  className={styles.deleteAccountBtn}
                />
                <AnimatePresence mode="wait">
                  {openModal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={styles.deleteAccountModal}
                      data-testid="delete-account-modal"
                    >
                      <Modal
                        isOpen={openModal}
                        setIsOpen={setOpenModal}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  text: string
  "data-testid"?: string
  className?: string
}

const Modal = ({
  isOpen,
  setIsOpen
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) => {

  const handleDeleteAccount = async () => {
    await deleteAccount()
  }
  if (!isOpen) return null

  return (
    <div className={styles.deleteAccountModal}>
      <div className={styles.modal}>
        <h2>Smazat účet</h2>
        <p>Opravdu chcete smazat svůj účet? Tuto akci nelze vrátit zpět.</p>
        <div className={styles.modalActions}>
          <ClickButton
            text="Zrušit"
            onClickAction={() => setIsOpen(false)}
            className={styles.cancelBtn}
          />
          <ClickButton
            text="Smazat účet"
            onClickAction={handleDeleteAccount}
            className={styles.deleteBtn}
          />
        </div>
      </div>
    </div>
  )
}

const AccountNavLink = ({
  href,
  route,
  text,
  "data-testid": dataTestId,
  className,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href
  // ensure CSS module active class is added so `.ScrollLink.active` rules match
  return (
    <ScrollLink
      href={href}
      text={text}
      className={clx(className, active && styles.active)}
      data-testid={dataTestId}
    />
  )
}

export default AccountNav


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



function ScrollLink({
  href,
  text,
  className,
  textColor,
  borderColor,
  borderR = false,
  borderL = false,
  "data-testid": dataTestId,
}: {
  href: string;
  text: string;
  className?: string;
  textColor?: string;
  borderColor?: string;
  borderR?: boolean;
  borderL?: boolean;
  "data-testid"?: string;
}) {
  return (
    <LocalizedClientLink href={href} className={clx(styles.ScrollLink, className)} data-testid={dataTestId}
      style={{
      }}
    >
        <button 
          className={styles.button}
            style={{
            textDecoration: "none",
          }}
        >
            <div className={styles.slider}>
                <div className={styles.el}>
                    <PerspectiveText2 label={text} className={className} textColor={textColor}/>
                </div>
                <div className={styles.el}>
                    <PerspectiveText2 label={text} className={className} textColor={textColor}/>
                </div>
            </div>
        </button>
    </LocalizedClientLink>
  );
}

function PerspectiveText2({label, className, textColor}: {label: string; className?: string; textColor?: string}) {
  return (    
      <div className={styles.perspectiveText}>
          <p 
            className={className}
            style={{
              color: textColor || "var(--ChText)",
            }}
          >
            {label}
          </p>
          <p 
            className={className}
            style={{
              color: textColor || "var(--ChText)",
            }}
          >
            {label}
          </p>
      </div>
  )
}