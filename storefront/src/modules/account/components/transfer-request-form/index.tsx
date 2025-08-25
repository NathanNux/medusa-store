"use client"

import { useActionState } from "react"
import { createTransferRequest } from "@lib/data/orders"
import { Input, IconButton } from "@medusajs/ui"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { CheckCircleMiniSolid, XCircleSolid } from "@medusajs/icons"
import { useEffect, useState } from "react"
import s from "./style.module.scss"

export default function TransferRequestForm() {
  const [showSuccess, setShowSuccess] = useState(false)

  const [state, formAction] = useActionState(createTransferRequest, {
    success: false,
    error: null,
    order: null,
  })

  useEffect(() => {
    if (state.success && state.order) {
      setShowSuccess(true)
    }
  }, [state.success, state.order])

  return (
    <div className={s.root}>
      <div className={s.headerRow}>
        <div className={s.intro}>
          <h3 className={s.title}>Převod objednávek</h3>
          <p className={s.desc}>
            Nemůžete najít objednávku, kterou hledáte?
            <br /> Propojte objednávku se svým účtem.
          </p>
        </div>
        <form action={formAction} className={s.form}>
          <div className={s.formInner}>
            <Input className={s.input} name="order_id" placeholder="ID objednávky" />
            <SubmitButton variant="secondary" className="w-fit whitespace-nowrap self-end">
              Požádat o převod
            </SubmitButton>
          </div>
        </form>
      </div>
      {!state.success && state.error && (
        <p className={s.error}>{state.error}</p>
      )}
      {showSuccess && (
        <div className={s.success}>
          <div className={s.successLeft}>
            <CheckCircleMiniSolid className={s.iconSuccess} />
            <div className={s.successTextWrap}>
              <p className={s.successTitle}>
                Požadavek na převod pro objednávku {state.order?.id} byl odeslán
              </p>
              <p className={s.successDesc}>
                E-mail s žádostí o převod byl odeslán na {state.order?.email}
              </p>
            </div>
          </div>
          <IconButton variant="transparent" className={s.closeBtn} onClick={() => setShowSuccess(false)}>
            <XCircleSolid className={s.iconClose} />
          </IconButton>
        </div>
      )}
    </div>
  )
}
