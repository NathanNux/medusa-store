import styles from "./styles/addresses-template.module.scss"


import BgImage from "@modules/account/components/BgImage"
import { HttpTypes } from "@medusajs/types"
import AddressBook from "../components/address-book"

type AddressesTemplateProps = {
    customer: HttpTypes.StoreCustomer
    region: HttpTypes.StoreRegion
}

export const AddressesTemplate = ({ customer, region }: AddressesTemplateProps) => {
    return (
        <section className={styles.content}>
            <div className={styles.content} data-testid="addresses-page-wrapper">
                <div className={styles.header}>
                    <h1 className={styles.title}>Doručovací adresy</h1>
                    <Divider />
                    <p className={styles.desc}>
                        Zobrazte a aktualizujte své doručovací adresy, můžete přidat libovolný počet. Uložení adres zajistí, že budou k dispozici při pokladně.
                    </p>
                </div>
                <AddressBook customer={customer} region={region} />
            </div>
            <BgImage src="/assets/img/img/3.jpg" />
        </section>
    )
}

export default AddressesTemplate

const Divider = () => <div className={styles.divider} />