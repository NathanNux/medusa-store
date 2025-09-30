import { Disclosure } from "@headlessui/react"
import { Badge, clx, Divider } from "@medusajs/ui"
import s from "./style.module.scss"
import { useEffect } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import { useFormStatus } from "react-dom"
import ClickButton from "../edit-button"

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
          <div className={s.leftColContent}>
            <span className={s.labelUpper}>{label}:{" "}</span>
            <div className={s.rightInfoRow}>
              {typeof currentInfo === "string" ? (
                <span className={s.fontSemibold} data-testid="current-info">{currentInfo}</span>
              ) : (
                currentInfo
              )}
            </div>
          </div>
          <Divider />
        </div>
        <div>
          <ClickButton
            text={state ? "Zrušit" : "Upravit"}
            onClickAction={handleToggle}
            type={state ? "button" : "button"}
            className={s.editBtn}
            active={state}
            data-testid="edit-button"
          />
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
              <ClickButton
                text="Uložit změny"
                type="submit"
                disabled={pending}
                className={s.saveBtn}
                data-testid="save-button"
              />
            </div>
          </div>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  )
}

export default AccountInfo
