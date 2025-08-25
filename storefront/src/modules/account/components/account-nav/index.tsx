"use client"

import { Button, clx } from "@medusajs/ui"
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
          </div>
          <div className={styles.navList}>
            <ul>
              <li>
                <AccountNavLink
                  href="/account"
                  route={route!}
                  data-testid="overview-link"
                  className={styles.overviewLink}
                >
                  Přehled
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/profile"
                  route={route!}
                  data-testid="profile-link"
                  className={styles.profileLink}
                >
                  Profil
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/addresses"
                  route={route!}
                  data-testid="addresses-link"
                  className={styles.addressesLink}
                >
                  Adresy
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/orders"
                  route={route!}
                  data-testid="orders-link"
                  className={styles.ordersLink}
                >
                  Objednávky
                </AccountNavLink>
              </li>
              <li>
                <Button
                  type="button"
                  onClick={handleLogout}
                  variant="primary"
                  data-testid="logout-button"
                  className={styles.logoutBtn}
                >
                  Odhlásit se
                </Button>
              </li>
              <li>
                <Button
                  type="button"
                  onClick={() => setOpenModal(true)}
                  variant="danger"
                  data-testid="delete-account-button"
                  className={styles.deleteAccountBtn}
                >
                  Smazat účet
                </Button>
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
  children: React.ReactNode
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
          <Button
            onClick={handleDeleteAccount}
            variant="danger"
            className={styles.deleteBtn}
          >
            Smazat účet
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            variant="secondary"
            className={styles.cancelBtn}
          >
            Zrušit
          </Button>
        </div>
      </div>
    </div>
  )
}

const AccountNavLink = ({
  href,
  route,
  children,
  "data-testid": dataTestId,
  className,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href
  return (
    <LocalizedClientLink
      href={href}
      className={clx(className, "text-ui-fg-subtle hover:text-ui-fg-base", {
        "text-ui-fg-base font-semibold": active,
      })}
      data-testid={dataTestId}
    >
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav
