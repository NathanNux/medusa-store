"use client"

import { Plus } from "@medusajs/icons"
import { Button, Divider, Text } from "@medusajs/ui"
import { useEffect, useState, useActionState } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import CountrySelect from "@modules/checkout/components/country-select"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { HttpTypes } from "@medusajs/types"
import { addCustomerAddress } from "@lib/data/customer"
import s from "./add-address.module.scss"

const AddAddress = ({
  region,
  addresses,
}: {
  region: HttpTypes.StoreRegion
  addresses: HttpTypes.StoreCustomerAddress[]
}) => {
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(addCustomerAddress, {
    isDefaultShipping: addresses.length === 0,
    success: false,
    error: null,
  })

  const close = () => {
    setSuccessState(false)
    closeModal()
  }

  useEffect(() => {
    if (successState) {
      close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState])

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true)
    }
  }, [formState])

  return (
    <>
      <div className={s.addButtonContainer}>
        <div className={s.addButton}>
          <Text className={s.addressText}>Vaše adresy:</Text>
          <ScrollButton
            text="Nová adresa"
            className={s.cardButton}
            onClickAction={open}
            data-testid="add-address-button"
          />
        </div>
        <Divider />
      </div>

      <Modal isOpen={state} close={close} data-testid="add-address-modal">
        <Modal.Title>
          <h2 className={s.modalTitle}>Přidat adresu</h2>
        </Modal.Title>
        <form action={formAction}>
          <Modal.Body>
            <div className={s.form}
            >
              <div className={s.rowTwo}>
                <Input
                  label="Jméno"
                  name="first_name"
                  required
                  autoComplete="given-name"
                  data-testid="first-name-input"
                />
                <Input
                  label="Příjmení"
                  name="last_name"
                  required
                  autoComplete="family-name"
                  data-testid="last-name-input"
                />
              </div>
              <Input
                label="Společnost"
                name="company"
                autoComplete="organization"
                data-testid="company-input"
              />
              <Input
                label="Adresa"
                name="address_1"
                required
                autoComplete="address-line1"
                data-testid="address-1-input"
              />
              <Input
                label="Bytová jednotka, patro, apod."
                name="address_2"
                autoComplete="address-line2"
                data-testid="address-2-input"
              />
              <div className={s.rowPostal}>
                <Input
                  label="PSČ"
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  data-testid="postal-code-input"
                />
                <Input
                  label="Město"
                  name="city"
                  required
                  autoComplete="locality"
                  data-testid="city-input"
                />
              </div>
              <Input
                label="Kraj / Okres"
                name="province"
                autoComplete="address-level1"
                data-testid="state-input"
              />
              <CountrySelect
                region={region}
                name="country_code"
                required
                autoComplete="country"
                data-testid="country-select"
              />
              <Input
                label="Telefon"
                name="phone"
                autoComplete="phone"
                data-testid="phone-input"
              />
            </div>
            {formState.error && (
              <div className={s.error} data-testid="address-error">
                {formState.error}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className={s.actions}>
              <Button
                type="reset"
                variant="secondary"
                onClick={close}
                className={s.btnHeight}
                data-testid="cancel-button"
              >
                Zrušit
              </Button>
              <SubmitButton data-testid="save-button">Uložit</SubmitButton>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default AddAddress


function ScrollButton({
  text,
  className,
  textColor,
  "data-testid": dataTestId,
  onClickAction
}: {
  text: string;
  className?: string;
  textColor?: string;
  "data-testid"?: string;
  onClickAction?: () => void | Promise<void>;
}) {
  return (
    <div className={s.ScrollLink} data-testid={dataTestId}
      onClick={onClickAction}
    >
        <button 
          className={s.button}
            style={{
            textDecoration: "none",
          }}
        >
            <div className={s.slider}>
                <div className={s.el}>
                    <PerspectiveText label={text} className={className} textColor={textColor}/>
                </div>
                <div className={s.el}>
                    <PerspectiveText label={text} className={className} textColor={textColor}/>
                </div>
            </div>
        </button>
    </div>
  );
}

function PerspectiveText({label, className, textColor}: {label: string; className?: string; textColor?: string}) {
  return (    
    <div className={s.perspectiveText}>
        <p 
          className={className}
          style={{
            color: textColor || "var(--ChText)",
          }}
        >
          {label}
          <Plus />
        </p>
        <p 
          className={className}
          style={{
            color: textColor || "var(--Wtext)",
          }}
        >
          {label}
          <Plus />
        </p>
    </div>
  )
}
