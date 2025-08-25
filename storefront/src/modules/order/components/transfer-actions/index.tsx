"use client"

import { acceptTransferRequest, declineTransferRequest } from "@lib/data/orders"
import { Button } from "@medusajs/ui"
import { useState } from "react"
import styles from "../styles/transfer-actions.module.scss"

type TransferStatus = "pending" | "success" | "error"

const TransferActions = ({ id, token }: { id: string; token: string }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [status, setStatus] = useState<{
    accept: TransferStatus | null
    decline: TransferStatus | null
  } | null>({
    accept: null,
    decline: null,
  })

  const acceptTransfer = async () => {
    setStatus({ accept: "pending", decline: null })
    setErrorMessage(null)

    const { success, error } = await acceptTransferRequest(id, token)

    if (error) setErrorMessage(error)
    setStatus({ accept: success ? "success" : "error", decline: null })
  }

  const declineTransfer = async () => {
    setStatus({ accept: null, decline: "pending" })
    setErrorMessage(null)

    const { success, error } = await declineTransferRequest(id, token)

    if (error) setErrorMessage(error)
    setStatus({ accept: null, decline: success ? "success" : "error" })
  }

  return (
    <div className={styles.root}>
      {status?.accept === "success" && (
        <p className={styles.success}>Vaše objednávka byla úspěšně převedena!</p>
      )}
      {status?.decline === "success" && (
        <p className={styles.success}>Převod objednávky byl úspěšně zamítnut!</p>
      )}
      {status?.accept !== "success" && status?.decline !== "success" && (
        <div className={styles.actions}>
          <Button
            size="large"
            onClick={acceptTransfer}
            isLoading={status?.accept === "pending"}
            disabled={
              status?.accept === "pending" || status?.decline === "pending"
            }
          >
            Přijmout převod
          </Button>
          <Button
            size="large"
            variant="secondary"
            onClick={declineTransfer}
            isLoading={status?.decline === "pending"}
            disabled={
              status?.accept === "pending" || status?.decline === "pending"
            }
          >
            Zamítnout převod
          </Button>
        </div>
      )}
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </div>
  )
}

export default TransferActions
