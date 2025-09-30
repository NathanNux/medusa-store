import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"
import s from "./styles/account-layout.module.scss"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  const isVerified = customer?.metadata?.email_verified as boolean

  return (
    <div className={s.section} data-testid="account-page">
      <div className={s.container}>
        {customer && isVerified && (
          <div className={s.verifiedGrid}>
            <div className={s.nav}>
              <AccountNav customer={customer} />
            </div>
            <div className={s.children}>
              {children}
            </div>
          </div>
        )}
        {!customer && (
          <div className={s.center}>
            <div>
              {children}
            </div>
          </div>
        )}
       {customer && !isVerified && (
         <div className={s.centerZ1}>
          {children}
            {/* <div>
              <AccountNav customer={customer} />
            </div> */}
        </div>
        
       )}
      </div>
      <div className={s.footer}>
        <div className={s.text}>
          <h3 className={s.title}>Máte dotaz?</h3>
          <span className={s.textSpan}>
            Nejčastější dotazy a odpovědi najdete na naší stránce
            zákaznického servisu.
          </span>
        </div>
        <div className={s.Link}>
          <UnderlineLink href="/customer-service">
            Zákaznický servis
          </UnderlineLink>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
