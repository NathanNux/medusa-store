import { Disclosure } from "@headlessui/react"
import { Badge, Button, clx } from "@medusajs/ui"
import s from "./style.module.scss"
import { useEffect } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import { useFormStatus } from "react-dom"

type AccountInfoProps = {
  label: string
  currentInfo: string | React.ReactNode
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  clearState: () => void
  children?: React.ReactNode
  'data-testid'?: string
}

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage = "An error occurred, please try again",
  children,
  'data-testid': dataTestid
}: AccountInfoProps) => {
  const { state, close, toggle } = useToggleState()

  const { pending } = useFormStatus()

  const handleToggle = () => {
    clearState()
    setTimeout(() => toggle(), 100)
  }

  useEffect(() => {
    if (isSuccess) {
      close()
    }
  }, [isSuccess, close])

  return (
    <div className={s.root} data-testid={dataTestid}>
      <div className={s.headerRow}>
        <div className={s.leftCol}>
          <span className={s.labelUpper}>{label}</span>
          <div className={s.rightInfoRow}>
            {typeof currentInfo === "string" ? (
              <span className={s.fontSemibold} data-testid="current-info">{currentInfo}</span>
            ) : (
              currentInfo
            )}
          </div>
        </div>
        <div>
          <Button
            variant="secondary"
            className={s.editBtn}
            onClick={handleToggle}
            type={state ? "reset" : "button"}
            data-testid="edit-button"
            data-active={state}
          >
            {state ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>

      {/* Success state */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            s.successPanel,
            {
              [s.panelOpen]: isSuccess,
              [s.panelClosed]: !isSuccess,
            }
          )}
          data-testid="success-message"
        >
          <Badge className={s.badgeSuccess} color="green">
            <span>{label} Aktualizováno úspěšně</span>
          </Badge>
        </Disclosure.Panel>
      </Disclosure>

      {/* Error state  */}
      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            s.errorPanel,
            {
              [s.panelOpen]: isError,
              [s.panelClosed]: !isError,
            }
          )}
          data-testid="error-message"
        >
          <Badge className={s.badgeError} color="red">
            <span>{errorMessage}</span>
          </Badge>
        </Disclosure.Panel>
      </Disclosure>

      <Disclosure>
        <Disclosure.Panel
          static
          className={clx(
            s.editPanel,
            {
              [s.panelOpen]: state,
              [s.panelClosed]: !state,
            }
          )}
        >
          <div className={s.editContent}>
            <div>{children}</div>
            <div className={s.editActions}>
              <Button
                isLoading={pending}
                className={s.saveBtn}
                type="submit"
                data-testid="save-button"
              >
                Uložit změny
              </Button>
            </div>
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  )
}

export default AccountInfo
