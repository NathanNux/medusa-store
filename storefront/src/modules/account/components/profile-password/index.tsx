"use client"

import React, { useEffect, useActionState } from "react"
import Input from "@modules/common/components/input"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { toast } from "@medusajs/ui"
import s from "./style.module.scss"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfilePassword: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false)

  // TODO: Add support for password updates
  // WIP: Toto dodělat. 
  const updatePassword = async () => {
    toast.info("Aktualizování hesel není ještě implementováno. Pracuje se na tom.")
  }

  const clearState = () => {
    setSuccessState(false)
  }

  return (
    <form action={updatePassword} onReset={() => clearState()} className={s.root}>
      <AccountInfo
        label="Heslo"
        currentInfo={
          <span>Heslo není z bezpečnostních důvodů zobrazeno</span>
        }
        isSuccess={successState}
        isError={false}
        errorMessage={undefined}
        clearState={clearState}
        data-testid="account-password-editor"
      >
        <div className={s.gridTwo}>
          <Input
            label="Staré heslo"
            name="old_password"
            required
            type="password"
            data-testid="old-password-input"
          />
          <Input
            label="Nové heslo"
            type="password"
            name="new_password"
            required
            data-testid="new-password-input"
          />
          <Input
            label="Potvrdit heslo"
            type="password"
            name="confirm_password"
            required
            data-testid="confirm-password-input"
          />
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfilePassword
