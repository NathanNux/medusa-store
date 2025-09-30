
import { Dialog, Transition } from "@headlessui/react"
import { clx } from "@medusajs/ui"
import React, { Fragment } from "react"
import { ModalProvider, useModal } from "@lib/context/modal-context"
import X from "@modules/common/icons/x"

import styles from "../../../account/components/address-card/styles.module.scss"

type ModalProps = {
  isOpen: boolean
  close: () => void
  size?: "small" | "medium" | "large"
  search?: boolean
  children: React.ReactNode
  'data-testid'?: string
}
// WIP: finish the styling of Adresa page and its components
// WIP: Add more finishing touches - animations, slight responsivness
// WIP: Finish styling page objednavky, both of the main page, buttons, and chceck its functions, if they work. 
// Pluch stylize the order details component for it, so it fits the styling of the accoung page. 
// WIP: after that just stylize Recenze page, and add some functionality to it, not just to inspect the review, but also show the product link page, so they see it
// THINK of how to add avatar picture to the account page, and make it work with the backend.
// Connect sanity with the main front page, and news - mainly use AI to generate the schemas and implementation for the images, texts, and info navbar component
const Modal = ({
  isOpen,
  close,
  size = "medium",
  search = false,
  children,
  'data-testid': dataTestId
}: ModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className={styles.modal} onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={styles.backdrop} />
        </Transition.Child>

        <div className={clx(styles.container, {
          [styles.search]: search,
        })}>
          <div
            className={clx(styles.container, {
              ["items-center"]: !search,
              ["items-start"]: search,
            })}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                data-testid={dataTestId}
                className={clx(
                  styles.panel,
                  {
                    [styles.small]: size === "small",
                    [styles.medium]: size === "medium",
                    [styles.large]: size === "large",
                    [styles.transparent]: search,
                  }
                )}
              >
                <ModalProvider close={close}>{children}</ModalProvider>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { close } = useModal()
  return (
    <Dialog.Title className={styles.title}>
      <div className={styles.text}>{children}</div>
      <button onClick={close} data-testid="close-modal-button" className={styles.closeBtn}>
        <X size={20} />
      </button>
    </Dialog.Title>
  )
}

const Description: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Dialog.Description className={styles.description}>
      {children}
    </Dialog.Description>
  )
}

const Body: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={styles.body}>{children}</div>
}

const Footer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={styles.footer}>{children}</div>
}

Modal.Title = Title
Modal.Description = Description
Modal.Body = Body
Modal.Footer = Footer

export default Modal
