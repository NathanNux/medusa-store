import React from "react"

import AddAddress from "../address-card/add-address"
import EditAddress from "../address-card/edit-address-modal"
import { HttpTypes } from "@medusajs/types"
import s from "./style.module.scss"

type AddressBookProps = {
  customer: HttpTypes.StoreCustomer
  region: HttpTypes.StoreRegion
}

const AddressBook: React.FC<AddressBookProps> = ({ customer, region }) => {
  const { addresses } = customer
  return (
    <div className={s.root}>
      <div className={s.grid}>
        <AddAddress region={region} addresses={addresses} />
        {addresses.map((address) => {
          return (
            <EditAddress region={region} address={address} key={address.id} />
          )
        })}
      </div>
    </div>
  )
}

export default AddressBook
