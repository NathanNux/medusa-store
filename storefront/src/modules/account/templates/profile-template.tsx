import s from "./styles/profile.module.scss"

import ProfilePhone from "@modules/account//components/profile-phone"
import ProfileBillingAddress from "@modules/account/components/profile-billing-address"
import ProfileEmail from "@modules/account/components/profile-email"
import ProfileName from "@modules/account/components/profile-name"
import ProfilePassword from "@modules/account/components/profile-password"

import BgImage from "@modules/account/components/BgImage"
import { HttpTypes } from "@medusajs/types"

type ProfileTemplateProps = {
    customer: HttpTypes.StoreCustomer
    regions: HttpTypes.StoreRegion[]
}

export const ProfileTemplate = ({ customer, regions }: ProfileTemplateProps) => {
    return (
        <section className={s.content}>
            <div className={s.content} data-testid="profile-page-wrapper">
                <div className={s.header}>
                    <h1 className={s.title}>Profil</h1>
                    <Divider />
                    <p className={s.desc}>
                        Zde můžete zobrazit a aktualizovat informace o svém profilu, včetně svého jména, e-mailu a telefonního čísla. Také můžete aktualizovat svou fakturační adresu nebo změnit heslo.
                    </p>
                </div>
                <div className={s.body}>
                    <ProfileName customer={customer} />
                    <Divider />
                    <ProfileEmail customer={customer} />
                    <Divider />
                    <ProfilePhone customer={customer} />
                    <Divider />
                    <ProfilePassword customer={customer} />
                    <Divider />
                    <ProfileBillingAddress customer={customer} regions={regions} />
                </div>
            </div>
            <BgImage  src="/assets/img/img/1.jpg" />
        </section>
    )
}

export default ProfileTemplate

const Divider = () => <div className={s.divider} />
;``